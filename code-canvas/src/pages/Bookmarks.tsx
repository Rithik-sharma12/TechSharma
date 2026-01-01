import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Bookmark, Trash2, ExternalLink } from 'lucide-react';

const STRAPI_URL = import.meta.env.VITE_STRAPI_URL || 'http://localhost:1337';

interface BookmarkedArticle {
  id: number;
  documentId: string;
  article: {
    id: number;
    documentId: string;
    title: string;
    slug: string;
    excerpt: string;
    author: string;
    readTime: string;
    imageUrl: string;
  };
}

const Bookmarks = () => {
  const { isAuthenticated, token, user } = useAuth();
  const navigate = useNavigate();
  const [bookmarks, setBookmarks] = useState<BookmarkedArticle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    fetchBookmarks();
  }, [isAuthenticated, navigate]);

  const fetchBookmarks = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `${STRAPI_URL}/api/bookmarks?filters[user][id][$eq]=${user?.id}&populate=article`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.ok) {
        const data = await res.json();
        setBookmarks(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching bookmarks:', error);
    } finally {
      setLoading(false);
    }
  };

  const removeBookmark = async (documentId: string) => {
    try {
      const res = await fetch(`${STRAPI_URL}/api/bookmarks/${documentId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        setBookmarks(bookmarks.filter((b) => b.documentId !== documentId));
      }
    } catch (error) {
      console.error('Error removing bookmark:', error);
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
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-8">
          <Bookmark className="h-8 w-8 text-gray-700" />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Bookmarks</h1>
            <p className="text-gray-600">Articles you've saved for later</p>
          </div>
        </div>

        {bookmarks.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Bookmark className="h-12 w-12 mx-auto text-gray-300 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No bookmarks yet</h3>
              <p className="text-gray-500 mb-4">
                Start saving articles by clicking the bookmark icon on any article
              </p>
              <Button onClick={() => navigate('/')}>Browse Articles</Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {bookmarks.map((bookmark) => (
              <Card key={bookmark.id} className="overflow-hidden hover:shadow-md transition-shadow">
                <CardContent className="p-0">
                  <div className="flex">
                    {bookmark.article?.imageUrl && (
                      <div className="w-48 h-32 flex-shrink-0">
                        <img
                          src={bookmark.article.imageUrl}
                          alt={bookmark.article.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div className="flex-1 p-4 flex flex-col justify-between">
                      <div>
                        <h3 className="font-semibold text-lg text-gray-900 mb-1 line-clamp-1">
                          {bookmark.article?.title || 'Untitled'}
                        </h3>
                        <p className="text-gray-600 text-sm line-clamp-2 mb-2">
                          {bookmark.article?.excerpt}
                        </p>
                        <div className="flex items-center text-sm text-gray-500 gap-4">
                          <span>{bookmark.article?.author}</span>
                          <span>{bookmark.article?.readTime}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 mt-3">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => navigate(`/article/${bookmark.article?.slug}`)}
                          className="flex items-center gap-1"
                        >
                          <ExternalLink className="h-4 w-4" />
                          Read
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => removeBookmark(bookmark.documentId)}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Bookmarks;
