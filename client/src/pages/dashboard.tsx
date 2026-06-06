import { useMemo, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  CartesianGrid,
  ReferenceArea,
} from "recharts";
import { format, parseISO } from "date-fns";
import {
  AlertCircle,
  TrendingUp,
  Users,
  Stethoscope,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Tabs,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

import { waves, trend, seasonSummary, ILPlayer } from "@/lib/data";
import { useInjuries } from "@/hooks/use-injuries";

function impactBadge(impact: ILPlayer["impact"]) {
  const map = {
    High: "bg-destructive text-destructive-foreground",
    Medium: "bg-amber-500 text-white dark:bg-amber-500 dark:text-black",
    Low: "bg-muted text-muted-foreground",
  } as const;
  return (
    <Badge className={map[impact]} data-testid={`badge-impact-${impact}`}>
      {impact}
    </Badge>
  );
}

function statusBadge(status: ILPlayer["status"]) {
  if (status === "60-Day IL") {
    return (
      <Badge variant="outline" className="border-destructive text-destructive">
        {status}
      </Badge>
    );
  }
  if (status === "15-Day IL") {
    return <Badge variant="outline">{status}</Badge>;

  }
  return <Badge variant="secondary">{status}</Badge>;
}

type RoleFilter = "All" | "Starting Pitcher" | "Relief Pitcher" | "Position Player";

export default function Dashboard() {
  const [filter, setFilter] = useState<RoleFilter>("All");
  const { players, loading, error } = useInjuries();

  const filtered = useMemo(() => {
    if (filter === "All") return players;
    return players.filter((p) => p.role === filter);
  }, [filter, players]);

  const waveAnnotations = useMemo(() => {
    return waves
      .map((w) => {
        const point = trend.find((t) => t.date >= w.date);
        return point
          ? { ...w, game: point.game, pct: point.pct }
          : null;
      })
      .filter(Boolean) as Array<
      (typeof waves)[number] & { game: number; pct: number }
    >;
  }, []);

  if (loading) return <div className="min-h-screen bg-background flex items-center justify-center text-muted-foreground">Loading injury data...</div>;
  if (error) return <div className="min-h-screen bg-background flex items-center justify-center text-destructive">Error: {error}</div>;

  const ilCount = players.filter((p) => p.status !== "Day-to-Day").length;

  const pitcherCount = players.filter(
    (p) =>
      p.status !== "Day-to-Day" &&
      (p.role === "Starting Pitcher" || p.role === "Relief Pitcher")
  ).length;

  
  const highImpact = players.filter(
    (p) => p.impact === "High" && p.status !== "Day-to-Day"
  ).length;

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="mx-auto max-w-7xl px-6 py-6 flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-md bg-primary text-primary-foreground flex items-center justify-center font-bold">
              LA
            </div>
            <div>
              <h1 className="text-xl font-semibold tracking-tight" data-testid="text-title">
                Leslie's Dodgers Injury Tracker
              </h1>
              <p className="text-xs text-muted-foreground" data-testid="text-subtitle">
                2026 season · Updated {new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="font-mono" data-testid="badge-record">
              {seasonSummary.wins}–{seasonSummary.losses} ({seasonSummary.pct.toFixed(3)})
            </Badge>
            <Badge className="bg-primary text-primary-foreground" data-testid="badge-standing">
              {seasonSummary.standing}
            </Badge>
            <Badge variant="secondary" data-testid="badge-streak">
              L10 {seasonSummary.lastTen} · {seasonSummary.streak}
            </Badge>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-8 space-y-8">
        {/* KPI strip */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <KPI
            icon={<Users className="h-4 w-4" />}
            label="Players on IL"
            value={ilCount.toString()}
            sub={`+ 1 Day-to-Day`}
            testId="kpi-il-count"
          />
          <KPI
            icon={<Stethoscope className="h-4 w-4" />}
            label="Pitchers on IL"
            value={pitcherCount.toString()}
            sub={`${pitcherCount} of ${ilCount} IL players`}
            testId="kpi-pitcher-count"
          />
          <KPI
            icon={<AlertCircle className="h-4 w-4" />}
            label="High-impact injuries"
            value={highImpact.toString()}
            sub="Snell · Glasnow · Díaz"
            testId="kpi-high-impact"
          />
          <KPI
            icon={<TrendingUp className="h-4 w-4" />}
            label="Run differential"
            value={`+${seasonSummary.runDiff}`}
            sub={`${seasonSummary.runsScored} RS / ${seasonSummary.runsAllowed} RA`}
            testId="kpi-run-diff"
          />
        </section>

        {/* Trend chart */}
        <Card data-testid="card-trend">
          <CardHeader className="flex flex-row items-start justify-between gap-4 flex-wrap">
            <div>
              <CardTitle className="text-base">Winning percentage vs. injury waves</CardTitle>
              <CardDescription>
                Cumulative season win % over every game played. Vertical markers show the
                dates of major IL transactions.
              </CardDescription>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1.5">
                <span className="inline-block h-0.5 w-4 bg-[hsl(var(--chart-1))]" /> Win %
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="inline-block h-3 w-0.5 bg-[hsl(var(--chart-2))]" /> Injury wave
              </span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[360px]" data-testid="chart-trend">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={trend}
                  margin={{ top: 28, right: 24, bottom: 32, left: 4 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="hsl(var(--border))"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="game"
                    type="number"
                    domain={[1, trend.length]}
                    ticks={[1, 10, 20, 30, 40, 50, trend.length]}
                    tickFormatter={(v) => {
                      const point = trend.find((t) => t.game === v);
                      return point ? format(parseISO(point.date), "MMM d") : "";
                    }}
                    tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                    stroke="hsl(var(--border))"
                  />
                  <YAxis
                    domain={[0.4, 1.0]}
                    ticks={[0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0]}
                    tickFormatter={(v) => v.toFixed(3)}
                    tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                    stroke="hsl(var(--border))"
                    width={48}
                  />
                  <ReferenceLine
                    y={0.5}
                    stroke="hsl(var(--muted-foreground))"
                    strokeDasharray="2 4"
                  />
                  {waveAnnotations.map((w, i) => (
                    <ReferenceLine
                      key={w.label}
                      x={w.game}
                      stroke="hsl(var(--chart-2))"
                      strokeDasharray="4 4"
                      strokeWidth={1.5}
                      label={(props: any) => {
                        const { viewBox } = props;
                        const prev = waveAnnotations[i - 1];
                        const tooClose = !!prev && w.game - prev.game < 4;
                        const dx = tooClose ? 10 : 0;
                        return (
                          <text
                            x={viewBox.x + dx}
                            y={viewBox.y - 6}
                            textAnchor="middle"
                            fill="hsl(var(--chart-2))"
                            fontSize={11}
                            fontWeight={600}
                          >
                            {i + 1}
                          </text>
                        );
                      }}
                    />
                  ))}
                  <Tooltip
                    contentStyle={{
                      background: "hsl(var(--popover))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: 8,
                      fontSize: 12,
                    }}
                    labelFormatter={(_, payload) => {
                      const p = payload?.[0]?.payload as
                        | (typeof trend)[number]
                        | undefined;
                      if (!p) return "";
                      return `Game ${p.game} · ${format(parseISO(p.date), "MMM d")}`;
                    }}
                    formatter={(value: number, _name, item) => {
                      const p = item.payload as (typeof trend)[number];
                      return [
                        `${value.toFixed(3)} (${p.wins}-${p.losses})`,
                        "Win %",
                      ];
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="pct"
                    stroke="hsl(var(--chart-1))"
                    strokeWidth={2.5}
                    dot={false}
                    activeDot={{ r: 4 }}
                    isAnimationActive={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Injury wave legend */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {waves.map((w, i) => (
                <div
                  key={w.label}
                  className="flex items-start gap-2 text-xs p-3 rounded-md border border-border bg-card"
                  data-testid={`wave-${w.label}`}
                >
                  <span className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[hsl(var(--chart-2))] text-[10px] font-semibold text-white">
                    {i + 1}
                  </span>
                  <div>
                    <div className="font-medium text-foreground">
                      {format(parseISO(w.date), "MMM d")} · {w.label}
                    </div>
                    <div className="text-muted-foreground">{w.description}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* IL Table */}
        <Card data-testid="card-il-table">
          <CardHeader className="flex flex-row items-start justify-between gap-4 flex-wrap">
            <div>
              <CardTitle className="text-base">Active Injured List</CardTitle>
              <CardDescription>
                All players currently on the 15-day IL, 60-day IL, or listed as
                day-to-day.
              </CardDescription>
            </div>
            <Tabs
              value={filter}
              onValueChange={(v) => setFilter(v as RoleFilter)}
              className="ml-auto"
            >
              <TabsList>
                <TabsTrigger value="All" data-testid="tab-all">
                  All
                </TabsTrigger>
                <TabsTrigger value="Starting Pitcher" data-testid="tab-sp">
                  SP
                </TabsTrigger>
                <TabsTrigger value="Relief Pitcher" data-testid="tab-rp">
                  RP
                </TabsTrigger>
                <TabsTrigger value="Position Player" data-testid="tab-pos">
                  Position
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Player</TableHead>
                    <TableHead>Pos</TableHead>
                    <TableHead>Injury</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>IL date</TableHead>
                    <TableHead>Expected return</TableHead>
                    <TableHead>Impact</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((p) => (
                    <TableRow key={p.name} data-testid={`row-player-${p.name.replace(/\s+/g, "-")}`}>
                      <TableCell className="font-medium">
                        <div>{p.name}</div>
                        <div className="text-xs text-muted-foreground">{p.notes}</div>
                      </TableCell>
                      <TableCell className="font-mono text-xs">{p.position}</TableCell>
                      <TableCell className="text-sm">{p.injury}</TableCell>
                      <TableCell>{statusBadge(p.status)}</TableCell>
                      <TableCell className="text-xs text-muted-foreground font-mono">
                        {format(parseISO(p.ilDate), "MMM d")}
                      </TableCell>
                      <TableCell className="text-sm">{p.expectedReturn}</TableCell>
                      <TableCell>{impactBadge(p.impact)}</TableCell>
                    </TableRow>
                  ))}
                  {filtered.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                        No players match this filter.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Position impact */}
        <Card data-testid="card-position-impact">
          <CardHeader>
            <CardTitle className="text-base">Position impact</CardTitle>
            <CardDescription>
              How the current IL is hitting each unit of the roster.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <ImpactGroup
              title="Starting rotation"
              players={players.filter(
                (p) => p.role === "Starting Pitcher" && p.status !== "Day-to-Day"
              )}
              summary="Snell, Glasnow, Stone, Knack, Miller all sidelined — Yamamoto, Sasaki, and rotation depth carrying the load."
            />
            <ImpactGroup
              title="Bullpen"
              players={players.filter(
                (p) => p.role === "Relief Pitcher" && p.status !== "Day-to-Day"
              )}
              summary="Closer Edwin Díaz out long-term; Graterol, Stewart, Dreyer, Casparius also down. High-leverage roles are stretched."
            />
            <ImpactGroup
              title="Position players"
              players={players.filter((p) => p.role === "Position Player")}
              summary="Edman rehabbing; Muncy day-to-day with wrist HBP. Lineup mostly intact."
            />
          </CardContent>
        </Card>

        <footer className="text-xs text-muted-foreground pt-2 pb-8">
          Sources: MLB.com Dodgers injury report, ESPN, CBS Sports, Fox Sports, and
          FanGraphs RosterResource. Win-percentage trend reconstructed from MLB.com
          standings and StatMuse monthly splits. Some game-level sequencing is approximated
          where granular game-by-game data was not publicly available.
        </footer>
      </main>
    </div>
  );
}

function KPI({
  icon,
  label,
  value,
  sub,
  testId,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub: string;
  testId: string;
}) {
  return (
    <Card data-testid={testId}>
      <CardContent className="p-5">
        <div className="flex items-center justify-between text-muted-foreground text-xs">
          <span>{label}</span>
          {icon}
        </div>
        <div className="mt-2 text-2xl font-semibold tracking-tight">{value}</div>
        <div className="mt-1 text-xs text-muted-foreground">{sub}</div>
      </CardContent>
    </Card>
  );
}

function ImpactGroup({
  title,
  players,
  summary,
}: {
  title: string;
  players: ILPlayer[];
  summary: string;
}) {
  return (
    <div className="rounded-lg border border-border p-4 bg-card">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold">{title}</h3>
        <Badge variant="outline" className="font-mono">
          {players.length}
        </Badge>
      </div>
      <p className="text-xs text-muted-foreground mt-2 mb-3">{summary}</p>
      <ul className="space-y-1.5">
        {players.map((p) => (
          <li
            key={p.name}
            className="flex items-center justify-between text-xs"
          >
            <span className="truncate">{p.name}</span>
            <span className="text-muted-foreground font-mono">{p.position}</span>
          </li>
        ))}
        {players.length === 0 && (
          <li className="text-xs text-muted-foreground">No active injuries.</li>
        )}
      </ul>
    </div>
  );
}
