import Card from "../components/ui/Card";

function Stat({ label, value }) {
  return (
    <div>
      <div className="flex items-center justify-between text-sm text-slate-300">
        <span>{label}</span><span className="font-semibold text-slate-100">{value}%</span>
      </div>
      <div className="mt-1 h-2 rounded-full bg-slate-800">
        <div className="h-2 rounded-full bg-indigo-500" style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}

export default function Stats() {
  return (
    <section className="space-y-6">
      <header className="space-y-2">
        <h1 className="title">Estadísticas</h1>
        <p className="muted">Resumen visual de datos ingresados a los juegos (mock).</p>
      </header>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <h3 className="font-semibold mb-3">Actividad</h3>
          <div className="space-y-3">
            <Stat label="Datos ingresados hoy" value={72} />
            <Stat label="Validaciones correctas" value={88} />
            <Stat label="Errores reportados" value={12} />
          </div>
        </Card>

        <Card>
          <h3 className="font-semibold mb-3">Juegos</h3>
          <ul className="text-slate-300 text-sm space-y-2">
            <li>Juego A – 124 entradas</li>
            <li>Juego B – 96 entradas</li>
            <li>Juego C – 41 entradas</li>
          </ul>
        </Card>

        <Card>
          <h3 className="font-semibold mb-3">Tendencia semanal</h3>
          <div className="grid grid-cols-7 gap-1">
            {["L","M","X","J","V","S","D"].map((d,i)=>(
              <div key={i} className="h-16 rounded-md bg-gradient-to-t from-indigo-500/10 to-indigo-500"
                   style={{ height: `${40 + i*6}px` }} />
            ))}
          </div>
          <p className="text-slate-400 text-xs mt-2">Gráfico de columnas (placeholder).</p>
        </Card>
      </div>
    </section>
  );
}
