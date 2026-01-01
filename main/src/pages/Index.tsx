import { useQuery } from "@tanstack/react-query";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ArticleCard from "@/components/blog/ArticleCard";
import AdminFAB from "@/components/admin/AdminFAB";
import { fetchFeaturedArticle, fetchLatestArticles, StrapiArticle } from "@/lib/api";
import { getFeaturedArticle, getLatestArticles, Article } from "@/data/articles";
import { Skeleton } from "@/components/ui/skeleton";

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

const Index = () => {
  // Fetch featured article from Strapi
  const { data: strapiFeatured, isLoading: loadingFeatured } = useQuery({
    queryKey: ['featuredArticle'],
    queryFn: fetchFeaturedArticle,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Fetch latest articles from Strapi
  const { data: strapiLatest, isLoading: loadingLatest } = useQuery({
    queryKey: ['latestArticles'],
    queryFn: () => fetchLatestArticles(6),
    staleTime: 1000 * 60 * 5,
  });

  // Use Strapi data if available, fallback to static data
  const featuredArticle = strapiFeatured 
    ? strapiToArticle(strapiFeatured) 
    : getFeaturedArticle();
  
  const latestArticles = strapiLatest && strapiLatest.length > 0
    ? strapiLatest.map(strapiToArticle).filter(a => a.id !== featuredArticle.id).slice(0, 5)
    : getLatestArticles(5).slice(1);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="mx-auto max-w-4xl px-4 py-12">
        {/* Author Intro */}
        <section className="mb-16 text-center">
          <h1 className="mb-4 font-serif text-4xl font-bold leading-tight text-foreground md:text-5xl">
            Where Technology Meets Curiosity
          </h1>
          <p className="mx-auto max-w-2xl font-serif text-lg leading-relaxed text-muted-foreground md:text-xl">
            Exploring the intersection of hardware, software, and security. 
            Deep dives into programming, troubleshooting guides, and insights 
            from the world of cybersecurity.
          </p>
        </section>

        {/* Featured Article */}
        <section className="mb-12">
          <h2 className="mb-6 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Featured
          </h2>
          {loadingFeatured ? (
            <div className="space-y-4">
              <Skeleton className="h-64 w-full" />
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ) : (
            <ArticleCard
              id={featuredArticle.id}
              title={featuredArticle.title}
              excerpt={featuredArticle.excerpt}
              author={featuredArticle.author}
              date={featuredArticle.date}
              readTime={featuredArticle.readTime}
              section={featuredArticle.section}
              imageUrl={featuredArticle.imageUrl || "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&h=500&fit=crop"}
              featured
            />
          )}
        </section>

        {/* Latest Articles */}
        <section>
          <h2 className="mb-6 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Latest Articles
          </h2>
          <div className="divide-y divide-border">
            {loadingLatest ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="py-6 space-y-3">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-1/4" />
                </div>
              ))
            ) : (
              latestArticles.map((article, index) => (
                <ArticleCard
                  key={article.id}
                  id={article.id}
                  title={article.title}
                  excerpt={article.excerpt}
                  author={article.author}
                  date={article.date}
                  readTime={article.readTime}
                  section={article.section}
                  imageUrl={
                    article.imageUrl ||
                    (index === 0
                      ? "https://images.unsplash.com/photo-1595225476474-87563907a212?w=400&h=300&fit=crop"
                      : index === 1
                      ? "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=300&fit=crop"
                      : index === 2
                      ? "https://images.unsplash.com/photo-1629654297299-c8506221ca97?w=400&h=300&fit=crop"
                      : undefined)
                  }
                />
              ))
            )}
          </div>
        </section>
      </main>

      <Footer />
      <AdminFAB />
    </div>
  );
};

export default Index;
