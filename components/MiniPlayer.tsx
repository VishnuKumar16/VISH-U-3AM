"use client";

import { usePathname } from "next/navigation";
import { usePlayer } from "@/context/PlayerContext";

function WaveBars({ active }: { active: boolean }) {
    const heights = [7, 13, 20, 27, 18, 11, 7];

    return (
        <div className="flex h-9 items-center gap-[3px]">
            {heights.map((height, index) => (
                <span
                    key={index}
                    className={`
                        w-[3px]
                        rounded-full
                        bg-white/55
                        ${active ? "wave-active" : ""}
                    `}
                    style={
                        {
                            height: `${height}px`,
                            "--delay": `${index * 0.09}s`,
                        } as React.CSSProperties
                    }
                />
            ))}
        </div>
    );
}

/* PREVIOUS */

function PreviousIcon() {
    return (
        <span className="relative block h-4 w-4">
            <span
                className="
                    absolute
                    left-0
                    top-1/2
                    -translate-y-1/2
                    h-0
                    w-0
                    border-y-[5px]
                    border-r-[7px]
                    border-y-transparent
                    border-r-white/60
                "
            />

            <span
                className="
                    absolute
                    left-[7px]
                    top-1/2
                    -translate-y-1/2
                    h-[10px]
                    w-[2px]
                    rounded-full
                    bg-white/60
                "
            />
        </span>
    );
}

/* NEXT */

function NextIcon() {
    return (
        <span className="relative block h-4 w-4">
            <span
                className="
                    absolute
                    right-0
                    top-1/2
                    -translate-y-1/2
                    h-0
                    w-0
                    border-y-[5px]
                    border-l-[7px]
                    border-y-transparent
                    border-l-white/60
                "
            />

            <span
                className="
                    absolute
                    right-[7px]
                    top-1/2
                    -translate-y-1/2
                    h-[10px]
                    w-[2px]
                    rounded-full
                    bg-white/60
                "
            />
        </span>
    );
}

/* PLAY */

function PlayIcon() {
    return (
        <span
            className="
                ml-[3px]
                block
                h-0
                w-0
                border-y-[8px]
                border-l-[11px]
                border-y-transparent
                border-l-black
            "
        />
    );
}

/* PAUSE */

function PauseIcon() {
    return (
        <span className="flex items-center gap-[4px]">
            <span className="h-[16px] w-[3px] rounded-full bg-black" />
            <span className="h-[16px] w-[3px] rounded-full bg-black" />
        </span>
    );
}

export default function MiniPlayer() {
    const pathname = usePathname();

    const {
        isPlaying,
        togglePlay,
        nextSong,
        prevSong,
    } = usePlayer();

    if (pathname === "/player") {
        return null;
    }

    return (
        <div
            className="
                pointer-events-none
                fixed
                bottom-4
                left-1/2
                z-[100]
                -translate-x-1/2
                sm:bottom-6
            "
        >
            <div
                className="
                    pointer-events-auto
                    flex
                    items-center
                    justify-center
                    gap-2
                    sm:gap-4
                "
            >

                {/* LEFT WAVE */}

                <div className="hidden sm:block">
                    <WaveBars active={isPlaying} />
                </div>

                {/* PREVIOUS */}

                <button
                    type="button"
                    onClick={() => void prevSong()}
                    aria-label="Previous song"
                    className="
                        group
                        flex
                        h-10
                        w-10
                        items-center
                        justify-center
                        rounded-full
                        border
                        border-white/[0.08]
                        bg-white/[0.02]
                        transition-all
                        duration-300
                        hover:border-white/20
                        hover:bg-white/[0.08]
                        hover:scale-105
                        active:scale-90
                    "
                >
                    <span className="transition group-hover:scale-110">
                        <PreviousIcon />
                    </span>
                </button>

                {/* PLAY / PAUSE */}

                <button
                    type="button"
                    onClick={() => void togglePlay()}
                    aria-label={isPlaying ? "Pause" : "Play"}
                    className="
                        flex
                        h-[58px]
                        w-[58px]
                        items-center
                        justify-center
                        rounded-full
                        border
                        border-white/20
                        bg-white
                        text-black
                        shadow-[0_0_40px_rgba(255,255,255,0.14)]
                        transition-all
                        duration-300
                        hover:scale-105
                        hover:shadow-[0_0_50px_rgba(255,255,255,0.22)]
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
                    onClick={() => void nextSong()}
                    aria-label="Next song"
                    className="
                        group
                        flex
                        h-10
                        w-10
                        items-center
                        justify-center
                        rounded-full
                        border
                        border-white/[0.08]
                        bg-white/[0.02]
                        transition-all
                        duration-300
                        hover:border-white/20
                        hover:bg-white/[0.08]
                        hover:scale-105
                        active:scale-90
                    "
                >
                    <span className="transition group-hover:scale-110">
                        <NextIcon />
                    </span>
                </button>

                {/* RIGHT WAVE */}

                <div className="hidden sm:block">
                    <WaveBars active={isPlaying} />
                </div>

            </div>
        </div>
    );
}