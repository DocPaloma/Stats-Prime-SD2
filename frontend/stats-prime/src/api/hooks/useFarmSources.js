import { useState, useEffect } from "react";
import axiosClient from "../axiosClient";
import axios from "axios";

function useFarmSources(gameIdDB, token) {
    const [sources, setSources] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!gameIdDB) return;
        setLoading(true);
        axiosClient.get(`/games/${gameIdDB}/farm-sources/`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
    })
    .then((res) => setSources(res.data))
    .finally(() => setLoading(false));
    }, [gameIdDB, token]);

    return { sources, loading };
}

export default useFarmSources;