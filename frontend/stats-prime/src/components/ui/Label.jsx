export default function Label({ className = "", children, ...props }) {
  return (
    <label className={"block text-sm mb-1 text-slate-300 " + className} {...props}>
      {children}
    </label>
  );
}
