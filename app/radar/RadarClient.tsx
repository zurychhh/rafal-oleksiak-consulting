'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Logo from '../components/ui/Logo';
import s from './radar.module.css';

/* ═══════════════════════════════════════════════════════════
   DATA
   ═══════════════════════════════════════════════════════════ */

const PAIN_POINTS = [
  {
    icon: '\u{1F50D}',
    title: 'Competitors Move Fast',
    desc: 'New features, pricing changes, positioning shifts \u2014 your competitors evolve constantly. Manual monitoring can\u2019t keep up.',
  },
  {
    icon: '\u{1F4CA}',
    title: 'Analysis Takes Hours',
    desc: 'Reviewing 3\u20135 competitor websites, comparing messaging, features, and positioning manually takes an entire workday. Every time.',
  },
  {
    icon: '\u{1F3AF}',
    title: 'Blind Spots Kill Growth',
    desc: 'You don\u2019t know what you don\u2019t know. Missing a competitor\u2019s new angle or market gap can cost you months of lost revenue.',
  },
];

const STEPS = [
  {
    num: '01',
    title: 'Enter Your Website + Competitors',
    desc: 'Provide your URL and up to 5 competitor websites. RADAR handles the rest \u2014 no manual data entry needed.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
        <path d="M8 21h8" />
        <path d="M12 17v4" />
      </svg>
    ),
  },
  {
    num: '02',
    title: 'AI Scrapes & Analyzes',
    desc: 'RADAR crawls every site, extracting positioning, features, pricing signals, tech stack, content strategy, and social proof indicators.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <circle cx="12" cy="12" r="6" />
        <circle cx="12" cy="12" r="2" />
      </svg>
    ),
  },
  {
    num: '03',
    title: 'Strategic Intelligence Report',
    desc: 'Claude AI generates a comprehensive competitive analysis: threat levels, strengths, weaknesses, unique angles, and market gaps.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
      </svg>
    ),
  },
  {
    num: '04',
    title: 'Action Items Delivered',
    desc: 'Prioritized recommendations land in your inbox: what to do first, what gaps to exploit, and where you\u2019re vulnerable.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
        <polyline points="22 4 12 14.01 9 11.01" />
      </svg>
    ),
  },
];

const CAPABILITIES = [
  {
    title: 'Website Scraping',
    gradient: 'linear-gradient(135deg, #EF4444, #F97316)',
    items: ['Automated HTML extraction', 'Meta data & heading analysis', 'Tech stack detection', 'Content length measurement'],
  },
  {
    title: 'AI Competitive Analysis',
    gradient: 'linear-gradient(135deg, #A855F7, #C084FC)',
    items: ['Claude AI-powered comparison', 'Positioning & messaging analysis', 'Strengths & weaknesses per competitor', 'Unique angle identification'],
  },
  {
    title: 'Threat Assessment',
    gradient: 'linear-gradient(135deg, #EF4444, #DC2626)',
    items: ['Threat level scoring (low/medium/high)', 'Competitive position evaluation', 'Risk area identification', 'Market overlap detection'],
  },
  {
    title: 'Market Gap Detection',
    gradient: 'linear-gradient(135deg, #F59E0B, #FBBF24)',
    items: ['Unserved audience segments', 'Missing feature opportunities', 'Content gap analysis', 'Pricing opportunity signals'],
  },
  {
    title: 'Strategic Action Items',
    gradient: 'linear-gradient(135deg, #10B981, #34D399)',
    items: ['Priority-ranked recommendations', 'Expected impact assessment', 'Quick wins vs long-term plays', 'Specific implementation guidance'],
  },
  {
    title: 'Email Report Delivery',
    gradient: 'linear-gradient(135deg, #0EA5E9, #38BDF8)',
    items: ['Full HTML report to your inbox', 'Competitor cards with threat badges', 'Advantages & vulnerabilities summary', 'Shareable with your team'],
  },
];

