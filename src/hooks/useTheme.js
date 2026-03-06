import { useEffect, useState } from "react";

export default function useTheme() {

  const [theme, setTheme] = useState(
    localStorage.getItem("theme") || "dark"
  );

  useEffect(() => {

    localStorage.setItem("theme", theme);

  }, [theme]);

  const toggleTheme = () => {

    setTheme((prev) => prev === "dark" ? "light" : "dark");

  };

  return { theme, toggleTheme };

}