// Strapi API configuration
const STRAPI_URL = import.meta.env.VITE_STRAPI_URL || 'http://localhost:1337';

export interface StrapiResponse<T> {
  data: T;
  meta?: {
    pagination?: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

export interface StrapiArticle {
  id: number;
  documentId: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  author: string;
  authorBio: string;
  readTime: string;
  subsection: string;
  imageUrl: string;
  tags: string[];
  featured: boolean;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  section?: {
    id: number;
    documentId: string;
    name: string;
    slug: string;
  };
}

export interface StrapiSection {
  id: number;
  documentId: string;
  name: string;
  slug: string;
  description: string;
  order: number;
}

// Fetch all articles
export async function fetchArticles(): Promise<StrapiArticle[]> {
  try {
    const response = await fetch(
      `${STRAPI_URL}/api/articles?populate=section&sort=createdAt:desc`
    );
    if (!response.ok) throw new Error('Failed to fetch articles');
    const data: StrapiResponse<StrapiArticle[]> = await response.json();
    return data.data || [];
  } catch (error) {
    console.error('Error fetching articles:', error);
    return [];
  }
}

// Fetch article by slug/id
export async function fetchArticleBySlug(slug: string): Promise<StrapiArticle | null> {
  try {
    const response = await fetch(
      `${STRAPI_URL}/api/articles?filters[slug][$eq]=${slug}&populate=section`
    );
    if (!response.ok) throw new Error('Failed to fetch article');
    const data: StrapiResponse<StrapiArticle[]> = await response.json();
    return data.data?.[0] || null;
  } catch (error) {
    console.error('Error fetching article:', error);
    return null;
  }
}

// Fetch articles by section
export async function fetchArticlesBySection(sectionSlug: string): Promise<StrapiArticle[]> {
  try {
    const response = await fetch(
      `${STRAPI_URL}/api/articles?filters[section][slug][$eq]=${sectionSlug}&populate=section&sort=createdAt:desc`
    );
    if (!response.ok) throw new Error('Failed to fetch articles');
    const data: StrapiResponse<StrapiArticle[]> = await response.json();
    return data.data || [];
  } catch (error) {
    console.error('Error fetching articles by section:', error);
    return [];
  }
}

// Fetch featured article
export async function fetchFeaturedArticle(): Promise<StrapiArticle | null> {
  try {
    const response = await fetch(
      `${STRAPI_URL}/api/articles?filters[featured][$eq]=true&populate=section&pagination[limit]=1`
    );
    if (!response.ok) throw new Error('Failed to fetch featured article');
    const data: StrapiResponse<StrapiArticle[]> = await response.json();
    return data.data?.[0] || null;
  } catch (error) {
    console.error('Error fetching featured article:', error);
    return null;
  }
}

// Fetch latest articles
export async function fetchLatestArticles(count: number = 5): Promise<StrapiArticle[]> {
  try {
    const response = await fetch(
      `${STRAPI_URL}/api/articles?populate=section&sort=createdAt:desc&pagination[limit]=${count}`
    );
    if (!response.ok) throw new Error('Failed to fetch articles');
    const data: StrapiResponse<StrapiArticle[]> = await response.json();
    return data.data || [];
  } catch (error) {
    console.error('Error fetching latest articles:', error);
    return [];
  }
}

// Fetch all sections
export async function fetchSections(): Promise<StrapiSection[]> {
  try {
    const response = await fetch(
      `${STRAPI_URL}/api/sections?sort=order:asc`
    );
    if (!response.ok) throw new Error('Failed to fetch sections');
    const data: StrapiResponse<StrapiSection[]> = await response.json();
    return data.data || [];
  } catch (error) {
    console.error('Error fetching sections:', error);
    return [];
  }
}
