"use client";
import { toggleTheme, getNextTheme } from "./utils/theme";

export default function Home() {
  return (
    <div className="h-screen w-screen bg-bg transition-all ease-in duration-500">
      <h1 className="text-3xl text-txt font-bold">Portifi Ai</h1>
      <p className="text-txt font-bold">Sub Heading</p>
      <button
        onClick={() => toggleTheme(getNextTheme())}
        className="mt-4 px-4 py-2 bg-prime text-txt rounded hover:bg-second transition-colors"
      >
        toggle Theme
      </button>
    </div>
  );
}
