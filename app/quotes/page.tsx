"use client";

import { useEffect, useState } from "react";

const thoughts = [
  {
    hi: "कुछ रातें सिर्फ़ महसूस करने के लिए होती हैं।",
    en: "Some nights are meant to be felt, not understood.",
  },
  {
    hi: "ख़ामोशी भी कभी-कभी जवाब होती है।",
    en: "Silence can be an answer too.",
  },
  {
    hi: "हर अकेलापन उदासी नहीं होता।",
    en: "Not every solitude is sadness.",
  },
  {
    hi: "रात जितनी गहरी होती है, ख़याल उतने साफ़ होते हैं।",
    en: "The deeper the night, the clearer the thoughts.",
  },
  {
    hi: "कुछ बातें सिर्फ़ रात समझती है।",
    en: "Some things are understood only by the night.",
  },
  {
    hi: "जिसे कहना मुश्किल हो, उसे कभी-कभी लिख देना चाहिए।",
    en: "Some feelings are easier to write than to say.",
  },
  {
    hi: "कुछ लोग दूर होकर भी रातों के बहुत क़रीब रहते हैं।",
    en: "Some people stay close to your nights, even from far away.",
  },
  {
    hi: "हर याद वापस नहीं आती, कुछ हमेशा साथ रहती है।",
    en: "Not every memory comes back. Some never leave.",
  },
];

