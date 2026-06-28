import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const WP_API = 'https://blog.infinitypillars.com/wp-json/wp/v2';

const BlogPage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`${WP_API}/posts?_embed&per_page=20`)
      .then(res => res.json())
      .then(data => { setPosts(data); setLoading(false); })
      .catch(() => { setError('Failed to load posts.'); setLoading(false); });
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-24">
        <div className="mb-16">
          <h1 className="text-5xl md:text-6xl font-bold tracking-tighter mb-4">Blog</h1>
          <p className="text-muted-foreground text-lg">Insights on growth, marketing, and strategy.</p>
        </div>

        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="space-y-4 animate-pulse">
                <div className="h-48 bg-muted rounded-none" />
                <div className="h-4 bg-muted w-1/3" />
                <div className="h-6 bg-muted w-full" />
                <div className="h-4 bg-muted w-2/3" />
              </div>
            ))}
          </div>
        )}

        {error && <p className="text-destructive">{error}</p>}

        {!loading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map(post => {
              const thumbnail = post._embedded?.['wp:featuredmedia']?.[0]?.source_url;
              const category = post._embedded?.['wp:term']?.[0]?.[0]?.name;
              const date = new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

              return (
                <Link key={post.id} to={`/blog/${post.slug}`} className="group block border border-border hover:border-foreground transition-all duration-300">
                  {thumbnail && (
                    <div className="overflow-hidden h-48">
                      <img
                        src={thumbnail}
                        alt={post.title.rendered}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  )}
                  <div className="p-6 space-y-3">
                    {category && (
                      <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                        {category}
                      </span>
                    )}
                    <h2
                      className="text-xl font-bold tracking-tight group-hover:text-muted-foreground transition-colors duration-200"
                      dangerouslySetInnerHTML={{ __html: post.title.rendered }}
                    />
                    <div
                      className="text-sm text-muted-foreground line-clamp-2"
                      dangerouslySetInnerHTML={{ __html: post.excerpt.rendered }}
                    />
                    <p className="text-xs text-muted-foreground/60">{date}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default BlogPage;
