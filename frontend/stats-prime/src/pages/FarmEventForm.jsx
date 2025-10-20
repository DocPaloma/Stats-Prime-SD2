import { useState, useEffect } from "react";
import axiosClient from "../api/axiosClient";
import { createFarmEvent } from "../api/farmEvents";
import SourceSelector from "../components/selectors/SourceSelector";

function FarmEventRegister() {
  const [games, setGames] = useState([]);
  const [selectedGame, setSelectedGame] = useState("");
  const [form, setForm] = useState({ farm_type: "", source: "", drops: [] });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    axiosClient
      .get("/games/")
      .then((res) => setGames(res.data))
      .catch((err) => console.error("Error fetching games:", err));
  }, []);

  // Cargar drops automáticamente al seleccionar la fuente
  useEffect(() => {
    if (!selectedGame || !form.source) return;

    axiosClient
      axiosClient
      .get(`/games/${selectedGame}/farm-sources/${form.source}/rewards/`)
      .then((res) => {
        const rewards = res.data.map((r) => ({
          id: r.id,
          name: r.name,
          rarity_display: r.rarity_display,
          quantity: 0,
        }));
        setForm((prev) => ({ ...prev, drops: rewards }));
      })
      .catch((err) => console.error("Error fetching rewards:", err));
  }, [form.source, selectedGame]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedGame) return alert("Selecciona un juego.");
    if (!form.farm_type || !form.source) return alert("Selecciona tipo y fuente de farmeo.");

    setLoading(true);
    setMessage("");

    try {
      const payload = {
        ...form,
        drops: form.drops
          .filter((d) => d.quantity > 0)
          .map((d) => ({
            reward_name: d.name,
            rarity: d.rarity_display,
            quantity: d.quantity,
          })),
      };

      await createFarmEvent(selectedGame, payload);
      setMessage("✅ Evento de farmeo registrado con éxito.");
      setForm({ farm_type: "", source: "", drops: [] });
    } catch (error) {
      console.error("Error creating farm event:", error);
      setMessage("❌ Error al registrar el evento de farmeo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg md:max-w-xk mx-auto bg-slate-900 text-slate-200 p-6 rounded-xl shadow-lg">
      <h2 className="text-xl font-bold mb-4">Registrar evento de farmeo</h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Selector de juego */}
        <div>
          <label className="block font-medium mb-2">Juego:</label>
          <select
            value={selectedGame}
            onChange={(e) => {
              setSelectedGame(e.target.value);
              setForm({ farm_type: "", source: "", drops: [] }); // reset
            }}
            className="w-full bg-slate-800 text-slate-200 border border-slate-700 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">Selecciona un juego</option>
            {games.map((game) => (
              <option key={game.id} value={game.id}>
                {game.name}
              </option>
            ))}
          </select>
        </div>

        {/* Tipo de farmeo */}
        <div>
          <label className="block font-medium mb-2">Tipo de farmeo:</label>
          <select
            value={form.farm_type}
            onChange={(e) => {
              setForm((prev) => ({ ...prev, farm_type: e.target.value, source: "", drops: [] }));
            }}
            disabled={!selectedGame}
            className="w-full bg-slate-800 text-slate-200 border border-slate-700 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            <option value="">Selecciona tipo</option>
            <option value="JEFE">Jefe</option>
            <option value="JEFE-SEMANAL">Jefe Semanal</option>
            <option value="DOMINIO-TALENTO">Dominio</option>
          </select>
        </div>

        {/* Selector de fuente dinámico filtrando por tipo */}
        <SourceSelector
          gameIdDB={selectedGame}
          farmTypeFilter={form.farm_type} // <-- pasar tipo para filtrar
          value={form.source}
          onChange={(value) => setForm((prev) => ({ ...prev, source: value }))}
        />

        {/* Tabla de drops */}
        {form.drops.length > 0 && (
          <div className="mt-6">
            <h3 className="font-semibold mb-2">Drops obtenidos:</h3>
        
            <table className="w-full text-sm bg-slate-800 border border-slate-700 rounded-lg">
              <thead>
                <tr className="text-left border-b border-slate-700">
                  <th className="p-2">Recompensa</th>
                  <th className="p-2">Rareza</th>
                  <th className="p-2 text-center">Cantidad</th>
                </tr>
              </thead>
              <tbody>
                {form.drops.map((drop, index) => (
                  <tr key={drop.id} className="border-b border-slate-700">
                    <td className="p-2">
                      <input
                        type="text"
                        value={drop.name}
                        disabled
                        className="w-full bg-slate-900 border border-slate-700 rounded p-1 text-center opacity-60 cursor-not-allowed"
                      />
                    </td>
                    <td className="p-2">
                      <input
                        type="text"
                        value={drop.rarity_display || ""}
                        disabled
                        className="w-full bg-slate-900 border border-slate-700 rounded p-1 text-center opacity-60 cursor-not-allowed"
                      />
                    </td>
                    <td className="p-2 text-center">
                      <input
                        type="number"
                        min="0"
                        value={drop.quantity}
                        onChange={(e) => {
                          const updated = [...form.drops];
                          updated[index].quantity = parseInt(e.target.value) || 0;
                          setForm((prev) => ({ ...prev, drops: updated }));
                        }}
                        className="w-20 bg-slate-900 border border-slate-700 rounded p-1 text-center"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Botón de enviar */}
        <button
          type="submit"
          disabled={loading || !form.source || form.drops.length === 0}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg disabled:opacity-50"
        >
          {loading ? "Registrando..." : "Registrar evento"}
        </button>

        {message && (
          <p className="text-sm mt-2 text-center text-indigo-400">{message}</p>
        )}
      </form>
    </div>
  );
}

export default FarmEventRegister;