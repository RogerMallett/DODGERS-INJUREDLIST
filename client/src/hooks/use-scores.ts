import { useState, useEffect } from "react";

export interface GameScore {
  date: string;
  runsFor: number;
  runsAgainst: number;
  opponent: string;
}

interface ScoresResult {
  scoresByDate: Record<string, GameScore>;
  loading: boolean;
  error: string | null;
}

export function useScores(): ScoresResult {
  const [scoresByDate, setScoresByDate] = useState<Record<string, GameScore>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/scores")
      .then((res) => {
        if (!res.ok) throw new Error(`Server error: ${res.status}`);
        return res.json();
      })
      .then((data) => {
        const map: Record<string, GameScore> = {};
        for (const g of data.scores ?? []) {
          map[g.date] = g;
        }
        setScoresByDate(map);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  return { scoresByDate, loading, error };
}
