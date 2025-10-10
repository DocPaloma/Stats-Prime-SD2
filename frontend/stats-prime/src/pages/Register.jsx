import { useState } from "react";

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const onChange = e => setForm({ ...form, [e.target.name]: e.target.value });
  const onSubmit = e => { e.preventDefault(); /* TODO: API */ };

  return (
    <section className="grid place-items-center">
      <div className="w-full max-w-md card">
        <h1 className="text-2xl font-semibold">Crear cuenta</h1>
        <p className="muted text-sm mt-1">Regístrate para empezar.</p>

        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <div>
            <label className="label">Nombre</label>
            <input className="input" name="name" value={form.name} onChange={onChange} required />
          </div>
          <div>
            <label className="label">Correo</label>
            <input className="input" type="email" name="email" value={form.email} onChange={onChange} required />
          </div>
          <div>
            <label className="label">Contraseña</label>
            <input className="input" type="password" name="password" value={form.password} onChange={onChange} required />
          </div>
          <button className="w-full btn-primary">Crear cuenta</button>
        </form>
      </div>
    </section>
  );
}
