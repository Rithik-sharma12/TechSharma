import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Save } from 'lucide-react';

const STRAPI_URL = import.meta.env.VITE_STRAPI_URL || 'http://localhost:1337';

interface Section {
  id: number;
  documentId: string;
  name: string;
  slug: string;
}

const ArticleEditor = () => {
  const { id } = useParams();
  const isNew = id === 'new';
  const { isAdmin, isAuthenticated, token, user } = useAuth();
  const navigate = useNavigate();

  const [sections, setSections] = useState<Section[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    author: '',
    authorBio: '',
    readTime: '',
    section: '',
    subsection: '',
    imageUrl: '',
    tags: '',
    featured: false,
  });

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    if (!isAdmin) {
      navigate('/');
      return;
    }
    fetchSections();
    if (!isNew && id) {
      fetchArticle(id);
    } else {
      // Set default author for new articles
      setFormData(prev => ({
        ...prev,
        author: user?.username || '',
      }));
    }
  }, [isAuthenticated, isAdmin, navigate, id, isNew, user]);

  const fetchSections = async () => {
    try {
      const res = await fetch(`${STRAPI_URL}/api/sections`);
      if (res.ok) {
        const data = await res.json();
        setSections(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching sections:', error);
    }
  };

  const fetchArticle = async (documentId: string) => {
    setLoading(true);
    try {
      const res = await fetch(`${STRAPI_URL}/api/articles/${documentId}?populate=section`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        const article = data.data;
        setFormData({
          title: article.title || '',
          slug: article.slug || '',
          excerpt: article.excerpt || '',
          content: article.content || '',
          author: article.author || '',
          authorBio: article.authorBio || '',
          readTime: article.readTime || '',
          section: article.section?.documentId || '',
          subsection: article.subsection || '',
          imageUrl: article.imageUrl || '',
          tags: Array.isArray(article.tags) ? article.tags.join(', ') : '',
          featured: article.featured || false,
        });
      }
    } catch (error) {
      console.error('Error fetching article:', error);
      setError('Failed to load article');
    } finally {
      setLoading(false);
    }
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    setFormData(prev => ({
      ...prev,
      title,
      slug: isNew ? generateSlug(title) : prev.slug,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      const tagsArray = formData.tags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag);

      const payload = {
        data: {
          title: formData.title,
          slug: formData.slug,
          excerpt: formData.excerpt,
          content: formData.content,
          author: formData.author,
          authorBio: formData.authorBio,
          readTime: formData.readTime,
          section: formData.section || null,
          subsection: formData.subsection,
          imageUrl: formData.imageUrl,
          tags: tagsArray,
          featured: formData.featured,
        },
      };

      const url = isNew
        ? `${STRAPI_URL}/api/articles`
        : `${STRAPI_URL}/api/articles/${id}`;

      const res = await fetch(url, {
        method: isNew ? 'POST' : 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        navigate('/admin');
      } else {
        const errorData = await res.json();
        setError(errorData.error?.message || 'Failed to save article');
      }
    } catch (error) {
      console.error('Error saving article:', error);
      setError('Network error. Please try again.');
    } finally {
      setSaving(false);
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
        <Button
          variant="ghost"
          onClick={() => navigate('/admin')}
          className="mb-6 flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Button>

        <Card>
          <CardHeader>
            <CardTitle>{isNew ? 'Create New Article' : 'Edit Article'}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-md">
                  {error}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={handleTitleChange}
                    placeholder="Article title"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="slug">Slug *</Label>
                  <Input
                    id="slug"
                    value={formData.slug}
                    onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                    placeholder="article-slug"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="excerpt">Excerpt</Label>
                <Textarea
                  id="excerpt"
                  value={formData.excerpt}
                  onChange={(e) => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
                  placeholder="Brief description of the article..."
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="content">Content *</Label>
                <Textarea
                  id="content"
                  value={formData.content}
                  onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                  placeholder="Write your article content here... (supports Markdown)"
                  rows={15}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="author">Author *</Label>
                  <Input
                    id="author"
                    value={formData.author}
                    onChange={(e) => setFormData(prev => ({ ...prev, author: e.target.value }))}
                    placeholder="Author name"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="readTime">Read Time</Label>
                  <Input
                    id="readTime"
                    value={formData.readTime}
                    onChange={(e) => setFormData(prev => ({ ...prev, readTime: e.target.value }))}
                    placeholder="e.g., 5 min read"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="authorBio">Author Bio</Label>
                <Textarea
                  id="authorBio"
                  value={formData.authorBio}
                  onChange={(e) => setFormData(prev => ({ ...prev, authorBio: e.target.value }))}
                  placeholder="Brief author biography..."
                  rows={2}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="section">Section</Label>
                  <Select
                    value={formData.section}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, section: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a section" />
                    </SelectTrigger>
                    <SelectContent>
                      {sections.map((section) => (
                        <SelectItem key={section.id} value={section.documentId}>
                          {section.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subsection">Subsection</Label>
                  <Input
                    id="subsection"
                    value={formData.subsection}
                    onChange={(e) => setFormData(prev => ({ ...prev, subsection: e.target.value }))}
                    placeholder="e.g., Tutorials"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="imageUrl">Cover Image URL</Label>
                <Input
                  id="imageUrl"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData(prev => ({ ...prev, imageUrl: e.target.value }))}
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="tags">Tags (comma-separated)</Label>
                <Input
                  id="tags"
                  value={formData.tags}
                  onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
                  placeholder="react, typescript, web development"
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="featured"
                  checked={formData.featured}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, featured: checked }))}
                />
                <Label htmlFor="featured">Featured Article</Label>
              </div>

              <div className="flex justify-end gap-4">
                <Button type="button" variant="outline" onClick={() => navigate('/admin')}>
                  Cancel
                </Button>
                <Button type="submit" disabled={saving} className="flex items-center gap-2">
                  <Save className="h-4 w-4" />
                  {saving ? 'Saving...' : isNew ? 'Create Article' : 'Save Changes'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
};

export default ArticleEditor;
