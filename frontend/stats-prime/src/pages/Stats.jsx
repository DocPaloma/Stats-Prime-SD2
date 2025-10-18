// src/pages/Stats.jsx
import { useEffect, useMemo, useState } from "react";
import Card from "../components/ui/Card";
import Input from "../components/ui/Input";
import Label from "../components/ui/Label";
import Button from "../components/ui/Button";
import axiosClient from "../api/axiosClient";

// Recharts (gráficas)
import {
  ResponsiveContainer,
  LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid,
  BarChart, Bar,
  PieChart, Pie, Cell, Legend,
} from "recharts";

/* ==========================
   Caché simple en memoria (HU-73)
   ========================== */
const CACHE = new Map(); // Map<key, {value, expiresAt}>
const TTL_10_MIN = 10 * 60 * 1000;

function cacheKeyFromFilters(filters) {
  return `stats:${JSON.stringify(filters || {})}`;
}
function cacheGet(key) {
  const entry = CACHE.get(key);
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) {
    CACHE.delete(key);
    return null;
  }
  return entry.value;
}
function cacheSet(key, value, ttlMs = TTL_10_MIN) {
  CACHE.set(key, { value, expiresAt: Date.now() + ttlMs });
}

/* ==========================
   Componente principal
   ========================== */
export default function Stats() {
  // Filtros
  const [filters, setFilters] = useState({
    sourceId: "",
    itemId: "",
    from: "",
    to: "",
  });

  // Estado de datos
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  // KPIs y series (con valores por defecto)
  const totals = data?.totals || { drops: 0, uniques: 0, runs: 0 };
  const byType = data?.byType || [];
  const byRarity = data?.byRarity || [];
  const timeseries = data?.timeseries || [];

  const onChange = (e) => {
    const { name, value } = e.target;
    setFilters((f) => ({ ...f, [name]: value }));
  };

  const fetchStats = async () => {
    setLoading(true);
    setErr("");
    try {
      const key = cacheKeyFromFilters(filters);

      // 1) Intento caché
      const cached = cacheGet(key);
      if (cached) {
        setData(cached);
        setLoading(false);
        return;
      }

      // 2) Llamada real (HU-72 base de datos)
      // Espera respuesta con shape:
      // {
      //   totals: { drops, uniques, runs },
      //   byType: [{ type, count }],
      //   byRarity: [{ rarity, count }],
      //   timeseries: [{ date, count }]
      // }
      const res = await axiosClient.get("stats", { params: filters });
      const fresh = res.data;

      setData(fresh);
      cacheSet(key, fresh, TTL_10_MIN);
    } catch (e) {
      setErr(
        e?.response?.data?.detail ||
          e?.message ||
          "No se pudieron cargar las estadísticas."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Carga inicial sin filtros
    fetchStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Dona por tipo
  const pieData = useMemo(
    () => byType.map((d) => ({ name: d.type, value: d.count })),
    [byType]
  );
  const COLORS = ["#6366F1", "#22C55E", "#F59E0B", "#EF4444", "#10B981", "#3B82F6"];

  return (
    <section className="space-y-6">
      <header className="space-y-2">
        <h1 className="title">Estadísticas</h1>
        <p className="muted">
          Dashboard con filtros, KPIs y gráficas. Resultados se cachean por 10 min.
        </p>
      </header>

      {/* Filtros */}
      <Card>
        <h2 className="font-semibold mb-3">Filtros</h2>
        <div className="grid md:grid-cols-4 gap-3">
          <div>
            <Label>Fuente (sourceId)</Label>
            <Input
              name="sourceId"
              value={filters.sourceId}
              onChange={onChange}
              placeholder="Ej: dungeon-1"
            />
          </div>
          <div>
            <Label>Item ID</Label>
            <Input
              name="itemId"
              value={filters.itemId}
              onChange={onChange}
              placeholder="Ej: item-125"
            />
          </div>
          <div>
            <Label>Desde</Label>
            <Input type="date" name="from" value={filters.from} onChange={onChange} />
          </div>
          <div>
            <Label>Hasta</Label>
            <Input type="date" name="to" value={filters.to} onChange={onChange} />
          </div>
        </div>
        <div className="mt-4 flex gap-2">
          <Button onClick={fetchStats}>Aplicar filtros</Button>
          <Button
            className="bg-slate-700 hover:bg-slate-600"
            onClick={() => {
              setFilters({ sourceId: "", itemId: "", from: "", to: "" });
              setData(null);
            }}
          >
            Limpiar
          </Button>
        </div>
      </Card>

      {loading && <p className="text-slate-400">Cargando estadísticas…</p>}
      {err && <div className="alert-error">{err}</div>}

      {data && !loading && !err && (
        <>
          {/* KPIs */}
          <div className="grid gap-6 md:grid-cols-3">
            <Card>
              <h3 className="text-slate-400 text-sm">Drops totales</h3>
              <p className="text-3xl font-semibold mt-1">{totals.drops}</p>
            </Card>
            <Card>
              <h3 className="text-slate-400 text-sm">Items únicos</h3>
              <p className="text-3xl font-semibold mt-1">{totals.uniques}</p>
            </Card>
            <Card>
              <h3 className="text-slate-400 text-sm">Runs</h3>
              <p className="text-3xl font-semibold mt-1">{totals.runs}</p>
            </Card>
          </div>

          {/* Serie temporal */}
          <Card>
            <h2 className="font-semibold mb-3">Drops por día</h2>
            <div style={{ width: "100%", height: 300 }}>
              <ResponsiveContainer>
                <LineChart data={timeseries}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Line type="monotone" dataKey="count" stroke="#6366F1" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Barras por rareza */}
          <Card>
            <h2 className="font-semibold mb-3">Drops por rareza</h2>
            <div style={{ width: "100%", height: 300 }}>
              <ResponsiveContainer>
                <BarChart data={byRarity}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="rarity" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#22C55E" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Dona por tipo */}
          <Card>
            <h2 className="font-semibold mb-3">Distribución por tipo</h2>
            <div style={{ width: "100%", height: 320 }}>
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={pieData}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={70}
                    outerRadius={110}
                    paddingAngle={2}
                  >
                    {pieData.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </>
      )}
    </section>
  );
}
