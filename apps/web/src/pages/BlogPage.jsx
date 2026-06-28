import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const WP_API = 'https://blog.infinitypillars.com/wp-json/wp/v2';

function readTime(html = '') {
  return Math.max(1, Math.ceil(html.replace(/<[^>]+>/g, '').split(/\s+/).length / 200));
}
function fmtDate(d) {
  return new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}
function strip(html = '') {
  return html.replace(/<[^>]+>/g, '').trim();
}

/* ── Skeleton ─────────────────────────────────────────── */
function SkeletonCard({ big }) {
  return big ? (
    <div className="grid grid-cols-1 lg:grid-cols-2 border border-border animate-pulse">
      <div className="bg-muted aspect-[4/3] lg:aspect-auto" />
      <div className="p-10 flex flex-col gap-4">
        <div className="h-3 bg-muted w-24" />
        <div className="h-8 bg-muted w-full" />
        <div className="h-8 bg-muted w-3/4" />
        <div className="h-4 bg-muted w-full mt-2" />
        <div className="h-4 bg-muted w-2/3" />
        <div className="h-3 bg-muted w-32 mt-4" />
      </div>
    </div>
  ) : (
    <div className="border border-border animate-pulse">
      <div className="bg-muted aspect-video" />
      <div className="p-6 flex flex-col gap-3">
        <div className="h-3 bg-muted w-20" />
        <div className="h-5 bg-muted w-full" />
        <div className="h-5 bg-muted w-3/4" />
        <div className="h-3 bg-muted w-28 mt-2" />
      </div>
    </div>
  );
}

