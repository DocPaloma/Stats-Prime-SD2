export default function Button({ className = "", children, ...props }) {
  return (
    <button
      className={
        "inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2 " +
        "font-medium transition active:scale-[.98] " +
        "bg-indigo-600 text-white hover:bg-indigo-500 shadow " +
        className
      }
      {...props}
    >
      {children}
    </button>
  );
}
