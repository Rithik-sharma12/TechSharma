import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, Eye, Lightbulb, Users } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

const STRAPI_URL = import.meta.env.VITE_STRAPI_URL || 'http://localhost:1337';

interface Article {
  id: number;
  documentId: string;
  title: string;
  slug: string;
  author: string;
  featured: boolean;
  createdAt: string;
  section?: {
    name: string;
  };
}

interface Idea {
  id: number;
  documentId: string;
  title: string;
  status: string;
  category: string;
  user?: {
    username: string;
  };
  createdAt: string;
}

const AdminDashboard = () => {
  const { isAdmin, isAuthenticated, token } = useAuth();
  const navigate = useNavigate();
  const [articles, setArticles] = useState<Article[]>([]);
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'articles' | 'ideas'>('articles');

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    if (!isAdmin) {
      navigate('/');
      return;
    }
    fetchData();
  }, [isAuthenticated, isAdmin, navigate]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [articlesRes, ideasRes] = await Promise.all([
        fetch(`${STRAPI_URL}/api/articles?populate=section&sort=createdAt:desc`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${STRAPI_URL}/api/ideas?populate=user&sort=createdAt:desc`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      if (articlesRes.ok) {
        const articlesData = await articlesRes.json();
        setArticles(articlesData.data || []);
      }

      if (ideasRes.ok) {
        const ideasData = await ideasRes.json();
        setIdeas(ideasData.data || []);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteArticle = async (documentId: string) => {
    try {
      const res = await fetch(`${STRAPI_URL}/api/articles/${documentId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        setArticles(articles.filter((a) => a.documentId !== documentId));
      }
    } catch (error) {
      console.error('Error deleting article:', error);
    }
  };

  const handleUpdateIdeaStatus = async (documentId: string, status: string) => {
    try {
      const res = await fetch(`${STRAPI_URL}/api/ideas/${documentId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ data: { status } }),
      });

      if (res.ok) {
        setIdeas(ideas.map((idea) => 
          idea.documentId === documentId ? { ...idea, status } : idea
        ));
      }
    } catch (error) {
      console.error('Error updating idea:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-500';
      case 'rejected': return 'bg-red-500';
      case 'implemented': return 'bg-blue-500';
      default: return 'bg-yellow-500';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-600 mt-1">Manage articles, ideas, and users</p>
          </div>
          <Button onClick={() => navigate('/admin/article/new')} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            New Article
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Articles</CardTitle>
              <Eye className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{articles.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Pending Ideas</CardTitle>
              <Lightbulb className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {ideas.filter((i) => i.status === 'pending').length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Ideas</CardTitle>
              <Users className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{ideas.length}</div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-6">
          <Button
            variant={activeTab === 'articles' ? 'default' : 'outline'}
            onClick={() => setActiveTab('articles')}
          >
            Articles
          </Button>
          <Button
            variant={activeTab === 'ideas' ? 'default' : 'outline'}
            onClick={() => setActiveTab('ideas')}
          >
            User Ideas
          </Button>
        </div>

        {/* Articles Table */}
        {activeTab === 'articles' && (
          <Card>
            <CardHeader>
              <CardTitle>All Articles</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Author</TableHead>
                    <TableHead>Section</TableHead>
                    <TableHead>Featured</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {articles.map((article) => (
                    <TableRow key={article.id}>
                      <TableCell className="font-medium">{article.title}</TableCell>
                      <TableCell>{article.author}</TableCell>
                      <TableCell>{article.section?.name || '-'}</TableCell>
                      <TableCell>
                        {article.featured && <Badge>Featured</Badge>}
                      </TableCell>
                      <TableCell>
                        {new Date(article.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => navigate(`/article/${article.slug}`)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => navigate(`/admin/article/${article.documentId}`)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button size="sm" variant="destructive">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete Article?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  This action cannot be undone. This will permanently delete the article.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDeleteArticle(article.documentId)}
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                  {articles.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                        No articles yet. Create your first article!
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}

        {/* Ideas Table */}
        {activeTab === 'ideas' && (
          <Card>
            <CardHeader>
              <CardTitle>User Ideas & Suggestions</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {ideas.map((idea) => (
                    <TableRow key={idea.id}>
                      <TableCell className="font-medium">{idea.title}</TableCell>
                      <TableCell className="capitalize">{idea.category}</TableCell>
                      <TableCell>{idea.user?.username || 'Anonymous'}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(idea.status)}>
                          {idea.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {new Date(idea.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleUpdateIdeaStatus(idea.documentId, 'approved')}
                            disabled={idea.status === 'approved'}
                          >
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleUpdateIdeaStatus(idea.documentId, 'rejected')}
                            disabled={idea.status === 'rejected'}
                          >
                            Reject
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                  {ideas.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                        No ideas submitted yet.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default AdminDashboard;
