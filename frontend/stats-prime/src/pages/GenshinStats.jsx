import { useParams } from "react-router-dom";

export default function GenshinStats() {
    const { gameId } = useParams();
    const { farmType } = useParams();

    const gameIdDb = ( gameId === "genshin" ) ? 1 : 0;

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Genshin Impact - {farmType.replace("-", " ")}</h1>
            <p>Aquí puedes encontrar estadísticas detalladas sobre {farmType.replace("-", " ")} en Genshin Impact.</p>
            <p>Selecciona los filtros que desees para visualizar las estadísticas correspondientes.</p>
            { farmType === "world-bosses" && (
                <section>
                    <h2 className="text-xl font-semibold mb-3">Jefes de Mundo</h2>
                    <p>Aquí se mostrarán las estadísticas relacionadas con los jefes de mundo en Genshin Impact.</p>
                </section>
            )}
            { farmType === "weekly-bosses" && (
                <section>
                    <h2 className="text-xl font-semibold mb-3">Jefes Semanales</h2>
                    <p>Aquí se mostrarán las estadísticas relacionadas con los jefes semanales en Genshin Impact.</p>
                </section>
            ) }
            { farmType === "domains" && (
                <section>
                    <h2 className="text-xl font-semibold mb-3">Dominios</h2>
                    <p>Aquí se mostrarán las estadísticas relacionadas con los dominios en Genshin Impact.</p>
                </section>
            ) }
        </div>
    );
}