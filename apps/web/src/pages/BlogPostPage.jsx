import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const WP_API = 'https://blog.infinitypillars.com/wp-json/wp/v2';

/* ── helpers ─────────────────────────────────────────────────── */
function readingTime(html) {
  const words = html.replace(/<[^>]+>/g, '').trim().split(/\s+/).length;
  return Math.ceil(words / 200);
}

function addIds(html) {
  let i = 0;
  return html.replace(/<(h[23])([^>]*)>/gi, (_, tag, attrs) => `<${tag}${attrs} id="h-${i++}">`);
}

function extractHeadings(html) {
  const tmp = document.createElement('div');
  tmp.innerHTML = html;
  return Array.from(tmp.querySelectorAll('h2,h3')).map((el, i) => ({
    id: `h-${i}`, text: el.textContent.trim(), level: +el.tagName[1],
  }));
}

function extractFAQs(html) {
  const tmp = document.createElement('div');
  tmp.innerHTML = html;
  const faqs = [];
  const sel = tmp.querySelector('.faq-section,[id*="faq"],[class*="faq"]');
  const root = sel || tmp;
  root.querySelectorAll('h3,h4').forEach(q => {
    let ans = q.nextElementSibling;
    if (ans) faqs.push({ q: q.textContent.trim(), a: ans.textContent.trim() });
  });
  return faqs;
}

function buildArticleSchema(post, url, thumbnail, faqs) {
  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Article',
        '@id': `${url}#article`,
        headline: post.title.rendered.replace(/<[^>]+>/g, ''),
        description: post.excerpt.rendered.replace(/<[^>]+>/g, '').trim(),
        image: thumbnail ? { '@type': 'ImageObject', url: thumbnail } : undefined,
        datePublished: post.date,
        dateModified: post.modified || post.date,
        author: { '@type': 'Organization', name: 'Infinity Pillars' },
        publisher: {
          '@type': 'Organization',
          name: 'Infinity Pillars',
          logo: { '@type': 'ImageObject', url: 'https://infinitypillars.com/logo.png' },
        },
        mainEntityOfPage: { '@type': 'WebPage', '@id': url },
      },
      ...(faqs.length ? [{
        '@type': 'FAQPage',
        '@id': `${url}#faq`,
        mainEntity: faqs.map(f => ({
          '@type': 'Question',
          name: f.q,
          acceptedAnswer: { '@type': 'Answer', text: f.a },
        })),
      }] : []),
    ],
  };
  return JSON.stringify(schema);
}

