'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import styles from '../../../admin.module.css';

type Tab = 'dashboard' | 'campaigns' | 'creative' | 'intelligence' | 'analytics';

interface PlatformConnection {
  platform: string;
  status: string;
  accountName: string;
  lastSync: string;
  error?: string;
}

interface Alert {
  id: string;
  type: string;
  severity: string;
  title: string;
  description: string;
  createdAt: string;
  acknowledged: boolean;
}

interface Recommendation {
  id: string;
  campaignId: string;
  type: string;
  priority: string;
  title: string;
  description: string;
  expectedImpact: string;
}

const PLATFORM_LABELS: Record<string, string> = {
  google_ads: 'Google Ads',
  meta_ads: 'Meta Ads',
  linkedin_ads: 'LinkedIn Ads',
};

const STATUS_COLORS: Record<string, string> = {
  connected: '#4ade80',
  disconnected: '#8b8fa3',
  error: '#f87171',
  rate_limited: '#fbbf24',
};

export default function MCCDashboard() {
  const pathname = usePathname();
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [connections, setConnections] = useState<PlatformConnection[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  async function loadDashboard() {
    setLoading(true);
    try {
      const [connectionsRes, alertsRes] = await Promise.allSettled([
        fetch('/api/mcc/analytics?type=connections'),
        fetch('/api/mcc/intelligence?type=alerts&acknowledged=false'),
      ]);

      if (connectionsRes.status === 'fulfilled' && connectionsRes.value.ok) {
        const data = await connectionsRes.value.json();
        setConnections(data.connections || []);
      }
      if (alertsRes.status === 'fulfilled' && alertsRes.value.ok) {
        const data = await alertsRes.value.json();
        setAlerts(data.alerts || []);
      }
    } catch (error) {
      console.error('Dashboard load error:', error);
    }
    setLoading(false);
  }

  if (loading) {
    return (
      <div className={styles.loadingOverlay}>
        <div className={styles.spinner} />
        Loading Marketing Command Center...
      </div>
    );
  }

  return (
    <div>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Marketing Command Center</h1>
      </div>

      {/* Navigation Tabs */}
      <div className={styles.tabs}>
        {(['dashboard', 'campaigns', 'creative', 'intelligence', 'analytics'] as Tab[]).map((tab) => (
          <button
            key={tab}
            className={activeTab === tab ? styles.tabActive : styles.tab}
            onClick={() => setActiveTab(tab)}
          >
            {tab === 'dashboard' && 'Dashboard'}
            {tab === 'campaigns' && 'Kampanie'}
            {tab === 'creative' && 'Kreacje AI'}
            {tab === 'intelligence' && 'Konkurencja'}
            {tab === 'analytics' && 'Analityka'}
          </button>
        ))}
      </div>

      {/* Dashboard Tab */}
      {activeTab === 'dashboard' && (
        <DashboardView
          connections={connections}
          alerts={alerts}
          recommendations={recommendations}
          onRefresh={loadDashboard}
        />
      )}

      {/* Campaigns Tab */}
      {activeTab === 'campaigns' && <CampaignsView />}

      {/* Creative Tab */}
      {activeTab === 'creative' && <CreativeView />}

      {/* Intelligence Tab */}
      {activeTab === 'intelligence' && <IntelligenceView alerts={alerts} />}

      {/* Analytics Tab */}
      {activeTab === 'analytics' && <AnalyticsView />}
    </div>
  );
}

// =============================================================================
// Dashboard View
// =============================================================================

function DashboardView({
  connections,
  alerts,
  recommendations,
  onRefresh,
}: {
  connections: PlatformConnection[];
  alerts: Alert[];
  recommendations: Recommendation[];
  onRefresh: () => void;
}) {
  return (
    <>
      {/* Platform Connections */}
      <h2 style={{ color: '#fff', fontSize: 18, fontWeight: 600, margin: '0 0 16px' }}>
        Podlaczone platformy
      </h2>
      <div className={styles.cardGrid}>
        {(['google_ads', 'meta_ads', 'linkedin_ads'] as const).map((platform) => {
          const conn = connections.find((c) => c.platform === platform);
          return (
            <div key={platform} className={styles.card}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 className={styles.cardName}>{PLATFORM_LABELS[platform]}</h3>
                <span
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: '50%',
                    background: STATUS_COLORS[conn?.status || 'disconnected'],
                    display: 'inline-block',
                  }}
                />
              </div>
              <p className={styles.cardSlug}>
                {conn?.status === 'connected'
                  ? conn.accountName
                  : conn?.error || 'Nie polaczono'}
              </p>
              <div className={styles.cardStats}>
                <span className={styles.cardStat}>
                  Status: <span className={styles.cardStatValue}>
                    {conn?.status === 'connected' ? 'Aktywny' : 'Nieaktywny'}
                  </span>
                </span>
                {conn?.lastSync && (
                  <span className={styles.cardStat}>
                    Sync: <span className={styles.cardStatValue}>
                      {new Date(conn.lastSync).toLocaleString('pl')}
                    </span>
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Alerts */}
      {alerts.length > 0 && (
        <>
          <h2 style={{ color: '#fff', fontSize: 18, fontWeight: 600, margin: '32px 0 16px' }}>
            Alerty ({alerts.length})
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {alerts.slice(0, 5).map((alert) => (
              <div
                key={alert.id}
                className={styles.card}
                style={{
                  borderLeft: `3px solid ${
                    alert.severity === 'critical' ? '#f87171' :
                    alert.severity === 'warning' ? '#fbbf24' : '#60a5fa'
                  }`,
                }}
              >
                <p style={{ color: '#fff', fontSize: 14, fontWeight: 500, margin: '0 0 4px' }}>
                  {alert.title}
                </p>
                <p style={{ color: '#8b8fa3', fontSize: 13, margin: 0 }}>
                  {alert.description}
                </p>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Recommendations */}
      {recommendations.length > 0 && (
        <>
          <h2 style={{ color: '#fff', fontSize: 18, fontWeight: 600, margin: '32px 0 16px' }}>
            Rekomendacje optymalizacji
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {recommendations.map((rec) => (
              <div key={rec.id} className={styles.card}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <p style={{ color: '#fff', fontSize: 14, fontWeight: 500, margin: 0 }}>
                    {rec.title}
                  </p>
                  <span className={rec.priority === 'critical' ? styles.statusDraft : styles.statusScheduled}>
                    {rec.priority}
                  </span>
                </div>
                <p style={{ color: '#8b8fa3', fontSize: 13, margin: '8px 0 0' }}>
                  {rec.description}
                </p>
                <p style={{ color: '#4ade80', fontSize: 12, margin: '4px 0 0' }}>
                  Szacowany efekt: {rec.expectedImpact}
                </p>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Quick Actions */}
      <h2 style={{ color: '#fff', fontSize: 18, fontWeight: 600, margin: '32px 0 16px' }}>
        Szybkie akcje
      </h2>
      <div className={styles.btnGroup}>
        <button className={styles.btnPrimary} onClick={onRefresh}>
          Odswiez dane
        </button>
        <button className={styles.btnSecondary} onClick={() => {}}>
          Uruchom optymalizacje
        </button>
        <button className={styles.btnSecondary} onClick={() => {}}>
          Skanuj konkurencje
        </button>
      </div>
    </>
  );
}

// =============================================================================
// Campaigns View
// =============================================================================

function CampaignsView() {
  const [campaigns, setCampaigns] = useState<Array<{
    id: string;
    name: string;
    status: string;
    objective: string;
    platforms: Array<{ platform: string }>;
    budget: { dailyBudget: number; currency: string };
    metrics: { impressions: number; clicks: number; conversions: number; cost: number; roas: number };
  }>>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);

  useEffect(() => {
    loadCampaigns();
  }, []);

  async function loadCampaigns() {
    setLoading(true);
    try {
      const res = await fetch('/api/mcc/campaigns');
      if (res.ok) {
        const data = await res.json();
        setCampaigns(data.campaigns || []);
      }
    } catch (error) {
      console.error('Campaigns load error:', error);
    }
    setLoading(false);
  }

  async function handleAction(campaignId: string, action: string) {
    try {
      await fetch('/api/mcc/campaigns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, campaignId }),
      });
      loadCampaigns();
    } catch (error) {
      console.error('Campaign action error:', error);
    }
  }

  if (loading) {
    return <div className={styles.loadingOverlay}><div className={styles.spinner} /> Ladowanie kampanii...</div>;
  }

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h2 style={{ color: '#fff', fontSize: 18, fontWeight: 600, margin: 0 }}>
          Kampanie ({campaigns.length})
        </h2>
        <button className={styles.btnPrimary} onClick={() => setShowCreate(true)}>
          + Nowa kampania
        </button>
      </div>

      {campaigns.length === 0 ? (
        <div className={styles.emptyState}>
          <p className={styles.emptyStateTitle}>Brak kampanii</p>
          <p className={styles.emptyStateText}>
            Stworz pierwsza kampanie, aby zaczac zarzadzac reklamami z jednego miejsca.
          </p>
          <button className={styles.btnPrimary} onClick={() => setShowCreate(true)}>
            Stworz kampanie
          </button>
        </div>
      ) : (
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Nazwa</th>
              <th>Status</th>
              <th>Platformy</th>
              <th>Budzet/dzien</th>
              <th>Impressions</th>
              <th>Clicks</th>
              <th>Konwersje</th>
              <th>ROAS</th>
              <th>Akcje</th>
            </tr>
          </thead>
          <tbody>
            {campaigns.map((campaign) => (
              <tr key={campaign.id}>
                <td style={{ color: '#fff', fontWeight: 500 }}>{campaign.name}</td>
                <td>
                  <span className={
                    campaign.status === 'active' ? styles.statusPublished :
                    campaign.status === 'paused' ? styles.statusDraft :
                    styles.statusScheduled
                  }>
                    {campaign.status}
                  </span>
                </td>
                <td>
                  {campaign.platforms.map((p) => PLATFORM_LABELS[p.platform] || p.platform).join(', ')}
                </td>
                <td>{campaign.budget.dailyBudget} {campaign.budget.currency}</td>
                <td>{campaign.metrics.impressions.toLocaleString()}</td>
                <td>{campaign.metrics.clicks.toLocaleString()}</td>
                <td>{campaign.metrics.conversions}</td>
                <td style={{ color: campaign.metrics.roas > 1 ? '#4ade80' : '#f87171' }}>
                  {campaign.metrics.roas.toFixed(1)}x
                </td>
                <td>
                  <div className={styles.btnGroup}>
                    {campaign.status === 'draft' && (
                      <button
                        className={`${styles.btnPrimary} ${styles.btnSmall}`}
                        onClick={() => handleAction(campaign.id, 'launch')}
                      >
                        Launch
                      </button>
                    )}
                    {campaign.status === 'active' && (
                      <button
                        className={`${styles.btnSecondary} ${styles.btnSmall}`}
                        onClick={() => handleAction(campaign.id, 'pause')}
                      >
                        Pause
                      </button>
                    )}
                    {campaign.status === 'paused' && (
                      <button
                        className={`${styles.btnSecondary} ${styles.btnSmall}`}
                        onClick={() => handleAction(campaign.id, 'resume')}
                      >
                        Resume
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Create Campaign Modal */}
      {showCreate && <CreateCampaignModal onClose={() => setShowCreate(false)} onCreated={loadCampaigns} />}
    </>
  );
}

// =============================================================================
// Create Campaign Modal
// =============================================================================

function CreateCampaignModal({
  onClose,
  onCreated,
}: {
  onClose: () => void;
  onCreated: () => void;
}) {
  const [name, setName] = useState('');
  const [objective, setObjective] = useState('traffic');
  const [platforms, setPlatforms] = useState<string[]>(['google_ads']);
  const [dailyBudget, setDailyBudget] = useState('100');
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);

    try {
      const res = await fetch('/api/mcc/campaigns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'create',
          name,
          objective,
          platforms,
          budget: {
            totalBudget: 0,
            dailyBudget: parseFloat(dailyBudget),
            currency: 'PLN',
            allocation: platforms.map((p) => ({
              platform: p,
              percentage: 100 / platforms.length,
              dailyLimit: parseFloat(dailyBudget) / platforms.length,
            })),
            bidStrategy: 'maximize_clicks',
          },
          schedule: {
            startDate: new Date().toISOString().split('T')[0],
            timezone: 'Europe/Warsaw',
          },
          targeting: {
            locations: [{ type: 'country', value: 'PL' }],
            languages: ['pl'],
            demographics: { ageRanges: ['25-54'], genders: ['all'] },
            interests: [],
            keywords: [],
            audiences: [],
            exclusions: { keywords: [], audiences: [], placements: [], locations: [] },
            devices: { desktop: true, mobile: true, tablet: true },
          },
        }),
      });

      if (res.ok) {
        onCreated();
        onClose();
      }
    } catch (error) {
      console.error('Create campaign error:', error);
    }

    setSubmitting(false);
  }

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <h2 className={styles.modalTitle}>Nowa kampania</h2>
        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Nazwa kampanii</label>
            <input
              className={styles.formInput}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="np. Lead Gen Q1 2026"
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Cel kampanii</label>
            <select className={styles.formSelect} value={objective} onChange={(e) => setObjective(e.target.value)}>
              <option value="awareness">Swiadomosc marki</option>
              <option value="traffic">Ruch na stronie</option>
              <option value="engagement">Zaangazowanie</option>
              <option value="leads">Pozyskiwanie leadow</option>
              <option value="conversions">Konwersje</option>
              <option value="sales">Sprzedaz</option>
            </select>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Platformy</label>
            <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
              {(['google_ads', 'meta_ads', 'linkedin_ads'] as const).map((p) => (
                <label key={p} style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#c4c7d4', fontSize: 14 }}>
                  <input
                    type="checkbox"
                    checked={platforms.includes(p)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setPlatforms([...platforms, p]);
                      } else {
                        setPlatforms(platforms.filter((x) => x !== p));
                      }
                    }}
                  />
                  {PLATFORM_LABELS[p]}
                </label>
              ))}
            </div>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Budzet dzienny (PLN)</label>
            <input
              className={styles.formInput}
              type="number"
              min="10"
              step="10"
              value={dailyBudget}
              onChange={(e) => setDailyBudget(e.target.value)}
              required
            />
          </div>

          <div className={styles.modalActions}>
            <button type="button" className={styles.btnSecondary} onClick={onClose}>
              Anuluj
            </button>
            <button type="submit" className={styles.btnPrimary} disabled={submitting || !name || platforms.length === 0}>
              {submitting ? 'Tworzenie...' : 'Stworz kampanie'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// =============================================================================
// Creative View
// =============================================================================

function CreativeView() {
  const [product, setProduct] = useState('');
  const [audience, setAudience] = useState('');
  const [platform, setPlatform] = useState('google_ads');
  const [objective, setObjective] = useState('leads');
  const [tone, setTone] = useState('professional');
  const [result, setResult] = useState<{
    variants: Array<{
      headlines: string[];
      descriptions: string[];
      callToAction: string;
      reasoning: string;
      estimatedQualityScore: number;
    }>;
    competitorDifferentiation: string;
    abTestSuggestion: string;
  } | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleGenerate(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      const res = await fetch('/api/mcc/creative', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'generate',
          product,
          targetAudience: audience,
          platform,
          objective,
          tone,
          language: 'pl',
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setResult(data.result);
      }
    } catch (error) {
      console.error('Creative generation error:', error);
    }

    setLoading(false);
  }

  return (
    <>
      <h2 style={{ color: '#fff', fontSize: 18, fontWeight: 600, margin: '0 0 20px' }}>
        Generator kreacji AI
      </h2>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32 }}>
        {/* Input Form */}
        <div>
          <form onSubmit={handleGenerate}>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Produkt / Usluga</label>
              <input
                className={styles.formInput}
                value={product}
                onChange={(e) => setProduct(e.target.value)}
                placeholder="np. Audyt marketingowy strony www"
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Grupa docelowa</label>
              <input
                className={styles.formInput}
                value={audience}
                onChange={(e) => setAudience(e.target.value)}
                placeholder="np. Wlasciciele firm 25-55 lat, Polska"
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Platforma</label>
              <select className={styles.formSelect} value={platform} onChange={(e) => setPlatform(e.target.value)}>
                <option value="google_ads">Google Ads</option>
                <option value="meta_ads">Meta Ads</option>
                <option value="linkedin_ads">LinkedIn Ads</option>
              </select>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Cel</label>
              <select className={styles.formSelect} value={objective} onChange={(e) => setObjective(e.target.value)}>
                <option value="leads">Leady</option>
                <option value="traffic">Ruch</option>
                <option value="conversions">Konwersje</option>
                <option value="awareness">Swiadomosc</option>
              </select>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Ton komunikacji</label>
              <select className={styles.formSelect} value={tone} onChange={(e) => setTone(e.target.value)}>
                <option value="professional">Profesjonalny</option>
                <option value="casual">Luźny</option>
                <option value="urgent">Pilny (FOMO)</option>
                <option value="inspirational">Inspirujacy</option>
                <option value="educational">Edukacyjny</option>
              </select>
            </div>

            <button type="submit" className={styles.btnPrimary} disabled={loading || !product || !audience}>
              {loading ? 'Generowanie...' : 'Generuj kreacje'}
            </button>
          </form>
        </div>

        {/* Results */}
        <div>
          {loading && (
            <div className={styles.loadingOverlay}>
              <div className={styles.spinner} />
              Claude generuje kreacje...
            </div>
          )}

          {result && (
            <div>
              {result.variants.map((variant, i) => (
                <div key={i} className={styles.card} style={{ marginBottom: 12 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3 style={{ color: '#fff', fontSize: 14, fontWeight: 600, margin: '0 0 8px' }}>
                      Wariant {i + 1}
                    </h3>
                    <span style={{ color: '#fbbf24', fontSize: 12 }}>
                      QS: {variant.estimatedQualityScore}/10
                    </span>
                  </div>

                  <div style={{ marginBottom: 8 }}>
                    <p style={{ color: '#8b8fa3', fontSize: 11, margin: '0 0 4px' }}>NAGLOWKI:</p>
                    {variant.headlines.map((h, j) => (
                      <p key={j} style={{ color: '#fff', fontSize: 14, margin: '2px 0', padding: '4px 8px', background: '#1a1d2e', borderRadius: 4 }}>
                        {h}
                      </p>
                    ))}
                  </div>

                  <div style={{ marginBottom: 8 }}>
                    <p style={{ color: '#8b8fa3', fontSize: 11, margin: '0 0 4px' }}>OPISY:</p>
                    {variant.descriptions.map((d, j) => (
                      <p key={j} style={{ color: '#c4c7d4', fontSize: 13, margin: '2px 0', padding: '4px 8px', background: '#1a1d2e', borderRadius: 4 }}>
                        {d}
                      </p>
                    ))}
                  </div>

                  <p style={{ color: '#60a5fa', fontSize: 12, margin: '4px 0 0' }}>
                    CTA: {variant.callToAction}
                  </p>
                  <p style={{ color: '#8b8fa3', fontSize: 12, margin: '4px 0 0', fontStyle: 'italic' }}>
                    {variant.reasoning}
                  </p>
                </div>
              ))}

              {result.abTestSuggestion && (
                <div className={styles.card} style={{ borderLeft: '3px solid #7B2CBF' }}>
                  <p style={{ color: '#fff', fontSize: 13, fontWeight: 500, margin: '0 0 4px' }}>
                    Rekomendacja A/B test:
                  </p>
                  <p style={{ color: '#c4c7d4', fontSize: 13, margin: 0 }}>
                    {result.abTestSuggestion}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

// =============================================================================
// Intelligence View
// =============================================================================

function IntelligenceView({ alerts }: { alerts: Alert[] }) {
  const [competitors, setCompetitors] = useState<Array<{
    id: string;
    name: string;
    domain: string;
    platforms: string[];
    trackingEnabled: boolean;
    lastAnalyzed?: string;
  }>>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [newName, setNewName] = useState('');
  const [newDomain, setNewDomain] = useState('');

  useEffect(() => {
    loadCompetitors();
  }, []);

  async function loadCompetitors() {
    try {
      const res = await fetch('/api/mcc/intelligence?type=competitors');
      if (res.ok) {
        const data = await res.json();
        setCompetitors(data.competitors || []);
      }
    } catch (error) {
      console.error('Load competitors error:', error);
    }
  }

  async function addCompetitor(e: React.FormEvent) {
    e.preventDefault();
    try {
      await fetch('/api/mcc/intelligence', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'add_competitor',
          name: newName,
          domain: newDomain,
          platforms: ['google_ads', 'meta_ads'],
        }),
      });
      setNewName('');
      setNewDomain('');
      setShowAdd(false);
      loadCompetitors();
    } catch (error) {
      console.error('Add competitor error:', error);
    }
  }

  async function analyzeAll() {
    setAnalyzing(true);
    try {
      await fetch('/api/mcc/intelligence', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'analyze' }),
      });
      loadCompetitors();
    } catch (error) {
      console.error('Analyze error:', error);
    }
    setAnalyzing(false);
  }

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h2 style={{ color: '#fff', fontSize: 18, fontWeight: 600, margin: 0 }}>
          Monitoring konkurencji
        </h2>
        <div className={styles.btnGroup}>
          <button className={styles.btnSecondary} onClick={analyzeAll} disabled={analyzing}>
            {analyzing ? 'Analizowanie...' : 'Analizuj wszystkich'}
          </button>
          <button className={styles.btnPrimary} onClick={() => setShowAdd(true)}>
            + Dodaj konkurenta
          </button>
        </div>
      </div>

      {/* Competitors list */}
      {competitors.length === 0 ? (
        <div className={styles.emptyState}>
          <p className={styles.emptyStateTitle}>Brak sledzonych konkurentow</p>
          <p className={styles.emptyStateText}>
            Dodaj konkurentow, aby monitorowac ich aktywnosc reklamowa i pozycjonowanie.
          </p>
        </div>
      ) : (
        <div className={styles.cardGrid}>
          {competitors.map((comp) => (
            <div key={comp.id} className={styles.card}>
              <h3 className={styles.cardName}>{comp.name}</h3>
              <p className={styles.cardSlug}>{comp.domain}</p>
              <div className={styles.cardStats}>
                <span className={styles.cardStat}>
                  Platformy: <span className={styles.cardStatValue}>
                    {comp.platforms.map((p) => PLATFORM_LABELS[p] || p).join(', ')}
                  </span>
                </span>
              </div>
              {comp.lastAnalyzed && (
                <p style={{ color: '#8b8fa3', fontSize: 12, margin: '8px 0 0' }}>
                  Ostatnia analiza: {new Date(comp.lastAnalyzed).toLocaleString('pl')}
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Alerts Section */}
      {alerts.length > 0 && (
        <>
          <h2 style={{ color: '#fff', fontSize: 18, fontWeight: 600, margin: '32px 0 16px' }}>
            Alerty konkurencji
          </h2>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Waznosc</th>
                <th>Tytul</th>
                <th>Opis</th>
                <th>Data</th>
              </tr>
            </thead>
            <tbody>
              {alerts.map((alert) => (
                <tr key={alert.id}>
                  <td>
                    <span className={
                      alert.severity === 'critical' ? styles.statusDraft :
                      alert.severity === 'warning' ? styles.statusScheduled :
                      styles.statusPublished
                    }>
                      {alert.severity}
                    </span>
                  </td>
                  <td style={{ color: '#fff' }}>{alert.title}</td>
                  <td>{alert.description}</td>
                  <td>{new Date(alert.createdAt).toLocaleDateString('pl')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      {/* Add Competitor Modal */}
      {showAdd && (
        <div className={styles.modalOverlay} onClick={() => setShowAdd(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h2 className={styles.modalTitle}>Dodaj konkurenta</h2>
            <form onSubmit={addCompetitor}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Nazwa firmy</label>
                <input
                  className={styles.formInput}
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="np. Semcore"
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Domena</label>
                <input
                  className={styles.formInput}
                  value={newDomain}
                  onChange={(e) => setNewDomain(e.target.value)}
                  placeholder="np. semcore.pl"
                  required
                />
              </div>
              <div className={styles.modalActions}>
                <button type="button" className={styles.btnSecondary} onClick={() => setShowAdd(false)}>
                  Anuluj
                </button>
                <button type="submit" className={styles.btnPrimary} disabled={!newName || !newDomain}>
                  Dodaj
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

// =============================================================================
// Analytics View
// =============================================================================

function AnalyticsView() {
  const [overview, setOverview] = useState<{
    totalSpend: number;
    totalConversions: number;
    totalRevenue: number;
    blendedCpa: number;
    blendedRoas: number;
    platformBreakdown: Array<{
      platform: string;
      metrics: { impressions: number; clicks: number; conversions: number; cost: number; roas: number };
      share: number;
    }>;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();
  }, []);

  async function loadAnalytics() {
    setLoading(true);
    try {
      const res = await fetch('/api/mcc/analytics?type=overview');
      if (res.ok) {
        const data = await res.json();
        setOverview(data);
      }
    } catch (error) {
      console.error('Analytics load error:', error);
    }
    setLoading(false);
  }

  if (loading) {
    return <div className={styles.loadingOverlay}><div className={styles.spinner} /> Ladowanie analityki...</div>;
  }

  if (!overview) {
    return (
      <div className={styles.emptyState}>
        <p className={styles.emptyStateTitle}>Brak danych</p>
        <p className={styles.emptyStateText}>Podlacz platformy reklamowe, aby zobaczyc analityke.</p>
      </div>
    );
  }

  return (
    <>
      {/* KPI Cards */}
      <div className={styles.cardGrid}>
        <div className={styles.card}>
          <p style={{ color: '#8b8fa3', fontSize: 12, margin: '0 0 4px' }}>CALKOWITE WYDATKI</p>
          <p style={{ color: '#fff', fontSize: 28, fontWeight: 700, margin: 0 }}>
            {overview.totalSpend.toFixed(0)} PLN
          </p>
        </div>
        <div className={styles.card}>
          <p style={{ color: '#8b8fa3', fontSize: 12, margin: '0 0 4px' }}>KONWERSJE</p>
          <p style={{ color: '#fff', fontSize: 28, fontWeight: 700, margin: 0 }}>
            {overview.totalConversions}
          </p>
        </div>
        <div className={styles.card}>
          <p style={{ color: '#8b8fa3', fontSize: 12, margin: '0 0 4px' }}>PRZYCHOD</p>
          <p style={{ color: '#4ade80', fontSize: 28, fontWeight: 700, margin: 0 }}>
            {overview.totalRevenue.toFixed(0)} PLN
          </p>
        </div>
        <div className={styles.card}>
          <p style={{ color: '#8b8fa3', fontSize: 12, margin: '0 0 4px' }}>BLENDED CPA</p>
          <p style={{ color: '#fff', fontSize: 28, fontWeight: 700, margin: 0 }}>
            {overview.blendedCpa.toFixed(2)} PLN
          </p>
        </div>
        <div className={styles.card}>
          <p style={{ color: '#8b8fa3', fontSize: 12, margin: '0 0 4px' }}>BLENDED ROAS</p>
          <p style={{
            color: overview.blendedRoas > 1 ? '#4ade80' : '#f87171',
            fontSize: 28,
            fontWeight: 700,
            margin: 0,
          }}>
            {overview.blendedRoas.toFixed(1)}x
          </p>
        </div>
      </div>

      {/* Platform Breakdown */}
      <h2 style={{ color: '#fff', fontSize: 18, fontWeight: 600, margin: '32px 0 16px' }}>
        Rozklad platform
      </h2>
      {overview.platformBreakdown.length > 0 ? (
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Platforma</th>
              <th>Udzial wydatkow</th>
              <th>Impressions</th>
              <th>Clicks</th>
              <th>Konwersje</th>
              <th>Koszt</th>
              <th>ROAS</th>
            </tr>
          </thead>
          <tbody>
            {overview.platformBreakdown.map((pb) => (
              <tr key={pb.platform}>
                <td style={{ color: '#fff', fontWeight: 500 }}>
                  {PLATFORM_LABELS[pb.platform] || pb.platform}
                </td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{
                      width: 60,
                      height: 6,
                      background: '#3a3d50',
                      borderRadius: 3,
                      overflow: 'hidden',
                    }}>
                      <div style={{
                        width: `${pb.share}%`,
                        height: '100%',
                        background: 'linear-gradient(135deg, #7B2CBF, #0066FF)',
                        borderRadius: 3,
                      }} />
                    </div>
                    <span>{pb.share.toFixed(0)}%</span>
                  </div>
                </td>
                <td>{pb.metrics.impressions.toLocaleString()}</td>
                <td>{pb.metrics.clicks.toLocaleString()}</td>
                <td>{pb.metrics.conversions}</td>
                <td>{pb.metrics.cost.toFixed(0)} PLN</td>
                <td style={{ color: pb.metrics.roas > 1 ? '#4ade80' : '#f87171' }}>
                  {pb.metrics.roas.toFixed(1)}x
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p style={{ color: '#8b8fa3', fontSize: 14 }}>
          Brak danych o wydatkach. Podlacz platformy reklamowe.
        </p>
      )}
    </>
  );
}