const TICKER_ITEMS = [
  'Up to 5 Competitors per Scan',
  'AI-Powered by Claude',
  '30-60 Second Analysis',
  'Full Report to Email',
  'Threat Level Scoring',
  'Market Gap Detection',
  'Prioritized Action Items',
  'Zero Manual Research',
];

const ROADMAP = [
  {
    status: 'live',
    label: 'LIVE',
    title: 'AI Competitor Scraping + Analysis',
    items: ['Claude AI-powered competitor analysis', 'Website scraping with content extraction', 'Threat level assessment per competitor', 'Strategic insights & action items', 'Email report delivery'],
  },
  {
    status: 'progress',
    label: 'IN PROGRESS',
    title: 'Dashboard + Recurring Monitoring',
    items: ['Web-based competitor dashboard', 'Weekly/monthly automated scans', 'Change detection & email alerts', 'Historical trend tracking'],
  },
  {
    status: 'planned',
    label: 'PLANNED',
    title: 'SEO Intelligence + Content Gaps',
    items: ['Competitor keyword ranking tracking', 'Content gap detection & opportunities', 'Backlink profile comparison', 'Smart topic prioritization'],
  },
  {
    status: 'vision',
    label: 'VISION',
    title: 'Multi-Market + Predictive AI',
    items: ['Monitor competitors in 20+ markets', 'AI-predicted competitor moves', 'Automated counter-strategy generation', 'Industry benchmark scoring'],
  },
];

const PRICING = [
  {
    name: 'Free Scan',
    price: 'Free',
    period: '',
    desc: 'Try RADAR with a single competitor scan. See the full report before committing.',
    features: ['1 competitor analysis', 'Full AI report', 'Email delivery', 'Threat assessment', 'Action items'],
    cta: 'Try Free Scan',
    highlighted: false,
  },
  {
    name: 'Pro',
    price: '\u20AC49',
    period: '/mo',
    desc: 'For brands that need ongoing competitive intelligence across multiple competitors.',
    features: ['5 competitors per scan', 'Unlimited scans/month', 'Recurring monitoring', 'Change alerts', 'Priority support', 'Historical reports'],
    cta: 'Coming Soon',
    highlighted: true,
  },
  {
    name: 'Agency',
    price: 'Custom',
    period: '',
    desc: 'For agencies managing multiple client brands with competitive intelligence needs.',
    features: ['Unlimited competitors', 'Multi-brand dashboards', 'White-label reports', 'API access', 'Dedicated account manager', 'Custom integrations'],
    cta: 'Book a Call',
    highlighted: false,
  },
];

const FAQ_DATA = [
  {
    q: 'How does RADAR analyze competitors?',
    a: 'RADAR scrapes each competitor website, extracting meta data, headings, content, navigation structure, pricing signals, blog presence, social proof, and tech stack. Then Claude AI compares each competitor against your site to produce a strategic analysis with positioning, strengths, weaknesses, threat level, and unique angles.',
  },
  {
    q: 'How many competitors can I analyze at once?',
    a: 'You can analyze up to 5 competitor websites in a single scan. Each competitor is scraped and analyzed individually, then a combined strategic report identifies market gaps, your advantages, and your vulnerabilities across the competitive landscape.',
  },
  {
    q: 'How long does the analysis take?',
    a: 'A typical RADAR scan with 3\u20135 competitors completes in 30\u201360 seconds. The AI needs time to scrape each site and generate the strategic analysis. Results are shown on-screen immediately and also sent to your email.',
  },
  {
    q: 'Is the analysis accurate?',
    a: 'RADAR uses real scraped data from competitor websites combined with Claude AI\u2019s analytical capabilities. The tool identifies factual elements (pricing, features, blog presence) and provides AI-generated strategic interpretation. We recommend using RADAR insights as a starting point, complemented by your own domain expertise.',
  },
  {
    q: 'Can competitors see that I\u2019m scanning their site?',
    a: 'RADAR makes standard HTTP requests to publicly available web pages, similar to any browser visit. Competitor sites cannot distinguish RADAR visits from regular traffic. No login or authentication is attempted.',
  },
  {
    q: 'What does the email report include?',
    a: 'The full HTML report includes: competitor cards with threat level badges, strengths and weaknesses per competitor, your competitive advantages and vulnerabilities, market gaps to exploit, prioritized action items with expected impact, and a CTA to book a strategy call.',
  },
];

