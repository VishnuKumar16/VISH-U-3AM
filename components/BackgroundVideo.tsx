"use client";

import { useEffect, useRef, useState } from "react";

const VIDEOS = [
    "/video/night-01.mp4",
    "/video/night-02.mp4",
    "/video/night-03.mp4",
];

const CHANGE_INTERVAL = 3 * 60 * 1000; // 3 minutes

export default function BackgroundVideo() {
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const [index, setIndex] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setIndex((current) => {
                return (current + 1) % VIDEOS.length;
            });
        }, CHANGE_INTERVAL);

        return () => {
            clearInterval(timer);
        };
    }, []);

    useEffect(() => {
        const video = videoRef.current;

        if (!video) return;

        video.load();

        video.play().catch(() => {
            // Browser autoplay restriction.
        });
    }, [index]);

    return (
        <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
            <video
                ref={videoRef}
                key={VIDEOS[index]}
                autoPlay
                muted
                loop
                playsInline
                preload="auto"
                className="h-full w-full object-cover"
            >
                <source
                    src={VIDEOS[index]}
                    type="video/mp4"
                />
            </video>

            {/* Dark cinematic overlay */}
            <div className="absolute inset-0 bg-black/65" />

            {/* Bottom darkness */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black" />

            {/* Soft center glow */}
            <div
                className="absolute inset-0"
                style={{
                    background:
                        "radial-gradient(circle at 50% 40%, rgba(40,50,80,0.18), transparent 60%)",
                }}
            />
        </div>
    );
}