import { useState } from "react";
import { useNavigate, userSearchParams } from "react-router-dom";
import authApi from "../api/authApi";
import Card from "../components/ui/Card";
import Input from "../components/ui/Input";
import Label from "../components/ui/Label";
import Button from "../components/ui/Button";

export default function ResetPassword() {
  const [params] = userSearchParams();
  const token = params.get("token");
  const navigate = useNavigate();
  const [form, setForm] = useState({ password: "", confirm: "" });
  const onChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirm) {
      alert("Las contraseñas no coinciden");
      return;
    }
    
    try {
      await authApi.resetPasswordConfirm(token, form.password);
      alert("Contraseña actualizada. Ya puedes iniciar sesión.");
      navigate("/login");
    } catch (err) {
      alert("Error al actualizar la contraseña: " + (err.response?.data?.detail || err.message));
      console.error(err);
    }
  };

  return (
    <section className="grid place-items-center">
      <Card className="w-full max-w-md">
        <h1 className="text-2xl font-semibold">Definir nueva contraseña</h1>
        <p className="text-slate-400 text-sm mt-1">Ingresa tu nueva contraseña para completar el proceso.</p>

        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <div>
            <Label>Nueva contraseña</Label>
            <Input type="password" name="password" value={form.password} onChange={onChange} required />
          </div>
          <div>
            <Label>Confirmar contraseña</Label>
            <Input type="password" name="confirm" value={form.confirm} onChange={onChange} required />
          </div>
          <Button className="w-full">Actualizar</Button>
        </form>
      </Card>
    </section>
  );
}
