import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Filter,
  Signal,
  SignalHigh,
  WifiOff,
  MoreHorizontal,
  Plus,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  Legend,
  TooltipProps,
} from "recharts";
import { DataTable } from "@/components/ui/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { AddStationModal } from "./AddStationModal";

// ... (keep existing mock data)
const kpiData = {
  availability: 99.8,
  downtimeHours: 1245.5,
  criticalStations: 14,
};

const trendData = [
  { name: "Jan", availability: 99.9 },
  { name: "Feb", availability: 99.85 },
  { name: "Mar", availability: 99.7 },
  { name: "Apr", availability: 99.95 },
  { name: "May", availability: 99.6 },
  { name: "Jun", availability: 99.8 },
];

const ispData = [
  { name: "Claro", value: 450, color: "#ef4444" }, // Red
  { name: "Tigo", value: 380, color: "#3b82f6" }, // Blue
  { name: "WOM", value: 210, color: "#8b5cf6" }, // Purple
  { name: "Movistar", value: 205.5, color: "#10b981" }, // Green
];

const worstStationsData = [
  { name: "BOG_SUBA_01", downtime: 45 },
  { name: "MED_POBLADO_04", downtime: 38 },
  { name: "CAL_NORTE_12", downtime: 32 },
  { name: "BOG_KENNEDY_09", downtime: 28 },
  { name: "BARR_CENTRO_02", downtime: 25 },
];

const techDowntimeData = [
  { name: "2G", terrestrial: 120, satellite: 40 },
  { name: "3G", terrestrial: 250, satellite: 80 },
  { name: "4G", terrestrial: 400, satellite: 150 },
  { name: "5G", terrestrial: 50, satellite: 0 },
];

// Table Data
type StationRecord = {
  id: string;
  name: string;
  isp: string;
  department: string;
  availability: number;
  downtime: number;
  status: "Critical" | "Warning" | "Healthy";
};

const tableData: StationRecord[] = [
  {
    id: "ST-001",
    name: "BOG_SUBA_01",
    isp: "Claro",
    department: "Bogota",
    availability: 97.5,
    downtime: 45,
    status: "Critical",
  },
  {
    id: "ST-002",
    name: "MED_POBLADO_04",
    isp: "Tigo",
    department: "Antioquia",
    availability: 98.1,
    downtime: 38,
    status: "Warning",
  },
  {
    id: "ST-003",
    name: "CAL_NORTE_12",
    isp: "WOM",
    department: "Valle",
    availability: 98.5,
    downtime: 32,
    status: "Warning",
  },
  {
    id: "ST-004",
    name: "BOG_KENNEDY_09",
    isp: "Movistar",
    department: "Bogota",
    availability: 98.8,
    downtime: 28,
    status: "Warning",
  },
  {
    id: "ST-005",
    name: "BARR_CENTRO_02",
    isp: "Claro",
    department: "Atlantico",
    availability: 99.1,
    downtime: 25,
    status: "Healthy",
  },
  {
    id: "ST-006",
    name: "CAR_BOCA_01",
    isp: "Tigo",
    department: "Bolivar",
    availability: 99.5,
    downtime: 12,
    status: "Healthy",
  },
  {
    id: "ST-007",
    name: "BUC_CENTRO_03",
    isp: "WOM",
    department: "Santander",
    availability: 99.8,
    downtime: 5,
    status: "Healthy",
  },
];

