import { Link, useLocation, useNavigate } from "react-router-dom";
import { Home, Settings, LogOut, LogIn } from "lucide-react";
import { Button } from "./ui/button";

export function Navbar({ user, setUser }) {
  const location = useLocation();

  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.clear();
    setUser(null);
    navigate('/');
  };

  return (
    <nav className="border-b bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-8">
            <Link to={ user ? "/dashboard" : "/"} className="flex items-center">
              <span className="text-xl font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                AI Interviewer
              </span>
            </Link>

            <div className="hidden md:flex items-center gap-2">
              <Link to={ user ? "/dashboard" : "/"}>
                <Button
                  variant={location.pathname === "/" ? "default" : "ghost"}
                  size="sm"
                  className="gap-2"
                >
                  <Home className="w-4 h-4" />
                  Home
                </Button>
              </Link>

              {user && (
                <Link to="/settings">
                  <Button
                    variant={location.pathname === "/settings" ? "default" : "ghost"}
                    size="sm"
                    className="gap-2"
                  >
                    <Settings className="w-4 h-4" />
                    Settings
                  </Button>
                </Link>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3">
            {user ? (
              <>
                <span className="text-sm text-gray-600 hidden sm:block">
                  Hello, <span className="font-medium text-gray-900">{user.username}</span>
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLogout}
                  className="gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden sm:inline">Logout</span>
                </Button>
              </>
            ) : (
              <Link to="/login">
                <Button size="sm" className="gap-2">
                  <LogIn className="w-4 h-4" />
                  Sign In
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;