/* ── Featured Card ────────────────────────────────────── */
function FeaturedCard({ post }) {
  const thumb    = post._embedded?.['wp:featuredmedia']?.[0]?.source_url;
  const category = post._embedded?.['wp:term']?.[0]?.[0]?.name;
  const mins     = readTime(post.content?.rendered);
  const title    = strip(post.title?.rendered);
  const excerpt  = strip(post.excerpt?.rendered).slice(0, 160) + '…';

  return (
    <Link
      to={`/blog/${post.slug}`}
      className="group grid grid-cols-1 lg:grid-cols-[55%_45%] border border-border hover:border-foreground transition-all duration-300 overflow-hidden"
    >
      {/* Image */}
      <div className="relative overflow-hidden bg-muted aspect-[4/3] lg:aspect-auto min-h-[320px]">
        {thumb && (
          <img
            src={thumb}
            alt={title}
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
          />
        )}
        {/* gradient on desktop */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-background/20 hidden lg:block" />
      </div>

      {/* Content */}
      <div className="flex flex-col justify-between p-8 lg:p-12">
        <div className="space-y-4">
          {category && (
            <span className="inline-block text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground border border-border px-3 py-1">
              {category}
            </span>
          )}
          <h2 className="text-3xl lg:text-4xl font-black tracking-tighter leading-[1.08] text-foreground group-hover:text-muted-foreground transition-colors duration-200">
            {title}
          </h2>
          <p className="text-muted-foreground leading-relaxed text-sm lg:text-base">
            {excerpt}
          </p>
        </div>

        <div className="flex items-center justify-between mt-8 pt-6 border-t border-border">
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span>{fmtDate(post.date)}</span>
            <span className="w-px h-3 bg-border" />
            <span>{mins} min read</span>
          </div>
          <span className="text-xs font-black uppercase tracking-widest text-foreground group-hover:translate-x-1 transition-transform duration-200 inline-flex items-center gap-1">
            Read <span>→</span>
          </span>
        </div>
      </div>
    </Link>
  );
}

/* ── Post Card ────────────────────────────────────────── */
function PostCard({ post }) {
  const thumb    = post._embedded?.['wp:featuredmedia']?.[0]?.source_url;
  const category = post._embedded?.['wp:term']?.[0]?.[0]?.name;
  const mins     = readTime(post.content?.rendered);
  const title    = strip(post.title?.rendered);

  return (
    <Link
      to={`/blog/${post.slug}`}
      className="group flex flex-col border border-border hover:border-foreground transition-all duration-300 overflow-hidden"
    >
      {/* Image */}
      <div className="relative overflow-hidden bg-muted aspect-video">
        {thumb ? (
          <img
            src={thumb}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
          />
        ) : (
          <div className="w-full h-full bg-muted flex items-center justify-center">
            <span className="text-muted-foreground/30 text-4xl font-black">{title.charAt(0)}</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-6 gap-3">
        {category && (
          <span className="text-[10px] font-black uppercase tracking-[0.18em] text-muted-foreground">
            {category}
          </span>
        )}
        <h3 className="font-black text-lg tracking-tight leading-snug text-foreground group-hover:text-muted-foreground transition-colors duration-200 line-clamp-3">
          {title}
        </h3>
        <div className="mt-auto pt-4 border-t border-border flex items-center gap-3 text-xs text-muted-foreground">
          <span>{fmtDate(post.date)}</span>
          <span className="w-px h-3 bg-border" />
          <span>{mins} min</span>
        </div>
      </div>
    </Link>
  );
}

/* ── Blog Page ────────────────────────────────────────── */
const BlogPage = () => {
  const [posts, setPosts]               = useState([]);
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState(null);
  const [activeCategory, setActiveCategory] = useState('All');

  useEffect(() => {
    fetch(`${WP_API}/posts?_embed&per_page=30&status=publish`)
      .then(r => r.json())
      .then(data => {
        setPosts(data.filter(p => p.status === 'publish' && p.slug !== 'hello-world'));
        setLoading(false);
      })
      .catch(() => { setError('Could not load posts.'); setLoading(false); });
  }, []);

  const categories = ['All', ...new Set(
    posts.flatMap(p => (p._embedded?.['wp:term']?.[0] ?? []).map(c => c.name))
  )];

  const filtered = activeCategory === 'All'
    ? posts
    : posts.filter(p =>
        (p._embedded?.['wp:term']?.[0] ?? []).some(c => c.name === activeCategory)
      );

  const [featured, ...rest] = filtered;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />

      {/* ── HERO ── */}
      <section className="relative pt-32 pb-16 px-4 sm:px-6 lg:px-16 border-b border-border overflow-hidden">
        {/* decorative grid */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: 'repeating-linear-gradient(hsl(var(--foreground)) 0 1px, transparent 1px 100%), repeating-linear-gradient(90deg, hsl(var(--foreground)) 0 1px, transparent 1px 100%)',
            backgroundSize: '60px 60px',
          }}
        />

        <div className="max-w-7xl mx-auto">
          {/* eyebrow */}
          <p className="text-[10px] font-black uppercase tracking-[0.25em] text-muted-foreground mb-4">
            Infinity Pillars / Insights
          </p>

          {/* title */}
          <h1 className="text-[clamp(4rem,12vw,9rem)] font-black tracking-tighter leading-[0.9] text-foreground mb-6">
            BLOG
          </h1>

          {/* subtitle */}
          <p className="text-muted-foreground text-lg max-w-lg mb-10 leading-relaxed">
            Strategy, technology, and ideas for ambitious brands. Updated weekly.
          </p>

          {/* Category filters */}
          {!loading && categories.length > 1 && (
            <div className="flex flex-wrap gap-2">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-1.5 text-xs font-bold uppercase tracking-widest border transition-all duration-200
                    ${activeCategory === cat
                      ? 'bg-foreground text-background border-foreground'
                      : 'border-border text-muted-foreground hover:border-foreground hover:text-foreground'
                    }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── CONTENT ── */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-16 py-16 space-y-16">

        {/* Error */}
        {error && (
          <p className="text-destructive text-center py-16">{error}</p>
        )}

        {/* Loading */}
        {loading && (
          <div className="space-y-12">
            <SkeletonCard big />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
            </div>
          </div>
        )}

        {/* Posts */}
        {!loading && !error && filtered.length === 0 && (
          <div className="text-center py-24">
            <p className="text-muted-foreground text-lg">No posts in this category yet.</p>
            <button
              onClick={() => setActiveCategory('All')}
              className="mt-4 text-xs font-black uppercase tracking-widest underline"
            >
              View all posts
            </button>
          </div>
        )}

        {!loading && !error && featured && (
          <>
            {/* Featured post */}
            <div>
              <div className="flex items-center gap-4 mb-6">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">
                  Featured
                </p>
                <div className="flex-1 h-px bg-border" />
              </div>
              <FeaturedCard post={featured} />
            </div>

            {/* Rest grid */}
            {rest.length > 0 && (
              <div>
                <div className="flex items-center gap-4 mb-8">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">
                    {activeCategory === 'All' ? 'All Articles' : activeCategory}
                  </p>
                  <div className="flex-1 h-px bg-border" />
                  <span className="text-[10px] font-bold text-muted-foreground">{rest.length}</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {rest.map(p => <PostCard key={p.id} post={p} />)}
                </div>
              </div>
            )}
          </>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default BlogPage;