const columns: ColumnDef<StationRecord>[] = [
  {
    accessorKey: "name",
    header: "Nombre de Estación",
    cell: ({ row }) => (
      <div className="font-medium text-white">{row.getValue("name")}</div>
    ),
  },
  {
    accessorKey: "isp",
    header: "ISP",
  },
  {
    accessorKey: "department",
    header: "Departamento",
  },
  {
    accessorKey: "availability",
    header: "Disponibilidad",
    cell: ({ row }) => {
      const val = parseFloat(row.getValue("availability"));
      return (
        <div className="flex items-center gap-2">
          <span
            className={cn(
              "font-mono",
              val < 98
                ? "text-rose-400"
                : val < 99
                  ? "text-amber-400"
                  : "text-emerald-400",
            )}
          >
            {val}%
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "downtime",
    header: "Indisponibilidad (hrs)",
    cell: ({ row }) => (
      <div className="font-mono text-slate-300">{row.getValue("downtime")}</div>
    ),
  },
  {
    accessorKey: "status",
    header: "Estado",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      const statusMap: Record<string, string> = {
        Critical: "Crítico",
        Warning: "Advertencia",
        Healthy: "Saludable"
      };
      return (
        <span
          className={cn(
            "px-2.5 py-1 rounded-full text-xs font-medium border",
            status === "Critical"
              ? "bg-rose-500/10 text-rose-400 border-rose-500/20"
              : status === "Warning"
                ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                : "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
          )}
        >
          {statusMap[status] || status}
        </span>
      );
    },
  },
  {
    id: "actions",
    cell: () => (
      <button className="p-2 hover:bg-white/10 rounded-md transition-colors text-slate-400 hover:text-white">
        <MoreHorizontal className="h-4 w-4" />
      </button>
    ),
  },
];

// Custom Tooltip for Recharts

const CustomTooltip = ({
  active,
  payload,
  label,
}: TooltipProps<number, string>) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#1e1e2d] border border-white/10 p-3 rounded-lg shadow-xl">
        <p className="text-slate-200 font-medium mb-2">{label}</p>
        {payload.map((entry, index) => (
          <div key={index} className="flex items-center gap-2 text-sm">
            <div
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-slate-400">{entry.name}:</span>
            <span className="text-white font-mono">{entry.value}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export function DashboardPage() {
  const [timeRange, setTimeRange] = useState("Q2 2025");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [stations, setStations] = useState<StationRecord[]>(tableData);

  const handleAddStation = (data: any) => {
    const newStation: StationRecord = {
      id: `ST-00${stations.length + 1}`,
      name: data.name,
      isp: data.isp,
      department: data.department,
      availability: data.availability,
      downtime: data.downtime,
      status:
        data.availability < 98
          ? "Critical"
          : data.availability < 99
            ? "Warning"
            : "Healthy",
    };
    setStations([newStation, ...stations]);
  };

  return (
    <div className="space-y-6">
      {/* Header & Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Disponibilidad de Red
          </h1>
          <p className="text-sm text-slate-400">
            Análisis de rendimiento y tiempo de inactividad de la infraestructura de telecomunicaciones.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center bg-[#27293d] border border-white/5 rounded-lg p-1">
            {["Q1 2025", "Q2 2025", "YTD"].map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={cn(
                  "px-3 py-1.5 text-xs font-medium rounded-md transition-all",
                  timeRange === range
                    ? "bg-indigo-500 text-white shadow-sm"
                    : "text-slate-400 hover:text-slate-200",
                )}
              >
                {range}
              </button>
            ))}
          </div>
          <button className="flex items-center gap-2 px-3 py-2 bg-[#27293d] border border-white/5 rounded-lg text-sm font-medium text-slate-300 hover:bg-white/5 transition-colors">
            <Filter className="h-4 w-4" />
            Filtros
          </button>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 px-3 py-2 bg-indigo-500 hover:bg-indigo-600 rounded-lg text-sm font-medium text-white transition-colors"
          >
            <Plus className="h-4 w-4" />
            Añadir Estación
          </button>
        </div>
      </div>

      {/* ZONE A: KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-[#27293d] to-[#1e1e2d] border-white/5 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <SignalHigh className="h-24 w-24 text-emerald-500" />
          </div>
          <CardHeader className="pb-2">
            <CardDescription className="text-slate-400 font-medium uppercase tracking-wider text-xs">
              Disponibilidad Promedio Nacional
            </CardDescription>
            <CardTitle className="text-4xl font-bold text-white flex items-baseline gap-2">
              {kpiData.availability}%
              <span className="text-sm font-medium text-emerald-400 flex items-center">
                <CheckCircle2 className="h-4 w-4 mr-1" /> Objetivo 99.5%
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden mt-4">
              <div
                className="h-full bg-emerald-500 rounded-full"
                style={{ width: `${kpiData.availability}%` }}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <CardDescription className="text-slate-400 font-medium uppercase tracking-wider text-xs">
                Tiempo Total de Indisponibilidad
              </CardDescription>
              <div className="p-2 bg-rose-500/10 rounded-lg">
                <Clock className="h-4 w-4 text-rose-400" />
              </div>
            </div>
            <CardTitle className="text-4xl font-bold text-white font-mono">
              {kpiData.downtimeHours.toLocaleString()}{" "}
              <span className="text-lg text-slate-500 font-sans">hrs</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-slate-400 mt-2 flex items-center gap-1">
              <span className="text-rose-400 font-medium">+12.5%</span> vs trimestre anterior
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <CardDescription className="text-slate-400 font-medium uppercase tracking-wider text-xs">
                Estaciones Críticas
              </CardDescription>
              <div className="p-2 bg-amber-500/10 rounded-lg">
                <AlertTriangle className="h-4 w-4 text-amber-400" />
              </div>
            </div>
            <CardTitle className="text-4xl font-bold text-white">
              {kpiData.criticalStations}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-slate-400 mt-2">
              Estaciones por debajo del 98.0% de disponibilidad
            </p>
          </CardContent>
        </Card>
      </div>

      {/* ZONE B: Impact Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Tendencia de Disponibilidad</CardTitle>
            <CardDescription>
              Porcentaje promedio mensual de disponibilidad en todas las regiones.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={trendData}
                  margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#ffffff10"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="name"
                    stroke="#94a3b8"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    dy={10}
                  />
                  <YAxis
                    domain={["dataMin - 0.2", "dataMax + 0.1"]}
                    stroke="#94a3b8"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(val) => `${val}%`}
                    dx={-10}
                  />
                  <RechartsTooltip content={<CustomTooltip />} />
                  <Line
                    type="monotone"
                    dataKey="availability"
                    stroke="#6366f1"
                    strokeWidth={3}
                    dot={{
                      r: 4,
                      fill: "#1e1e2d",
                      stroke: "#6366f1",
                      strokeWidth: 2,
                    }}
                    activeDot={{
                      r: 6,
                      fill: "#6366f1",
                      stroke: "#fff",
                      strokeWidth: 2,
                    }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Indisponibilidad por ISP</CardTitle>
            <CardDescription>Total de horas de indisponibilidad.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center">
            <div className="h-[220px] w-full relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={ispData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                    stroke="none"
                  >
                    {ispData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <RechartsTooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-2xl font-bold text-white">1.2k</span>
                <span className="text-xs text-slate-400">Total Hrs</span>
              </div>
            </div>
            <div className="w-full mt-4 grid grid-cols-2 gap-2">
              {ispData.map((isp) => (
                <div key={isp.name} className="flex items-center gap-2 text-sm">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: isp.color }}
                  />
                  <span className="text-slate-300">{isp.name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ZONE C: Detailed Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Top 10 Peores Estaciones</CardTitle>
            <CardDescription>
              Estaciones con mayor cantidad de horas de caída.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={worstStationsData}
                  layout="vertical"
                  margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#ffffff10"
                    horizontal={true}
                    vertical={false}
                  />
                  <XAxis
                    type="number"
                    stroke="#94a3b8"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    dataKey="name"
                    type="category"
                    stroke="#94a3b8"
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                    width={100}
                  />
                  <RechartsTooltip
                    content={<CustomTooltip />}
                    cursor={{ fill: "#ffffff05" }}
                  />
                  <Bar
                    dataKey="downtime"
                    fill="#ef4444"
                    radius={[0, 4, 4, 0]}
                    barSize={20}
                  >
                    {worstStationsData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={index < 2 ? "#ef4444" : "#f87171"}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Caídas por Tecnología y Medio</CardTitle>
            <CardDescription>
              Impacto Terrestre vs Satelital a través de las tecnologías.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={techDowntimeData}
                  margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#ffffff10"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="name"
                    stroke="#94a3b8"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    dy={10}
                  />
                  <YAxis
                    stroke="#94a3b8"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    dx={-10}
                  />
                  <RechartsTooltip
                    content={<CustomTooltip />}
                    cursor={{ fill: "#ffffff05" }}
                  />
                  <Legend
                    wrapperStyle={{
                      paddingTop: "20px",
                      fontSize: "12px",
                      color: "#94a3b8",
                    }}
                  />
                  <Bar
                    dataKey="terrestrial"
                    name="Terrestre"
                    stackId="a"
                    fill="#3b82f6"
                    radius={[0, 0, 4, 4]}
                    barSize={30}
                  />
                  <Bar
                    dataKey="satellite"
                    name="Satelital"
                    stackId="a"
                    fill="#8b5cf6"
                    radius={[4, 4, 0, 0]}
                    barSize={30}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ZONE D: Data Table */}
      <Card>
        <CardHeader>
          <CardTitle>Registros de Estaciones</CardTitle>
          <CardDescription>
            Lista detallada de todas las estaciones y su estado actual.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable columns={columns} data={stations} />
        </CardContent>
      </Card>

      <AddStationModal
        open={isAddModalOpen}
        onOpenChange={setIsAddModalOpen}
        onSuccess={handleAddStation}
      />
    </div>
  );
}
