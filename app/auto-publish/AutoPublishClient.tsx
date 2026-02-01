'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Logo from '../components/ui/Logo';
import s from './auto-publish.module.css';

/* ═══════════════════════════════════════════════════════════
   DATA
   ═══════════════════════════════════════════════════════════ */

const PAIN_POINTS = [
  {
    icon: '\u{1F4B8}',
    title: 'Content Is Expensive',
    desc: 'Hiring writers costs \u20AC500\u20132,000 per article. Most ecommerce teams can\u2019t sustain weekly publishing at that rate.',
  },
  {
    icon: '\u23F3',
    title: 'Consistency Is Hard',
    desc: 'One post, then silence for months. Google rewards freshness signals \u2014 sporadic content hurts your domain authority.',
  },
  {
    icon: '\u{1F9E9}',
    title: 'SEO Knowledge Gap',
    desc: 'Writing content is one thing. Structuring it with proper H-tags, meta data, keyword density, and internal links requires SEO expertise.',
  },
];

const STEPS = [
  {
    num: '01',
    title: 'Configure Your AI Agent',
    desc: 'Set expertise, tone, target keywords and audience. The AI learns your brand voice and content strategy.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
      </svg>
    ),
  },
  {
    num: '02',
    title: 'Smart Content Generation',
    desc: 'AI researches trending topics, writes 1,500+ word articles with proper heading structure, internal links, and schema markup.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2L2 7l10 5 10-5-10-5z" />
        <path d="M2 17l10 5 10-5" />
        <path d="M2 12l10 5 10-5" />
      </svg>
    ),
  },
  {
    num: '03',
    title: 'Automatic Publishing',
    desc: 'Set your schedule \u2014 daily, every 3 days, weekly. Posts go live automatically on your blog without manual intervention.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    ),
  },
  {
    num: '04',
    title: 'SEO Optimization Built-In',
    desc: 'Meta titles, descriptions, keyword density, readability scores, and alt-text \u2014 all optimized automatically before every publish.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
      </svg>
    ),
  },
];

const CAPABILITIES = [
  {
    title: 'AI Content Writer',
    gradient: 'linear-gradient(135deg, #A855F7, #C084FC)',
    items: ['Claude AI writes long-form articles', 'Brand voice & tone matching', 'Automatic topic research', 'Human-quality readability'],
  },
  {
    title: 'Smart Scheduling',
    gradient: 'linear-gradient(135deg, #0EA5E9, #38BDF8)',
    items: ['Daily, weekly, or custom intervals', 'Timezone-aware publishing', 'Queue management', 'Holiday & blackout dates'],
  },
  {
    title: 'SEO Optimization',
    gradient: 'linear-gradient(135deg, #10B981, #34D399)',
    items: ['Meta title & description generation', 'Keyword density analysis', 'Internal linking suggestions', 'Schema markup (JSON-LD)'],
  },
  {
    title: 'Multi-Agent Support',
    gradient: 'linear-gradient(135deg, #F59E0B, #FBBF24)',
    items: ['Run multiple content agents', 'Different expertise per agent', 'Separate keyword strategies', 'Portfolio-wide management'],
  },
  {
    title: 'Analytics Dashboard',
    gradient: 'linear-gradient(135deg, #EF4444, #F87171)',
    items: ['Posts published & scheduled', 'Word count & quality metrics', 'SEO score tracking', 'Content performance overview'],
  },
  {
    title: 'Platform Integration',
    gradient: 'linear-gradient(135deg, #8B5CF6, #A78BFA)',
    items: ['Headless CMS / custom blog', 'WordPress plugin (coming soon)', 'Shopify integration (coming soon)', 'REST API access'],
  },
];

const TICKER_ITEMS = [
  '500+ Posts Published',
  '15+ Active Brands',
  '34% Avg Traffic Growth',
  '1,247 Avg Words/Post',
  '92% SEO Score Average',
  '\u20AC0.03/word vs \u20AC0.30 agency',
  '24/7 Autopilot Publishing',
  'Zero Writer Management',
];

