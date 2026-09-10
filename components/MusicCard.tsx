"use client";

import { useEffect, useState } from "react";
import { usePlayer } from "@/context/PlayerContext";

/* =========================================================
   TIME
========================================================= */

function formatTime(seconds: number) {
    if (!Number.isFinite(seconds) || seconds < 0) {
        return "0:00";
    }

    const minutes = Math.floor(seconds / 60);

    const remaining = Math.floor(seconds % 60);

    return `${minutes}:${remaining
        .toString()
        .padStart(2, "0")}`;
}

/* =========================================================
   VINYL
========================================================= */

function Vinyl({
    isPlaying,
}: {
    isPlaying: boolean;
}) {
    return (
        <div
            className={`
                relative
                h-52
                w-52
                sm:h-60
                sm:w-60
                ${
                    isPlaying
                        ? "animate-[spin_12s_linear_infinite]"
                        : ""
                }
            `}
        >
            {/* OUTER GLOW */}

            <div
                className="
                    absolute
                    -inset-5
                    rounded-full
                    bg-white/[0.025]
                    blur-3xl
                "
            />

            {/* RECORD */}

            <div
                className="
                    absolute
                    inset-0
                    rounded-full
                    border
                    border-white/[0.08]
                    bg-[radial-gradient(circle_at_center,#191919_0%,#0a0a0a_42%,#020202_100%)]
                    shadow-[0_0_80px_rgba(255,255,255,0.06)]
                "
            >
                {/* GROOVES */}

                <div
                    className="
                        absolute
                        inset-[7%]
                        rounded-full
                        border
                        border-white/[0.045]
                    "
                />

                <div
                    className="
                        absolute
                        inset-[14%]
                        rounded-full
                        border
                        border-white/[0.04]
                    "
                />

                <div
                    className="
                        absolute
                        inset-[21%]
                        rounded-full
                        border
                        border-white/[0.035]
                    "
                />

                <div
                    className="
                        absolute
                        inset-[28%]
                        rounded-full
                        border
                        border-white/[0.03]
                    "
                />

                <div
                    className="
                        absolute
                        inset-[35%]
                        rounded-full
                        border
                        border-white/[0.025]
                    "
                />

                {/* LIGHT REFLECTION */}

                <div
                    className="
                        pointer-events-none
                        absolute
                        inset-0
                        rounded-full
                        bg-[linear-gradient(135deg,transparent_25%,rgba(255,255,255,0.06)_48%,transparent_70%)]
                    "
                />

                {/* CENTER LABEL */}

                <div
                    className="
                        absolute
                        left-1/2
                        top-1/2
                        flex
                        h-16
                        w-16
                        -translate-x-1/2
                        -translate-y-1/2
                        items-center
                        justify-center
                        rounded-full
                        bg-white
                        shadow-[0_0_35px_rgba(255,255,255,0.14)]
                    "
                >
                    <div
                        className="
                            h-2
                            w-2
                            rounded-full
                            bg-black
                        "
                    />
                </div>
            </div>
        </div>
    );
}

/* =========================================================
   ICONS
========================================================= */

function PreviousIcon() {
    return (
        <svg
            viewBox="0 0 24 24"
            className="h-5 w-5"
            fill="currentColor"
            aria-hidden="true"
        >
            <rect
                x="5"
                y="5"
                width="2"
                height="14"
                rx="1"
            />

            <path d="M19 5 9 12l10 7V5Z" />
        </svg>
    );
}

function NextIcon() {
    return (
        <svg
            viewBox="0 0 24 24"
            className="h-5 w-5"
            fill="currentColor"
            aria-hidden="true"
        >
            <rect
                x="17"
                y="5"
                width="2"
                height="14"
                rx="1"
            />

            <path d="m5 5 10 7-10 7V5Z" />
        </svg>
    );
}

function PlayIcon() {
    return (
        <svg
            viewBox="0 0 24 24"
            className="h-7 w-7"
            fill="currentColor"
            aria-hidden="true"
        >
            <path d="M8 5v14l11-7L8 5Z" />
        </svg>
    );
}

function PauseIcon() {
    return (
        <svg
            viewBox="0 0 24 24"
            className="h-7 w-7"
            fill="currentColor"
            aria-hidden="true"
        >
            <rect
                x="7"
                y="5"
                width="3.5"
                height="14"
                rx="1"
            />

            <rect
                x="13.5"
                y="5"
                width="3.5"
                height="14"
                rx="1"
            />
        </svg>
    );
}

function VolumeIcon({
    muted,
}: {
    muted: boolean;
}) {
    if (muted) {
        return (
            <svg
                viewBox="0 0 24 24"
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
                aria-hidden="true"
            >
                <path d="M4 9v6h4l5 4V5L8 9H4Z" />

                <path d="m17 9 4 6" />

                <path d="m21 9-4 6" />
            </svg>
        );
    }

    return (
        <svg
            viewBox="0 0 24 24"
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.7"
            aria-hidden="true"
        >
            <path d="M4 9v6h4l5 4V5L8 9H4Z" />

            <path d="M16 9.5c1.3 1.4 1.3 3.6 0 5" />

            <path d="M19 7c2.5 2.8 2.5 7.2 0 10" />
        </svg>
    );
}

/* =========================================================
   WAVE
========================================================= */

function WaveBars({
    active,
}: {
    active: boolean;
}) {
    const bars = [
        8,
        15,
        22,
        13,
        27,
        18,
        11,
        24,
        16,
        9,
    ];

    return (
        <div
            className="
                flex
                h-8
                items-center
                gap-[3px]
            "
        >
            {bars.map((height, index) => (
                <span
                    key={index}
                    className={`
                        w-[3px]
                        rounded-full
                        transition-all
                        duration-500
                        ${
                            active
                                ? "bg-white/60"
                                : "bg-white/15"
                        }
                    `}
                    style={{
                        height: `${height}px`,
                        animation: active
                            ? `pulse 900ms ease-in-out ${
                                  index * 70
                              }ms infinite alternate`
                            : "none",
                    }}
                />
            ))}
        </div>
    );
}

/* =========================================================
   MUSIC CARD
========================================================= */

export default function MusicCard() {
    const {
        isPlaying,
        currentTime,
        duration,
        volume,
        currentSong,
        togglePlay,
        nextSong,
        prevSong,
        seek,
        setVolume,
    } = usePlayer();

    /* =====================================================
       SONG REVEAL
    ===================================================== */

    const [showSong, setShowSong] =
        useState(false);

    /* =====================================================
       RESET REVEAL WHEN SONG CHANGES
    ===================================================== */

    useEffect(() => {
        setShowSong(false);
    }, [currentSong?.src]);

    /* =====================================================
       LOCAL VOLUME
    ===================================================== */

    const [localVolume, setLocalVolume] =
        useState(volume);

    useEffect(() => {
        setLocalVolume(volume);
    }, [volume]);

    /* =====================================================
       PROGRESS
    ===================================================== */

    const progress =
        duration > 0
            ? Math.min(
                  100,
                  Math.max(
                      0,
                      (currentTime / duration) *
                          100
                  )
              )
            : 0;

    /* =====================================================
       VOLUME
    ===================================================== */

    const volumePercent = Math.round(
        localVolume * 100
    );

    const muted = localVolume <= 0;

    return (
        <>
            {/* =================================================
                PLAYER
            ================================================= */}

            <section
                className="
                    relative
                    -top-16
                    w-full
                    max-w-5xl
                    sm:-top-2
                    "
            >
                <div
                    className="
                        relative
                        mx-auto
                        w-full
                        overflow-hidden
                        rounded-[36px]
                        border
                        border-white/[0.10]
                        bg-black/45
                        px-5
                        py-7
                        shadow-[0_35px_120px_rgba(0,0,0,0.65)]
                        backdrop-blur-2xl
                        sm:px-10
                        sm:py-9
                    "
                >
                    {/* AMBIENT GLOW */}

                    <div
                        className="
                            pointer-events-none
                            absolute
                            left-1/2
                            top-0
                            h-80
                            w-80
                            -translate-x-1/2
                            rounded-full
                            bg-white/[0.025]
                            blur-3xl
                        "
                    />

                    <div
                        className="
                            pointer-events-none
                            absolute
                            inset-0
                            bg-gradient-to-b
                            from-white/[0.025]
                            via-transparent
                            to-transparent
                        "
                    />

                    <div
                        className="
                            relative
                            z-10
                        "
                    >
                        {/* =================================================
                            TOP LABEL
                        ================================================= */}

                        <div
                            className="
                                text-center
                            "
                        >
                            <p
                                className="
                                    text-[9px]
                                    uppercase
                                    tracking-[0.6em]
                                    text-white/25
                                "
                            >
                                VISH-U 3.A.M. · NIGHT RADIO
                            </p>
                        </div>

                        {/* =================================================
                            VINYL
                        ================================================= */}

                        <div
                            className="
                                mt-5
                                flex
                                justify-center
                                sm:mt-7
                            "
                        >
                            <Vinyl
                                isPlaying={
                                    isPlaying
                                }
                            />
                        </div>

                        {/* =================================================
                            TEXT
                        ================================================= */}

                        <div
                            className="
                                mt-5
                                text-center
                            "
                        >
                            <p
                                className="
                                    text-[9px]
                                    uppercase
                                    tracking-[0.55em]
                                    text-white/25
                                "
                            >
                                YOU DON'T CHOOSE
                            </p>

                            <h2
                                className="
                                    mt-2
                                    text-3xl
                                    font-medium
                                    text-white/90
                                    sm:text-4xl
                                "
                                style={{
                                    fontFamily:
                                        "'Noto Serif Devanagari', 'Nirmala UI', serif",
                                }}
                            >
                                बस सुनो।
                            </h2>

                            {/* =================================================
                                SONG NAME / HIDDEN MESSAGE
                            ================================================= */}

                            <p
                                className="
                                    mt-2
                                    text-[10px]
                                    uppercase
                                    tracking-[0.28em]
                                    text-white/25
                                    transition-all
                                    duration-300
                                "
                            >
                                {showSong
                                    ? currentSong?.name ??
                                      "Unknown Song"
                                    : "You don't choose. The night chooses."}
                            </p>

                            {/* =================================================
                                REVEAL BUTTON
                            ================================================= */}

                            <button
                                type="button"
                                onClick={() =>
                                    setShowSong(
                                        (value) =>
                                            !value
                                    )
                                }
                                className="
                                    mt-4
                                    text-[9px]
                                    uppercase
                                    tracking-[0.35em]
                                    text-white/35
                                    transition-all
                                    duration-300
                                    hover:text-white/75
                                "
                            >
                                {showSong
                                    ? "HIDE THE SONG"
                                    : "TAP TO REVEAL"}
                            </button>
                        </div>

                        {/* =================================================
                            PROGRESS
                        ================================================= */}

                        <div
                            className="
                                mt-8
                            "
                        >
                            <input
                                type="range"
                                min="0"
                                max={
                                    duration > 0
                                        ? duration
                                        : 1
                                }
                                step="0.1"
                                value={
                                    duration > 0
                                        ? Math.min(
                                              currentTime,
                                              duration
                                          )
                                        : 0
                                }
                                onChange={(event) => {
                                    if (
                                        duration <=
                                        0
                                    ) {
                                        return;
                                    }

                                    seek(
                                        Number(
                                            event
                                                .target
                                                .value
                                        )
                                    );
                                }}
                                className="
                                    h-1
                                    w-full
                                    cursor-pointer
                                    appearance-none
                                    rounded-full
                                    outline-none
                                "
                                style={{
                                    background:
                                        `linear-gradient(to right, rgba(255,255,255,0.72) ${progress}%, rgba(255,255,255,0.10) ${progress}%)`,
                                }}
                            />

                            <div
                                className="
                                    mt-2
                                    flex
                                    justify-between
                                    text-[10px]
                                    text-white/25
                                "
                            >
                                <span>
                                    {formatTime(
                                        currentTime
                                    )}
                                </span>

                                <span>
                                    {formatTime(
                                        duration
                                    )}
                                </span>
                            </div>
                        </div>

                        {/* =================================================
                            MAIN CONTROLS
                        ================================================= */}

                        <div
                            className="
                                mt-8
                                flex
                                items-center
                                justify-center
                                gap-5
                                sm:gap-7
                            "
                        >
                            {/* PREVIOUS */}

                            <button
                                type="button"
                                onClick={() =>
                                    void prevSong()
                                }
                                aria-label="Previous song"
                                className="
                                    flex
                                    h-12
                                    w-12
                                    items-center
                                    justify-center
                                    rounded-full
                                    border
                                    border-white/[0.10]
                                    bg-white/[0.025]
                                    text-white/45
                                    transition-all
                                    duration-300
                                    hover:scale-105
                                    hover:border-white/25
                                    hover:bg-white/[0.07]
                                    hover:text-white
                                    active:scale-95
                                "
                            >
                                <PreviousIcon />
                            </button>

                            {/* PLAY / PAUSE */}

                            <button
                                type="button"
                                onClick={() =>
                                    void togglePlay()
                                }
                                aria-label={
                                    isPlaying
                                        ? "Pause"
                                        : "Play"
                                }
                                className="
                                    flex
                                    h-[78px]
                                    w-[78px]
                                    items-center
                                    justify-center
                                    rounded-full
                                    border
                                    border-white/20
                                    bg-white
                                    text-black
                                    shadow-[0_0_45px_rgba(255,255,255,0.14)]
                                    transition-all
                                    duration-300
                                    hover:scale-105
                                    hover:shadow-[0_0_65px_rgba(255,255,255,0.20)]
                                    active:scale-95
                                "
                            >
                                {isPlaying ? (
                                    <PauseIcon />
                                ) : (
                                    <PlayIcon />
                                )}
                            </button>

                            {/* NEXT */}

                            <button
                                type="button"
                                onClick={() =>
                                    void nextSong()
                                }
                                aria-label="Next song"
                                className="
                                    flex
                                    h-12
                                    w-12
                                    items-center
                                    justify-center
                                    rounded-full
                                    border
                                    border-white/[0.10]
                                    bg-white/[0.025]
                                    text-white/45
                                    transition-all
                                    duration-300
                                    hover:scale-105
                                    hover:border-white/25
                                    hover:bg-white/[0.07]
                                    hover:text-white
                                    active:scale-95
                                "
                            >
                                <NextIcon />
                            </button>
                        </div>

                        {/* =================================================
                            VOLUME + WAVE
                        ================================================= */}

                        <div
                            className="
                                mt-8
                                flex
                                flex-wrap
                                items-center
                                justify-center
                                gap-4
                            "
                        >
                            <WaveBars
                                active={
                                    isPlaying
                                }
                            />

                            <div
                                className="
                                    flex
                                    items-center
                                    gap-3
                                "
                            >
                                {/* MUTE */}

                                <button
                                    type="button"
                                    aria-label={
                                        muted
                                            ? "Unmute"
                                            : "Mute"
                                    }
                                    onClick={() => {
                                        if (
                                            muted
                                        ) {
                                            setVolume(
                                                0.8
                                            );
                                        } else {
                                            setVolume(
                                                0
                                            );
                                        }
                                    }}
                                    className="
                                        flex
                                        h-8
                                        w-8
                                        items-center
                                        justify-center
                                        rounded-full
                                        text-white/35
                                        transition
                                        hover:bg-white/[0.06]
                                        hover:text-white
                                    "
                                >
                                    <VolumeIcon
                                        muted={
                                            muted
                                        }
                                    />
                                </button>

                                {/* VOLUME SLIDER */}

                                <input
                                    type="range"
                                    min="0"
                                    max="1"
                                    step="0.01"
                                    value={
                                        localVolume
                                    }
                                    onChange={(
                                        event
                                    ) => {
                                        const value =
                                            Number(
                                                event
                                                    .target
                                                    .value
                                            );

                                        setLocalVolume(
                                            value
                                        );

                                        setVolume(
                                            value
                                        );
                                    }}
                                    className="
                                        h-1
                                        w-[150px]
                                        cursor-pointer
                                        appearance-none
                                        rounded-full
                                        outline-none
                                    "
                                    style={{
                                        background:
                                            `linear-gradient(to right, rgba(255,255,255,0.65) ${volumePercent}%, rgba(255,255,255,0.10) ${volumePercent}%)`,
                                    }}
                                />

                                <span
                                    className="
                                        w-7
                                        text-right
                                        text-[9px]
                                        tabular-nums
                                        text-white/20
                                    "
                                >
                                    {
                                        volumePercent
                                    }
                                </span>
                            </div>

                            <WaveBars
                                active={
                                    isPlaying
                                }
                            />
                        </div>

                        {/* =================================================
                            FOOTER
                        ================================================= */}

                        <div
                            className="
                                mt-8
                                text-center
                                text-[8px]
                                uppercase
                                tracking-[0.5em]
                                text-white/[0.13]
                            "
                        >
                            LISTEN IN THE DARK
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}