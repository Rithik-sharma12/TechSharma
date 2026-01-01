import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Bookmark, BookmarkCheck, Share2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const STRAPI_URL = import.meta.env.VITE_STRAPI_URL || 'http://localhost:1337';

interface ArticleActionsProps {
  articleId: number;
  articleDocumentId: string;
  articleTitle: string;
  articleSlug: string;
  showLabels?: boolean;
}

const ArticleActions = ({
  articleId,
  articleDocumentId,
  articleTitle,
  articleSlug,
  showLabels = false,
}: ArticleActionsProps) => {
  const { isAuthenticated, token, user } = useAuth();
  const { toast } = useToast();
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [bookmarkDocId, setBookmarkDocId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated && user?.id && articleId) {
      checkBookmarkStatus();
    }
  }, [isAuthenticated, user?.id, articleId]);

  const checkBookmarkStatus = async () => {
    try {
      const res = await fetch(
        `${STRAPI_URL}/api/bookmarks?filters[user][id][$eq]=${user?.id}&filters[article][id][$eq]=${articleId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.ok) {
        const data = await res.json();
        if (data.data && data.data.length > 0) {
          setIsBookmarked(true);
          setBookmarkDocId(data.data[0].documentId);
        }
      }
    } catch (error) {
      console.error('Error checking bookmark status:', error);
    }
  };

  const handleBookmark = async () => {
    if (!isAuthenticated) {
      toast({
        title: 'Sign in required',
        description: 'Please sign in to bookmark articles',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    try {
      if (isBookmarked && bookmarkDocId) {
        // Remove bookmark
        const res = await fetch(`${STRAPI_URL}/api/bookmarks/${bookmarkDocId}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.ok) {
          setIsBookmarked(false);
          setBookmarkDocId(null);
          toast({
            title: 'Bookmark removed',
            description: 'Article removed from your bookmarks',
          });
        }
      } else {
        // Add bookmark
        const res = await fetch(`${STRAPI_URL}/api/bookmarks`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            data: {
              user: user?.id,
              article: articleId,
            },
          }),
        });

        if (res.ok) {
          const data = await res.json();
          setIsBookmarked(true);
          setBookmarkDocId(data.data.documentId);
          toast({
            title: 'Bookmarked!',
            description: 'Article saved to your bookmarks',
          });
        }
      }
    } catch (error) {
      console.error('Error toggling bookmark:', error);
      toast({
        title: 'Error',
        description: 'Failed to update bookmark',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleShare = async () => {
    const url = `${window.location.origin}/article/${articleSlug}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: articleTitle,
          url: url,
        });
      } catch (error) {
        // User cancelled or error
        if ((error as Error).name !== 'AbortError') {
          copyToClipboard(url);
        }
      }
    } else {
      copyToClipboard(url);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: 'Link copied!',
      description: 'Article link copied to clipboard',
    });
  };

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="ghost"
        size={showLabels ? 'default' : 'icon'}
        onClick={handleBookmark}
        disabled={loading}
        className={isBookmarked ? 'text-blue-600' : ''}
      >
        {isBookmarked ? (
          <BookmarkCheck className="h-5 w-5" />
        ) : (
          <Bookmark className="h-5 w-5" />
        )}
        {showLabels && <span className="ml-2">{isBookmarked ? 'Saved' : 'Save'}</span>}
      </Button>
      <Button
        variant="ghost"
        size={showLabels ? 'default' : 'icon'}
        onClick={handleShare}
      >
        <Share2 className="h-5 w-5" />
        {showLabels && <span className="ml-2">Share</span>}
      </Button>
    </div>
  );
};

export default ArticleActions;
