import { useState, useEffect } from "react";
import type { ILPlayer } from "@/lib/data";

interface InjuriesResult {
  players: ILPlayer[];
  loading: boolean;
  error: string | null;
}

export function useInjuries(): InjuriesResult {
  const [players, setPlayers] = useState<ILPlayer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/injuries")
      .then((res) => {
        if (!res.ok) throw new Error(`Server error: ${res.status}`);
        return res.json();
      })
      .then((data) => {
        setPlayers(data.players);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  return { players, loading, error };
}