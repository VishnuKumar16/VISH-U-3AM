import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

export async function GET() {
  try {
    const musicDir = path.join(process.cwd(), "public", "music");

    const files = await fs.readdir(musicDir);

    const songs = files
      .filter((file) => /\.(mp3|wav|m4a|ogg)$/i.test(file))
      .sort((a, b) =>
        a.localeCompare(b, undefined, {
          numeric: true,
          sensitivity: "base",
        })
      )
      .map((file) => ({
        src: `/music/${encodeURIComponent(file)}`,
        name: path
            .parse(file)
            .name
            .replace(/_spotdown\.org$/i, "")
            .replace(/\s*-\s*New Version.*?\(From\s*_?(.*?)_?\s*\)/i, "")
            .trim(),
      }));

    return NextResponse.json(songs);
  } catch (error) {
    console.error("Error loading songs:", error);

    return NextResponse.json(
      { error: "Could not load songs" },
      { status: 500 }
    );
  }
}