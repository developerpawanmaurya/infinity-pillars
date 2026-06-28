import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const WP_API = 'https://blog.infinitypillars.com/wp-json/wp/v2';

const BlogPostPage = () => {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`${WP_API}/posts?slug=${slug}&_embed`)
      .then(res => res.json())
      .then(data => {
        if (data.length === 0) { setError('Post not found.'); }
        else { setPost(data[0]); }
        setLoading(false);
      })
      .catch(() => { setError('Failed to load post.'); setLoading(false); });
  }, [slug]);

  if (loading) return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-24 animate-pulse space-y-6">
        <div className="h-4 bg-muted w-1/4" />
        <div className="h-10 bg-muted w-3/4" />
        <div className="h-64 bg-muted" />
        <div className="space-y-3">
          {[...Array(8)].map((_, i) => <div key={i} className="h-4 bg-muted" />)}
        </div>
      </main>
      <Footer />
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="max-w-3xl mx-auto px-4 pt-32 pb-24 text-center">
        <p className="text-destructive mb-4">{error}</p>
        <Link to="/blog" className="text-sm underline">← Back to Blog</Link>
      </main>
      <Footer />
    </div>
  );

  const thumbnail = post._embedded?.['wp:featuredmedia']?.[0]?.source_url;
  const category = post._embedded?.['wp:term']?.[0]?.[0]?.name;
  const date = new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-24">

        <Link to="/blog" className="text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors duration-200 mb-10 inline-block">
          ← Back to Blog
        </Link>

        <div className="space-y-6 mb-10">
          {category && (
            <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
              {category}
            </span>
          )}
          <h1
            className="text-4xl md:text-5xl font-bold tracking-tighter leading-tight"
            dangerouslySetInnerHTML={{ __html: post.title.rendered }}
          />
          <p className="text-sm text-muted-foreground">{date}</p>
        </div>

        {thumbnail && (
          <img
            src={thumbnail}
            alt={post.title.rendered}
            className="w-full h-72 object-cover mb-10"
          />
        )}

        <div
          className="prose prose-neutral max-w-none
            prose-headings:font-bold prose-headings:tracking-tight
            prose-p:text-muted-foreground prose-p:leading-relaxed
            prose-a:text-foreground prose-a:underline
            prose-img:rounded-none prose-img:w-full"
          dangerouslySetInnerHTML={{ __html: post.content.rendered }}
        />

      </main>
      <Footer />
    </div>
  );
};

export default BlogPostPage;
