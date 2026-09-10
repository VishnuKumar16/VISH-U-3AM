"use client";

import {
    createContext,
    ReactNode,
    useCallback,
    useContext,
    useEffect,
    useRef,
    useState,
} from "react";

/* =========================================================
   TYPES
========================================================= */

type Song = {
    src: string;
    name: string;
};

type PlayerContextType = {
    isPlaying: boolean;
    currentIndex: number;
    currentSong: Song | null;
    currentTime: number;
    duration: number;
    volume: number;

    togglePlay: () => Promise<void>;
    nextSong: () => Promise<void>;
    prevSong: () => Promise<void>;
    seek: (time: number) => void;
    setVolume: (value: number) => void;
};

const PlayerContext =
    createContext<PlayerContextType | null>(null);

/* =========================================================
   SETTINGS
========================================================= */

const FADE_TIME = 1500;

const SONG_KEY = "vish-u 3am-song";
const QUEUE_KEY = "vish-u 3am-queue";
const POSITION_KEY = "vish-u 3am-position";
const VOLUME_KEY = "vish-u 3am-volume";

/* =========================================================
   PLAYER PROVIDER
========================================================= */

export function PlayerProvider({
    children,
}: {
    children: ReactNode;
}) {
    /* =====================================================
       AUDIO
    ===================================================== */

    const audioRef =
        useRef<HTMLAudioElement | null>(null);

    /* =====================================================
       DYNAMIC SONG LIST

       Songs are loaded from:

       /api/songs

       which scans:

       public/music/
    ===================================================== */

    const songsRef =
        useRef<Song[]>([]);

    const [songsLoaded, setSongsLoaded] =
        useState(false);

    const getSongCount = useCallback(() => {
        return songsRef.current.length;
    }, []);

    const getSongPath = useCallback(
        (index: number) => {
            return songsRef.current[index]?.src ?? "";
        },
        []
    );

    /* =====================================================
       SHUFFLE QUEUE
    ===================================================== */

    const queueRef =
        useRef<number[]>([]);

    const positionRef =
        useRef(0);

    /* =====================================================
       CURRENT SONG
    ===================================================== */

    const currentRef =
        useRef(0);

    /* =====================================================
       VOLUME
    ===================================================== */

    const volumeRef =
        useRef(0.8);

    /* =====================================================
       TRANSITION
    ===================================================== */

    const transitionRef =
        useRef(false);

    const fadeTimerRef =
        useRef<ReturnType<typeof setInterval> | null>(
            null
        );

    const mountedRef =
        useRef(false);

    /* =====================================================
       STATE
    ===================================================== */

    const [
        currentIndex,
        setCurrentIndex,
    ] = useState(0);

    const [
        isPlaying,
        setIsPlaying,
    ] = useState(false);

    const [
        currentTime,
        setCurrentTime,
    ] = useState(0);

    const [
        duration,
        setDuration,
    ] = useState(0);

    const [
        volume,
        setVolumeState,
    ] = useState(0.8);

    /* =====================================================
       CURRENT SONG

       This gives MusicCard access to the
       actual currently playing song.
    ===================================================== */

    const currentSong =
        songsRef.current[currentIndex] ?? null;

    /* =====================================================
       SAVE PLAYER STATE
    ===================================================== */

    const saveState = useCallback(() => {
        try {
            localStorage.setItem(
                SONG_KEY,
                String(currentRef.current)
            );

            localStorage.setItem(
                QUEUE_KEY,
                JSON.stringify(queueRef.current)
            );

            localStorage.setItem(
                POSITION_KEY,
                String(positionRef.current)
            );

            localStorage.setItem(
                VOLUME_KEY,
                String(volumeRef.current)
            );
        } catch {
            // localStorage may be unavailable
        }
    }, []);

    /* =====================================================
       LOAD SONGS FROM API
    ===================================================== */

    const loadSongs = useCallback(
        async () => {
            try {
                const response =
                    await fetch(
                        "/api/songs",
                        {
                            cache: "no-store",
                        }
                    );

                if (!response.ok) {
                    throw new Error(
                        `Songs API failed: ${response.status}`
                    );
                }

                const data =
                    await response.json();

                if (!Array.isArray(data)) {
                    throw new Error(
                        "Invalid songs API response."
                    );
                }

                const validSongs: Song[] =
                    data
                        .filter(
                            (song: unknown) =>
                                typeof song ===
                                    "object" &&
                                song !== null &&
                                "src" in song &&
                                typeof (
                                    song as {
                                        src?: unknown;
                                    }
                                ).src ===
                                    "string"
                        )
                        .map(
                            (
                                song: {
                                    src: string;
                                    name?: string;
                                }
                            ) => ({
                                src: song.src,
                                name:
                                    song.name ??
                                    "Unknown Song",
                            })
                        );

                songsRef.current =
                    validSongs;

                setSongsLoaded(true);

                console.log(
                    `VISH-U 3.A.M.: ${validSongs.length} songs loaded.`
                );

                return validSongs;
            } catch (error) {
                console.error(
                    "Failed to load songs:",
                    error
                );

                songsRef.current = [];

                setSongsLoaded(true);

                return [];
            }
        },
        []
    );

    /* =====================================================
       SHUFFLE

       Every song appears once before
       a new shuffle cycle starts.
    ===================================================== */

    function makeShuffle(
        count: number,
        avoid?: number
    ): number[] {
        const list = Array.from(
            { length: count },
            (_, index) => index
        );

        /* Fisher-Yates shuffle */

        for (
            let i = list.length - 1;
            i > 0;
            i--
        ) {
            const j =
                Math.floor(
                    Math.random() *
                        (i + 1)
                );

            [
                list[i],
                list[j],
            ] = [
                list[j],
                list[i],
            ];
        }

        /* Avoid immediately repeating previous song */

        if (
            avoid !== undefined &&
            list.length > 1 &&
            list[0] === avoid
        ) {
            [
                list[0],
                list[1],
            ] = [
                list[1],
                list[0],
            ];
        }

        return list;
    }

    /* =====================================================
       SETUP / RESTORE QUEUE
    ===================================================== */

    const setupQueue = useCallback(
        () => {
            const songCount =
                songsRef.current.length;

            if (songCount === 0) {
                queueRef.current = [];
                positionRef.current = 0;
                currentRef.current = 0;

                setCurrentIndex(0);

                return 0;
            }

            let savedQueue:
                | number[]
                | null = null;

            let savedPosition = 0;

            let savedSong = 0;

            try {
                /* -----------------------------------------
                   QUEUE
                ----------------------------------------- */

                const storedQueue =
                    localStorage.getItem(
                        QUEUE_KEY
                    );

                if (storedQueue) {
                    const parsed =
                        JSON.parse(
                            storedQueue
                        );

                    if (
                        Array.isArray(
                            parsed
                        ) &&
                        parsed.length ===
                            songCount
                    ) {
                        const valid =
                            parsed.every(
                                (
                                    value: unknown
                                ) =>
                                    typeof value ===
                                        "number" &&
                                    Number.isInteger(
                                        value
                                    ) &&
                                    value >= 0 &&
                                    value <
                                        songCount
                            );

                        const unique =
                            new Set(
                                parsed
                            ).size ===
                            songCount;

                        if (
                            valid &&
                            unique
                        ) {
                            savedQueue =
                                parsed;
                        }
                    }
                }

                /* -----------------------------------------
                   POSITION
                ----------------------------------------- */

                const storedPosition =
                    localStorage.getItem(
                        POSITION_KEY
                    );

                if (
                    storedPosition !==
                    null
                ) {
                    const value =
                        Number(
                            storedPosition
                        );

                    if (
                        Number.isInteger(
                            value
                        ) &&
                        value >= 0 &&
                        value < songCount
                    ) {
                        savedPosition =
                            value;
                    }
                }

                /* -----------------------------------------
                   CURRENT SONG
                ----------------------------------------- */

                const storedSong =
                    localStorage.getItem(
                        SONG_KEY
                    );

                if (
                    storedSong !== null
                ) {
                    const value =
                        Number(
                            storedSong
                        );

                    if (
                        Number.isInteger(
                            value
                        ) &&
                        value >= 0 &&
                        value < songCount
                    ) {
                        savedSong =
                            value;
                    }
                }

                /* -----------------------------------------
                   VOLUME
                ----------------------------------------- */

                const storedVolume =
                    localStorage.getItem(
                        VOLUME_KEY
                    );

                if (
                    storedVolume !==
                    null
                ) {
                    const value =
                        Number(
                            storedVolume
                        );

                    if (
                        Number.isFinite(
                            value
                        )
                    ) {
                        const clean =
                            Math.max(
                                0,
                                Math.min(
                                    1,
                                    value
                                )
                            );

                        volumeRef.current =
                            clean;

                        setVolumeState(
                            clean
                        );
                    }
                }
            } catch {
                savedQueue = null;
            }

            /* =================================================
               CREATE NEW SHUFFLE
            ================================================= */

            if (
                !savedQueue ||
                savedQueue.length !==
                    songCount
            ) {
                savedQueue =
                    makeShuffle(
                        songCount
                    );

                savedPosition = 0;

                savedSong =
                    savedQueue[0] ?? 0;
            } else {
                /* -----------------------------------------
                   Make current song and queue position agree
                ----------------------------------------- */

                const actualPosition =
                    savedQueue.indexOf(
                        savedSong
                    );

                if (
                    actualPosition !== -1
                ) {
                    savedPosition =
                        actualPosition;
                } else {
                    savedPosition = 0;

                    savedSong =
                        savedQueue[0] ??
                        0;
                }
            }

            queueRef.current =
                savedQueue;

            positionRef.current =
                savedPosition;

            currentRef.current =
                savedSong;

            setCurrentIndex(
                savedSong
            );

            saveState();

            return savedSong;
        },
        [saveState]
    );

    /* =====================================================
       GET NEXT SONG
    ===================================================== */

    const getNextSong =
        useCallback(() => {
            const queue =
                queueRef.current;

            const songCount =
                getSongCount();

            if (songCount === 0) {
                return 0;
            }

            /* Safety fallback */

            if (
                queue.length !==
                songCount
            ) {
                const newQueue =
                    makeShuffle(
                        songCount,
                        currentRef.current
                    );

                queueRef.current =
                    newQueue;

                positionRef.current = 0;

                const next =
                    newQueue[0] ?? 0;

                saveState();

                return next;
            }

            /* Songs remaining in current cycle */

            if (
                positionRef.current <
                songCount - 1
            ) {
                positionRef.current +=
                    1;

                const next =
                    queue[
                        positionRef.current
                    ];

                saveState();

                return next;
            }

            /* Complete shuffle finished */

            const newQueue =
                makeShuffle(
                    songCount,
                    currentRef.current
                );

            queueRef.current =
                newQueue;

            positionRef.current = 0;

            const next =
                newQueue[0] ?? 0;

            saveState();

            return next;
        }, [
            getSongCount,
            saveState,
        ]);

    /* =====================================================
       GET PREVIOUS SONG
    ===================================================== */

    const getPreviousSong =
        useCallback(() => {
            const queue =
                queueRef.current;

            const songCount =
                getSongCount();

            if (
                songCount === 0
            ) {
                return 0;
            }

            if (
                queue.length !==
                songCount
            ) {
                return currentRef.current;
            }

            /* At beginning of current shuffle,
               go to last song of same shuffle. */

            if (
                positionRef.current <= 0
            ) {
                positionRef.current =
                    songCount - 1;
            } else {
                positionRef.current -=
                    1;
            }

            const previous =
                queue[
                    positionRef.current
                ];

            saveState();

            return previous;
        }, [
            getSongCount,
            saveState,
        ]);

    /* =====================================================
       STOP FADE
    ===================================================== */

    const stopFade =
        useCallback(() => {
            if (
                fadeTimerRef.current !==
                null
            ) {
                clearInterval(
                    fadeTimerRef.current
                );

                fadeTimerRef.current =
                    null;
            }
        }, []);

    /* =====================================================
       FADE AUDIO
    ===================================================== */

    const fadeAudio =
        useCallback(
            (
                audio: HTMLAudioElement,
                from: number,
                to: number,
                durationMs: number
            ) => {
                stopFade();

                const safeDuration =
                    Math.max(
                        50,
                        durationMs
                    );

                const start =
                    Date.now();

                return new Promise<void>(
                    (resolve) => {
                        const update =
                            () => {
                                if (
                                    !mountedRef.current
                                ) {
                                    stopFade();
                                    resolve();
                                    return;
                                }

                                const elapsed =
                                    Date.now() -
                                    start;

                                const progress =
                                    Math.min(
                                        1,
                                        elapsed /
                                            safeDuration
                                    );

                                /* Smooth ease-in-out */

                                const eased =
                                    progress <
                                    0.5
                                        ? 2 *
                                          progress *
                                          progress
                                        : 1 -
                                          Math.pow(
                                              -2 *
                                                  progress +
                                                  2,
                                              2
                                          ) /
                                              2;

                                const nextVolume =
                                    from +
                                    (to -
                                        from) *
                                    eased;

                                audio.volume =
                                    Math.max(
                                        0,
                                        Math.min(
                                            1,
                                            nextVolume
                                        )
                                    );

                                if (
                                    progress >=
                                    1
                                ) {
                                    stopFade();

                                    audio.volume =
                                        Math.max(
                                            0,
                                            Math.min(
                                                1,
                                                to
                                            )
                                        );

                                    resolve();
                                }
                            };

                        update();

                        fadeTimerRef.current =
                            setInterval(
                                update,
                                50
                            );
                    }
                );
            },
            [stopFade]
        );

    /* =====================================================
       RELIABLE AUDIO START
    ===================================================== */

    const playLoadedAudio =
        useCallback(
            async (
                audio: HTMLAudioElement
            ) => {
                if (
                    !mountedRef.current
                ) {
                    return false;
                }

                try {
                    /*
                       If browser hasn't loaded enough
                       data, wait for it.
                    */

                    if (
                        audio.readyState < 3
                    ) {
                        await new Promise<void>(
                            (
                                resolve,
                                reject
                            ) => {
                                let finished =
                                    false;

                                let timer:
                                    | ReturnType<
                                          typeof setTimeout
                                      >
                                    | null =
                                    null;

                                const cleanup =
                                    () => {
                                        audio.removeEventListener(
                                            "canplay",
                                            onReady
                                        );

                                        audio.removeEventListener(
                                            "loadeddata",
                                            onReady
                                        );

                                        audio.removeEventListener(
                                            "error",
                                            onError
                                        );

                                        if (
                                            timer !==
                                            null
                                        ) {
                                            clearTimeout(
                                                timer
                                            );
                                        }
                                    };

                                const finish =
                                    () => {
                                        if (
                                            finished
                                        ) {
                                            return;
                                        }

                                        finished =
                                            true;

                                        cleanup();

                                        resolve();
                                    };

                                const fail =
                                    () => {
                                        if (
                                            finished
                                        ) {
                                            return;
                                        }

                                        finished =
                                            true;

                                        cleanup();

                                        reject(
                                            new Error(
                                                "Audio source could not be loaded."
                                            )
                                        );
                                    };

                                const onReady =
                                    () => {
                                        finish();
                                    };

                                const onError =
                                    () => {
                                        fail();
                                    };

                                timer =
                                    setTimeout(
                                        () => {
                                            if (
                                                audio.readyState >=
                                                2
                                            ) {
                                                finish();
                                            } else {
                                                fail();
                                            }
                                        },
                                        10000
                                    );

                                audio.addEventListener(
                                    "canplay",
                                    onReady
                                );

                                audio.addEventListener(
                                    "loadeddata",
                                    onReady
                                );

                                audio.addEventListener(
                                    "error",
                                    onError
                                );

                                if (
                                    audio.readyState >=
                                    2
                                ) {
                                    finish();
                                }
                            }
                        );
                    }

                    if (
                        !mountedRef.current
                    ) {
                        return false;
                    }

                    await audio.play();

                    return true;
                } catch (error) {
                    console.error(
                        "Audio start error:",
                        error
                    );

                    return false;
                }
            },
            []
        );

    /* =====================================================
       INITIALIZE PLAYER
    ===================================================== */

    useEffect(() => {
        let cancelled = false;

        const initialize =
            async () => {
                /*
                   Load actual songs from API
                */

                const loadedSongs =
                    await loadSongs();

                if (
                    cancelled ||
                    !mountedRef.current
                ) {
                    return;
                }

                if (
                    loadedSongs.length === 0
                ) {
                    console.error(
                        "No audio files found in public/music."
                    );

                    return;
                }

                /*
                   Create / restore shuffle
                */

                const initialIndex =
                    setupQueue();

                const initialPath =
                    loadedSongs[
                        initialIndex
                    ]?.src ?? "";

                if (!initialPath) {
                    console.error(
                        "Initial song path is empty."
                    );

                    return;
                }

                const audio =
                    audioRef.current;

                if (!audio) {
                    return;
                }

                /*
                   Load first song
                */

                audio.src =
                    initialPath;

                audio.currentTime = 0;

                audio.volume =
                    volumeRef.current;

                audio.load();

                console.log(
                    "Initial song:",
                    initialPath
                );
            };

        /* =================================================
           CREATE AUDIO ELEMENT
        ================================================= */

        const audio =
            new Audio();

        audio.preload = "auto";

        audio.volume =
            volumeRef.current;

        audio.setAttribute(
            "playsinline",
            ""
        );

        audioRef.current =
            audio;

        mountedRef.current =
            true;

        /* =================================================
           TIME UPDATE
        ================================================= */

        const handleTimeUpdate =
            () => {
                setCurrentTime(
                    audio.currentTime
                );

                if (
                    Number.isFinite(
                        audio.duration
                    )
                ) {
                    setDuration(
                        audio.duration
                    );
                }
            };

        /* =================================================
           LOADED METADATA
        ================================================= */

        const handleLoadedMetadata =
            () => {
                if (
                    Number.isFinite(
                        audio.duration
                    )
                ) {
                    setDuration(
                        audio.duration
                    );
                }
            };

        /* =================================================
           PLAY
        ================================================= */

        const handlePlay =
            () => {
                setIsPlaying(true);
            };

        /* =================================================
           PAUSE
        ================================================= */

        const handlePause =
            () => {
                if (
                    !transitionRef.current
                ) {
                    setIsPlaying(false);
                }
            };

        /* =================================================
           AUDIO ERROR
        ================================================= */

        const handleError =
            () => {
                console.error(
                    "Audio element error:",
                    audio.error,
                    "Source:",
                    audio.src
                );
            };

        /* =================================================
           SONG ENDED

           Automatically play next song.
        ================================================= */

        const handleEnded =
            async () => {
                if (
                    transitionRef.current ||
                    !mountedRef.current
                ) {
                    return;
                }

                transitionRef.current =
                    true;

                try {
                    const next =
                        getNextSong();

                    audio.pause();

                    const nextPath =
                        getSongPath(
                            next
                        );

                    if (!nextPath) {
                        throw new Error(
                            "Next song path is empty."
                        );
                    }

                    audio.src =
                        nextPath;

                    audio.currentTime =
                        0;

                    audio.volume =
                        volumeRef.current;

                    audio.load();

                    const started =
                        await playLoadedAudio(
                            audio
                        );

                    if (!started) {
                        throw new Error(
                            "Automatic next song could not start."
                        );
                    }

                    currentRef.current =
                        next;

                    setCurrentIndex(
                        next
                    );

                    setCurrentTime(
                        0
                    );

                    setDuration(
                        Number.isFinite(
                            audio.duration
                        )
                            ? audio.duration
                            : 0
                    );

                    setIsPlaying(
                        true
                    );

                    saveState();
                } catch (error) {
                    console.error(
                        "Automatic next song error:",
                        error
                    );

                    setIsPlaying(
                        false
                    );
                } finally {
                    transitionRef.current =
                        false;
                }
            };

        /* =================================================
           VISIBILITY CHANGE
        ================================================= */

        const handleVisibilityChange =
            () => {
                if (
                    document.visibilityState !==
                    "visible"
                ) {
                    return;
                }

                setCurrentTime(
                    audio.currentTime
                );

                if (
                    Number.isFinite(
                        audio.duration
                    )
                ) {
                    setDuration(
                        audio.duration
                    );
                }

                setIsPlaying(
                    !audio.paused &&
                        !audio.ended
                );
            };

        /* =================================================
           EVENT LISTENERS
        ================================================= */

        audio.addEventListener(
            "timeupdate",
            handleTimeUpdate
        );

        audio.addEventListener(
            "loadedmetadata",
            handleLoadedMetadata
        );

        audio.addEventListener(
            "play",
            handlePlay
        );

        audio.addEventListener(
            "pause",
            handlePause
        );

        audio.addEventListener(
            "ended",
            handleEnded
        );

        audio.addEventListener(
            "error",
            handleError
        );

        document.addEventListener(
            "visibilitychange",
            handleVisibilityChange
        );

        /* =================================================
           START INITIALIZATION
        ================================================= */

        initialize();

        /* =================================================
           CLEANUP
        ================================================= */

        return () => {
            cancelled = true;

            mountedRef.current =
                false;

            stopFade();

            audio.pause();

            audio.removeEventListener(
                "timeupdate",
                handleTimeUpdate
            );

            audio.removeEventListener(
                "loadedmetadata",
                handleLoadedMetadata
            );

            audio.removeEventListener(
                "play",
                handlePlay
            );

            audio.removeEventListener(
                "pause",
                handlePause
            );

            audio.removeEventListener(
                "ended",
                handleEnded
            );

            audio.removeEventListener(
                "error",
                handleError
            );

            document.removeEventListener(
                "visibilitychange",
                handleVisibilityChange
            );

            audio.src = "";

            audioRef.current =
                null;
        };
    }, [
        getNextSong,
        getSongPath,
        loadSongs,
        playLoadedAudio,
        saveState,
        setupQueue,
        stopFade,
    ]);

    /* =====================================================
       PLAY / PAUSE
    ===================================================== */

    const togglePlay =
        async () => {
            const audio =
                audioRef.current;

            if (
                !audio ||
                transitionRef.current ||
                !songsLoaded
            ) {
                return;
            }

            if (
                getSongCount() === 0
            ) {
                console.error(
                    "No songs available."
                );

                return;
            }

            try {
                /* -----------------------------------------
                   PLAY
                ----------------------------------------- */

                if (
                    audio.paused
                ) {
                    transitionRef.current =
                        true;

                    audio.volume = 0;

                    const started =
                        await playLoadedAudio(
                            audio
                        );

                    if (!started) {
                        throw new Error(
                            "Audio could not start."
                        );
                    }

                    setIsPlaying(
                        true
                    );

                    await fadeAudio(
                        audio,
                        0,
                        volumeRef.current,
                        FADE_TIME
                    );

                    transitionRef.current =
                        false;
                }

                /* -----------------------------------------
                   PAUSE
                ----------------------------------------- */

                else {
                    transitionRef.current =
                        true;

                    await fadeAudio(
                        audio,
                        audio.volume,
                        0,
                        FADE_TIME
                    );

                    audio.pause();

                    audio.volume =
                        volumeRef.current;

                    setIsPlaying(
                        false
                    );

                    transitionRef.current =
                        false;
                }
            } catch (error) {
                transitionRef.current =
                    false;

                console.error(
                    "Toggle playback error:",
                    error
                );

                setIsPlaying(
                    false
                );

                audio.volume =
                    volumeRef.current;
            }
        };

    /* =====================================================
       NEXT SONG
    ===================================================== */

    const nextSong =
        async () => {
            if (
                transitionRef.current
            ) {
                return;
            }

            const audio =
                audioRef.current;

            if (
                !audio ||
                getSongCount() === 0
            ) {
                return;
            }

            transitionRef.current =
                true;

            try {
                const next =
                    getNextSong();

                const wasPlaying =
                    !audio.paused;

                /* -----------------------------------------
                   FADE OUT
                ----------------------------------------- */

                if (
                    wasPlaying
                ) {
                    await fadeAudio(
                        audio,
                        audio.volume,
                        0,
                        FADE_TIME
                    );
                } else {
                    audio.volume = 0;
                }

                /* -----------------------------------------
                   LOAD NEXT SONG
                ----------------------------------------- */

                const nextPath =
                    getSongPath(
                        next
                    );

                if (!nextPath) {
                    throw new Error(
                        "Next song path is empty."
                    );
                }

                audio.pause();

                audio.src =
                    nextPath;

                audio.currentTime =
                    0;

                audio.volume = 0;

                audio.load();

                currentRef.current =
                    next;

                setCurrentIndex(
                    next
                );

                setCurrentTime(
                    0
                );

                setDuration(
                    0
                );

                saveState();

                /* -----------------------------------------
                   PLAY NEXT
                ----------------------------------------- */

                if (
                    wasPlaying
                ) {
                    const started =
                        await playLoadedAudio(
                            audio
                        );

                    if (!started) {
                        throw new Error(
                            "Audio could not start."
                        );
                    }

                    setIsPlaying(
                        true
                    );

                    await fadeAudio(
                        audio,
                        0,
                        volumeRef.current,
                        FADE_TIME
                    );
                } else {
                    audio.volume =
                        volumeRef.current;

                    setIsPlaying(
                        false
                    );
                }
            } catch (error) {
                console.error(
                    "Next song error:",
                    error
                );

                setIsPlaying(
                    false
                );
            } finally {
                transitionRef.current =
                    false;
            }
        };

    /* =====================================================
       PREVIOUS SONG
    ===================================================== */

    const prevSong =
        async () => {
            if (
                transitionRef.current
            ) {
                return;
            }

            const audio =
                audioRef.current;

            if (
                !audio ||
                getSongCount() === 0
            ) {
                return;
            }

            transitionRef.current =
                true;

            try {
                const previous =
                    getPreviousSong();

                const wasPlaying =
                    !audio.paused;

                /* -----------------------------------------
                   FADE OUT
                ----------------------------------------- */

                if (
                    wasPlaying
                ) {
                    await fadeAudio(
                        audio,
                        audio.volume,
                        0,
                        FADE_TIME
                    );
                } else {
                    audio.volume = 0;
                }

                /* -----------------------------------------
                   LOAD PREVIOUS
                ----------------------------------------- */

                const previousPath =
                    getSongPath(
                        previous
                    );

                if (
                    !previousPath
                ) {
                    throw new Error(
                        "Previous song path is empty."
                    );
                }

                audio.pause();

                audio.src =
                    previousPath;

                audio.currentTime =
                    0;

                audio.volume = 0;

                audio.load();

                currentRef.current =
                    previous;

                setCurrentIndex(
                    previous
                );

                setCurrentTime(
                    0
                );

                setDuration(
                    0
                );

                saveState();

                /* -----------------------------------------
                   PLAY PREVIOUS
                ----------------------------------------- */

                if (
                    wasPlaying
                ) {
                    const started =
                        await playLoadedAudio(
                            audio
                        );

                    if (!started) {
                        throw new Error(
                            "Audio could not start."
                        );
                    }

                    setIsPlaying(
                        true
                    );

                    await fadeAudio(
                        audio,
                        0,
                        volumeRef.current,
                        FADE_TIME
                    );
                } else {
                    audio.volume =
                        volumeRef.current;

                    setIsPlaying(
                        false
                    );
                }
            } catch (error) {
                console.error(
                    "Previous song error:",
                    error
                );

                setIsPlaying(
                    false
                );
            } finally {
                transitionRef.current =
                    false;
            }
        };

    /* =====================================================
       SEEK
    ===================================================== */

    const seek =
        (time: number) => {
            const audio =
                audioRef.current;

            if (!audio) {
                return;
            }

            if (
                !Number.isFinite(
                    audio.duration
                )
            ) {
                return;
            }

            const safeTime =
                Math.max(
                    0,
                    Math.min(
                        time,
                        audio.duration
                    )
                );

            audio.currentTime =
                safeTime;

            setCurrentTime(
                safeTime
            );
        };

    /* =====================================================
       VOLUME
    ===================================================== */

    const setVolume =
        (value: number) => {
            const clean =
                Math.max(
                    0,
                    Math.min(
                        1,
                        value
                    )
                );

            volumeRef.current =
                clean;

            setVolumeState(
                clean
            );

            const audio =
                audioRef.current;

            if (
                audio &&
                !transitionRef.current
            ) {
                audio.volume =
                    clean;
            }

            try {
                localStorage.setItem(
                    VOLUME_KEY,
                    String(clean)
                );
            } catch {
                // ignore
            }
        };

    /* =====================================================
       PROVIDER
    ===================================================== */

    return (
        <PlayerContext.Provider
            value={{
                isPlaying,
                currentIndex,
                currentSong,
                currentTime,
                duration,
                volume,

                togglePlay,
                nextSong,
                prevSong,
                seek,
                setVolume,
            }}
        >
            {children}
        </PlayerContext.Provider>
    );
}

/* =========================================================
   HOOK
========================================================= */

export function usePlayer() {
    const context =
        useContext(
            PlayerContext
        );

    if (!context) {
        throw new Error(
            "usePlayer must be used inside PlayerProvider"
        );
    }

    return context;
}