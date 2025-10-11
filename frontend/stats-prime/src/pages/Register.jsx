import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Card from "../components/ui/Card";
import Input from "../components/ui/Input";
import Label from "../components/ui/Label";
import Button from "../components/ui/Button";

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const onChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Validaciones mínimas
    if (!form.name.trim()) return setError("El nombre es obligatorio.");
    if (!/^\S+@\S+\.\S+$/.test(form.email)) return setError("Ingresa un correo válido.");
    if (form.password.length < 8) return setError("La contraseña debe tener al menos 8 caracteres.");

    try {
      setLoading(true);

      // TODO: Aquí iría la petición real al backend:
      // await api.post('/auth/register', form);

      // Simulación de éxito
      await new Promise((r) => setTimeout(r, 800));

      setSuccess("Usuario creado con éxito. Redirigiendo al inicio de sesión…");

      // Redirigir después de un breve delay
      setTimeout(() => navigate("/login"), 2200);
    } catch (err) {
      setError("No se pudo crear la cuenta. Intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="grid place-items-center">
      <Card className="w-full max-w-xl">
        <h1 className="text-2xl font-semibold">Crear cuenta</h1>
        <p className="text-slate-400 text-sm mt-1">Regístrate para empezar.</p>

        {/* Mensajes */}
        {error && <div className="alert-error mt-4">{error}</div>}
        {success && <div className="alert-success mt-4">{success}</div>}

        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <div>
            <Label>Nombre</Label>
            <Input
              name="name"
              value={form.name}
              onChange={onChange}
              placeholder="Tu nombre"
              required
            />
          </div>

          <div>
            <Label>Correo</Label>
            <Input
              type="email"
              name="email"
              value={form.email}
              onChange={onChange}
              placeholder="tucorreo@dominio.com"
              required
            />
          </div>

          <div>
            <Label>Contraseña</Label>
            <Input
              type="password"
              name="password"
              value={form.password}
              onChange={onChange}
              placeholder="Mínimo 8 caracteres"
              required
            />
          </div>

          <Button className="w-full" disabled={loading}>
            {loading ? "Creando..." : "Crear cuenta"}
          </Button>
        </form>
      </Card>
    </section>
  );
}
