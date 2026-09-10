"use client";

import MusicCard from "@/components/MusicCard";
import { useEffect, useRef, useState } from "react";

const videos = [
    "/video/night-01.mp4",
    "/video/night-02.mp4",
    "/video/night-03.mp4",
];

export default function PlayerPage() {
    const [activeVideo, setActiveVideo] = useState(0);

    const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

    useEffect(() => {
        const timer = setInterval(() => {
            setActiveVideo((current) => {
                const next = (current + 1) % videos.length;

                const nextVideo = videoRefs.current[next];
                const oldVideo = videoRefs.current[current];

                if (nextVideo) {
                    nextVideo.currentTime = 0;

                    nextVideo.play().catch(() => { });
                }

                setTimeout(() => {
                    if (oldVideo) {
                        oldVideo.pause();
                    }
                }, 3000);

                return next;
            });
        }, 180000);

        return () => clearInterval(timer);
    }, []);

    return (
        <main className="relative h-[100dvh] w-full overflow-hidden bg-black text-white">

            {/* =================================================
                BACKGROUND
            ================================================= */}

            <div className="fixed inset-0 z-0 overflow-hidden">
                {videos.map((src, index) => (
                    <video
                        key={src}
                        ref={(el) => {
                            videoRefs.current[index] = el;
                        }}
                        className="
                            absolute
                            inset-0
                            h-full
                            w-full
                            object-cover
                            transition-opacity
                            duration-[3000ms]
                            ease-in-out
                        "
                        style={{
                            opacity:
                                activeVideo === index ? 1 : 0,
                        }}
                        src={src}
                        muted
                        autoPlay={index === 0}
                        playsInline
                        preload="auto"
                    />
                ))}
            </div>

            {/* DARKNESS */}

            <div className="
                fixed
                inset-0
                z-[1]
                bg-black/70
            " />

            {/* VIGNETTE */}

            <div className="
                fixed
                inset-0
                z-[2]
                bg-[radial-gradient(circle_at_center,rgba(30,30,35,0.12)_0%,rgba(0,0,0,0.58)_58%,rgba(0,0,0,0.94)_100%)]
            " />

            {/* =================================================
                CONTENT
            ================================================= */}

            <div className="
                relative
                z-10
                flex
                h-full
                min-h-0
                w-full
                flex-col
            ">

                {/* =================================================
                    HEADER
                ================================================= */}

                <header className="
                    shrink-0
                    px-6
                    pt-5
                    text-center
                    sm:pt-6
                ">

                    <p className="
                        text-[7px]
                        uppercase
                        tracking-[0.65em]
                        text-white/35
                    ">
                        NIGHT RADIO
                    </p>

                    <h1
                        className="
                            mt-1
                            text-4xl
                            leading-none
                            text-white/90
                            sm:text-5xl
                        "
                        style={{
                            fontFamily:
                                "'Noto Serif Devanagari', 'Nirmala UI', serif",
                        }}
                    >
                        बस सुनो।
                    </h1>

                    <p className="
                        mt-1.5
                        text-[10px]
                        tracking-wide
                        text-white/30
                    ">
                        Close your eyes. Let the memories play.
                    </p>

                </header>

                {/* =================================================
                    PLAYER
                ================================================= */}

                <div className="
                    flex
                    min-h-0
                    flex-1
                    items-center
                    justify-center
                    px-4
                    py-3
                    sm:px-8
                    sm:py-4
                ">

                    <MusicCard />

                </div>

            </div>
        </main>
    );
}