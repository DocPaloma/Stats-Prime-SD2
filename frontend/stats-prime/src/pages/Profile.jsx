import { useState } from "react";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleDelete = () => {
    // TODO: llamada real al backend para eliminar cuenta
    logout();         // salir tras borrar
    navigate("/");    // redirigir
  };

  return (
    <section className="space-y-6">
      <h1 className="title">Perfil</h1>

      <Card>
        <h2 className="font-semibold mb-2">Información</h2>
        <p className="text-slate-400 text-sm">Nombre: Usuario Demo</p>
        <p className="text-slate-400 text-sm">Email: demo@stats-prime.com</p>
      </Card>

      <Card>
        <h2 className="font-semibold mb-3">Acciones</h2>
        <div className="flex flex-wrap gap-2">
          <Button onClick={() => navigate("/stats")} className="">Ver estadísticas</Button>
          <Button className="bg-rose-600 hover:bg-rose-500" onClick={() => setConfirmOpen(true)}>
            Eliminar cuenta
          </Button>
        </div>
      </Card>

      {/* Modal simple */}
      {confirmOpen && (
        <div className="fixed inset-0 z-20 grid place-items-center bg-black/60 p-4">
          <div className="w-full max-w-md rounded-2xl bg-slate-900 border border-slate-800 p-6">
            <h3 className="text-lg font-semibold">¿Eliminar cuenta?</h3>
            <p className="text-slate-400 mt-1 text-sm">
              Esta acción es irreversible. Se eliminarán tus datos.
            </p>
            <div className="mt-5 flex justify-end gap-2">
              <button className="btn-ghost" onClick={() => setConfirmOpen(false)}>Cancelar</button>
              <button className="btn-primary bg-rose-600 hover:bg-rose-500" onClick={handleDelete}>
                Sí, eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
