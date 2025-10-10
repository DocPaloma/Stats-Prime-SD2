export default function Home() {
  return (
    <section className="space-y-6">
      <header className="space-y-2">
        <span className="inline-flex items-center rounded-lg px-2 py-1 text-xs font-medium bg-slate-800 border border-slate-700">
          Sprint 2
        </span>
        <h1 className="text-3xl font-semibold tracking-tight">Home</h1>
        <p className="text-slate-400">Bienvenido. Aquí irá el panel/seguimiento de rutas según el sprint.</p>
      </header>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl bg-slate-900/70 border border-slate-800 p-6 shadow-xl">
          <h3 className="font-semibold">Progreso</h3>
          <p className="text-slate-400 mt-1">Resumen de tareas y avances.</p>
          <button className="mt-4 inline-flex items-center rounded-xl bg-indigo-600 px-4 py-2 font-medium text-white hover:bg-indigo-500">
            Ver detalles
          </button>
        </div>

        <div className="rounded-2xl bg-slate-900/70 border border-slate-800 p-6 shadow-xl">
          <h3 className="font-semibold">Últimos eventos</h3>
          <ul className="mt-2 space-y-2 text-sm text-slate-300 list-disc pl-5">
            <li>Login completado</li>
            <li>Registro en pruebas</li>
            <li>Perfil pendiente</li>
          </ul>
        </div>
      </div>
    </section>
  );
}
