import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Card from "../components/ui/Card";
import Input from "../components/ui/Input";
import Label from "../components/ui/Label";
import Button from "../components/ui/Button";
import { getUserProfile, updateUserProfile } from "../api/profileApi";

export default function EditProfile() {
  const navigate = useNavigate();
  const [profileLoading, setProfileLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // Datos de perfil
  const [form, setForm] = useState({
    username: "",
    first_name: "",
    last_name: "",
    secret_question: "",
    secret_answer: "",
    current_password: "",
  });

  useEffect(() => {
    (async () => {
      try {
        const data = await getUserProfile();
        setForm((prev) => ({...prev, username: data.username || "", first_name: data.first_name || "", last_name: data.last_name || "", secret_question: data.secret_question || "", secret_answer: "" }));
      } catch (err) {
        setError(
          err?.response?.data?.detail || err?.message || "No se pudo cargar."
        );
      } finally {
        setProfileLoading(false);
      }
    })();
  }, []);

  const onChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));


  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validaciones básicas
    if (!form.current_password.trim()) {
      setError("Por favor, ingresa tu contraseña actual para confirmar los cambios.");
      return;
    }

    try {
      setSaving(true);
      const payload = {...form};

      if (!payload.secret_answer) delete payload.secret_answer;

      await updateUserProfile(payload);

      navigate("/profile");
    } catch (err) {
      setError(
        err?.response?.data?.detail ||
          (err?.response?.data && JSON.stringify(err.response.data)) ||
          err?.message ||
          "No se pudo guardar."
      );
    } finally {
      setSaving(false);
    }
  };

  if (profileLoading) return <p className="text-slate-400">Cargando…</p>;

  return (
    <section className="grid place-items-center">
      <Card className="w-full max-w-xl">
        <h1 className="text-2xl font-semibold">Editar perfil</h1>
        <p className="text-slate-400 text-sm mt-1">Actualiza tu información básica.</p>

        {error && <div className="alert-error mt-4">{error}</div>}

        <form onSubmit={onSubmit} className="mt-6 space-y-6">
          {/* ---------------- Datos básicos ---------------- */}
          <div className="space-y-4">
            <div>
              <Label>Nombre de usuario</Label>
              <Input
                name="username"
                value={form.username}
                onChange={onChange}
                placeholder="Tu username"
              />
            </div>

            <div>
              <Label>Nombre</Label>
              <Input
                name="first_name"
                value={form.first_name}
                onChange={onChange}
                placeholder="Tu nombre"
              />
            </div>

            <div>
              <Label>Apellido</Label>
              <Input
                name="last_name"
                value={form.last_name}
                onChange={onChange}
                placeholder="Tu apellido"
              />
            </div>

            <div>
              <Label>Correo electrónico</Label>
              <Input
                name="email"
                value={form.email}
                onChange={onChange}
                placeholder="Tu correo electrónico"
              />
            </div>

            <div>
              <Label>Pregunta secreta (opcional)</Label>
              <select
                name="secret_question"
                value={form.secret_question || ""}
                onChange={onChange}
                className="select-dark"
              >
                <option value="" disabled hidden>
                  Selecciona una pregunta
                </option>
                <option value="nombre_mascota">
                  ¿Cuál era el nombre de tu primera mascota?
                </option>
                <option value="comida_favorita">¿Cuál es tu comida favorita?</option>
                <option value="ciudad_nacimiento">¿En qué ciudad naciste?</option>
              </select>
            </div>

            <div>
              <Label>Respuesta secreta (opcional)</Label>
              <Input
                name="secret_answer"
                value={form.secret_answer}
                onChange={onChange}
                placeholder="Escribe tu respuesta secreta"
              />
              <p className="text-xs text-slate-500 mt-1">
                Guarda una respuesta que recuerdes. Se usará para recuperar tu cuenta.
              </p>
            </div>
          </div>

          <div>
            <Label>Contraseña actual</Label>
            <Input
              type="password"
              name="current_password"
              value={form.current_password}
              onChange={onChange}
              placeholder="Ingresa tu contraseña actual"
            />
            <p className="text-xs text-slate-500 mt-1">
              Ingresa tu contraseña actual para confirmar los cambios.
            </p>
          </div>

          <div className="flex gap-2">
            <Button className="w-full" disabled={saving}>
              {saving ? "Guardando..." : "Guardar cambios"}
            </Button>
            <Button
              type="button"
              className="w-full bg-slate-700 hover:bg-slate-600"
              onClick={() => navigate("/profile")}
              disabled={saving}
            >
              Cancelar
            </Button>
          </div>
        </form>
      </Card>
    </section>
  );
}
