import React from 'react';
import { Link, NavLink } from 'react-router-dom';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-primary-700 text-white shadow-md">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link to="/" className="text-xl font-bold">Sistema de Pólizas</Link>
          <nav>
            <ul className="flex space-x-4">
              <li>
                <NavLink 
                  to="/polizas" 
                  className={({ isActive }) => 
                    isActive 
                      ? "border-b-2 border-white pb-1" 
                      : "hover:border-b-2 hover:border-white pb-1"
                  }
                >
                  Pólizas
                </NavLink>
              </li>
              <li>
                <NavLink 
                  to="/inventario" 
                  className={({ isActive }) => 
                    isActive 
                      ? "border-b-2 border-white pb-1" 
                      : "hover:border-b-2 hover:border-white pb-1"
                  }
                >
                  Inventario
                </NavLink>
              </li>
              <li>
                <NavLink 
                  to="/empleados" 
                  className={({ isActive }) => 
                    isActive 
                      ? "border-b-2 border-white pb-1" 
                      : "hover:border-b-2 hover:border-white pb-1"
                  }
                >
                  Empleados
                </NavLink>
              </li>
            </ul>
          </nav>
        </div>
      </header>
      
      <main className="flex-grow container mx-auto px-4 py-6">
        {children}
      </main>
      
      <footer className="bg-secondary-800 text-white py-4">
        <div className="container mx-auto px-4 text-center">
          <p>Sistema de Gestión de Pólizas &copy; {new Date().getFullYear()}</p>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;
