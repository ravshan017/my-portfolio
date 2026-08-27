"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";

type Theme = "dark" | "light";

interface ThemeApi {
  theme: Theme;
  toggle: () => void;
}

const ThemeContext = createContext<ThemeApi>({
  theme: "dark",
  toggle: () => {},
});

export function useTheme(): ThemeApi {
  return useContext(ThemeContext);
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  // Сервер и первый клиентский рендер оба стартуют с «dark» — иначе
  // расходится гидратация (на клиенте no-flash скрипт уже выставил
  // data-theme из localStorage, а на сервере document недоступен).
  // Реальную тему подхватываем после маунта.
  const [theme, setTheme] = useState<Theme>("dark");

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => {
    const current = document.documentElement.getAttribute("data-theme");
    setTheme(current === "light" ? "light" : "dark");
  }, []);

  const toggle = () => {
    setTheme((prev) => {
      const next: Theme = prev === "dark" ? "light" : "dark";
      document.documentElement.setAttribute("data-theme", next);
      document.documentElement.style.colorScheme = next;
      try {
        localStorage.setItem("rb-theme", next);
      } catch {
        /* приватный режим — не критично */
      }
      return next;
    });
  };

  return (
    <ThemeContext.Provider value={{ theme, toggle }}>
      {children}
    </ThemeContext.Provider>
  );
}
