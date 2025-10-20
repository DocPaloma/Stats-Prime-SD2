import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import WuWaDomainImg from "../assets/wuwa/WuWa-artifacts.jpeg";

export default function GameView() {
  const { gameId } = useParams();

  const navigate = useNavigate();

  

  return (
    <div className="p-6">
        {gameId === "genshin" && (
            <section>
                <h1 className="text-2xl font-bold mb-4">Genshin Impact</h1>
                <p>Bienvenido a la página de estadísticas de Genshin Impact.</p>
                <p>Aquí puedes encontrar información detallada sobre tus aventuras en Teyvat.</p>
                <p>¿Qué estadísticas deseas visualizar?</p>
                <button 
                onClick={() => navigate("/games/genshin/world-bosses")}
                className="group relative overflow-hidden border border-slate-700 hover:border-indigo-500
                    transition-all duration-200 focus:outline-none rounded-x1 w-96 h-52 mr-4 mb-4">
                    <img src="https://static0.thegamerimages.com/wordpress/wp-content/uploads/2022/05/Genshin-World-Bosses-Cryo-Regisvine-Primo-Geovishap-Maguu-Kenki.jpg?q=50&fit=crop&w=1600&h=900&dpr=1.5"
                    alt="World Bosses Genshin"/>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"/>
                    <span className="absolute bottom-2 left-3 text-white font-semibold text-sm">Jefes de mundo / materiales de ascensión de personajes</span>
                </button>
                <button 
                onClick={() => navigate("/games/genshin/weekly-bosses")}
                className="group relative overflow-hidden border border-slate-700 hover:border-indigo-500
                    transition-all duration-200 focus:outline-none rounded-x1 w-96 h-52 mr-4 mb-4">
                    <img src="https://static0.thegamerimages.com/wordpress/wp-content/uploads/2022/05/Genshin-Boss-Fight-Banner-Azhdaha-Childe-Raiden.jpg?q=70&fit=crop&w=1440&h=990&dpr=1" 
                    alt="Jejes Semanales"/>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"/>
                    <span className="absolute bottom-2 left-3 text-white font-semibold text-sm">Jefes semanales / materiales avanzados de talentos</span>
                </button>
                <button 
                onClick={() => navigate("/games/genshin/domains")}
                className="group relative overflow-hidden border border-slate-700 hover:border-indigo-500
                    transition-all duration-200 focus:outline-none rounded-x1 w-96 h-52 mr-4 mb-4">
                    <img src="https://preview.redd.it/domain-fresque-analysis-the-one-picture-in-every-domain-v0-k29cmvzu65ha1.png?width=1080&crop=smart&auto=webp&s=69d4f18fccf73b50ed536f6b687a798e601649f1"
                    alt="Dominios Genshin"/>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"/>
                    <span className="absolute bottom-2 left-3 text-white font-semibold text-sm">Dominios</span>
                </button>

                <button onClick={() => navigate("/farm-event/register")}
                    className="group relative overflow-hidden border border-slate-700 hover:border-indigo-500
                    transition-all duration-200 focus:outline-none rounded-x1 w-96 h-52 mr-4 mb-4">
                        <img src={"https://i.blogs.es/df8d58/artefacto_flor_del_entrelazamiento/450_1000.webp"}
                        alt="Registro de farmeos genshin"/>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"/>
                    <span className="absolute bottom-2 left-3 text-white font-semibold text-sm">Hacer registro de farmeo</span>
                </button>
            </section>)}
        {gameId === "wuthering" && (
            <section>
                <h1 className="text-2xl font-bold mb-4">Wuthering Wuwa</h1>
                <p>Bienvenido a la página de estadísticas de Wuthering Wuwa.</p>
                <p>Aquí puedes encontrar información detallada sobre tus aventuras en Wuwa.</p>
                <p>¿Qué estadísticas deseas visualizar?</p>
                <button 
                onClick={() => navigate("/games/wuthering/world-bosses")}
                    className="group relative overflow-hidden border border-slate-700 hover:border-indigo-500
                    transition-all duration-200 focus:outline-none rounded-x1 w-96 h-52 mr-4 mb-4">
                    <img src="https://static0.gamerantimages.com/wordpress/wp-content/uploads/2025/01/wuthering-waves-wuwa-all-nightmare-echoes-locations.jpg?q=70&fit=crop&w=1600&h=900&dpr=1"
                    alt="World Bosses WuWa"/>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"/>
                    <span className="absolute bottom-2 left-3 text-white font-semibold text-sm">Jefes de mundo / materiales de ascensión de personajes</span>
                </button>
                <button 
                onClick={() => navigate("/games/wuthering/weekly-bosses")}
                className="group relative overflow-hidden border border-slate-700 hover:border-indigo-500
                    transition-all duration-200 focus:outline-none rounded-x1 w-96 h-52 mr-4 mb-4">
                    <img src="https://i.ytimg.com/vi/Yg_z-hZq9Vs/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLDhQFJgGWEOkDd9X7iMFWUxP5m8dA"
                    alt="Weekly Bosses WuWa"/>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"/>
                    <span className="absolute bottom-2 left-3 text-white font-semibold text-sm">Jefes semanales</span>
                </button>
                <button 
                onClick={() => navigate("/games/wuthering/domains")}
                className="group relative overflow-hidden border border-slate-700 hover:border-indigo-500
                    transition-all duration-200 focus:outline-none rounded-x1 w-96 h-52 mr-4 mb-4">
                    <img src={WuWaDomainImg}
                    alt="Domains WuWa"/>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"/>
                    <span className="absolute bottom-2 left-3 text-white font-semibold text-sm">Dominios</span>
                </button>

                <button onClick={() => navigate("/farm-event/register")}
                    className="group relative overflow-hidden border border-slate-700 hover:border-indigo-500
                    transition-all duration-200 focus:outline-none rounded-x1 w-96 h-52 mr-4 mb-4">
                        <img src="https://static0.thegamerimages.com/wordpress/wp-content/uploads/2024/05/wuthering-waves-dreamless-echo-screen.jpg?w=1600&h=1200&fit=crop"
                        alt="Registro de eventos de farm"/>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"/>
                    <span className="absolute bottom-2 left-3 text-white font-semibold text-sm"></span>
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