const ROADMAP = [
  {
    status: 'live',
    label: 'LIVE',
    title: 'AI Content Generation + Auto-Publishing',
    items: ['Claude AI-powered article writing', 'Configurable agent persona & tone', 'Cron-based auto-publish scheduling', 'Full SEO meta generation', 'Admin dashboard for management'],
  },
  {
    status: 'progress',
    label: 'IN PROGRESS',
    title: 'WordPress & Shopify Integrations',
    items: ['One-click WordPress plugin', 'Shopify blog connector', 'WooCommerce product-aware content', 'Automatic internal linking'],
  },
  {
    status: 'planned',
    label: 'PLANNED',
    title: 'Competitor Analysis + Content Gaps',
    items: ['Automated competitor blog monitoring', 'Content gap detection', 'Keyword opportunity scoring', 'Smart topic prioritization'],
  },
  {
    status: 'vision',
    label: 'VISION',
    title: 'Multi-Language + A/B Testing',
    items: ['Publish in 20+ languages', 'Title & meta A/B testing', 'AI-driven performance optimization', 'Automated content refresh'],
  },
];

const PRICING = [
  {
    name: 'Starter',
    price: '\u20AC99',
    period: '/mo',
    desc: 'Perfect for single-brand ecommerce stores starting their SEO content journey.',
    features: ['1 AI Agent', '10 posts / month', 'Basic SEO optimization', 'Auto-publish scheduling', 'Email support'],
    cta: 'Start Free Trial',
    highlighted: false,
  },
  {
    name: 'Growth',
    price: '\u20AC249',
    period: '/mo',
    desc: 'For growing brands that want aggressive organic traffic growth across multiple topics.',
    features: ['3 AI Agents', '30 posts / month', 'Advanced SEO + schema markup', 'Analytics dashboard', 'Priority support', 'Custom keyword strategies'],
    cta: 'Start Free Trial',
    highlighted: true,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    period: '',
    desc: 'For agencies and multi-brand portfolios needing full control and custom integrations.',
    features: ['Unlimited AI Agents', 'Unlimited posts', 'WordPress + Shopify plugins', 'Dedicated account manager', 'Custom API integrations', 'SLA guarantee'],
    cta: 'Book a Call',
    highlighted: false,
  },
];

const FAQ_DATA = [
  {
    q: 'How does the AI generate content?',
    a: 'We use Anthropic\u2019s Claude AI to research topics in your niche, then write long-form articles (1,200\u20132,000+ words) with proper heading structure, meta data, keywords, and readability optimization. Each agent is configured with your brand\u2019s expertise, tone, and target audience.',
  },
  {
    q: 'Will Google penalize AI-generated content?',
    a: 'Google\u2019s official stance is that AI content is fine as long as it\u2019s helpful, original, and provides value to users. Our AI produces human-quality articles focused on genuinely useful information \u2014 not thin, spammy content. We optimize for E-E-A-T signals.',
  },
  {
    q: 'Can I review and edit posts before publishing?',
    a: 'Yes. You can set your agent to \u201Cdraft\u201D mode, where posts are generated but held for your review. You can edit title, content, keywords, and meta data before approving for publication. Or use \u201Cauto-publish\u201D to go fully hands-off.',
  },
  {
    q: 'What platforms are supported?',
    a: 'Currently we support headless CMS and custom blog integrations via our REST API. WordPress plugin and Shopify blog connector are in active development and will launch soon.',
  },
  {
    q: 'How does the scheduling work?',
    a: 'You set an interval (daily, every 2 days, every 3 days, weekly, biweekly, or monthly) and a preferred publishing hour. Our system automatically generates and publishes content at your chosen schedule, with timezone support.',
  },
  {
    q: 'Is there a free trial?',
    a: 'Yes. You get a 14-day free trial with full access to all features on the Growth plan. No credit card required to start. You can generate and publish up to 10 posts during the trial period.',
  },
  {
    q: 'How is this different from ChatGPT or other AI writers?',
    a: 'Unlike generic AI writing tools, Auto-Publish is a complete SEO content engine. It doesn\u2019t just write \u2014 it researches topics, optimizes for search engines, generates meta data, manages scheduling, and publishes automatically. It\u2019s the difference between a word processor and a full marketing department.',
  },
];

