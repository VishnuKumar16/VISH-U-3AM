"use client";

import Navbar from "../components/Navbar";
import Link from "next/link";
import { useEffect, useState } from "react";

const VIDEOS = [
  "/video/night-01.mp4",
  "/video/night-02.mp4",
  "/video/night-03.mp4",
];

const VIDEO_DURATION = 3 * 60 * 1000;

export default function Home() {
  const [time, setTime] = useState("");
  const [videoIndex, setVideoIndex] = useState(0);
  const [videoVisible, setVideoVisible] = useState(true);

  /* ========================================================
     CLOCK
  ======================================================== */

  useEffect(() => {
    const updateTime = () => {
      setTime(
        new Date().toLocaleTimeString("en-IN", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        })
      );
    };

    updateTime();

    const timer = setInterval(updateTime, 1000);

    return () => clearInterval(timer);
  }, []);

  /* ========================================================
     CHANGE BACKGROUND VIDEO EVERY 3 MINUTES
  ======================================================== */

  useEffect(() => {
    const timer = setInterval(() => {
      /*
       * Fade current video out
       */
      setVideoVisible(false);

      /*
       * Change video after fade
       */
      setTimeout(() => {
        setVideoIndex((current) => {
          return (current + 1) % VIDEOS.length;
        });

        setVideoVisible(true);
      }, 700);
    }, VIDEO_DURATION);

    return () => clearInterval(timer);
  }, []);

  return (
    <main className="home-page relative min-h-[100svh] overflow-hidden bg-black text-white">

      {/* ====================================================
          BACKGROUND VIDEO
      ==================================================== */}

      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">

        <video
          key={VIDEOS[videoIndex]}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          className={`
            absolute inset-0
            h-full w-full
            object-cover
            transition-opacity duration-700
            ${videoVisible ? "opacity-100" : "opacity-0"}
          `}
        >
          <source
            src={VIDEOS[videoIndex]}
            type="video/mp4"
          />
        </video>

        {/* Cinematic darkness */}
        <div className="absolute inset-0 bg-black/65" />

        {/* Top darkness */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/25 to-black" />

        {/* Side darkness */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at center, transparent 25%, rgba(0,0,0,0.65) 100%)",
          }}
        />

        {/* Soft night glow */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at 50% 38%, rgba(45,55,85,0.18), transparent 55%)",
          }}
        />

      </div>


      {/* ====================================================
          GRAIN
      ==================================================== */}

      <div className="noise-overlay pointer-events-none fixed inset-0 z-[3]" />


      {/* ====================================================
          NAVBAR
      ==================================================== */}

      <div className="relative z-50">
        <Navbar />
      </div>


      {/* ====================================================
          STARS
      ==================================================== */}

      <div className="pointer-events-none fixed inset-0 z-[2]">

        {Array.from({ length: 70 }).map((_, i) => (
          <span
            key={i}
            className="star"
            style={{
              left: `${(i * 47) % 100}%`,
              top: `${(i * 67) % 82}%`,
              animationDelay: `${(i % 6) * 0.5}s`,
            }}
          />
        ))}

      </div>


      {/* ====================================================
          RAIN
      ==================================================== */}

      <div className="pointer-events-none fixed inset-0 z-[4]">
        <div className="rain absolute inset-0" />
      </div>


      {/* ====================================================
          HERO
      ==================================================== */}

      <section
        className="
          relative
          z-10
          flex
          min-h-[100svh]
          flex-col
          items-center
          justify-center
          px-6
          pb-44
          pt-28
          text-center
          sm:pb-28
          sm:pt-36
        "
      >

        {/* ==================================================
            STATUS
        ================================================== */}

        <div className="night-status">

          <span className="night-status-dot" />

          <span>
            YOU DON'T CHOOSE
          </span>

          <span className="night-status-line" />

          <span>
            VISH-U 3AM
          </span>

        </div>


        {/* ==================================================
            SMALL LABEL
        ================================================== */}

        <p
          className="
            mt-10
            text-[9px]
            uppercase
            tracking-[0.55em]
            text-white/30
          "
        >
          MOMENTS BETWEEN
        </p>


        {/* ==================================================
            MAIN TITLE
        ================================================== */}

        <div className="premium-title-wrap mt-10">

          <div className="premium-title-main">
            VISH-U
          </div>

          <div className="premium-title-divider">
            <span />
            <span className="premium-star">✦</span>
            <span />
          </div>

          <div className="premium-title-time">
            3 AM
          </div>

        </div>


        {/* ==================================================
            DECORATIVE SYMBOL
        ================================================== */}

        <div className="mt-7 flex items-center gap-4">

          <span className="h-px w-10 bg-white/10" />

          <span className="home-symbol">
            ✦
          </span>

          <span className="h-px w-10 bg-white/10" />

        </div>


        {/* ==================================================
            TAGLINE
        ================================================== */}

        <p
          className="
            mt-8
            max-w-xl
            text-sm
            leading-7
            text-white/55
            md:text-base
          "
        >
          Thinking about someone they secretly wish was there.
        </p>


        {/* ==================================================
            BUTTONS
        ================================================== */}

        <div
          className="
            mt-10
            flex
            flex-col
            items-center
            gap-3
            sm:flex-row
          "
        >

          <Link
            href="/player"
            className="
              group
              relative
              overflow-hidden
              rounded-full
              border
              border-white/20
              bg-white/[0.08]
              px-10
              py-4
              text-[10px]
              font-medium
              tracking-[0.28em]
              text-white/80
              backdrop-blur-xl
              transition-all
              duration-500
              hover:scale-[1.04]
              hover:border-white/40
              hover:bg-white
              hover:text-black
            "
          >
            ENTER THE VISH-U
          </Link>


          <Link
            href="/journal"
            className="
              rounded-full
              border
              border-white/10
              bg-black/25
              px-9
              py-4
              text-[10px]
              font-medium
              tracking-[0.28em]
              text-white/40
              backdrop-blur-xl
              transition-all
              duration-500
              hover:border-white/25
              hover:bg-white/[0.08]
              hover:text-white
            "
          >
            READ THE NIGHT
          </Link>

        </div>


        {/* ==================================================
            LOCAL TIME
        ================================================== */}

        <div className="mt-10">

          <div className="flex items-center justify-center gap-4">

            <span className="h-px w-8 bg-white/10" />

            <p
              className="
                text-[8px]
                tracking-[0.5em]
                text-white/20
              "
            >
              LOCAL TIME
            </p>

            <span className="h-px w-8 bg-white/10" />

          </div>


          <p className="home-time mt-3">
            {time}
          </p>


          <div className="mt-3 flex items-center justify-center gap-2">

            <span className="h-1 w-1 rounded-full bg-white/30" />

            <span
              className="
                text-[7px]
                uppercase
                tracking-[0.4em]
                text-white/15
              "
            >
              YOU ARE HERE
            </span>

          </div>

        </div>


        {/* ==================================================
            BOTTOM HINT
        ================================================== */}

        <div
          className="
            absolute
            bottom-40
            left-1/2
            -translate-x-1/2
            sm:bottom-7
          "
        >

          <p
            className="
              text-[7px]
              tracking-[0.55em]
              text-white/15
            "
          >
            STAY A WHILE
          </p>

          <div
            className="
              mx-auto
              mt-3
              h-7
              w-px
              bg-gradient-to-b
              from-white/20
              to-transparent
            "
          />

        </div>

      </section>


      {/* ====================================================
          BOTTOM CINEMATIC FADE
      ==================================================== */}

      <div
        className="
          pointer-events-none
          fixed
          bottom-0
          left-0
          right-0
          z-30
          h-32
          bg-gradient-to-t
          from-black
          to-transparent
        "
      />

    </main>
  );
}