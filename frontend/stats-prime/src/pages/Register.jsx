import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Card from "../components/ui/Card";
import Input from "../components/ui/Input";
import Label from "../components/ui/Label";
import Button from "../components/ui/Button";

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "", password2: "", first_name: "" , last_name: "" , secret_question: "", secret_answer: "" });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const onChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const validatePassword = (password) => {
      const re = {
        length: /.{8,}/,
        upper: /[A-Z]/,
        number: /[0-9]/,
        special: /[!@#$%^&*(),.?":{}|<>]/
      };
      if (!re.length.test(password)) return "La contraseña debe tener al menos 8 caracteres.";
      if (!re.upper.test(password)) return "La contraseña debe incluir al menos una letra mayúscula.";
      if (!re.number.test(password)) return "La contraseña debe incluir al menos un número.";
      if (!re.special.test(password)) return "La contraseña debe incluir al menos un carácter especial.";

      return null;
    };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Validaciones mínimas
    if (!form.name.trim()) return setError("El nombre es obligatorio.");
    if (!/^\S+@\S+\.\S+$/.test(form.email)) return setError("Ingresa un correo válido.");
    if (form.password !== form.confirm) return setError("Las contraseñas no coinciden.");

    const passwordError = validatePassword(form.password);
    if (passwordError) return setError(passwordError);
    

    try {
      setLoading(true);

      const res = await fetch("https://localhost:8000/api/users/register/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const data = await res.json();
        const msg = Object.values(data).flat().join(" ");
        throw new Error(data.detail || "Error en el registro");
      }

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
            <Label>Nombre de usuario</Label>
            <Input
              name="name"
              value={form.username}
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

          <div>
            <Label>Confirmar contraseña</Label>
            <Input
              type="password"
              name="password2"
              value={form.password2}
              onChange={onChange}
              placeholder="Repite tu contraseña"
              required
            />
          </div>

          <div>
            <Label>Nombre</Label>
            <Input
              name="first_name"
              value={form.first_name}
              onChange={onChange}
              placeholder="EJ: Alejandro Pérez"
              required
            />
          </div>

          <div>
            <Label>Apellido</Label>
            <Input
              name="last_name"
              value={form.last_name}
              onChange={onChange}
              placeholder="EJ: Pérez Gómez"
              required
            />
          </div>

          <div>
            <Label>Pregunta secreta</Label>
            <select
              name="secret_question"
              value={form.secret_question}
              onChange={onChange}
            >
              <option value="">Selecciona una pregunta</option>
              <option value="nombre_mascota">¿Cuál era el nombre de tu primera mascota?</option>
              <option value="comida_favorita">¿Cuál es tu comida favorita?</option>
              <option value="ciudad_nacimiento">¿En qué ciudad naciste?</option>
            </select>
            </div>


          <div>
            <Label>Respuesta secreta</Label>
            <Input
              name="secret_answer"
              value={form.secret_answer}
              onChange={onChange}
              placeholder="EJ: Rocky"
              
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
