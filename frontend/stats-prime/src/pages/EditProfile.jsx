import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Card from "../components/ui/Card";
import Input from "../components/ui/Input";
import Label from "../components/ui/Label";
import Button from "../components/ui/Button";
import { getUserProfile, updateUserProfile } from "../api/profileApi";

export default function EditProfile() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: "",
    email: "",
    secret_question: "",
    secret_answer: "",
    current_password: "",
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // 🧠 Cargar perfil actual
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const data = await getUserProfile();
        setForm((prev) => ({
          ...prev,
          username: data.username || "",
          email: data.email || "",
          secret_question: data.secret_question || "",
          secret_answer: "", // nunca se muestra
        }));
      } catch (err) {
        console.error(err);
        setError("No se pudieron cargar los datos del perfil.");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!form.current_password.trim()) {
      setError("Debes ingresar tu contraseña actual para confirmar los cambios.");
      return;
    }

    try {
      setSaving(true);
      const updatedData = {
        username: form.username,
        email: form.email,
        secret_question: form.secret_question,
        secret_answer: form.secret_answer,
        current_password: form.current_password,
      };
      const data = await updateUserProfile(updatedData);
      setSuccess(data.detail || "Perfil actualizado correctamente.");
      setForm((prev) => ({ ...prev, current_password: "", secret_answer: "" }));
    } catch (err) {
      const msg = err.response?.data?.detail || "No se pudo actualizar el perfil.";
      setError(msg);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <section className="grid place-items-center min-h-screen">
        <p className="text-slate-400">Cargando datos...</p>
      </section>
    );
  }

  return (
    <section className="grid place-items-center min-h-screen p-4">
      <Card className="w-full max-w-lg">
        <h1 className="text-2xl font-semibold mb-2">Editar perfil</h1>
        <p className="text-slate-400 text-sm mb-4">
          Actualiza tu información personal. Para confirmar los cambios, ingresa tu contraseña actual.
        </p>

        {error && <div className="alert-error mb-4">{error}</div>}
        {success && <div className="alert-success mb-4">{success}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Nombre de usuario</Label>
            <Input
              name="username"
              value={form.username}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <Label>Correo electrónico</Label>
            <Input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <Label>Pregunta secreta</Label>
            <Input
              name="secret_question"
              value={form.secret_question}
              onChange={handleChange}
              placeholder="Ej: ¿Nombre de tu primera mascota?"
            />
          </div>

          <div>
            <Label>Respuesta secreta</Label>
            <Input
              name="secret_answer"
              value={form.secret_answer}
              onChange={handleChange}
              placeholder="Tu respuesta secreta"
            />
          </div>

          <div>
            <Label>Contraseña actual</Label>
            <Input
              type="password"
              name="current_password"
              value={form.current_password}
              onChange={handleChange}
              placeholder="Confirma con tu contraseña actual"
              required
            />
          </div>

          <Button className="w-full" disabled={saving}>
            {saving ? "Guardando..." : "Guardar cambios"}
          </Button>
        </form>

        <div className="text-center mt-6">
          <Button variant="outline" onClick={() => navigate("/profile")}>
            Volver al perfil
          </Button>
        </div>
      </Card>
    </section>
  );
}