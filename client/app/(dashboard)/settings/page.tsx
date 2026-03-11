"use client";

import { useState } from "react";

import { getCurrentTheme, themes, toggleTheme, type Theme } from "@/app/utils/theme";

const themeOptions: Record<
  Theme,
  { label: string; dotClassName: string; ringClassName: string }
> = {
  light: {
    label: "Light",
    dotClassName: "bg-[#ea580c]",
    ringClassName: "ring-[#ea580c]/35",
  },
  dark: {
    label: "Dark",
    dotClassName: "bg-[#38bdf8]",
    ringClassName: "ring-[#38bdf8]/35",
  },
  coffee: {
    label: "Coffee",
    dotClassName: "bg-[#16a34a]",
    ringClassName: "ring-[#16a34a]/35",
  },
  modern: {
    label: "Modern",
    dotClassName: "bg-[linear-gradient(135deg,#f43f5e,#22d3ee)]",
    ringClassName: "ring-[#f43f5e]/35",
  },
};

function Settings() {
  const [selectedTheme, setSelectedTheme] = useState<Theme>(() =>
    typeof document === "undefined" ? "light" : getCurrentTheme(),
  );

  const handleThemeChange = (theme: Theme) => {
    setSelectedTheme(theme);
    toggleTheme(theme);
  };

  return (
    <section className="mx-auto max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-txt">Settings</h1>
        <p className="mt-1 text-sm text-mute">Customize how your workspace looks.</p>
      </div>

      <div className="rounded-2xl border border-bd bg-surface p-6 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-medium text-txt">Theme</h2>
            <p className="text-sm text-mute">Choose one of the available color themes.</p>
          </div>

          <div className="flex items-center gap-3">
            {themes.map((theme) => {
              const option = themeOptions[theme];
              const isSelected = selectedTheme === theme;

              return (
                <button
                  key={theme}
                  type="button"
                  aria-label={`Use ${option.label} theme`}
                  aria-pressed={isSelected}
                  onClick={() => handleThemeChange(theme)}
                  className={`flex h-11 w-11 items-center justify-center rounded-full border transition-all ${
                    isSelected
                      ? `border-transparent bg-bg ring-4 ${option.ringClassName}`
                      : "border-bd bg-bg hover:border-prime/40"
                  }`}
                >
                  <span className={`h-5 w-5 rounded-full ${option.dotClassName}`} />
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

export default Settings;