export default function QuotesPage() {
  const [index, setIndex] = useState(0);
  const [copied, setCopied] = useState(false);
  const [direction, setDirection] = useState<"next" | "prev">("next");

  const thought = thoughts[index];

  const goTo = (newIndex: number, newDirection?: "next" | "prev") => {
    setIndex((newIndex + thoughts.length) % thoughts.length);

    if (newDirection) {
      setDirection(newDirection);
    }
  };

  const nextThought = () => {
    setDirection("next");
    goTo(index + 1);
  };

  const previousThought = () => {
    setDirection("prev");
    goTo(index - 1);
  };

  const randomThought = () => {
    if (thoughts.length <= 1) return;

    let random = Math.floor(Math.random() * thoughts.length);

    while (random === index) {
      random = Math.floor(Math.random() * thoughts.length);
    }

    setDirection(random > index ? "next" : "prev");
    setIndex(random);
  };

  const copyThought = async () => {
    const text = `"${thought.hi}"\n${thought.en}`;

    try {
      await navigator.clipboard.writeText(text);

      setCopied(true);

      window.setTimeout(() => {
        setCopied(false);
      }, 1800);
    } catch {
      setCopied(false);
    }
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowRight") {
        setDirection("next");
        setIndex((current) => (current + 1) % thoughts.length);
      }

      if (event.key === "ArrowLeft") {
        setDirection("prev");
        setIndex(
          (current) =>
            (current - 1 + thoughts.length) % thoughts.length
        );
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <main
      className="
        relative
        h-[100svh]
        w-full
        overflow-hidden
        bg-black
        text-white
      "
    >
      {/* =====================================================
          BACKGROUND
      ===================================================== */}

      <div
        className="
          absolute
          inset-0
          scale-[1.03]
          bg-cover
          bg-center
        "
        style={{
          backgroundImage: "url('/quotes-bg.jpg')",
        }}
      />

      {/* Darkness */}
      <div className="absolute inset-0 bg-black/75" />

      {/* Cinematic gradient */}
      <div
        className="
          absolute
          inset-0
          bg-gradient-to-b
          from-black/80
          via-black/35
          to-black
        "
      />

      {/* Center glow */}
      <div
        className="
          pointer-events-none
          absolute
          left-1/2
          top-1/2
          h-[520px]
          w-[520px]
          -translate-x-1/2
          -translate-y-1/2
          rounded-full
          bg-white/[0.025]
          blur-[130px]
        "
      />

      {/* =====================================================
          CONTENT
      ===================================================== */}

      <div
        className="
          relative
          z-10
          flex
          h-full
          flex-col
          items-center
          px-5
          pb-28
          pt-28
          sm:px-8
          sm:pb-20
          sm:pt-32
        "
      >
        {/* =================================================
            TOP LABEL
        ================================================= */}

        <div className="shrink-0 text-center">
          <p
            className="
              text-[8px]
              uppercase
              tracking-[0.55em]
              text-white/30
            "
          >
            VISH-U 3.A.M.
          </p>

          <div
            className="
              mt-3
              flex
              items-center
              justify-center
              gap-3
            "
          >
            <span className="h-px w-8 bg-white/10" />

            <span
              className="
                text-[8px]
                tracking-[0.35em]
                text-white/20
              "
            >
              NIGHT THOUGHTS
            </span>

            <span className="h-px w-8 bg-white/10" />
          </div>
        </div>

        {/* =================================================
            QUOTE AREA
        ================================================= */}

        <div
          className="
            flex
            min-h-0
            w-full
            flex-1
            items-center
            justify-center
          "
        >
          <div
            key={index}
            className={`
              w-full
              max-w-5xl
              text-center
              ${
                direction === "next"
                  ? "thought-enter-next"
                  : "thought-enter-prev"
              }
            `}
          >
            {/* Counter */}

            <p
              className="
                mb-7
                text-[8px]
                font-medium
                tracking-[0.5em]
                text-white/20
              "
            >
              {String(index + 1).padStart(2, "0")}
              {" / "}
              {String(thoughts.length).padStart(2, "0")}
            </p>

            {/* Hindi */}

            <h1
              className="
                mx-auto
                max-w-4xl
                px-2
                text-[2.05rem]
                font-medium
                leading-[1.4]
                text-white
                sm:text-5xl
                md:text-6xl
                lg:text-7xl
              "
              style={{
                fontFamily:
                  "'Noto Serif Devanagari', 'Nirmala UI', serif",
              }}
            >
              “{thought.hi}”
            </h1>

            {/* English */}

            <p
              className="
                mx-auto
                mt-7
                max-w-2xl
                px-4
                text-sm
                font-light
                leading-7
                text-white/35
                sm:text-base
                md:text-lg
              "
            >
              {thought.en}
            </p>
          </div>
        </div>

        {/* =================================================
            CONTROLS
        ================================================= */}

        <div
          className="
            shrink-0
            pb-2
            text-center
          "
        >
          {/* Progress */}

          <div
            className="
              mb-6
              flex
              items-center
              justify-center
              gap-1.5
            "
          >
            {thoughts.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => {
                  setDirection(i > index ? "next" : "prev");
                  setIndex(i);
                }}
                aria-label={`Go to thought ${i + 1}`}
                className={`
                  h-[2px]
                  rounded-full
                  transition-all
                  duration-500
                  ${
                    i === index
                      ? "w-8 bg-white/70"
                      : "w-2 bg-white/15 hover:bg-white/35"
                  }
                `}
              />
            ))}
          </div>

          {/* Buttons */}

          <div
            className="
              flex
              items-center
              justify-center
              gap-2
            "
          >
            {/* Previous */}

            <button
              type="button"
              onClick={previousThought}
              aria-label="Previous thought"
              className="
                flex
                h-11
                w-11
                items-center
                justify-center
                rounded-full
                border
                border-white/10
                bg-white/[0.025]
                text-white/45
                transition-all
                duration-300
                hover:border-white/20
                hover:bg-white/[0.07]
                hover:text-white
                active:scale-90
              "
            >
              ←
            </button>

            {/* Random */}

            <button
              type="button"
              onClick={randomThought}
              className="
                flex
                h-11
                items-center
                gap-2
                rounded-full
                border
                border-white/10
                bg-white/[0.025]
                px-5
                text-[8px]
                uppercase
                tracking-[0.35em]
                text-white/40
                transition-all
                duration-300
                hover:border-white/20
                hover:bg-white/[0.07]
                hover:text-white
                active:scale-95
              "
            >
              <span className="text-sm">✦</span>
              RANDOM
            </button>

            {/* Copy */}

            <button
              type="button"
              onClick={copyThought}
              aria-label="Copy thought"
              className="
                flex
                h-11
                min-w-11
                items-center
                justify-center
                rounded-full
                border
                border-white/10
                bg-white/[0.025]
                px-4
                text-[8px]
                uppercase
                tracking-[0.25em]
                text-white/40
                transition-all
                duration-300
                hover:border-white/20
                hover:bg-white/[0.07]
                hover:text-white
                active:scale-95
              "
            >
              {copied ? "COPIED" : "COPY"}
            </button>

            {/* Next */}

            <button
              type="button"
              onClick={nextThought}
              aria-label="Next thought"
              className="
                flex
                h-11
                w-11
                items-center
                justify-center
                rounded-full
                border
                border-white/10
                bg-white/[0.025]
                text-white/45
                transition-all
                duration-300
                hover:border-white/20
                hover:bg-white/[0.07]
                hover:text-white
                active:scale-90
              "
            >
              →
            </button>
          </div>

          {/* Footer */}

          <p
            className="
              mt-5
              text-center
              text-[7px]
              uppercase
              tracking-[0.5em]
              text-white/15
            "
          >
            SOMEWHERE BETWEEN THOUGHT AND SILENCE
          </p>

          {/* Keyboard hint */}

          <p
            className="
              mt-2
              hidden
              text-[6px]
              uppercase
              tracking-[0.35em]
              text-white/10
              sm:block
            "
          >
            ← → TO EXPLORE
          </p>
        </div>
      </div>
    </main>
  );
}