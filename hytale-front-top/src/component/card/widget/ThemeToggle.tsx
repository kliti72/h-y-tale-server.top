import { createSignal, onMount } from "solid-js";

export default function ThemeToggle() {
  const [isDark, setIsDark] = createSignal(false);

  onMount(() => {
    // Carica preferenza salvata o system
    const saved = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

    if (saved === "dark" || (!saved && prefersDark)) {
      document.documentElement.classList.add("dark");
      setIsDark(true);
    } else {
      document.documentElement.classList.remove("dark");
      setIsDark(false);
    }
  });

  const toggleTheme = () => {
    const newDark = !isDark();
    setIsDark(newDark);

    if (newDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  return (
    <button
      onClick={toggleTheme}
      class="p-2 rounded-full bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-700 transition"
      aria-label="Toggle theme"
    >
      {isDark() ? "☀️" : "🌙"}  {/* sole = light, luna = dark */}
    </button>
  );
}