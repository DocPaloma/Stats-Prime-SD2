import { useState } from "react";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const onChange = e => setForm({ ...form, [e.target.name]: e.target.value });
  const onSubmit = e => { e.preventDefault(); /* TODO: API */ };

  return (
    <section className="grid place-items-center">
      <div className="w-full max-w-md rounded-2xl bg-slate-900/70 border border-slate-800 p-6 shadow-xl">
        <h1 className="text-2xl font-semibold">Iniciar sesión</h1>
        <p className="text-slate-400 text-sm mt-1">Accede a tu cuenta para continuar.</p>

        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <div>
            <label className="block text-sm mb-1 text-slate-300">Correo</label>
            <input
              className="w-full rounded-lg bg-slate-900/60 border border-slate-800 px-3 py-2 placeholder:text-slate-500 outline-none focus:ring-2 focus:ring-indigo-500"
              type="email" name="email" value={form.email} onChange={onChange} required
            />
          </div>
          <div>
            <label className="block text-sm mb-1 text-slate-300">Contraseña</label>
            <input
              className="w-full rounded-lg bg-slate-900/60 border border-slate-800 px-3 py-2 placeholder:text-slate-500 outline-none focus:ring-2 focus:ring-indigo-500"
              type="password" name="password" value={form.password} onChange={onChange} required
            />
          </div>
          <button className="w-full rounded-xl bg-indigo-600 px-4 py-2 font-medium text-white hover:bg-indigo-500">
            Entrar
          </button>
          <a className="block text-center text-sm text-indigo-400 hover:underline" href="/forgot-password">
            ¿Olvidaste tu contraseña?
          </a>
        </form>
      </div>
    </section>
  );
}
