import { useState, useEffect } from 'react';
import axiosClient from '../../api/axiosClient';

function SourceSelector({ gameIdDB, value, onChange }) {
    const [sources, setSources] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!gameIdDB) return;

        setLoading(true);
        axiosClient
            .get(`/games/${gameIdDB}/farm-sources/`)
            .then((res) => setSources(res.data))
            .catch((err) => console.error("Error al obtener las fuentes:", err))
            .finally(() => setLoading(false));
    }, [gameIdDB]);

    return(
        <div className='space-y-1'>
            <label className='block font-medium mb-2'>Fuente de farmeo:</label>
            {loading ? (
                <p className='text-slate-400 text-sm'>Cargando fuentes...</p>
            ) : (
                <select 
                value={value}
                onChange={(e) => setForm({ ...form, source: e.target.value})}
                className='w-full bg-slate-800 text-slate-200 rounded-lg border border-slate-700 p-2 text-sm focus:outline-none focus:ring-2 fpcis:ring-indigo-500'
                >
                    <option value=''>Selecciona una fuente</option>
                    {sources.map((source) => (
                        <option key={source.id} value={source.id}>
                            {source.name} - {source.source_type}
                        </option>
                    ))}
                </select>
                )}
        </div>
    )
}

export default SourceSelector;