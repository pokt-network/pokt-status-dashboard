import { StatusTable } from "../tables/status";
import { Loader2 } from "lucide-react";
import { useState, useEffect } from "react";

export function StatusCard() {
  const refreshInterval = 5 * 60;
  const [countdown, setCountdown] = useState(refreshInterval);

  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown(countdown - 1);
      if (countdown === 0) {
        setCountdown(refreshInterval);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [countdown]);

  return (
    <div className="w-full min-w-md p-0 gap-1 border-none bg-none flex flex-col max-w-[1400px]">
      <div className="rounded-lg p-4 text-white bg-[#09279f] mb-0">
        <div className="flex flex-row justify-between items-center gap-4">
          <h1 className="text-white text-2xl font-bold">Status</h1>
          <div className="flex items-center gap-2 text-sm text-white">
            <Loader2 className="animate-spin w-4 h-4" />
            <span className="font-semibold">Refresh In:</span>
            <span className="min-w-10 text-right">{countdown}s</span>
          </div>
        </div>
      </div>
      <div className="mt-4">
        <StatusTable />
      </div>
    </div>
  );
}