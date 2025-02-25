"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";

// Simple context type with only what's needed
interface TabVisibilityContextType {
  isTabActive: boolean;
  isWarningShown: boolean;
  dismissWarning: () => void;
}

// Create the context
const TabVisibilityContext = createContext<TabVisibilityContextType | null>(null);

// Provider component
export const TabVisibilityProvider = ({ children }: { children: ReactNode }) => {
  const [isTabActive, setIsTabActive] = useState(true);
  const [isWarningShown, setIsWarningShown] = useState(false);

  useEffect(() => {
    const handleVisibilityChange = () => {
      const isVisible = !document.hidden;
      setIsTabActive(isVisible);
      if (!isVisible) setIsWarningShown(true);
    };

    const handleFocus = () => {
      setIsTabActive(true);
    };

    const handleBlur = () => {
      setIsTabActive(false);
      setIsWarningShown(true);
    };

    // Set initial state
    setIsTabActive(!document.hidden);

    // Add event listeners
    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("focus", handleFocus);
    window.addEventListener("blur", handleBlur);

    // Clean up
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("focus", handleFocus);
      window.removeEventListener("blur", handleBlur);
    };
  }, []);

  const dismissWarning = () => {
    setIsWarningShown(false);
  };

  return (
    <TabVisibilityContext.Provider 
      value={{ 
        isTabActive, 
        isWarningShown, 
        dismissWarning 
      }}
    >
      {children}
    </TabVisibilityContext.Provider>
  );
};

// Hook to use the context
export const useTabVisibility = () => {
  const context = useContext(TabVisibilityContext);
  
  if (!context) {
    throw new Error("useTabVisibility must be used within a TabVisibilityProvider");
  }
  
  return context;
};