/* ═══════════════════════════════════════════════════════════
   DEMO TAB DATA
   ═══════════════════════════════════════════════════════════ */

const DEMO_TABS = [
  { id: 'input', label: 'Enter URLs' },
  { id: 'analysis', label: 'AI Analysis' },
  { id: 'report', label: 'Get Report' },
];

/* ═══════════════════════════════════════════════════════════
   COMPONENT
   ═══════════════════════════════════════════════════════════ */

export default function RadarClient() {
  const [demoTab, setDemoTab] = useState(0);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [expandedRoadmap, setExpandedRoadmap] = useState<number | null>(0);
  const [revealed, setRevealed] = useState(false);
  const timelineRef = useRef<HTMLDivElement>(null);

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
          <span className={s.badge}>AI-POWERED INTELLIGENCE</span>
          <h1 className={s.heroTitle}>
            Know Your Competitors<br />
            <span className={s.gradientText}>Before They Know You.</span>
          </h1>
          <p className={s.heroSub}>
            Enter your website and up to 5 competitors. AI scrapes, analyzes, and delivers
            strategic intelligence &mdash; strengths, weaknesses, threats, and action items &mdash;
            straight to your inbox.
          </p>
          <div className={s.heroCtas}>
            <button onClick={() => scrollTo('pricing')} className={s.ctaPrimary}>
              Try Free Scan &rarr;
            </button>
            <button onClick={() => scrollTo('demo')} className={s.ctaGhost}>
              See How It Works &darr;
            </button>
          </div>
          <p className={s.trustLine}>
            AI-powered by Claude &middot; 30-60 second analysis &middot; Up to 5 competitors per scan
          </p>
        </div>
      </section>

      {/* ─── PROBLEM / SOLUTION ─── */}
      <section className={s.section}>
        <div className={s.container}>
          <h2 className={s.sectionTitle}>
            The Competitive Intelligence <span className={s.gradientText}>Problem</span>
          </h2>
          <p className={s.sectionSub}>
            You can&apos;t beat competitors you don&apos;t understand. Most brands fly blind.
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
            What if AI did the competitive research &mdash;{' '}
            <span className={s.gradientText}>in under 60 seconds?</span>
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
            Three steps from URLs to competitive intelligence.
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
                <div className={s.demoPanel} key="input">
                  <div className={s.demoPanelLeft}>
                    <div className={s.demoLabel}>Your Website</div>
                    <div className={s.demoInput}>mystore.com</div>
                    <div className={s.demoLabel}>Competitors</div>
                    <div className={s.demoTags}>
                      <span className={s.demoTag}>competitor1.com</span>
                      <span className={s.demoTag}>competitor2.com</span>
                      <span className={s.demoTag}>competitor3.com</span>
                    </div>
                    <div className={s.demoLabel}>Email</div>
                    <div className={s.demoInput}>you@company.com</div>
                  </div>
                  <div className={s.demoPanelRight}>
                    <div className={s.demoPreviewLabel}>Scan Preview</div>
                    <div className={s.demoAgentPreview}>
                      <div className={s.demoAgentAvatar}>R</div>
                      <div>
                        <div className={s.demoAgentName}>RADAR Analysis</div>
                        <div className={s.demoAgentMeta}>3 competitors &middot; Full scan</div>
                      </div>
                    </div>
                    <div className={s.demoStatusBadge}>Ready to analyze</div>
                  </div>
                </div>
              )}
              {demoTab === 1 && (
                <div className={s.demoArticle} key="analysis">
                  <div className={s.demoArticleLabel}>AI Analysis Output</div>
                  <h3 className={s.demoArticleTitle}>competitor1.com &mdash; High Threat</h3>
                  <p className={s.demoArticleMeta}>
                    Strong positioning in premium segment. Well-structured content with clear value proposition.
                    Active blog with 40+ articles. Missing pricing transparency creates opportunity.
                  </p>
                  <div className={s.demoLabel}>Key Findings</div>
                  <div className={s.demoTags}>
                    <span className={s.demoTag}>Strong SEO</span>
                    <span className={s.demoTag}>Social Proof</span>
                    <span className={s.demoTag}>No Pricing</span>
                    <span className={s.demoTag}>Weak Mobile UX</span>
                  </div>
                  <div className={s.demoMetrics}>
                    <span>3 Competitors</span>
                    <span>2 High Threats</span>
                    <span>4 Action Items</span>
                  </div>
                </div>
              )}
              {demoTab === 2 && (
                <div className={s.demoPanel} key="report">
                  <div className={s.demoStatsGrid}>
                    <div className={s.demoStat}>
                      <div className={s.demoStatValue}>3</div>
                      <div className={s.demoStatLabel}>Analyzed</div>
                    </div>
                    <div className={s.demoStat}>
                      <div className={s.demoStatValue}>2</div>
                      <div className={s.demoStatLabel}>High Threats</div>
                    </div>
                    <div className={s.demoStat}>
                      <div className={s.demoStatValue}>5</div>
                      <div className={s.demoStatLabel}>Market Gaps</div>
                    </div>
                    <div className={s.demoStat}>
                      <div className={s.demoStatValue}>42s</div>
                      <div className={s.demoStatLabel}>Scan Time</div>
                    </div>
                  </div>
                  <div className={s.demoScheduleBar}>
                    <span className={s.demoPulse} />
                    Full report sent to <strong>you@company.com</strong>
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
            From URLs to strategic intelligence in four steps.
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
            Every competitive insight you need, automated.
          </p>
          <div className={s.capGrid}>
            {CAPABILITIES.map((cap, i) => (
              <div key={i} className={s.capCard}>
                <div className={s.capIcon} style={{ background: cap.gradient }}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="28" height="28">
                    {i === 0 && <><circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" /></>}
                    {i === 1 && <><path d="M12 2L2 7l10 5 10-5-10-5z" /><path d="M2 17l10 5 10-5" /><path d="M2 12l10 5 10-5" /></>}
                    {i === 2 && <><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" /></>}
                    {i === 3 && <><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></>}
                    {i === 4 && <><path d="M22 11.08V12a10 10 0 11-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></>}
                    {i === 5 && <><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22 6 12 13 2 6" /></>}
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
            We&apos;re building the most complete AI competitive intelligence platform. Here&apos;s our roadmap.
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
            Start with a free scan. Upgrade when you need ongoing intelligence.
          </p>
          <div className={s.pricingGrid}>
            {PRICING.map((plan, i) => (
              <div key={i} className={`${s.pricingCard} ${plan.highlighted ? s.pricingHighlighted : ''}`}>
                {plan.highlighted && <span className={s.recommendedBadge}>COMING SOON</span>}
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
                  <a
                    href="https://calendly.com/rafaloleksiakconsulting/30min"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={plan.highlighted ? s.ctaPrimary : s.ctaGhost}
                  >
                    {plan.cta}
                  </a>
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

      {/* ─── FINAL CTA ─── */}
      <section className={s.finalCta}>
        <div className={s.floatingShapes}>
          <div className={s.shape1} />
          <div className={s.shape2} />
          <div className={s.shape3} />
        </div>
        <div className={s.container}>
          <h2 className={s.finalTitle}>
            Ready to Outsmart<br />
            <span className={s.gradientText}>Your Competition?</span>
          </h2>
          <p className={s.finalSub}>
            Get AI-powered competitive intelligence in under 60 seconds.
            Know every strength, weakness, and opportunity.
          </p>
          <div className={s.finalCtas}>
            <a
              href="https://calendly.com/rafaloleksiakconsulting/30min"
              target="_blank"
              rel="noopener noreferrer"
              className={s.ctaPrimary}
            >
              Book a Demo &rarr;
            </a>
            <Link href="/" className={s.ctaGhost}>
              Back to Home
            </Link>
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
