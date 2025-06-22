 export default function Footer(){
  return (
    <footer className="w-full bg-[#183292] text-white">
      <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col sm:flex-row justify-between items-center">
        
        
        {/* Derechos de autor */}
        <div className="text-sm text-[#B0DFFF] select-none absolute right-0">
          &copy; {new Date().getFullYear()} VuelaYa. Todos los derechos reservados.
        </div>
      </div>
    </footer>
  );
};

