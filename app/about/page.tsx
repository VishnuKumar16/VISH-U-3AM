"use client";

import Link from "next/link";

export default function AboutPage() {
    return (
        <main className="min-h-screen bg-black px-6 pb-32 pt-40 text-white">
            <div className="mx-auto max-w-5xl">

                {/* Small intro */}
                <div className="mb-8">
                    <p
                        className="text-sm tracking-[0.35em] text-white/35"
                        style={{
                            fontFamily:
                                "'Noto Serif Devanagari', 'Nirmala UI', serif",
                        }}
                    >
                        एक छोटी सी जगह
                    </p>
                </div>

                {/* Main heading */}
                <h1
                    className="text-6xl font-semibold tracking-tight md:text-8xl"
                    style={{
                        fontFamily:
                            "'Noto Serif Devanagari', 'Nirmala UI', serif",
                    }}
                >
                    अकेले।
                </h1>

                <p className="mt-5 max-w-2xl text-lg leading-8 text-white/50 md:text-xl">
                    A quiet place for the hours when the world goes silent.
                </p>

                {/* Creator card */}
                <section className="mt-20 rounded-3xl border border-white/10 bg-white/[0.03] p-8 backdrop-blur-xl md:p-12">

                    <p className="text-xs uppercase tracking-[0.35em] text-white/35">
                        The person behind it
                    </p>

                    <h2 className="mt-5 text-3xl font-medium md:text-5xl">
                        Hi, I am Vishnu.
                    </h2>

                    <p className="mt-6 max-w-2xl text-base leading-8 text-white/50 md:text-lg">
                        The creator of{" "}
                        <span className="text-white/80">
                            VISH-U 3A.M
                        </span>
                        .
                        <br />
                        I made this little corner for anyone who finds themselves
                        awake at night, thinking about someone they secretly wish
                        was there.
                    </p>

                    <p
                        className="mt-8 text-2xl text-white/80"
                        style={{
                            fontFamily:
                                "'Noto Serif Devanagari', 'Nirmala UI', serif",
                        }}
                    >
                        कुछ रातें नींद के लिए नहीं,
                        <br />
                        किसी ख़ास की याद में जागने के लिए होती हैं।
                    </p>
                </section>

                {/* Links */}
                <section className="mt-8 grid gap-4 md:grid-cols-2">

                    {/* Instagram */}
                    <a
                        href="https://www.instagram.com/_neurotic___/?next=%252Faccounts%252Flogin%252F%253FconfirmReset%253D1"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group rounded-2xl border border-white/10 bg-white/[0.025] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-white/20 hover:bg-white/[0.05]"
                    >
                        <p className="text-xs uppercase tracking-[0.3em] text-white/30">
                            Instagram
                        </p>

                        <p className="mt-3 text-lg text-white/80 transition group-hover:text-white">
                            _neurotic___
                        </p>
                    </a>

                    {/* 3 A.M. Quote */}
                    <div className="group rounded-2xl border border-white/10 bg-white/[0.025] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-white/20 hover:bg-white/[0.05]">

                        <p className="text-xs uppercase tracking-[0.3em] text-white/30">
                            3 A.M.
                        </p>

                        <p className="mt-3 text-lg italic leading-7 text-white/70 transition group-hover:text-white/90">
                            “If you're here at 3 A.M., maybe you know why.”
                        </p>

                    </div>

                </section>

                {/* Back */}
                <div className="mt-16">
                    <Link
                        href="/"
                        className="text-sm tracking-[0.2em] text-white/35 transition hover:text-white"
                    >
                        ← BACK TO THE NIGHT
                    </Link>
                </div>

            </div>
        </main>
    );
}