/* ═══════════════════════════════════════════════════════════
   DEMO TAB DATA
   ═══════════════════════════════════════════════════════════ */

const DEMO_CONFIGURE = {
  agentName: 'Ecommerce SEO Expert',
  tags: ['conversion optimization', 'retention marketing', 'ecommerce growth', 'CRM strategy'],
  tone: 'Professional & Analytical',
};

const DEMO_GENERATE = {
  title: 'How Customer Retention Drives 5x More Revenue Than Acquisition',
  meta: 'Learn why investing in customer retention delivers dramatically higher ROI than acquisition spending, backed by data from 200+ ecommerce brands.',
  keywords: ['customer retention', 'ecommerce revenue', 'CLV optimization', 'retention marketing'],
};

const DEMO_PUBLISH = {
  stats: { published: 47, scheduled: 3, avgWords: 1247, seoScore: 94 },
  nextPost: 'In 2 days, 10:00 CET',
};

const DEMO_TABS = [
  { id: 'configure', label: 'Configure Agent' },
  { id: 'generate', label: 'Generate Content' },
  { id: 'publish', label: 'Auto-Publish' },
];

/* ═══════════════════════════════════════════════════════════
   COMPONENT
   ═══════════════════════════════════════════════════════════ */

export default function AutoPublishClient() {
  const [demoTab, setDemoTab] = useState(0);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [expandedRoadmap, setExpandedRoadmap] = useState<number | null>(0);
  const [revealed, setRevealed] = useState(false);
  const timelineRef = useRef<HTMLDivElement>(null);

  // Trial form state
  const [trialForm, setTrialForm] = useState({ company: '', email: '', website: '', cms: '', message: '' });
  const [trialLoading, setTrialLoading] = useState(false);
  const [trialSuccess, setTrialSuccess] = useState(false);
  const [trialError, setTrialError] = useState('');

  async function handleTrialSubmit(e: React.FormEvent) {
    e.preventDefault();
    setTrialLoading(true);
    setTrialError('');
    try {
      const res = await fetch('/api/auto-publish-trial', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(trialForm),
      });
      if (!res.ok) throw new Error('Failed to submit');
      setTrialSuccess(true);
    } catch {
      setTrialError('Something went wrong. Please try again or email us directly.');
    } finally {
      setTrialLoading(false);
    }
  }

  // IntersectionObserver for timeline reveal
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !revealed) {
            revealSteps();
            setRevealed(true);
          }
        });
      },
      { threshold: 0.15 }
    );

    const el = timelineRef.current;
    if (el) observer.observe(el);
    return () => {
      if (el) observer.unobserve(el);
    };
  }, [revealed]);

  function revealSteps() {
    const steps = document.querySelectorAll(`.${s.step}`);
    steps.forEach((step, i) => {
      setTimeout(() => step.classList.add(s.stepRevealed), i * 350);
    });
  }

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className={s.page}>
      {/* ─── HEADER ─── */}
      <header className={s.header}>
        <div className={s.headerInner}>
          <Logo />
          <nav className={s.nav}>
            <a href="#features" className={s.navLink}>Features</a>
            <a href="#pricing" className={s.navLink}>Pricing</a>
            <Link href="/blog" className={s.navLink}>Blog</Link>
          </nav>
          <a
            href="https://calendly.com/rafaloleksiakconsulting/30min"
            target="_blank"
            rel="noopener noreferrer"
            className={s.headerCta}
          >
            Book a Demo
          </a>
        </div>
      </header>

      {/* ─── HERO ─── */}
      <section className={s.hero}>
        <div className={s.floatingShapes}>
          <div className={s.shape1} />
          <div className={s.shape2} />
          <div className={s.shape3} />
        </div>
        <div className={s.heroContent}>
          <span className={s.badge}>AI-POWERED SEO TOOL</span>
          <h1 className={s.heroTitle}>
            Stop Writing Blog Posts.<br />
            <span className={s.gradientText}>Let AI Publish Content That Ranks.</span>
          </h1>
          <p className={s.heroSub}>
            Automated SEO content engine for ecommerce brands. AI writes, optimizes,
            and publishes &mdash; you get organic traffic growth without lifting a finger.
          </p>
          <div className={s.heroCtas}>
            <button onClick={() => scrollTo('trial')} className={s.ctaPrimary}>
              Start Free Trial &rarr;
            </button>
            <button onClick={() => scrollTo('demo')} className={s.ctaGhost}>
              See How It Works &darr;
            </button>
          </div>
          <p className={s.trustLine}>
            Trusted by 15+ ecommerce brands &middot; 500+ posts published &middot; Avg. 34% organic traffic increase
          </p>
        </div>
      </section>

      {/* ─── PROBLEM / SOLUTION ─── */}
      <section className={s.section}>
        <div className={s.container}>
          <h2 className={s.sectionTitle}>
            The SEO Content <span className={s.gradientText}>Problem</span>
          </h2>
          <p className={s.sectionSub}>
            Most ecommerce teams know they need blog content for SEO. Few can execute consistently.
          </p>
          <div className={s.painGrid}>
            {PAIN_POINTS.map((p, i) => (
              <div key={i} className={s.painCard}>
                <span className={s.painIcon}>{p.icon}</span>
                <h3 className={s.painTitle}>{p.title}</h3>
                <p className={s.painDesc}>{p.desc}</p>
              </div>
            ))}
          </div>
          <div className={s.breakerLine} />
          <p className={s.solutionText}>
            What if your blog wrote itself &mdash;{' '}
            <span className={s.gradientText}>and actually drove traffic?</span>
          </p>
        </div>
      </section>

      {/* ─── LIVE DEMO ─── */}
      <section id="demo" className={s.section}>
        <div className={s.container}>
          <h2 className={s.sectionTitle}>
            See It <span className={s.gradientText}>In Action</span>
          </h2>
          <p className={s.sectionSub}>
            Three steps from configuration to published, SEO-optimized content.
          </p>
          <div className={s.demoCard}>
            <div className={s.demoScanlines} />
            <div className={s.demoTabs}>
              {DEMO_TABS.map((tab, i) => (
                <button
                  key={tab.id}
                  className={`${s.demoTab} ${demoTab === i ? s.demoTabActive : ''}`}
                  onClick={() => setDemoTab(i)}
                >
                  <span className={s.demoTabNum}>{String(i + 1).padStart(2, '0')}</span>
                  {tab.label}
                </button>
              ))}
            </div>
            <div className={s.demoBody}>
              {demoTab === 0 && (
                <div className={s.demoPanel} key="configure">
                  <div className={s.demoPanelLeft}>
                    <div className={s.demoLabel}>Agent Name</div>
                    <div className={s.demoInput}>{DEMO_CONFIGURE.agentName}</div>
                    <div className={s.demoLabel}>Expertise Tags</div>
                    <div className={s.demoTags}>
                      {DEMO_CONFIGURE.tags.map((t) => (
                        <span key={t} className={s.demoTag}>{t}</span>
                      ))}
                    </div>
                    <div className={s.demoLabel}>Tone</div>
                    <div className={s.demoInput}>{DEMO_CONFIGURE.tone}</div>
                  </div>
                  <div className={s.demoPanelRight}>
                    <div className={s.demoPreviewLabel}>Agent Preview</div>
                    <div className={s.demoAgentPreview}>
                      <div className={s.demoAgentAvatar}>AI</div>
                      <div>
                        <div className={s.demoAgentName}>{DEMO_CONFIGURE.agentName}</div>
                        <div className={s.demoAgentMeta}>{DEMO_CONFIGURE.tone} &middot; Ecommerce Focus</div>
                      </div>
                    </div>
                    <div className={s.demoStatusBadge}>Ready to generate</div>
                  </div>
                </div>
              )}
              {demoTab === 1 && (
                <div className={s.demoPanel} key="generate">
                  <div className={s.demoArticle}>
                    <div className={s.demoArticleLabel}>Generated Article</div>
                    <h3 className={s.demoArticleTitle}>{DEMO_GENERATE.title}</h3>
                    <p className={s.demoArticleMeta}>{DEMO_GENERATE.meta}</p>
                    <div className={s.demoLabel}>Keywords</div>
                    <div className={s.demoTags}>
                      {DEMO_GENERATE.keywords.map((k) => (
                        <span key={k} className={s.demoTag}>{k}</span>
                      ))}
                    </div>
                    <div className={s.demoMetrics}>
                      <span>1,847 words</span>
                      <span>SEO Score: 96/100</span>
                      <span>Readability: A+</span>
                    </div>
                  </div>
                </div>
              )}
              {demoTab === 2 && (
                <div className={s.demoPanel} key="publish">
                  <div className={s.demoStatsGrid}>
                    <div className={s.demoStat}>
                      <div className={s.demoStatValue}>{DEMO_PUBLISH.stats.published}</div>
                      <div className={s.demoStatLabel}>Published</div>
                    </div>
                    <div className={s.demoStat}>
                      <div className={s.demoStatValue}>{DEMO_PUBLISH.stats.scheduled}</div>
                      <div className={s.demoStatLabel}>Scheduled</div>
                    </div>
                    <div className={s.demoStat}>
                      <div className={s.demoStatValue}>{DEMO_PUBLISH.stats.avgWords.toLocaleString()}</div>
                      <div className={s.demoStatLabel}>Avg Words</div>
                    </div>
                    <div className={s.demoStat}>
                      <div className={s.demoStatValue}>{DEMO_PUBLISH.stats.seoScore}%</div>
                      <div className={s.demoStatLabel}>SEO Score</div>
                    </div>
                  </div>
                  <div className={s.demoScheduleBar}>
                    <span className={s.demoPulse} />
                    Next auto-publish: <strong>{DEMO_PUBLISH.nextPost}</strong>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ─── FEATURES TIMELINE ─── */}
      <section id="features" className={s.section}>
        <div className={s.container}>
          <h2 className={s.sectionTitle}>
            How It <span className={s.gradientText}>Works</span>
          </h2>
          <p className={s.sectionSub}>
            From configuration to published content in four simple steps.
          </p>
          <div ref={timelineRef} className={s.timeline}>
            <div className={s.timelineLine} />
            {STEPS.map((step, i) => (
              <div key={i} className={s.step}>
                <div className={s.stepNode}>
                  <span className={s.stepNum}>{step.num}</span>
                </div>
                <div className={s.stepContent}>
                  <div className={s.stepIcon}>{step.icon}</div>
                  <h3 className={s.stepTitle}>{step.title}</h3>
                  <p className={s.stepDesc}>{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CAPABILITIES GRID ─── */}
      <section className={s.section}>
        <div className={s.container}>
          <h2 className={s.sectionTitle}>
            What You <span className={s.gradientText}>Get</span>
          </h2>
          <p className={s.sectionSub}>
            Everything you need to run SEO content on autopilot.
          </p>
          <div className={s.capGrid}>
            {CAPABILITIES.map((cap, i) => (
              <div key={i} className={s.capCard}>
                <div className={s.capIcon} style={{ background: cap.gradient }}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="28" height="28">
                    {i === 0 && <><path d="M12 2L2 7l10 5 10-5-10-5z" /><path d="M2 17l10 5 10-5" /><path d="M2 12l10 5 10-5" /></>}
                    {i === 1 && <><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></>}
                    {i === 2 && <><polyline points="22 12 18 12 15 21 9 3 6 12 2 12" /></>}
                    {i === 3 && <><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></>}
                    {i === 4 && <><path d="M18 20V10" /><path d="M12 20V4" /><path d="M6 20v-6" /></>}
                    {i === 5 && <><rect x="2" y="3" width="20" height="14" rx="2" ry="2" /><path d="M8 21h8" /><path d="M12 17v4" /></>}
                  </svg>
                </div>
                <h3 className={s.capTitle}>{cap.title}</h3>
                <ul className={s.capList}>
                  {cap.items.map((item, j) => (
                    <li key={j} className={s.capItem}>
                      <span className={s.checkmark}>{'\u2713'}</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── TICKER ─── */}
      <div className={s.ticker}>
        <div className={s.tickerTrack}>
          {[...TICKER_ITEMS, ...TICKER_ITEMS, ...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
            <span key={i} className={s.tickerItem}>
              {item}
              <span className={s.tickerDot}>&middot;</span>
            </span>
          ))}
        </div>
      </div>

      {/* ─── ROADMAP ─── */}
      <section className={s.section}>
        <div className={s.container}>
          <h2 className={s.sectionTitle}>
            What&apos;s Coming <span className={s.gradientText}>Next</span>
          </h2>
          <p className={s.sectionSub}>
            We&apos;re building the most complete AI SEO content platform. Here&apos;s our roadmap.
          </p>
          <div className={s.roadmap}>
            {ROADMAP.map((phase, i) => (
              <div
                key={i}
                className={`${s.roadmapCard} ${s[`roadmap_${phase.status}`]}`}
                onClick={() => setExpandedRoadmap(expandedRoadmap === i ? null : i)}
              >
                <div className={s.roadmapHeader}>
                  <span className={`${s.roadmapBadge} ${s[`badge_${phase.status}`]}`}>
                    {phase.label}
                  </span>
                  <h3 className={s.roadmapTitle}>{phase.title}</h3>
                  <span className={`${s.roadmapChevron} ${expandedRoadmap === i ? s.chevronOpen : ''}`}>
                    {'\u25BC'}
                  </span>
                </div>
                <div className={`${s.roadmapBody} ${expandedRoadmap === i ? s.roadmapBodyOpen : ''}`}>
                  <ul className={s.roadmapList}>
                    {phase.items.map((item, j) => (
                      <li key={j} className={s.roadmapItem}>
                        <span className={s.checkmark}>{'\u2713'}</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── PRICING ─── */}
      <section id="pricing" className={s.section}>
        <div className={s.container}>
          <h2 className={s.sectionTitle}>
            Simple, Transparent <span className={s.gradientText}>Pricing</span>
          </h2>
          <p className={s.sectionSub}>
            No hidden fees. No long-term contracts. Cancel anytime.
          </p>
          <div className={s.pricingGrid}>
            {PRICING.map((plan, i) => (
              <div key={i} className={`${s.pricingCard} ${plan.highlighted ? s.pricingHighlighted : ''}`}>
                {plan.highlighted && <span className={s.recommendedBadge}>RECOMMENDED</span>}
                <h3 className={s.pricingName}>{plan.name}</h3>
                <div className={s.pricingPrice}>
                  <span className={s.priceValue}>{plan.price}</span>
                  <span className={s.pricePeriod}>{plan.period}</span>
                </div>
                <p className={s.pricingDesc}>{plan.desc}</p>
                <ul className={s.pricingFeatures}>
                  {plan.features.map((f, j) => (
                    <li key={j} className={s.pricingFeature}>
                      <span className={s.checkmark}>{'\u2713'}</span>
                      {f}
                    </li>
                  ))}
                </ul>
                {plan.cta === 'Book a Call' ? (
                  <a
                    href="https://calendly.com/rafaloleksiakconsulting/30min"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={s.ctaGhost}
                  >
                    {plan.cta}
                  </a>
                ) : (
                  <button
                    onClick={() => scrollTo('trial')}
                    className={plan.highlighted ? s.ctaPrimary : s.ctaGhost}
                  >
                    {plan.cta}
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FAQ ─── */}
      <section className={s.section}>
        <div className={s.container}>
          <h2 className={s.sectionTitle}>
            Frequently Asked <span className={s.gradientText}>Questions</span>
          </h2>
          <div className={s.faqList}>
            {FAQ_DATA.map((faq, i) => (
              <div key={i} className={`${s.faqItem} ${openFaq === i ? s.faqOpen : ''}`}>
                <button className={s.faqQuestion} onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                  {faq.q}
                  <span className={s.faqToggle}>{openFaq === i ? '\u2212' : '+'}</span>
                </button>
                <div className={`${s.faqAnswer} ${openFaq === i ? s.faqAnswerOpen : ''}`}>
                  <p>{faq.a}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── TRIAL FORM ─── */}
      <section id="trial" className={s.trialSection}>
        <div className={s.container}>
          <h2 className={s.sectionTitle}>
            Start Your Free <span className={s.gradientText}>Trial</span>
          </h2>
          <p className={s.sectionSub}>
            Tell us about your business and we&apos;ll set up your AI content agent within 24 hours.
          </p>
          <div className={s.trialFormWrapper}>
            {trialSuccess ? (
              <div className={s.trialSuccess}>
                <div className={s.trialSuccessIcon}>&#10003;</div>
                <h3>Request Received!</h3>
                <p>We&apos;ll configure your AI agent and send you login credentials within 24 hours. Check your email at <strong>{trialForm.email}</strong> for next steps.</p>
                <a
                  href="https://calendly.com/rafaloleksiakconsulting/30min"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={s.ctaGhost}
                >
                  Or book a call to discuss your strategy
                </a>
              </div>
            ) : (
              <form onSubmit={handleTrialSubmit} className={s.trialForm}>
                <div className={s.trialRow}>
                  <div className={s.trialField}>
                    <label className={s.trialLabel}>Company Name *</label>
                    <input
                      type="text"
                      required
                      className={s.trialInput}
                      placeholder="Your ecommerce brand"
                      value={trialForm.company}
                      onChange={(e) => setTrialForm({ ...trialForm, company: e.target.value })}
                    />
                  </div>
                  <div className={s.trialField}>
                    <label className={s.trialLabel}>Email *</label>
                    <input
                      type="email"
                      required
                      className={s.trialInput}
                      placeholder="you@company.com"
                      value={trialForm.email}
                      onChange={(e) => setTrialForm({ ...trialForm, email: e.target.value })}
                    />
                  </div>
                </div>
                <div className={s.trialRow}>
                  <div className={s.trialField}>
                    <label className={s.trialLabel}>Website URL</label>
                    <input
                      type="url"
                      className={s.trialInput}
                      placeholder="https://yourstore.com"
                      value={trialForm.website}
                      onChange={(e) => setTrialForm({ ...trialForm, website: e.target.value })}
                    />
                  </div>
                  <div className={s.trialField}>
                    <label className={s.trialLabel}>CMS / Blog Platform</label>
                    <select
                      className={s.trialInput}
                      value={trialForm.cms}
                      onChange={(e) => setTrialForm({ ...trialForm, cms: e.target.value })}
                    >
                      <option value="">Select platform...</option>
                      <option value="WordPress">WordPress</option>
                      <option value="Shopify">Shopify</option>
                      <option value="WooCommerce">WooCommerce</option>
                      <option value="Custom / Headless CMS">Custom / Headless CMS</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>
                <div className={s.trialField}>
                  <label className={s.trialLabel}>Anything else we should know?</label>
                  <textarea
                    className={s.trialTextarea}
                    placeholder="Tell us about your content goals, niche, target keywords..."
                    rows={3}
                    value={trialForm.message}
                    onChange={(e) => setTrialForm({ ...trialForm, message: e.target.value })}
                  />
                </div>
                {trialError && <p className={s.trialError}>{trialError}</p>}
                <button type="submit" className={s.ctaPrimary} disabled={trialLoading}>
                  {trialLoading ? 'Submitting...' : 'Request Free Trial →'}
                </button>
                <p className={s.trialDisclaimer}>
                  No credit card required. 14-day free trial with full Growth plan features.
                </p>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* ─── FINAL CTA ─── */}
      <section className={s.finalCta}>
        <div className={s.floatingShapes}>
          <div className={s.shape1} />
          <div className={s.shape2} />
          <div className={s.shape3} />
        </div>
        <div className={s.container}>
          <h2 className={s.finalTitle}>
            Ready to Put Your SEO<br />
            <span className={s.gradientText}>on Autopilot?</span>
          </h2>
          <p className={s.finalSub}>
            Start publishing SEO-optimized content today. No credit card required.
          </p>
          <div className={s.finalCtas}>
            <button onClick={() => scrollTo('trial')} className={s.ctaPrimary}>
              Start Free Trial &rarr;
            </button>
            <a
              href="https://calendly.com/rafaloleksiakconsulting/30min"
              target="_blank"
              rel="noopener noreferrer"
              className={s.ctaGhost}
            >
              Book a Demo
            </a>
          </div>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer className={s.footer}>
        <p>&copy; {new Date().getFullYear()} Oleksiak Consulting. All rights reserved.</p>
      </footer>
    </div>
  );
}