/* ── sub-components ──────────────────────────────────────────── */
function ProgressBar() {
  const [pct, setPct] = useState(0);
  useEffect(() => {
    const fn = () => {
      const el = document.documentElement;
      setPct((el.scrollTop / (el.scrollHeight - el.clientHeight)) * 100);
    };
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);
  return (
    <div className="fixed top-0 left-0 right-0 z-[100] h-[3px] bg-transparent">
      <div
        className="h-full bg-foreground transition-all duration-75"
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

function TOC({ headings, activeId }) {
  if (!headings.length) return null;
  return (
    <nav className="space-y-1">
      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-4">
        Contents
      </p>
      {headings.map((h) => (
        <a
          key={h.id}
          href={`#${h.id}`}
          onClick={e => {
            e.preventDefault();
            document.getElementById(h.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }}
          className={`flex items-start gap-3 py-1.5 text-sm transition-all duration-200 group
            ${h.level === 3 ? 'pl-4' : ''}
            ${activeId === h.id ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
        >
          <span className={`mt-[6px] shrink-0 w-4 h-[1px] transition-all duration-200
            ${activeId === h.id ? 'bg-foreground w-6' : 'bg-border group-hover:bg-muted-foreground'}`} />
          <span className="leading-snug">{h.text}</span>
        </a>
      ))}
    </nav>
  );
}

function FAQAccordion({ faqs }) {
  const [open, setOpen] = useState(null);
  if (!faqs.length) return null;
  return (
    <section className="mt-20 border-t border-border pt-12">
      <h2 className="text-3xl font-black tracking-tighter mb-8">
        Frequently Asked Questions
      </h2>
      <div className="space-y-0 divide-y divide-border">
        {faqs.map((f, i) => (
          <div key={i}>
            <button
              onClick={() => setOpen(open === i ? null : i)}
              className="w-full flex items-center justify-between py-5 text-left gap-4 group"
            >
              <span className="font-semibold text-base leading-snug group-hover:text-muted-foreground transition-colors">
                {f.q}
              </span>
              <span className={`shrink-0 w-5 h-5 border border-border flex items-center justify-center
                text-xs transition-transform duration-300 ${open === i ? 'rotate-45' : ''}`}>
                +
              </span>
            </button>
            <div className={`overflow-hidden transition-all duration-300 ${open === i ? 'max-h-96 pb-5' : 'max-h-0'}`}>
              <p className="text-muted-foreground leading-relaxed text-sm">{f.a}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function ShareBar({ title, url }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  const tweet = `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`;
  return (
    <div className="flex items-center gap-3 mt-10 pt-8 border-t border-border">
      <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mr-2">Share</span>
      <a href={tweet} target="_blank" rel="noreferrer"
        className="px-4 py-2 text-xs font-bold uppercase tracking-widest border border-border hover:bg-foreground hover:text-background transition-all duration-200">
        𝕏 Twitter
      </a>
      <button onClick={copy}
        className="px-4 py-2 text-xs font-bold uppercase tracking-widest border border-border hover:bg-foreground hover:text-background transition-all duration-200">
        {copied ? '✓ Copied' : 'Copy Link'}
      </button>
    </div>
  );
}

/* ── skeleton ────────────────────────────────────────────────── */
function Skeleton() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="h-[70vh] bg-muted animate-pulse" />
      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-16 grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-16">
        <div className="space-y-4 animate-pulse">
          {[...Array(12)].map((_, i) => (
            <div key={i} className={`h-4 bg-muted ${i % 3 === 2 ? 'w-2/3' : 'w-full'}`} />
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
}

/* ── main page ───────────────────────────────────────────────── */
const BlogPostPage = () => {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeId, setActiveId] = useState('');
  const contentRef = useRef(null);

  useEffect(() => {
    setLoading(true);
    fetch(`${WP_API}/posts?slug=${slug}&_embed`)
      .then(r => r.json())
      .then(data => {
        if (!data.length) setError('Post not found.');
        else setPost(data[0]);
        setLoading(false);
      })
      .catch(() => { setError('Failed to load post.'); setLoading(false); });
  }, [slug]);

  // active TOC heading on scroll
  useEffect(() => {
    if (!post) return;
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(e => { if (e.isIntersecting) setActiveId(e.target.id); });
      },
      { rootMargin: '-20% 0px -70% 0px' }
    );
    document.querySelectorAll('h2[id],h3[id]').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, [post]);

  if (loading) return <Skeleton />;

  if (error) return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="max-w-3xl mx-auto px-4 pt-40 pb-24 text-center">
        <p className="text-destructive mb-6 text-lg">{error}</p>
        <Link to="/blog" className="text-xs font-black uppercase tracking-widest underline">← Back to Blog</Link>
      </main>
      <Footer />
    </div>
  );

  const thumbnail   = post._embedded?.['wp:featuredmedia']?.[0]?.source_url;
  const categories  = post._embedded?.['wp:term']?.[0] ?? [];
  const tags        = post._embedded?.['wp:term']?.[1] ?? [];
  const category    = categories[0]?.name;
  const minutes     = readingTime(post.content.rendered);
  const date        = new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  const titleClean  = post.title.rendered.replace(/<[^>]+>/g, '');
  const contentWithIds = addIds(post.content.rendered);
  const headings    = extractHeadings(contentWithIds);
  const faqs        = extractFAQs(post.content.rendered);
  const pageUrl     = window.location.href;

  return (
    <>
      <Helmet>
        <title>{titleClean} | Infinity Pillars Blog</title>
        <meta name="description" content={post.excerpt.rendered.replace(/<[^>]+>/g, '').trim()} />
        <meta property="og:title" content={titleClean} />
        <meta property="og:description" content={post.excerpt.rendered.replace(/<[^>]+>/g, '').trim()} />
        {thumbnail && <meta property="og:image" content={thumbnail} />}
        <script type="application/ld+json">{buildArticleSchema(post, pageUrl, thumbnail, faqs)}</script>
      </Helmet>

      <ProgressBar />
      <Header />

      {/* ── HERO ── */}
      <section className="relative w-full h-[85vh] min-h-[500px] overflow-hidden">
        {thumbnail
          ? <img src={thumbnail} alt={titleClean} className="absolute inset-0 w-full h-full object-cover scale-105" />
          : <div className="absolute inset-0 bg-muted" />
        }
        {/* gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/10" />

        {/* breadcrumb */}
        <div className="absolute top-28 left-0 right-0 px-6 lg:px-16">
          <Link to="/blog"
            className="inline-flex items-center gap-2 text-white/60 hover:text-white text-xs font-bold uppercase tracking-widest transition-colors">
            <span>←</span> Blog
          </Link>
        </div>

        {/* hero content */}
        <div className="absolute bottom-0 left-0 right-0 px-6 lg:px-16 pb-14">
          <div className="max-w-4xl">
            {category && (
              <span className="inline-block mb-4 px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] border border-white/30 text-white/80 bg-white/10 backdrop-blur-sm">
                {category}
              </span>
            )}
            <h1
              className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter leading-[1.05] text-white mb-6"
              dangerouslySetInnerHTML={{ __html: post.title.rendered }}
            />
            <div className="flex items-center gap-6 text-white/60 text-sm">
              <span>{date}</span>
              <span className="w-px h-4 bg-white/20" />
              <span>{minutes} min read</span>
              {tags.length > 0 && (
                <>
                  <span className="w-px h-4 bg-white/20" />
                  <span>{tags.slice(0, 2).map(t => t.name).join(', ')}</span>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── BODY ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-16">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_260px] gap-0 lg:gap-20 py-16">

          {/* article */}
          <article ref={contentRef}>
            <div
              className="
                prose prose-neutral dark:prose-invert max-w-none
                prose-headings:font-black prose-headings:tracking-tighter prose-headings:scroll-mt-24
                prose-h2:text-3xl prose-h2:mt-14 prose-h2:mb-4 prose-h2:border-t prose-h2:border-border prose-h2:pt-10
                prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3
                prose-p:text-base prose-p:leading-[1.85] prose-p:text-foreground/80
                prose-a:text-foreground prose-a:underline prose-a:decoration-border hover:prose-a:decoration-foreground
                prose-strong:text-foreground prose-strong:font-bold
                prose-blockquote:border-l-2 prose-blockquote:border-foreground prose-blockquote:pl-6 prose-blockquote:not-italic prose-blockquote:text-muted-foreground
                prose-img:w-full prose-img:rounded-none prose-img:my-10
                prose-code:text-sm prose-code:bg-muted prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-none prose-code:font-mono
                prose-pre:rounded-none prose-pre:bg-muted prose-pre:border prose-pre:border-border
                prose-ul:space-y-1 prose-ol:space-y-1
                prose-li:text-foreground/80
                prose-hr:border-border prose-hr:my-12
              "
              dangerouslySetInnerHTML={{ __html: contentWithIds }}
            />

            <FAQAccordion faqs={faqs} />

            {/* tags */}
            {tags.length > 0 && (
              <div className="mt-12 flex flex-wrap gap-2">
                {tags.map(t => (
                  <span key={t.id} className="px-3 py-1 text-xs font-bold uppercase tracking-widest border border-border text-muted-foreground hover:border-foreground hover:text-foreground transition-all duration-200 cursor-default">
                    {t.name}
                  </span>
                ))}
              </div>
            )}

            <ShareBar title={titleClean} url={pageUrl} />

            <div className="mt-10">
              <Link to="/blog"
                className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors duration-200">
                ← All Articles
              </Link>
            </div>
          </article>

          {/* sticky TOC sidebar */}
          <aside className="hidden lg:block">
            <div className="sticky top-28 pt-2">
              <TOC headings={headings} activeId={activeId} />
            </div>
          </aside>

        </div>
      </div>

      {/* ── NEWSLETTER CTA ── */}
      <section className="border-t border-border bg-muted/40">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 py-20 text-center">
          <p className="text-[10px] font-black uppercase tracking-[0.25em] text-muted-foreground mb-4">
            Infinity Pillars / Weekly
          </p>
          <h2 className="text-4xl md:text-5xl font-black tracking-tighter mb-4">
            Stay ahead of the curve.
          </h2>
          <p className="text-muted-foreground max-w-md mx-auto mb-10 leading-relaxed">
            Get our weekly roundup of the strategies and insights that are actually moving the needle for digital brands.
          </p>
          <Link
            to="/#booking"
            className="inline-flex items-center gap-3 px-8 py-4 bg-foreground text-background text-xs font-black uppercase tracking-widest hover:opacity-85 transition-opacity duration-200"
          >
            Work with us <span>→</span>
          </Link>
        </div>
      </section>

      <Footer />
    </>
  );
};

export default BlogPostPage;
