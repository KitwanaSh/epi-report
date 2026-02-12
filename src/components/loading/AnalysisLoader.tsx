"use client";

import { useState, useEffect } from "react";
import { LOADING_MESSAGES } from "@/utils/constants";

interface AnalysisLoaderProps {
  week: number;
  year: number;
}

export default function AnalysisLoader({ week, year }: AnalysisLoaderProps) {
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);

  // Cycle through loading messages
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMessageIndex((prev) => {
        if (prev < LOADING_MESSAGES.length - 1) {
          return prev + 1;
        }
        return prev; // Stay on last message
      });
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="py-16 flex flex-col items-center justify-center space-y-8">
      {/* Spinner */}
      <div className="relative">
        <div
          className="
            w-16 h-16 
            border-4 border-primary-light 
            border-t-primary 
            rounded-full 
            animate-spin
          "
        />
      </div>

      {/* Report Info */}
      <div className="text-center space-y-2">
        <h3 className="text-text-primary">
          Génération du rapport S{week}/{year}
        </h3>

        {/* Current Stage Message */}
        <p className="text-text-secondary text-[15px] animate-pulse-slow">
          {LOADING_MESSAGES[currentMessageIndex]}
        </p>
      </div>

      {/* Progress Bar */}
      <div className="w-full max-w-md">
        <div className="h-2 bg-surface-light rounded-full overflow-hidden">
          <div
            className="h-full bg-primary rounded-full animate-progress"
          />
        </div>
      </div>

      {/* Note */}
      <p className="text-text-muted text-[13px] text-center max-w-md">
        L&apos;analyse et la génération du texte peuvent prendre entre 20 et 40 secondes.
        Veuillez patienter.
      </p>
    </div>
  );
}