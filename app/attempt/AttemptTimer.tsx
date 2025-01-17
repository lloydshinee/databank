import { useEffect, useState } from "react";
import { useAttempt } from "@/providers/AttemptProvider";

export function AttemptTimer() {
  const { attempt, finishAttempt } = useAttempt();
  const expiresAt = attempt?.expiresAt ? new Date(attempt.expiresAt) : null;

  const [timeRemaining, setTimeRemaining] = useState<string>("");

  useEffect(() => {
    if (!expiresAt || attempt?.status === "Expired") return;

    const updateTimer = () => {
      const now = new Date();
      const difference = expiresAt.getTime() - now.getTime();

      if (difference <= 0) {
        setTimeRemaining("Time's up!");
        finishAttempt();
        return;
      }

      const minutes = Math.floor(difference / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeRemaining(
        `${minutes.toString().padStart(2, "0")}:${seconds
          .toString()
          .padStart(2, "0")}`
      );
    };

    // Update the timer every second
    updateTimer(); // Call once immediately to avoid delay
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval); // Cleanup the interval on unmount
  }, [expiresAt, attempt?.status]);

  if (!expiresAt) {
    return <div>No timer available.</div>;
  }

  return (
    <div className="text-lg font-semibold text-red-600">
      Time Remaining: {timeRemaining}
    </div>
  );
}
