import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import Label from "../components/ui/Label";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const onChange = e => setForm({ ...form, [e.target.name]: e.target.value });
  const navigate = useNavigate();
  const { login } = useAuth();

  const onSubmit = e => {
    e.preventDefault();
    // TODO: reemplazar por llamada al backend; si OK:
    login();
    navigate("/");
  };

  return (
    <section className="grid place-items-center">
      <Card className="w-full max-w-md">
        <h1 className="text-2xl font-semibold">Iniciar sesión</h1>
        <p className="text-slate-400 text-sm mt-1">Accede a tu cuenta para continuar.</p>

        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <div>
            <Label>Correo</Label>
            <Input type="email" name="email" value={form.email} onChange={onChange} required />
          </div>
          <div>
            <Label>Contraseña</Label>
            <Input type="password" name="password" value={form.password} onChange={onChange} required />
          </div>
          <Button className="w-full">Entrar</Button>
          <a className="block text-center text-sm text-indigo-400 hover:underline" href="/forgot-password">
            ¿Olvidaste tu contraseña?
          </a>
        </form>
      </Card>
    </section>
  );
}
