import { useState } from "react";
import Card from "../components/ui/Card";
import Input from "../components/ui/Input";
import Label from "../components/ui/Label";
import Button from "../components/ui/Button";
import authApi from "../api/authApi";

export default function PasswordResetBySecret() {
  const [step, setStep] = useState(1); // 1 = pedir identificador, 2 = responder pregunta
  const [username, setUsername] = useState("");
  const [secretQuestion, setSecretQuestion] = useState("");
  const [form, setForm] = useState({ answer: "", new_password: "", confirm: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  // Paso 1: obtener pregunta secreta
  const handleGetQuestion = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!username.trim()) {
      setError("Debes ingresar tu usuario o correo.");
      return;
    }

    try {
      setLoading(true);
      const res = await authApi.getSecretQuestion(username);
      setSecretQuestion(res.data.secret_question);
      setStep(2);
    } catch (err) {
      const msg = err.response?.data?.detail || "No se pudo obtener la pregunta secreta.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  // Paso 2: verificar respuesta y restablecer contraseña
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (form.new_password !== form.confirm) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    try {
      setLoading(true);
      const res = await authApi.passwordResetBySecret({
        identifier,
        answer: form.answer,
        new_password: form.new_password,
      });
      setSuccess(res.data.detail || "Contraseña actualizada correctamente.");
      setStep(3); // paso final
    } catch (err) {
      const msg = err.response?.data?.detail || "No se pudo actualizar la contraseña.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="grid place-items-center min-h-screen p-4">
      <Card className="w-full max-w-lg">
        <h1 className="text-2xl font-semibold mb-1">Recuperar contraseña</h1>
        <p className="text-slate-400 text-sm mb-4">
          Restablece tu contraseña usando tu pregunta secreta.
        </p>

        {error && <div className="alert-error mb-4">{error}</div>}
        {success && <div className="alert-success mb-4">{success}</div>}

        {step === 1 && (
          <form onSubmit={handleGetQuestion} className="space-y-4">
            <div>
              <Label>Usuario o correo</Label>
              <Input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Ej: player1 o ejemplo@correo.com"
                required
              />
            </div>
            <Button className="w-full" disabled={loading}>
              {loading ? "Buscando..." : "Continuar"}
            </Button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleResetPassword} className="space-y-4">
            <div>
              <Label>Pregunta secreta</Label>
              <div className="p-2 rounded bg-slate-800 text-slate-200 border border-slate-700">
                {secretQuestion}
              </div>
            </div>
            <div>
              <Label>Respuesta</Label>
              <Input
                name="answer"
                value={form.answer}
                onChange={onChange}
                placeholder="Tu respuesta secreta"
                required
              />
            </div>
            <div>
              <Label>Nueva contraseña</Label>
              <Input
                type="password"
                name="new_password"
                value={form.new_password}
                onChange={onChange}
                required
              />
            </div>
            <div>
              <Label>Confirmar contraseña</Label>
              <Input
                type="password"
                name="confirm"
                value={form.confirm}
                onChange={onChange}
                required
              />
            </div>
            <Button className="w-full" disabled={loading}>
              {loading ? "Guardando..." : "Actualizar contraseña"}
            </Button>
          </form>
        )}

        {step === 3 && (
          <div className="text-center">
            <p className="text-green-400 font-semibold mb-2">
              ✅ Tu contraseña ha sido restablecida correctamente.
            </p>
            <Button onClick={() => (window.location.href = "/login")}>
              Ir al inicio de sesión
            </Button>
          </div>
        )}
      </Card>
    </section>
  );
}

