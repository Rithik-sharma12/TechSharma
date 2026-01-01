import { useParams, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ArticleCard from "@/components/blog/ArticleCard";
import AdminFAB from "@/components/admin/AdminFAB";
import { getArticlesBySection, articles, Article } from "@/data/articles";
import { fetchArticlesBySection, StrapiArticle } from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";

const sectionDescriptions: Record<string, string> = {
  hardware: "Deep dives into computer hardware, DIY projects, and the physical side of technology.",
  software: "Exploring operating systems, development tools, and the software that powers our world.",
  security: "Cybersecurity insights, vulnerability research, and staying safe in a digital world.",
  programming: "Programming languages, paradigms, and the art of writing better code.",
};

// Helper to convert Strapi article to UI format
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

const strapiToArticle = (article: StrapiArticle): Article => ({
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

const Section = () => {
  const { section } = useParams<{ section: string }>();
  
  // Fetch articles from Strapi
  const { data: strapiArticles, isLoading } = useQuery({
    queryKey: ['sectionArticles', section],
    queryFn: () => fetchArticlesBySection(section || ''),
    staleTime: 1000 * 60 * 5,
    enabled: !!section,
  });

  // Use Strapi data if available, fallback to static data
  const sectionArticles = strapiArticles && strapiArticles.length > 0
    ? strapiArticles.map(strapiToArticle)
    : getArticlesBySection(section || "");
  
  const sectionTitle = section ? section.charAt(0).toUpperCase() + section.slice(1) : "";
  const description = sectionDescriptions[section?.toLowerCase() || ""] || "";

  const sectionImages: Record<string, string[]> = {
    hardware: [
      "https://images.unsplash.com/photo-1595225476474-87563907a212?w=400&h=300&fit=crop",
    ],
    software: [
      "https://images.unsplash.com/photo-1629654297299-c8506221ca97?w=400&h=300&fit=crop",
    ],
    security: [
      "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=400&h=300&fit=crop",
    ],
    programming: [
      "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=300&fit=crop",
    ],
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="mx-auto max-w-4xl px-4 py-12">
        <Link
          to="/"
          className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to home
        </Link>

        <header className="mb-12">
          <h1 className="mb-4 font-serif text-4xl font-bold text-foreground">
            {sectionTitle}
          </h1>
          {description && (
            <p className="max-w-2xl font-serif text-lg text-muted-foreground">
              {description}
            </p>
          )}
        </header>

        {isLoading ? (
          <div className="grid gap-8 md:grid-cols-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="border border-border bg-card p-6">
                <Skeleton className="h-40 w-full mb-4" />
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))}
          </div>
        ) : sectionArticles.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-lg text-muted-foreground">
              No articles in this section yet. Check back soon!
            </p>
          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-2">
            {sectionArticles.map((article, index) => (
              <article
                key={article.id}
                className="group border border-border bg-card p-6 transition-shadow hover:shadow-md"
              >
                <Link to={`/article/${article.id}`}>
                  <div className="mb-4 aspect-video overflow-hidden bg-muted">
                    {sectionImages[section?.toLowerCase() || ""]?.[index % sectionImages[section?.toLowerCase() || ""].length] ? (
                      <img
                        src={sectionImages[section?.toLowerCase() || ""][index % sectionImages[section?.toLowerCase() || ""].length]}
                        alt={article.title}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                        No image
                      </div>
                    )}
                  </div>
                </Link>
                <div className="mb-2 flex items-center gap-2 text-sm text-muted-foreground">
                  <span>{article.readTime}</span>
                  {article.subsection && (
                    <>
                      <span>·</span>
                      <span>{article.subsection}</span>
                    </>
                  )}
                </div>
                <Link to={`/article/${article.id}`}>
                  <h2 className="mb-2 font-serif text-xl font-bold leading-tight text-foreground transition-colors group-hover:text-primary">
                    {article.title}
                  </h2>
                </Link>
                <p className="mb-4 font-serif text-base leading-relaxed text-muted-foreground line-clamp-3">
                  {article.excerpt}
                </p>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span className="font-medium text-foreground">{article.author}</span>
                  <span>·</span>
                  <time>{article.date}</time>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>

      <Footer />
      <AdminFAB />
    </div>
  );
};

export default Section;
