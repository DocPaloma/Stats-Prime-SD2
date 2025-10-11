import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Card from "../components/ui/Card";
import Input from "../components/ui/Input";
import Label from "../components/ui/Label";
import Button from "../components/ui/Button";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const onSubmit = (e) => {
    e.preventDefault();

    // TODO: aquí iría la llamada real al backend:
    // await api.post('/auth/forgot-password', { email });

    // Simulación del flujo: ir a la pantalla para definir nueva contraseña
    navigate("/reset-password");
  };

  return (
    <section className="grid place-items-center">
      <Card className="w-full max-w-xl">
        <h1 className="text-2xl font-semibold">Recuperar contraseña</h1>
        <p className="text-slate-400 text-sm mt-1">
          Te enviaremos instrucciones a tu correo.
        </p>

        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <div>
            <Label>Correo</Label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <Button className="w-full">Enviar instrucciones</Button>
        </form>
      </Card>
    </section>
  );
}
