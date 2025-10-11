export default function Input({ className = "", ...props }) {
  return (
    <input
      className={
        "w-full rounded-lg bg-slate-900/60 border border-slate-800 px-3 py-2 " +
        "placeholder:text-slate-500 outline-none focus:ring-2 focus:ring-indigo-500 " +
        className
      }
      {...props}
    />
  );
}
