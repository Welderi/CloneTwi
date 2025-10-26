import { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
    const [isDay, setIsDay] = useState(() => {
        const saved = localStorage.getItem("isDay");
        return saved !== null ? JSON.parse(saved) : true;
    });

    useEffect(() => {
        localStorage.setItem("isDay", JSON.stringify(isDay));

        document.body.classList.remove("day", "night");
        document.body.classList.add(isDay ? "day" : "night");
    }, [isDay]);

    return (
        <ThemeContext.Provider value={{ isDay, setIsDay }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    return useContext(ThemeContext);
}
