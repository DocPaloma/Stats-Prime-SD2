import { useEffect, useMemo, useState } from "react";
import { getGames } from "../api/farmEvents";
import Card from "../components/ui/Card";
import Input from "../components/ui/Input";
import Label from "../components/ui/Label";
import Button from "../components/ui/Button";
import axiosClient from "../api/axiosClient";

/* ==========================
   Caché simple (HU-73)
   ========================== */
const CACHE = new Map();
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
    gameId: "",
    sourceId: "",
    itemId: "",
    from: "",
    to: "",
  });

  // Estado de datos
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [games, setGames] = useState([]);

  // Adaptación a la estructura del backend (UserStatsView)
  const totals = useMemo(() => ({
    drops: data?.summary?.total_drops || 0,
    uniques: data?.drops?.length || 0,
    runs: data?.summary?.total_events || 0,
  }), [data]);

  // Agrupamos por rareza para la lista textual
  const byRarity = useMemo(() => {
    if (!data?.drops) return [];
    const grouped = {};
    for (const d of data.drops) {
      const rarity = d.reward__rarity || "Desconocido";
      grouped[rarity] = (grouped[rarity] || 0) + d.total_quantity;
    }
    return Object.entries(grouped).map(([rarity, count]) => ({ rarity, count }));
  }, [data]);

  // No hay "byType" ni "timeseries" en el backend, así que dejamos vacío
  const byType = [];
  const timeseries = [];


  const onChange = (e) => {
    const { name, value } = e.target;
    setFilters((f) => ({ ...f, [name]: value }));
  };

  // Obtener estadísticas
  const fetchStats = async () => {
    if (!filters.gameId) return;
    setLoading(true);
    setErr("");
    try {
      const key = cacheKeyFromFilters(filters);
      const cached = cacheGet(key);
      if (cached) {
        setData(cached);
        setLoading(false);
        return;
      }

    const res = await axiosClient.get(`user-stats/`, {
      params: {
        game_id: filters.gameId,
        source_id: filters.sourceId || undefined,
        item_id: filters.itemId || undefined,
        start_date: filters.from || undefined,
        end_date: filters.to || undefined,
      },
    });

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
    const fetchGames = async () => {
      const data = await getGames();
      setGames(data);
    };
    fetchGames();
  }, []);

  // Datos procesados (sin gráficas)
  const pieData = useMemo(
    () => byType.map((d) => `${d.type}: ${d.count}`).join(", "),
    [byType]
  );

  return (
    <section className="space-y-6">
      <header className="space-y-2">
        <h1 className="title">Estadísticas personales</h1>
        <p className="muted">
          Visualiza tus estadísticas de drops, runs y rarezas por juego. Los datos se cachean por 10 minutos.
        </p>
      </header>

      {/* Filtros */}
      <Card>
        <h2 className="font-semibold mb-3">Filtros</h2>
        <div className="grid md:grid-cols-5 gap-3">
          <div>
            <Label>Juego</Label>
            <select
              name="gameId"
              value={filters.gameId}
              onChange={onChange}
              className="w-full p-2 rounded border border-slate-300 bg-slate-800 text-slate-100"
            >
              <option value="">Seleccionar...</option>
              {games.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.name}
                </option>
              ))}
            </select>
          </div>

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
          <Button onClick={fetchStats} disabled={!filters.gameId}>
            Aplicar filtros
          </Button>
          <Button
            className="bg-slate-700 hover:bg-slate-600"
            onClick={() => {
              setFilters({ gameId: "", sourceId: "", itemId: "", from: "", to: "" });
              setData(null);
            }}
          >
            Limpiar
          </Button>
        </div>
      </Card>

      {/* Estados */}
      {loading && <p className="text-slate-400">Cargando estadísticas…</p>}
      {err && <div className="alert-error">{err}</div>}

      {/* Datos */}
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

          {/* Información textual en lugar de gráficos */}
          <Card>
            <h2 className="font-semibold mb-2">Drops por rareza</h2>
            <ul className="list-disc ml-5">
              {byRarity.map((r, i) => (
                <li key={i}>{r.rarity}: {r.count}</li>
              ))}
            </ul>
          </Card>

          <Card>
            <h2 className="font-semibold mb-2">Distribución por tipo</h2>
            <p>{pieData || "Sin datos disponibles"}</p>
          </Card>

          <Card>
            <h2 className="font-semibold mb-2">Drops por día</h2>
            <ul className="list-disc ml-5">
              {timeseries.map((t, i) => (
                <li key={i}>{t.date}: {t.count}</li>
              ))}
            </ul>
          </Card>
        </>
      )}
    </section>
  );
}