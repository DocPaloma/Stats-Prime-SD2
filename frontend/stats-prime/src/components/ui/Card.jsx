export default function Card({ className = "", children }) {
  return (
    <div
      className={
        "rounded-2xl bg-slate-900/70 border border-slate-800 p-6 shadow-soft " +
        className
      }
    >
      {children}
    </div>
  );
}
