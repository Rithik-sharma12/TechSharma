import { Link } from "react-router-dom";
import ArticleActions from "./ArticleActions";

interface ArticleCardProps {
  id: string;
  numericId?: number;
  documentId?: string;
  title: string;
  excerpt: string;
  author: string;
  date: string;
  readTime: string;
  section: string;
  featured?: boolean;
  imageUrl?: string;
}

const ArticleCard = ({
  id,
  numericId,
  documentId,
  title,
  excerpt,
  author,
  date,
  readTime,
  section,
  featured = false,
  imageUrl,
}: ArticleCardProps) => {

  if (featured) {
    return (
      <article className="group relative overflow-hidden border-b border-border pb-8">
        <div className="flex flex-col gap-6 md:flex-row md:gap-8">
          {imageUrl && (
            <Link to={`/article/${id}`} className="md:w-2/5 flex-shrink-0">
              <div className="aspect-[16/10] overflow-hidden">
                <img
                  src={imageUrl}
                  alt={title}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                />
              </div>
            </Link>
          )}
          <div className="flex flex-col justify-center md:w-3/5">
            <div className="mb-3 flex items-center gap-3">
              <Link
                to={`/section/${section.toLowerCase()}`}
                className="text-xs font-medium uppercase tracking-wider text-primary hover:text-primary/80 transition-colors"
              >
                {section}
              </Link>
              <span className="text-muted-foreground">·</span>
              <span className="text-sm text-muted-foreground">{readTime}</span>
            </div>
            <Link to={`/article/${id}`}>
              <h2 className="mb-3 font-serif text-2xl font-bold leading-tight text-foreground transition-colors group-hover:text-primary md:text-3xl">
                {title}
              </h2>
            </Link>
            <p className="mb-4 font-serif text-lg leading-relaxed text-muted-foreground line-clamp-3">
              {excerpt}
            </p>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span className="font-medium text-foreground">{author}</span>
                <span>·</span>
                <time>{date}</time>
              </div>
              {numericId && documentId && (
                <ArticleActions
                  articleId={numericId}
                  articleDocumentId={documentId}
                  articleTitle={title}
                  articleSlug={id}
                />
              )}
            </div>
          </div>
        </div>
      </article>
    );
  }

  return (
    <article className="group border-b border-border py-6 last:border-0">
      <div className="flex gap-6">
        <div className="flex-1">
          <div className="mb-2 flex items-center gap-3">
            <Link
              to={`/section/${section.toLowerCase()}`}
              className="text-xs font-medium uppercase tracking-wider text-primary hover:text-primary/80 transition-colors"
            >
              {section}
            </Link>
            <span className="text-muted-foreground">·</span>
            <span className="text-sm text-muted-foreground">{readTime}</span>
          </div>
          <Link to={`/article/${id}`}>
            <h3 className="mb-2 font-serif text-xl font-bold leading-tight text-foreground transition-colors group-hover:text-primary">
              {title}
            </h3>
          </Link>
          <p className="mb-3 font-serif text-base leading-relaxed text-muted-foreground line-clamp-2">
            {excerpt}
          </p>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span className="font-medium text-foreground">{author}</span>
              <span>·</span>
              <time>{date}</time>
            </div>
            {numericId && documentId && (
              <ArticleActions
                articleId={numericId}
                articleDocumentId={documentId}
                articleTitle={title}
                articleSlug={id}
              />
            )}
          </div>
        </div>
        {imageUrl && (
          <Link to={`/article/${id}`} className="hidden flex-shrink-0 sm:block">
            <div className="h-24 w-32 overflow-hidden">
              <img
                src={imageUrl}
                alt={title}
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
              />
            </div>
          </Link>
        )}
      </div>
    </article>
  );
};

export default ArticleCard;
