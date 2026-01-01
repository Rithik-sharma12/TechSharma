import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Edit, Trash2, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
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
import { useToast } from '@/hooks/use-toast';

const STRAPI_URL = import.meta.env.VITE_STRAPI_URL || 'http://localhost:1337';

interface AdminArticleControlsProps {
  articleDocumentId: string;
  articleSlug: string;
  articleTitle: string;
  onDelete?: () => void;
  variant?: 'floating' | 'inline' | 'card';
}

/**
 * Admin controls for articles (Edit/Delete)
 * Only visible to admin users
 */
const AdminArticleControls = ({
  articleDocumentId,
  articleSlug,
  articleTitle,
  onDelete,
  variant = 'inline',
}: AdminArticleControlsProps) => {
  const { isAdmin, token } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  if (!isAdmin) return null;

  const handleDelete = async () => {
    try {
      const res = await fetch(`${STRAPI_URL}/api/articles/${articleDocumentId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        toast({
          title: 'Article deleted',
          description: `"${articleTitle}" has been removed.`,
        });
        onDelete?.();
        navigate('/');
      } else {
        throw new Error('Failed to delete');
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete article',
        variant: 'destructive',
      });
    }
  };

  if (variant === 'floating') {
    return (
      <div className="fixed bottom-24 right-6 z-50 flex flex-col gap-2">
        <Button
          size="icon"
          variant="secondary"
          className="h-12 w-12 rounded-full shadow-lg"
          asChild
        >
          <Link to={`/admin/article/${articleDocumentId}`}>
            <Edit className="h-5 w-5" />
          </Link>
        </Button>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              size="icon"
              variant="destructive"
              className="h-12 w-12 rounded-full shadow-lg"
            >
              <Trash2 className="h-5 w-5" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Article?</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete "{articleTitle}"? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    );
  }

  if (variant === 'card') {
    return (
      <div className="flex items-center gap-1">
        <Button size="icon" variant="ghost" className="h-8 w-8" asChild>
          <Link to={`/admin/article/${articleDocumentId}`}>
            <Edit className="h-4 w-4" />
          </Link>
        </Button>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive hover:text-destructive">
              <Trash2 className="h-4 w-4" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Article?</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete "{articleTitle}"? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    );
  }

  // Inline variant (default)
  return (
    <div className="flex items-center gap-2 border-t border-border pt-4 mt-4">
      <span className="text-sm text-muted-foreground mr-2">Admin:</span>
      <Button size="sm" variant="outline" asChild>
        <Link to={`/admin/article/${articleDocumentId}`}>
          <Edit className="h-4 w-4 mr-2" />
          Edit Article
        </Link>
      </Button>
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button size="sm" variant="destructive">
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Article?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{articleTitle}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminArticleControls;
