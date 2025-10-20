import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Card from "../components/ui/Card";
import Input from "../components/ui/Input";
import Label from "../components/ui/Label";
import Button from "../components/ui/Button";
import { getUserProfile, updateUserProfile, changePassword } from "../api/profileApi";

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
  });

  // Sección cambio de contraseña (opcional)
  const [pwd, setPwd] = useState({
    current: "",
    newp: "",
    confirm: "",
  });

  useEffect(() => {
    (async () => {
      try {
        const data = await getUserProfile();
        setForm({
          username: data.username || "",
          first_name: data.first_name || "",
          last_name: data.last_name || "",
          secret_question: data.secret_question || "",
          secret_answer: "", // no traemos la respuesta guardada por seguridad
        });
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
  const onChangePwd = (e) => setPwd((p) => ({ ...p, [e.target.name]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validaciones básicas
    if (!form.username.trim()) {
      setError("El nombre de usuario es obligatorio.");
      return;
    }
    if (pwd.newp || pwd.confirm || pwd.current) {
      if (!pwd.current || !pwd.newp || !pwd.confirm) {
        setError("Para cambiar la contraseña, completa todos los campos de la sección de contraseña.");
        return;
      }
      if (pwd.newp !== pwd.confirm) {
        setError("La confirmación de la nueva contraseña no coincide.");
        return;
      }
    }

    try {
      setSaving(true);

      // 1) Actualizar perfil
      await updateUserProfile({
        username: form.username,
        first_name: form.first_name,
        last_name: form.last_name,
        secret_question: form.secret_question || null,
        // sólo mandamos secret_answer si se escribió algo
        ...(form.secret_answer ? { secret_answer: form.secret_answer } : {}),
      });

      // 2) Cambiar contraseña (si la sección fue usada)
      if (pwd.newp) {
        await changePassword(pwd.current, pwd.newp, pwd.confirm);
      }

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

          {/* ---------------- Cambio de contraseña (opcional) ---------------- */}
          <div className="border-t border-slate-800 pt-6 space-y-4">
            <h2 className="font-semibold">Cambiar contraseña (opcional)</h2>

            <div>
              <Label>Contraseña actual</Label>
              <Input
                type="password"
                name="current"
                value={pwd.current}
                onChange={onChangePwd}
                placeholder="Tu contraseña actual"
              />
            </div>

            <div>
              <Label>Nueva contraseña</Label>
              <Input
                type="password"
                name="newp"
                value={pwd.newp}
                onChange={onChangePwd}
                placeholder="Nueva contraseña"
              />
            </div>

            <div>
              <Label>Confirmar nueva contraseña</Label>
              <Input
                type="password"
                name="confirm"
                value={pwd.confirm}
                onChange={onChangePwd}
                placeholder="Repite la nueva contraseña"
              />
            </div>
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
