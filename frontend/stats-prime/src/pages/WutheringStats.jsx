import { useParams } from "react-router-dom";
import { Navigate } from "react-router-dom";

export default function WutheringStats() {
    const { gameId } = useParams();
    const { farmType } = useParams();

    const gameIdDb = ( gameId === "wuthering" ) ? 2 : 0;

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Wuthering Wuwa - {farmType.replace("-", " ")}</h1>
            <p>Aquí puedes encontrar estadísticas detalladas sobre {farmType.replace("-", " ")} en Wuthering Wuwa.</p>
            <p>Selecciona los filtros que desees para visualizar las estadísticas correspondientes.</p>

            { farmType === "world-bosses" && (
                <section>
                    <h2 className="text-xl font-semibold mb-3">Jefes de Mundo</h2>
                    <p>Aquí se mostrarán las estadísticas relacionadas con los jefes de mundo en Wuthering Wuwa.</p>
                </section>
            )}

            { farmType === "weekly-bosses" && (
                <section>
                    <h2 className="text-xl font-semibold mb-3">Jefes Semanales</h2>
                    <p>Aquí se mostrarán las estadísticas relacionadas con los jefes semanales en Wuthering Wuwa.</p>
                </section>
            ) }
            { farmType === "domains" && (
                <section>
                    <h2 className="text-xl font-semibold mb-3">Dominios</h2>
                    <p>Aquí se mostrarán las estadísticas relacionadas con los dominios en Wuthering Wuwa.</p>
                </section>
            ) }
        </div>
    );
}