"use client";

import { createContext, useContext, useState, ReactNode } from "react";

// Updated context type
interface SeeFigureContenxtType {
  currentFigure: string | null;
  toggleFigure: (figure:string | null) => void;
}

const SeeFigureContenxt = createContext<SeeFigureContenxtType | null>(null);

// Provider component
export const SeeFigureProvider = ({ children }: { children: ReactNode }) => {
  const [currentFigure, setCurrentFigure] = useState<string | null>(null);
  
  const toggleFigure = (figure: string | null) => {
    setCurrentFigure(figure);
    console.log("Figure seen", figure)
  }

  return (
    <SeeFigureContenxt.Provider value={{ currentFigure, toggleFigure }}>
      {children}
    </SeeFigureContenxt.Provider>
  );
};

// Custom hook to use the context
export const useSeeFigure = () => {
  const context = useContext(SeeFigureContenxt);
  
  if (!context) {
    throw new Error("ToggleFigure must be used within a SeeFigureProvider");
  }
  
  return context;
};
