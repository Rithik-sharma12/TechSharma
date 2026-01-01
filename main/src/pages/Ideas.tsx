import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Lightbulb, Plus, Send, ThumbsUp } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

const STRAPI_URL = import.meta.env.VITE_STRAPI_URL || 'http://localhost:1337';

interface Idea {
  id: number;
  documentId: string;
  title: string;
  content: string;
  status: string;
  category: string;
  votes: number;
  createdAt: string;
  user?: {
    id: number;
    username: string;
  };
}

const Ideas = () => {
  const { isAuthenticated, token, user } = useAuth();
  const navigate = useNavigate();
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [myIdeas, setMyIdeas] = useState<Idea[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [newIdea, setNewIdea] = useState({
    title: '',
    content: '',
    category: 'feature',
  });

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    fetchIdeas();
  }, [isAuthenticated, navigate]);

  const fetchIdeas = async () => {
    setLoading(true);
    try {
      // Fetch all approved ideas
      const allRes = await fetch(
        `${STRAPI_URL}/api/ideas?filters[status][$eq]=approved&populate=user&sort=votes:desc`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Fetch user's own ideas
      const myRes = await fetch(
        `${STRAPI_URL}/api/ideas?filters[user][id][$eq]=${user?.id}&populate=user&sort=createdAt:desc`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (allRes.ok) {
        const allData = await allRes.json();
        setIdeas(allData.data || []);
      }

      if (myRes.ok) {
        const myData = await myRes.json();
        setMyIdeas(myData.data || []);
      }
    } catch (error) {
      console.error('Error fetching ideas:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitIdea = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const res = await fetch(`${STRAPI_URL}/api/ideas`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          data: {
            title: newIdea.title,
            content: newIdea.content,
            category: newIdea.category,
            status: 'pending',
            user: user?.id,
            votes: 0,
          },
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setMyIdeas([data.data, ...myIdeas]);
        setNewIdea({ title: '', content: '', category: 'feature' });
        setIsDialogOpen(false);
      }
    } catch (error) {
      console.error('Error submitting idea:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleVote = async (idea: Idea) => {
    try {
      const res = await fetch(`${STRAPI_URL}/api/ideas/${idea.documentId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          data: { votes: idea.votes + 1 },
        }),
      });

      if (res.ok) {
        setIdeas(ideas.map((i) => 
          i.documentId === idea.documentId ? { ...i, votes: i.votes + 1 } : i
        ));
      }
    } catch (error) {
      console.error('Error voting:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'implemented': return 'bg-blue-100 text-blue-800';
      default: return 'bg-yellow-100 text-yellow-800';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'feature': return '✨';
      case 'improvement': return '📈';
      case 'bug': return '🐛';
      case 'content': return '📝';
      default: return '💡';
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
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Lightbulb className="h-8 w-8 text-yellow-500" />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Ideas & Suggestions</h1>
              <p className="text-gray-600">Share your ideas to improve the platform</p>
            </div>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Submit Idea
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Submit a New Idea</DialogTitle>
                <DialogDescription>
                  Share your suggestion or idea with the community
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmitIdea} className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="idea-title">Title</Label>
                  <Input
                    id="idea-title"
                    value={newIdea.title}
                    onChange={(e) => setNewIdea({ ...newIdea, title: e.target.value })}
                    placeholder="A brief title for your idea"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="idea-category">Category</Label>
                  <Select
                    value={newIdea.category}
                    onValueChange={(value) => setNewIdea({ ...newIdea, category: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="feature">✨ New Feature</SelectItem>
                      <SelectItem value="improvement">📈 Improvement</SelectItem>
                      <SelectItem value="bug">🐛 Bug Report</SelectItem>
                      <SelectItem value="content">📝 Content Idea</SelectItem>
                      <SelectItem value="other">💡 Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="idea-content">Description</Label>
                  <Textarea
                    id="idea-content"
                    value={newIdea.content}
                    onChange={(e) => setNewIdea({ ...newIdea, content: e.target.value })}
                    placeholder="Describe your idea in detail..."
                    rows={5}
                    required
                  />
                </div>
                <div className="flex justify-end gap-3">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={submitting} className="flex items-center gap-2">
                    <Send className="h-4 w-4" />
                    {submitting ? 'Submitting...' : 'Submit'}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <Tabs defaultValue="community" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="community">Community Ideas</TabsTrigger>
            <TabsTrigger value="my-ideas">My Ideas ({myIdeas.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="community">
            {ideas.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <Lightbulb className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No approved ideas yet</h3>
                  <p className="text-gray-500">Be the first to share an idea!</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {ideas.map((idea) => (
                  <Card key={idea.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-xl">{getCategoryIcon(idea.category)}</span>
                            <h3 className="font-semibold text-lg text-gray-900">{idea.title}</h3>
                          </div>
                          <p className="text-gray-600 mb-3 line-clamp-2">{idea.content}</p>
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <span>By {idea.user?.username || 'Anonymous'}</span>
                            <span>{new Date(idea.createdAt).toLocaleDateString()}</span>
                            <Badge className={getStatusColor(idea.status)}>{idea.status}</Badge>
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleVote(idea)}
                          className="flex items-center gap-2 ml-4"
                        >
                          <ThumbsUp className="h-4 w-4" />
                          {idea.votes}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="my-ideas">
            {myIdeas.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <Lightbulb className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No ideas submitted yet</h3>
                  <p className="text-gray-500 mb-4">Share your first idea with the community</p>
                  <Button onClick={() => setIsDialogOpen(true)}>Submit an Idea</Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {myIdeas.map((idea) => (
                  <Card key={idea.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-xl">{getCategoryIcon(idea.category)}</span>
                            <h3 className="font-semibold text-lg text-gray-900">{idea.title}</h3>
                            <Badge className={getStatusColor(idea.status)}>{idea.status}</Badge>
                          </div>
                          <p className="text-gray-600 mb-3">{idea.content}</p>
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <span>{new Date(idea.createdAt).toLocaleDateString()}</span>
                            <span className="flex items-center gap-1">
                              <ThumbsUp className="h-3 w-3" /> {idea.votes} votes
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>
      <Footer />
    </div>
  );
};

export default Ideas;
