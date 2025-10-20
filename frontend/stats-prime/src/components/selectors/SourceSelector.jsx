import { useState, useEffect } from 'react';
import axiosClient from '../../api/axiosClient';

function SourceSelector({ gameIdDB, value, onChange }) {
    const [sources, setSources] = useState([]);

    useEffect(() => {
        if (!gameIdDB) return;
        axiosClient
            .get(`/games/${gameIdDB}/farm-sources/`)
            .then((res) => setSources(res.data))
            .catch((err) => console.error("Error fetching sources:", err));
    }, [gameIdDB]);

    return (
        <div>
            <label className="block font-medium mb-2">Fuente de farmeo:</label>
            <select
                value={value}
                onChange={(e) => onChange(e.target.value)}  // ✅ aquí está la clave
                disabled={!gameIdDB}
                className="w-full bg-slate-800 text-slate-200 border border-slate-700 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
            >
                <option value="">Selecciona una fuente</option>
                {sources.map((src) => (
                    <option key={src.id} value={src.id}>
                        {src.name}
                    </option>
                ))}
            </select>
        </div>
    );
}

export default SourceSelector;