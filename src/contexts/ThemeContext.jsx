import { createContext, useContext, useMemo } from "react";

const ThemeContext = createContext({
  darkMode: true,
  toggleDarkMode: () => {},
  mode: "dark",
  setMode: () => {},
  isSystem: false,
});

export function ThemeProvider({ children }) {
  const darkMode = true;
  const mode = "dark";

  // Ensure the data-theme attribute is always dark
  if (typeof document !== "undefined") {
    document.documentElement.setAttribute("data-theme", "dark");
    document.documentElement.classList.add("dark");
    document.documentElement.classList.remove("light");
  }

  const contextValue = useMemo(
    () => ({
      darkMode,
      toggleDarkMode: () => {},
      mode,
      setMode: () => {},
      isSystem: false,
    }),
    [],
  );

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
