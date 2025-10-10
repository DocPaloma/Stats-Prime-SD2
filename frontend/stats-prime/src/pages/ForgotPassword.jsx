import { useState } from "react";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const onSubmit = e => { e.preventDefault(); /* TODO: API */ };

  return (
    <section className="grid place-items-center">
      <div className="w-full max-w-md card">
        <h1 className="text-2xl font-semibold">Recuperar contraseña</h1>
        <p className="muted text-sm mt-1">Te enviaremos instrucciones a tu correo.</p>

        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <div>
            <label className="label">Correo</label>
            <input className="input" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
          </div>
          <button className="w-full btn-primary">Enviar instrucciones</button>
        </form>
      </div>
    </section>
  );
}
