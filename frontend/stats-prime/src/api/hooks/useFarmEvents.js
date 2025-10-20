import { useEffect, useState } from "react";
import { getFarmEvents, createFarmEvent, deleteFarmEvent } from "../farmEvents";

export const useFarmEvents = (gameIdDB) => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!gameIdDB) return;

        const fetchEvents = async () => {
            setLoading(true);
            try {
                const data = await getFarmEvents(gameIdDB);
                setEvents(data);
            } catch (error) {
                console.error("Error fetching farm events:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchEvents();
    }, [gameIdDB]);

    const addEvent = async (newEvent) => {
        const createdEvent = await createFarmEvent(gameIdDB, newEvent);
        setEvents((prevEvents) => [...prevEvents, createdEvent]);
    };

    const removeEvent = async (eventId) => {
        await deleteFarmEvent(gameIdDB, eventId);
        setEvents((prevEvents) => prevEvents.filter((event) => event.id !== eventId));
    };

    return { events, loading, addEvent, removeEvent };
};