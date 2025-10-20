import { useEffect, useState } from "react";
import axios from "axios";

export default function GenshinStats({ farmType }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const gameId = 1; // Genshin Impact en tu base de datos
  const token = localStorage.getItem("access");

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await axios.get(`http://127.0.0.1:8000/api/games/${gameId}/farm-stats/`, {
          headers: { Authorization: `Bearer ${token}` },
          params: { type: farmType }, // JEFE, JEFE-SEMANAL, DOMINIO
        });
        setData(res.data);
      } catch (err) {
        console.error("Error fetching stats:", err);
        setError("No se pudieron cargar las estadísticas.");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [farmType]);

  if (loading) return <p className="text-center mt-10">Cargando estadísticas...</p>;
  if (error) return <p className="text-center text-red-500 mt-10">{error}</p>;

  const titleMap = {
    JEFE: "Jefes de Mundo",
    "JEFE-SEMANAL": "Jefes Semanales",
    DOMINIO: "Dominios",
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-4 text-center text-blue-600">
        Genshin Impact — {titleMap[farmType] || farmType}
      </h1>

      {/* --- Resumen general --- */}
      <div className="bg-gray-100 rounded-xl p-4 shadow-md mb-6">
        <h2 className="text-xl font-semibold mb-3">Resumen general</h2>
        <ul className="space-y-1">
          <li>🕹️ Total de eventos: {data.summary.total_events}</li>
          <li>🎁 Total de drops: {data.summary.total_drops}</li>
          <li>📊 Promedio de drops: {data.summary.avg_drops}</li>
        </ul>
      </div>

      {/* --- Tabla de drops --- */}
      <div className="bg-white rounded-xl shadow p-4 overflow-x-auto">
        <h2 className="text-xl font-semibold mb-3">Drops obtenidos</h2>
        {data.drops.length > 0 ? (
          <table className="min-w-full text-sm text-left border-collapse">
            <thead>
              <tr className="border-b bg-gray-50">
                <th className="p-2">Ítem</th>
                <th className="p-2">Rareza</th>
                <th className="p-2">Total</th>
                <th className="p-2">Promedio</th>
                <th className="p-2">Máx.</th>
                <th className="p-2">Mín.</th>
              </tr>
            </thead>
            <tbody>
              {data.drops.map((drop, i) => (
                <tr key={i} className="border-b hover:bg-gray-50">
                  <td className="p-2">{drop.reward__name}</td>
                  <td className="p-2">{drop.reward__rarity}</td>
                  <td className="p-2">{drop.total_quantity}</td>
                  <td className="p-2">{drop.avg_quantity.toFixed(2)}</td>
                  <td className="p-2">{drop.max_quantity}</td>
                  <td className="p-2">{drop.min_quantity}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No hay drops registrados para este tipo de fuente.</p>
        )}
      </div>

      
    </div>
  );
}
