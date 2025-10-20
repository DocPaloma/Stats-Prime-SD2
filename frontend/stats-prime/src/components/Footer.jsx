function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 text-center text-sm py-6 border-t border-slate-800 mt-10">
      <p>
        © {new Date().getFullYear()} FarmTracker. Todos los derechos reservados.
      </p>
      <p className="mt-1 text-xs text-slate-500">
        Las imágenes, nombres y recursos visuales relacionados con 
        <span className="text-slate-300"> Genshin Impact</span>, 
        <span className="text-slate-300"> Wuthering Waves</span> y 
        <span className="text-slate-300"> Warframe</span> son propiedad de sus respectivos dueños y se utilizan únicamente con fines informativos y sin ánimo de lucro.
      </p>
    </footer>
  );
}

export default Footer;
