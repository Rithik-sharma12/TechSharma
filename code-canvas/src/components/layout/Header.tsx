import { Link } from "react-router-dom";
import { Moon, Sun, Bookmark, User, LogIn, Shield, Lightbulb, LayoutDashboard } from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";

const Header = () => {
  const [isDark, setIsDark] = useState(false);
  const { user, isAuthenticated, isAdmin } = useAuth();

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const shouldBeDark = savedTheme === "dark" || (!savedTheme && prefersDark);
    setIsDark(shouldBeDark);
    document.documentElement.classList.toggle("dark", shouldBeDark);
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    localStorage.setItem("theme", newTheme ? "dark" : "light");
    document.documentElement.classList.toggle("dark", newTheme);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="mx-auto flex h-16 max-w-4xl items-center justify-between px-4">
        <Link to="/" className="font-sans text-xl font-bold text-foreground hover:text-primary transition-colors">
          TechSharma
        </Link>
        
        <div className="hidden items-center gap-8 md:flex">
          <Link to="/section/hardware" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            Hardware
          </Link>
          <Link to="/section/software" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            Software
          </Link>
          <Link to="/section/security" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            Security
          </Link>
          <Link to="/section/programming" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            Programming
          </Link>
        </div>

        <div className="flex items-center gap-4">
          {isAuthenticated && (
            <>
              <Link to="/ideas" className="text-muted-foreground hover:text-foreground transition-colors" title="Ideas">
                <Lightbulb className="h-5 w-5" />
              </Link>
              <Link to="/bookmarks" className="text-muted-foreground hover:text-foreground transition-colors" title="Bookmarks">
                <Bookmark className="h-5 w-5" />
              </Link>
            </>
          )}
          
          {isAdmin && (
            <Link to="/admin" className="text-muted-foreground hover:text-foreground transition-colors" title="Admin Dashboard">
              <LayoutDashboard className="h-5 w-5" />
            </Link>
          )}
          
          {isAuthenticated ? (
            <Link 
              to="/profile" 
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
              title={user?.username}
            >
              {isAdmin && <Shield className="h-4 w-4 text-primary" />}
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-medium">
                {user?.username?.charAt(0).toUpperCase()}
              </div>
            </Link>
          ) : (
            <Link 
              to="/login" 
              className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              <LogIn className="h-4 w-4" />
              Sign in
            </Link>
          )}
          
          <button
            onClick={toggleTheme}
            className="text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Toggle theme"
          >
            {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>
        </div>
      </nav>
    </header>
  );
};

export default Header;
