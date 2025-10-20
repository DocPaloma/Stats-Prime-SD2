import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";

function StatBar({ label, value }) {
  return (
    <div>
      <div className="flex items-center justify-between text-xs text-slate-400">
        <span>{label}</span>
        <span className="text-slate-200 font-medium">{value}%</span>
      </div>
      <div className="mt-1 h-2 rounded-full bg-slate-800">
        <div className="h-2 rounded-full bg-indigo-500" style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}

import heroImg from "../assets/hero-gacha.jpg";
import ssDrops from "../assets/screenshot-drops.png";
import ssStats from "../assets/screenshot-stats.webp";

import genshinImg from "../assets/genshin/genshin-impact.jpg";
import wutheringImg from "../assets/wuwa/wuthering-logo.jpg";
import warframeImg from "../assets/warframe/warframe-logo.jpg";

export default function Home() {
  const { isAuth } = useAuth();
  const navigate = useNavigate();

  return (
    <section className="space-y-10">
      {/* Encabezado */}
      <header className="space-y-2">
        <span className="inline-flex items-center rounded-lg px-2 py-1 text-xs font-medium bg-slate-800 border border-slate-700">
          Sprint 2
        </span>
        <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">
          {isAuth
            ? "Panel de inicio"
            : "Stats-Prime: estadísticas de drops para Genshin y Wuthering Waves"}
        </h1>
        <p className="text-slate-400 max-w-3xl">
          {isAuth ? (
            "Resumen rápido de tu cuenta y accesos directos."
          ) : (
            <>
              Registra y analiza tus drops de <span className="font-medium text-slate-200">jefes y dungeons</span>:
              artefactos, materiales de evolución de armas y talentos. Mira tendencias, tasa de drop y planifica farmeos
              con datos reales.
            </>
          )}
        </p>
      </header>

      {/* Bloques para usuarios autenticados */}
      {isAuth && (
        <div className="grid gap-6 md:grid-cols-3">
          <Card>
            <h3 className="font-semibold">Accesos rápidos</h3>
            <div className="mt-3 flex flex-wrap gap-2">
              <Button onClick={() => navigate("/profile")}>Perfil</Button>
              <Button className="bg-violet-600 hover:bg-violet-500" onClick={() => navigate("/stats")}>
                Ver estadísticas
              </Button>
            </div>
          </Card>

          <Card>
            <h3 className="font-semibold">Actividad reciente</h3>
            <ul className="mt-2 space-y-2 text-sm text-slate-300 list-disc pl-5">
              <li>Login completado</li>
              <li>Actualizaste tu perfil</li>
              <li>Se generaron 12 nuevas entradas</li>
            </ul>
          </Card>

          <Card>
            <h3 className="font-semibold">Estado del sprint</h3>
            <p className="text-slate-400 mt-1">3 tareas en progreso, 2 cerradas.</p>
            <Button className="mt-3">Ver tablero</Button>
          </Card>

        {/* Sección de juegos disponibles */}
          <Card className="p-8 shadow-xl">
            <h3 className="font-semibold mb-6 text-2xl text-center text-white">Juegos disponibles</h3>
            <div className="grid gap-8 sm:grid-cols-3">
              {/* Genshin Impact */}
              <button
                onClick={() => navigate("/games/genshin")}
                className="group relative rounded-xl overflow-hidden border border-slate-700 hover:border-indigo-500
                           transition-all duration-200 focus:outline-none hover:scale-[1.03]"
              >
                <img
                  src={genshinImg}
                  alt="Genshin Impact"
                  className="w-full h-40 object-cover opacity-90 group-hover:opacity-100 transition-opacity"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <span className="absolute bottom-2 left-3 text-white font-semibold text-sm">Genshin Impact</span>
              </button>

              {/* Wuthering Waves */}
              <button
                onClick={() => navigate("/games/wuthering")}
                className="group relative rounded-xl overflow-hidden border border-slate-700 hover:border-indigo-500
                           transition-all duration-200 focus:outline-none hover:scale-[1.03]"
              >
                <img
                  src={wutheringImg}
                  alt="Wuthering Waves"
                  className="w-full h-40 object-cover opacity-90 group-hover:opacity-100 transition-opacity"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <span className="absolute bottom-2 left-3 text-white font-semibold text-sm">Wuthering Waves</span>
              </button>

              {/* Warframe - bloqueado */}
              <div
                className="relative rounded-xl overflow-hidden border border-slate-800 bg-slate-900/40 cursor-not-allowed opacity-70"
              >
                <img
                  src={warframeImg}
                  alt="Warframe (Próximamente)"
                  className="w-full h-40 object-cover grayscale opacity-70"
                />
                <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center text-white">
                  <span className="text-sm font-semibold">Warframe</span>
                  <span className="text-xs text-slate-300">Próximamente</span>
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Landing pública */}
      {!isAuth && (
        <>
          {/* Héroe */}
          <div className="grid gap-8 md:grid-cols-2 items-center">
            <div className="space-y-5">
              <div className="flex gap-2">
                <span className="badge">Genshin Impact</span>
                <span className="badge">Wuthering Waves</span>
              </div>

              <h2 className="text-2xl font-semibold">
                Registra drops. Obtén insights. Optimiza tu farmeo.
              </h2>

              <p className="text-slate-400">
                Guarda resultados de dominios y jefes semanales: calidad de artefactos, tipo de set,
                materiales de evolución de armas y talentos. Visualiza porcentajes y tendencias.
              </p>

              <div className="flex flex-wrap gap-2">
                <Button onClick={() => navigate("/register")}>Comenzar gratis</Button>
                <Button className="bg-slate-800 hover:bg-slate-700" onClick={() => navigate("/login")}>
                  Ya tengo cuenta
                </Button>
              </div>

              <div className="grid grid-cols-3 gap-3 pt-2">
                <StatBar label="Artefactos 5★" value={27} />
                <StatBar label="Mats talentos" value={64} />
                <StatBar label="Mats armas" value={52} />
              </div>
            </div>

            <div>
              <div
                className="relative rounded-2xl border border-slate-800 shadow-soft overflow-hidden
                           bg-gradient-to-br from-slate-900/60 to-slate-800/40"
                style={{ aspectRatio: "16/9" }}
              >
                <div className="absolute inset-0 p-3">
                  <div className="w-full h-full rounded-xl overflow-hidden">
                    <img
                      src={heroImg}
                      alt="Arte promocional"
                      className="w-full h-full object-cover object-center"
                      loading="eager"
                    />
                  </div>
                </div>
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/10" />
              </div>
            </div>
          </div>

          {/* Galería agrupada en UNA card (alineación perfecta) */}
          <Card className="p-4 md:p-6">
            <h3 className="sr-only">Galería</h3>
            <div className="grid gap-4 md:gap-6 md:grid-cols-2">
              {/* Marco 1 */}
              <figure
                className="rounded-xl border border-slate-800 bg-slate-900/40 shadow-soft
                           p-2 md:p-3 overflow-hidden"
              >
                <div className="w-full h-full aspect-[16/10] md:aspect-[16/9] flex items-center justify-center">
                  <img
                    src={ssDrops}
                    alt="Registro de drops"
                    className="block max-h-full w-auto object-contain"
                    loading="lazy"
                  />
                </div>
              </figure>

              {/* Marco 2 */}
              <figure
                className="rounded-xl border border-slate-800 bg-slate-900/40 shadow-soft
                           p-2 md:p-3 overflow-hidden"
              >
                <div className="w-full h-full aspect-[16/10] md:aspect-[16/9] flex items-center justify-center">
                  <img
                    src={ssStats}
                    alt="Panel de estadísticas"
                    className="block max-h-full w-auto object-contain"
                    loading="lazy"
                  />
                </div>
              </figure>
            </div>
          </Card>

          {/* Soporte actual (mismo padding/radio que la galería) */}
          <Card className="p-6">
            <h3 className="font-semibold">Soporte actual</h3>
            <ul className="mt-2 space-y-2 text-sm text-slate-300 list-disc pl-5">
              <li>Genshin Impact — artefactos, jefes semanales, talentos</li>
              <li>Wuthering Waves — mats de arma, Echoes/sets equivalentes</li>
              <li>Más juegos próximamente</li>
            </ul>
          </Card>

          {/* Cómo funciona */}
          <Card className="md:flex md:items-center md:justify-between">
            <div className="space-y-2">
              <h3 className="font-semibold">¿Cómo funciona?</h3>
              <ol className="mt-2 space-y-2 text-sm text-slate-300 list-decimal pl-5">
                <li>Regístrate y crea tu perfil.</li>
                <li>Tras cada run, registra tus drops (artefactos/mats).</li>
                <li>Analiza las gráficas y optimiza tu ruta de farmeo.</li>
              </ol>
            </div>
            <div className="mt-4 md:mt-0">
              <Button onClick={() => navigate("/register")}>Empezar ahora</Button>
            </div>
          </Card>
        </>
      )}
    </section>
  );
}
