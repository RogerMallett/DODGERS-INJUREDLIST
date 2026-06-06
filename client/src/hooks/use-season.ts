import { useState, useEffect } from "react";

export interface SeasonGame {
  game: number;
  date: string;
  opponent: string;
  runsFor: number;
  runsAgainst: number;
  result: "W" | "L";
  wins: number;
  losses: number;
  pct: number;
}

interface SeasonResult {
  trend: SeasonGame[];
  team: { id: number; name: string } | null;
  loading: boolean;
  error: string | null;
}

export function useSeason(teamId = 119): SeasonResult {
  const [trend, setTrend] = useState<SeasonGame[]>([]);
  const [team, setTeam] = useState<{ id: number; name: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/season?teamId=${teamId}`)
      .then((res) => {
        if (!res.ok) throw new Error(`Server error: ${res.status}`);
        return res.json();
      })
      .then((data) => {
        setTrend(data.trend ?? []);
        setTeam(data.team ?? null);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [teamId]);

  return { trend, team, loading, error };
}
