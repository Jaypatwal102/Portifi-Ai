"use client";
import { toggleTheme, getNextTheme } from "./utils/theme";

export default function Home() {
  return (
    <div className="h-screen dark:text-amber-200 w-screen bg-bg transition-all ease-in duration-500">
      <h1 className="text-3xl text-suraj font-bold">Portifi Ai</h1>
      <p className="text-suraj font-bold">Sub Heading</p>
      <button
        onClick={() => toggleTheme(getNextTheme())}
        className="mt-4 px-4 py-2 bg-primary text-bg rounded hover:bg-secondary
         transition-colors"
      >
        toggle Theme
      </button>
    </div>
  );
}
