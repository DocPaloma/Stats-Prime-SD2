import { useParams } from "react-router-dom";

export default function GameView() {
  const { gameId } = useParams();

  return (
    <div className="p-6">
        {gameId === "genshin" && (
            <section>
                <h1 className="text-2xl font-bold mb-4">Genshin Impact</h1>
                <p>Bienvenido a la página de estadísticas de Genshin Impact.</p>
                <p>Aquí puedes encontrar información detallada sobre tus aventuras en Teyvat.</p>
                <p>¿Qué estadísticas deseas visualizar?</p>
                <button 
                onClick={() => Navigate("/games/genshin/world-bosses")}
                className="group relative rounded-x1 overflow-hidden border border-slate-700 hover:border-indigo-500
                    transition-all duration-200 focus:outline-none">
                    <img />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"/>
                    <span className="absolute bottom-2 left-3 text-white font-semibold text-sm">Jefes de mundo / materiales de ascensión de personajes</span>
                </button>
                <button 
                onClick={() => Navigate("/games/genshin/weekly-bosses")}
                className="group relative rounded-x1 overflow-hidden border border-slate-700 hover:border-indigo-500
                    transition-all duration-200 focus:outline-none">
                    <img />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"/>
                    <span className="absolute bottom-2 left-3 text-white font-semibold text-sm">Jefes semanales / materiales avanzados de talentos</span>
                </button>
                <button 
                onClick={() => Navigate("/games/genshin/domains")}
                className="group relative rounded-x1 overflow-hidden border border-slate-700 hover:border-indigo-500
                    transition-all duration-200 focus:outline-none">
                    <img />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"/>
                    <span className="absolute bottom-2 left-3 text-white font-semibold text-sm">Dominios</span>
                </button>
            </section>)}
        {gameId === "wuthering" && (
            <section>
                <h1 className="text-2xl font-bold mb-4">Wuthering Wuwa</h1>
                <p>Bienvenido a la página de estadísticas de Wuthering Wuwa.</p>
                <p>Aquí puedes encontrar información detallada sobre tus aventuras en Wuwa.</p>
                <p>¿Qué estadísticas deseas visualizar?</p>
                <button 
                onClick={() => Navigate("/games/wuthering/world-bosses")}
                    className="group relative rounded-x1 overflow-hidden border border-slate-700 hover:border-indigo-500
                    transition-all duration-200 focus:outline-none">
                    <img />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"/>
                    <span className="absolute bottom-2 left-3 text-white font-semibold text-sm">Jefes de mundo / materiales de ascensión de personajes</span>
                </button>
                <button 
                onClick={() => Navigate("/games/wuthering/weekly-bosses")}
                className="group relative rounded-x1 overflow-hidden border border-slate-700 hover:border-indigo-500
                    transition-all duration-200 focus:outline-none">
                    <img />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"/>
                    <span className="absolute bottom-2 left-3 text-white font-semibold text-sm">Jefes semanales</span>
                </button>
                <button 
                onClick={() => Navigate("/games/wuthering/domains")}
                className="group relative rounded-x1 overflow-hidden border border-slate-700 hover:border-indigo-500
                    transition-all duration-200 focus:outline-none">
                    <img />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"/>
                    <span className="absolute bottom-2 left-3 text-white font-semibold text-sm">Dominios</span>
                </button>
            </section>)}
        {gameId === "warframe" && (
            <section>
                <h1 className="text-2xl font-bold mb-4">Warframe</h1>
                <p>Bienvenido a la página de estadísticas de Warframe.</p>
                <p>Aquí puedes encontrar información detallada sobre tus aventuras en el sistema solar.</p>
            </section>)}
    </div>
  );
}