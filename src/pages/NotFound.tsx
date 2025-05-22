
import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col bg-beige">
      <header className="bg-green py-4">
        <div className="container mx-auto px-4">
          <h1 className="text-white text-2xl font-bold text-center">Marmitaria Família</h1>
        </div>
      </header>
      
      <main className="flex-grow flex items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4 text-brown-dark">404</h1>
          <p className="text-xl text-gray-600 mb-4">Página não encontrada</p>
          <a href="/" className="marmita-btn-primary inline-block">
            Voltar ao Cardápio
          </a>
        </div>
      </main>
      
      <footer className="bg-brown text-white py-4">
        <div className="container mx-auto px-4 text-center text-sm">
          <p>Marmitaria Família &copy; 2025</p>
          <p className="mt-1">Rua Julio Verne, 321, Parangaba, Fortaleza, CE</p>
        </div>
      </footer>
    </div>
  );
};

export default NotFound;
