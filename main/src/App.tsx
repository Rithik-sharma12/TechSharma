import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import Index from "./pages/Index";
import Article from "./pages/Article";
import Section from "./pages/Section";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import AdminDashboard from "./pages/AdminDashboard";
import ArticleEditor from "./pages/ArticleEditor";
import Bookmarks from "./pages/Bookmarks";
import Ideas from "./pages/Ideas";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Index />} />
            <Route path="/article/:id" element={<Article />} />
            <Route path="/section/:section" element={<Section />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* Authenticated User Routes */}
            <Route path="/profile" element={
              <ProtectedRoute requireAuth>
                <Profile />
              </ProtectedRoute>
            } />
            <Route path="/bookmarks" element={
              <ProtectedRoute requireAuth>
                <Bookmarks />
              </ProtectedRoute>
            } />
            <Route path="/ideas" element={
              <ProtectedRoute requireAuth>
                <Ideas />
              </ProtectedRoute>
            } />
            
            {/* Admin Only Routes - CRUD Operations */}
            <Route path="/admin" element={
              <ProtectedRoute requireAdmin>
                <AdminDashboard />
              </ProtectedRoute>
            } />
            <Route path="/admin/article/:id" element={
              <ProtectedRoute requireAdmin>
                <ArticleEditor />
              </ProtectedRoute>
            } />
            
            {/* Catch-all */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
