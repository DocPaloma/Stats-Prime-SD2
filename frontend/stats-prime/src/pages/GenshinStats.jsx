import { useEffect, useState } from "react";
import { getFarmEvents, getSources } from "../api/farmEvents";

export default function GenshinStats({ farmType }) {
  const gameIdDb = 1; // Genshin Impact → ID 1 en tu backend

  const [events, setEvents] = useState([]);
  const [sources, setSources] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [filters, setFilters] = useState({
    date: "",
    rarity: "",
    source: "",
  });

  // 🔹 1. Cargar datos
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [eventsData, sourcesData] = await Promise.all([
          getFarmEvents(gameIdDb),
          getSources(gameIdDb),
        ]);
        setEvents(eventsData);
        setSources(sourcesData);
      } catch (err) {
        console.error("Error cargando datos:", err);
      }
    };
    fetchData();
  }, [gameIdDb]);

  // 🔹 2. Filtrar por tipo de fuente
  const getValidSourceTypes = () => {
    if (farmType === "world-bosses") return ["JEFE"];
    if (farmType === "weekly-bosses") return ["JEFE-SEMANAL"];
    if (farmType === "domains") return ["DOMINIO"];
    return [];
  };

  // 🔹 3. Aplicar filtros
  useEffect(() => {
    const validTypes = getValidSourceTypes();

    let filtered = events.filter((e) =>
      validTypes.includes(
        sources.find((s) => s.id === e.source)?.source_type || ""
      )
    );

    if (filters.source)
      filtered = filtered.filter(
        (e) => sources.find((s) => s.id === e.source)?.name === filters.source
      );

    if (filters.rarity)
      filtered = filtered.filter((e) =>
        e.rewards?.some((r) => r.rarity_display === filters.rarity)
      );

    if (filters.date)
      filtered = filtered.filter((e) => e.date === filters.date);

    setFilteredEvents(filtered);
  }, [events, sources, farmType, filters]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      <main className="flex-1 p-6">
        <h1 className="text-2xl font-bold mb-4">
          Genshin Impact — {farmType.replace("-", " ")}
        </h1>

        {/* 🎛️ Filtros */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <select
            value={filters.source}
            onChange={(e) =>
              setFilters((f) => ({ ...f, source: e.target.value }))
            }
            className="bg-slate-800 border border-slate-700 p-2 rounded"
          >
            <option value="">Filtrar por fuente</option>
            {sources
              .filter((s) => getValidSourceTypes().includes(s.source_type))
              .map((s) => (
                <option key={s.id} value={s.name}>
                  {s.name}
                </option>
              ))}
          </select>

          <select
            value={filters.rarity}
            onChange={(e) =>
              setFilters((f) => ({ ...f, rarity: e.target.value }))
            }
            className="bg-slate-800 border border-slate-700 p-2 rounded"
          >
            <option value="">Rareza</option>
            {[1, 2, 3, 4, 5].map((r) => (
              <option key={r} value={r}>
                ⭐ {r}
              </option>
            ))}
          </select>

          <input
            type="date"
            value={filters.date}
            onChange={(e) =>
              setFilters((f) => ({ ...f, date: e.target.value }))
            }
            className="bg-slate-800 border border-slate-700 p-2 rounded"
          />
        </div>

        {/* 📋 Lista de eventos */}
        <div className="space-y-4">
          {filteredEvents.length > 0 ? (
            filteredEvents.map((event) => {
              const src = sources.find((s) => s.id === event.source);
              return (
                <div
                  key={event.id}
                  className="border border-slate-700 rounded-lg p-4 bg-slate-900"
                >
                  <h2 className="text-lg font-semibold">
                    {src ? src.name : "Fuente desconocida"}
                  </h2>
                  <p className="text-sm text-slate-400">
                    Fecha: {event.date} — {src?.source_type}
                  </p>
                  <ul className="mt-2">
                    {event.rewards?.map((r) => (
                      <li key={r.id} className="text-slate-300 text-sm">
                        {r.name} ({r.rarity_display}⭐)
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })
          ) : (
            <p className="text-slate-500">No hay registros disponibles.</p>
          )}
        </div>
      </main>
    </div>
  );
}
