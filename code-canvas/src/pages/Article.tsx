import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Share2, Bookmark, Twitter, Linkedin } from "lucide-react";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ReadingProgress from "@/components/blog/ReadingProgress";
import CodeBlock from "@/components/blog/CodeBlock";
import { getArticleById, Article as ArticleType } from "@/data/articles";
import { fetchArticleBySlug, StrapiArticle } from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";

// Helper to convert Strapi article to UI format
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

const strapiToArticle = (article: StrapiArticle): ArticleType => ({
  id: article.slug || article.documentId,
  title: article.title,
  excerpt: article.excerpt || '',
  content: article.content || '',
  author: article.author || 'Anonymous',
  authorBio: article.authorBio || '',
  date: formatDate(article.publishedAt || article.createdAt),
  readTime: article.readTime || '5 min read',
  section: article.section?.name || 'General',
  subsection: article.subsection,
  imageUrl: article.imageUrl,
  tags: article.tags || [],
});

// Helper function to parse inline markdown (bold, italic, inline code)
const parseInlineMarkdown = (text: string): React.ReactNode[] => {
  const result: React.ReactNode[] = [];
  // Match **bold**, *italic*, and `code`
  const regex = /(\*\*(.+?)\*\*|\*(.+?)\*|`([^`]+)`)/g;
  let lastIndex = 0;
  let match;
  let keyIndex = 0;

  while ((match = regex.exec(text)) !== null) {
    // Add text before the match
    if (match.index > lastIndex) {
      result.push(text.slice(lastIndex, match.index));
    }

    if (match[2]) {
      // Bold text **text**
      result.push(<strong key={keyIndex++}>{match[2]}</strong>);
    } else if (match[3]) {
      // Italic text *text*
      result.push(<em key={keyIndex++}>{match[3]}</em>);
    } else if (match[4]) {
      // Inline code `code`
      result.push(
        <code key={keyIndex++} className="bg-muted px-1.5 py-0.5 rounded font-mono text-sm">
          {match[4]}
        </code>
      );
    }

    lastIndex = regex.lastIndex;
  }

  // Add remaining text
  if (lastIndex < text.length) {
    result.push(text.slice(lastIndex));
  }

  return result.length > 0 ? result : [text];
};

const Article = () => {
  const { id } = useParams<{ id: string }>();
  const [isBookmarked, setIsBookmarked] = useState(false);

  // Fetch article from Strapi
  const { data: strapiArticle, isLoading } = useQuery({
    queryKey: ['article', id],
    queryFn: () => fetchArticleBySlug(id || ''),
    staleTime: 1000 * 60 * 5,
    enabled: !!id,
  });

  // Use Strapi data if available, fallback to static data
  const article = strapiArticle 
    ? strapiToArticle(strapiArticle) 
    : getArticleById(id || "");

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="mx-auto max-w-3xl px-4 py-12">
          <Skeleton className="h-4 w-32 mb-8" />
          <Skeleton className="h-10 w-3/4 mb-4" />
          <Skeleton className="h-6 w-1/2 mb-8" />
          <div className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="mx-auto max-w-3xl px-4 py-20 text-center">
          <h1 className="mb-4 font-serif text-3xl font-bold text-foreground">
            Article Not Found
          </h1>
          <p className="mb-8 text-muted-foreground">
            The article you're looking for doesn't exist.
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  // Parse content and render code blocks
  const renderContent = (content: string) => {
    const parts = content.split(/(```[\s\S]*?```)/g);
    
    return parts.map((part, index) => {
      if (part.startsWith("```")) {
        const match = part.match(/```(\w+)?\n([\s\S]*?)```/);
        if (match) {
          const [, language, code] = match;
          return <CodeBlock key={index} code={code.trim()} language={language || "text"} />;
        }
      }
      
      // Convert markdown-style content to paragraphs
      const lines = part.split("\n\n");
      return lines.map((line, lineIndex) => {
        if (line.startsWith("## ")) {
          return (
            <h2
              key={`${index}-${lineIndex}`}
              className="mb-4 mt-10 font-sans text-2xl font-bold text-foreground"
            >
              {line.replace("## ", "")}
            </h2>
          );
        }
        if (line.startsWith("### ")) {
          return (
            <h3
              key={`${index}-${lineIndex}`}
              className="mb-3 mt-8 font-sans text-xl font-semibold text-foreground"
            >
              {line.replace("### ", "")}
            </h3>
          );
        }
        if (line.startsWith("- ")) {
          const items = line.split("\n").filter(l => l.startsWith("- "));
          return (
            <ul key={`${index}-${lineIndex}`} className="mb-6 ml-6 list-disc space-y-2">
              {items.map((item, i) => (
                <li key={i} className="font-serif text-lg leading-relaxed text-foreground">
                  {parseInlineMarkdown(item.replace("- ", ""))}
                </li>
              ))}
            </ul>
          );
        }
        if (line.trim() && !line.startsWith("1.") && !line.match(/^\d+\./)) {
          return (
            <p
              key={`${index}-${lineIndex}`}
              className="mb-6 font-serif text-lg leading-[1.8] text-foreground"
            >
              {parseInlineMarkdown(line)}
            </p>
          );
        }
        // Numbered lists
        if (line.match(/^\d+\./)) {
          const items = line.split("\n").filter(l => l.match(/^\d+\./));
          return (
            <ol key={`${index}-${lineIndex}`} className="mb-6 ml-6 list-decimal space-y-2">
              {items.map((item, i) => (
                <li key={i} className="font-serif text-lg leading-relaxed text-foreground">
                  {parseInlineMarkdown(item.replace(/^\d+\.\s*/, ""))}
                </li>
              ))}
            </ol>
          );
        }
        return null;
      });
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <ReadingProgress />
      
      <article className="mx-auto max-w-3xl px-4 py-12">
        {/* Back Link */}
        <Link
          to="/"
          className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to articles
        </Link>

        {/* Article Header */}
        <header className="mb-10">
          <div className="mb-4 flex items-center gap-3">
            <Link
              to={`/section/${article.section.toLowerCase()}`}
              className="text-sm font-medium uppercase tracking-wider text-primary hover:text-primary/80 transition-colors"
            >
              {article.section}
            </Link>
            {article.subsection && (
              <>
                <span className="text-muted-foreground">·</span>
                <span className="text-sm text-muted-foreground">{article.subsection}</span>
              </>
            )}
          </div>
          
          <h1 className="mb-6 font-serif text-3xl font-bold leading-tight text-foreground md:text-4xl lg:text-[2.75rem]">
            {article.title}
          </h1>
          
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 overflow-hidden rounded-full bg-muted">
                <div className="flex h-full w-full items-center justify-center text-lg font-semibold text-muted-foreground">
                  {article.author.charAt(0)}
                </div>
              </div>
              <div>
                <p className="font-medium text-foreground">{article.author}</p>
                <p className="text-sm text-muted-foreground">
                  {article.date} · {article.readTime}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsBookmarked(!isBookmarked)}
                className={`transition-colors ${isBookmarked ? "text-primary" : "text-muted-foreground hover:text-foreground"}`}
                aria-label={isBookmarked ? "Remove bookmark" : "Add bookmark"}
              >
                <Bookmark className={`h-5 w-5 ${isBookmarked ? "fill-current" : ""}`} />
              </button>
              <button
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Share on Twitter"
              >
                <Twitter className="h-5 w-5" />
              </button>
              <button
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Share on LinkedIn"
              >
                <Linkedin className="h-5 w-5" />
              </button>
              <button
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Share"
              >
                <Share2 className="h-5 w-5" />
              </button>
            </div>
          </div>
        </header>

        {/* Article Content */}
        <div className="prose-custom">
          {renderContent(article.content)}
        </div>

        {/* Tags */}
        <div className="mt-12 border-t border-border pt-8">
          <div className="flex flex-wrap gap-2">
            {article.tags.map((tag) => (
              <span
                key={tag}
                className="bg-muted px-3 py-1 text-sm font-medium text-muted-foreground"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>

        {/* Author Bio */}
        <div className="mt-8 border-t border-border pt-8">
          <div className="flex items-start gap-4">
            <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-full bg-muted">
              <div className="flex h-full w-full items-center justify-center text-xl font-semibold text-muted-foreground">
                {article.author.charAt(0)}
              </div>
            </div>
            <div>
              <p className="mb-1 font-semibold text-foreground">Written by {article.author}</p>
              <p className="text-muted-foreground">{article.authorBio}</p>
            </div>
          </div>
        </div>
      </article>

      <Footer />
    </div>
  );
};

export default Article;
