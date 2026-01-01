import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, User, Shield, LogOut, Settings, BookOpen, Edit } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";

const Profile = () => {
  const { user, isAuthenticated, isAdmin, logout, isLoading } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="mx-auto max-w-2xl px-4 py-12">
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="mx-auto max-w-md px-4 py-12">
          <div className="rounded-lg border border-border bg-card p-8 text-center">
            <User className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
            <h1 className="mb-2 font-serif text-2xl font-bold text-foreground">
              Sign in to view your profile
            </h1>
            <p className="mb-6 text-muted-foreground">
              Access your saved articles, manage comments, and more.
            </p>
            <div className="flex flex-col gap-3">
              <Button asChild className="w-full">
                <Link to="/login">Sign in</Link>
              </Button>
              <Button asChild variant="outline" className="w-full">
                <Link to="/register">Create account</Link>
              </Button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="mx-auto max-w-2xl px-4 py-12">
        <Link
          to="/"
          className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to home
        </Link>

        {/* Profile Header */}
        <div className="rounded-lg border border-border bg-card p-6 mb-6">
          <div className="flex items-start gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground text-2xl font-bold">
              {user?.username?.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1">
              <h1 className="font-serif text-2xl font-bold text-foreground">
                {user?.username}
              </h1>
              <p className="text-muted-foreground">{user?.email}</p>
              <div className="mt-2 flex items-center gap-2">
                {isAdmin ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                    <Shield className="h-3 w-3" />
                    Admin
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
                    <User className="h-3 w-3" />
                    User
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid gap-4 md:grid-cols-2">
          <Link
            to="/bookmarks"
            className="flex items-center gap-4 rounded-lg border border-border bg-card p-4 hover:bg-accent transition-colors"
          >
            <BookOpen className="h-8 w-8 text-primary" />
            <div>
              <h3 className="font-medium text-foreground">Saved Articles</h3>
              <p className="text-sm text-muted-foreground">View your bookmarked articles</p>
            </div>
          </Link>

          {isAdmin && (
            <>
              <a
                href="http://localhost:1337/admin"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 rounded-lg border border-border bg-card p-4 hover:bg-accent transition-colors"
              >
                <Settings className="h-8 w-8 text-primary" />
                <div>
                  <h3 className="font-medium text-foreground">Admin Panel</h3>
                  <p className="text-sm text-muted-foreground">Manage content in Strapi</p>
                </div>
              </a>

              <Link
                to="/admin/articles"
                className="flex items-center gap-4 rounded-lg border border-border bg-card p-4 hover:bg-accent transition-colors"
              >
                <Edit className="h-8 w-8 text-primary" />
                <div>
                  <h3 className="font-medium text-foreground">Manage Articles</h3>
                  <p className="text-sm text-muted-foreground">Create, edit, delete articles</p>
                </div>
              </Link>
            </>
          )}
        </div>

        {/* Logout */}
        <div className="mt-8">
          <Button variant="outline" onClick={handleLogout} className="w-full">
            <LogOut className="mr-2 h-4 w-4" />
            Sign out
          </Button>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Profile;
