import { useEffect, useState } from "react";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { getUserProfile, deleteUserAccount } from "../api/profileApi";

export default function Profile() {
  const { isAuth, logout } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuth) {
      navigate("/login");
      return;
    }
    (async () => {
      try {
        const data = await getUserProfile();
        setProfile(data);
      } catch (err) {
        setError("No se pudo cargar el perfil: " + (err?.message || "Error"));
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, [isAuth, navigate]);

  const handleDelete = async () => {
    try {
      // el backend exige contraseña para borrar; pedimos al usuario:
      const password = window.prompt("Para confirmar, ingresa tu contraseña:");
      if (!password) return;

      await deleteUserAccount(password);
      logout();
      navigate("/");
    } catch (err) {
      alert(
        err?.response?.data?.detail ||
          err?.message ||
          "No se pudo eliminar la cuenta."
      );
    }
  };

  if (loading) return <p className="text-slate-400">Cargando perfil...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;
  if (!profile) return <p className="text-slate-400">No hay datos de perfil.</p>;

  return (
    <section className="space-y-6">
      <h1 className="title">Perfil</h1>

      <Card>
        <h2 className="font-semibold mb-2">Información</h2>
        {profile ? (
          <>
            <p className="text-slate-400 text-sm">
              Nombre de usuario: {profile.username || "No especificado"}
            </p>
            <p className="text-slate-400 text-sm">Email: {profile.email}</p>
            <p className="text-slate-400 text-sm">
              Nombre: {profile.first_name || "-"}
            </p>
            <p className="text-slate-400 text-sm">
              Apellido: {profile.last_name || "-"}
            </p>
          </>
        ) : (
          <p className="text-slate-400 text-sm">No hay información disponible.</p>
        )}
      </Card>

      <Card>
        <h2 className="font-semibold mb-3">Acciones</h2>
        <div className="flex flex-wrap gap-2">
          <Button onClick={() => navigate("/profile/edit")}>Editar perfil</Button>
          <Button onClick={() => navigate("/stats")}>Ver estadísticas</Button>
          <Button
            className="bg-rose-600 hover:bg-rose-500"
            onClick={() => setConfirmOpen(true)}
          >
            Eliminar cuenta
          </Button>
        </div>
      </Card>

      {confirmOpen && (
        <div className="fixed inset-0 z-20 grid place-items-center bg-black/60 p-4">
          <div className="w-full max-w-md rounded-2xl bg-slate-900 border border-slate-800 p-6">
            <h3 className="text-lg font-semibold">¿Eliminar cuenta?</h3>
            <p className="text-slate-400 mt-1 text-sm">
              Esta acción es irreversible. Se eliminarán tus datos.
            </p>
            <div className="mt-5 flex justify-end gap-2">
              <button className="btn-ghost" onClick={() => setConfirmOpen(false)}>
                Cancelar
              </button>
              <button
                className="btn-primary bg-rose-600 hover:bg-rose-500"
                onClick={() => {
                  setConfirmOpen(false);
                  handleDelete();
                }}
              >
                Sí, eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
