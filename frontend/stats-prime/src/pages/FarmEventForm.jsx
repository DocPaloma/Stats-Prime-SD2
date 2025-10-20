import { useState, useEffect } from "react";
import axiosClient from "../api/axiosClient";
import { createFarmEvent } from "../api/farmEvents";
import SourceSelector from "../components/selectors/SourceSelector";

function FarmEventRegister() {
    consst [games, setGames] = useState([]);
    const [selectedGame, setSelectedGame] = useState("");
    const [form, setForm] = useState({ farm_type: "", source: ""});
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    useEffect(() => {
        axiosClient
            .get("/games/")
            .then((res) => setGames(res.data))
            .catch((err) => console.error("Error fetching games:", err));
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!selectedGame) return alert("Selecciona un juego.");
        if (!form.farm_type || !farm.source) return alert("Selecciona tipo y fuente de farmeo.");

        setLoading(true);
        setMessage("");

        try {
            await createFarmEvent(selectedGame, form);
            setMessage("Evento de farmeo registrado con éxito.");
            setForm({ farm_type: "", source: ""});
        } catch (error) {
            console.error("Error creating farm event:", error);
            setMessage("Error al registrar el evento de farmeo.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto bg-slate-900 text-slate-200 p-6 rounded-xl shadow-lg">
            <h2 className="text-xl font-bold mb-4">Registrar evento de farmeo</h2>

            <form onSubmit={handleSubmit} className="space-y-5">
                {/* Selector de juego */}
                <div>
                    <label className="block font-medium mb-2">Juego:</label>
                    <select
                        value={selectedGame}
                        onChange={(e) => setSelectedGame(e.target.value)}
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
                        onChange={(e) => setForm({ ...form, farm_type: e.target.value })}
                        disabled={!selectedGame}
                        className="w-full bg-slate-800 text-slate-200 border border-slate-700 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
                    >
                        <option value="">Selecciona tipo</option>
                        <option value="JEFE">Jefe</option>
                        <option value="JEFE_SEMANAL">Jefe Semanal</option>
                        <option value="DOMINIO">Dominio</option>
                    </select>
                </div>

                {/* Selector de fuente dinámico */}
                <SourceSelector
                    gameIdDB={selectedGame}
                    value={form.source}
                    onChange={(value) => setForm({ ...form, source: value })}
                />

                <button
                    type="submit"
                    disabled={loading || !selectedGame}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg disabled:opacity-50"
                >
                    {loading ? "Registrando..." : "Registrar evento"}
                </button>

                {message && <p className="text-sm mt-2">{message}</p>}
            </form>
        </div>
    );
}

export default FarmEventRegister;