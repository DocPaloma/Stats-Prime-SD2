import { useState } from "react";
import Card from "../components/ui/Card";
import Input from "../components/ui/Input";
import Label from "../components/ui/Label";
import Button from "../components/ui/Button";
import authApi from "../api/authApi";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setError("Ingresa un correo válido.");
      return;
    }

    try {
      setLoading(true);
      const res = await authApi.forgotPassword(email);
      const msg =
        res?.data?.detail ||
        res?.data?.message ||
        "Si existe una cuenta con ese correo, recibirás instrucciones.";
      setSuccess(msg);
    } catch (err) {
      const msg =
        err?.response?.data?.detail ||
        err?.response?.data?.error ||
        err?.message ||
        "No se pudo procesar la solicitud.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="grid place-items-center">
      <Card className="w-full max-w-xl">
        <h1 className="text-2xl font-semibold">Recuperar contraseña</h1>
        <p className="text-slate-400 text-sm mt-1">
          Te enviaremos instrucciones a tu correo.
        </p>

        {error && <div className="alert-error mt-4">{error}</div>}
        {success && <div className="alert-success mt-4">{success}</div>}

        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <div>
            <Label>Correo</Label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tucorreo@dominio.com"
              required
            />
          </div>

          <Button className="w-full" disabled={loading}>
            {loading ? "Enviando..." : "Enviar instrucciones"}
          </Button>
        </form>
      </Card>
    </section>
  );
}
