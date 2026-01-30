import styles from "./Services.module.css";

export default function Services() {
  const services = [
    {
      id: 1,
      iconGradient: "linear-gradient(135deg, #7B2CBF, #9D4EDD)",
      icon: "fa-chart-line",
      title: "CRM Strategy That Retains 30% More Customers",
      description: "I build CRM systems that turn one-time buyers into repeat customers. My proven frameworks help you retain 20-30% more customers than industry average.",
      deliverables: [
        "HubSpot, Salesforce, Pipedrive setup - configured to your business model, not generic templates",
        "Custom workflow automation that saves your team 15+ hours per week",
        "Lead scoring & segmentation so sales focuses on ready-to-buy prospects"
      ]
    },
    {
      id: 2,
      iconGradient: "linear-gradient(135deg, #0066FF, #00BFFF)",
      icon: "fa-envelope",
      title: "Email Automation That Converts 25%+ More Prospects",
      description: "I design email sequences that feel like 1-on-1 conversations. You'll convert 20-30% more prospects - automatically.",
      deliverables: [
        "Welcome series that convert 40%+ of new subscribers (vs 10% industry average)",
        "Abandoned cart recovery flows recovering 15-25% of lost revenue",
        "Re-engagement campaigns that win back 20% of dormant customers"
      ]
    },
    {
      id: 3,
      iconGradient: "linear-gradient(135deg, #10B981, #34D399)",
      icon: "fa-gears",
      title: "Marketing Automation That Nurtures Leads While You Sleep",
      description: "I build marketing machines that work 24/7. Your team focuses on closing, not chasing cold leads.",
      deliverables: [
        "Lead nurturing sequences that move 30% more prospects from MQL to SQL",
        "Cross-channel integration (email + SMS + web + ads) for consistent messaging",
        "Behavioral triggers that respond to customer actions in real-time"
      ]
    },
    {
      id: 4,
      iconGradient: "linear-gradient(135deg, #F59E0B, #FBBF24)",
      icon: "fa-users",
      title: "Customer Retention That Reduces Churn by 25%",
      description: "I predict which customers are about to churn - before they leave. My frameworks reduce churn by 20-30% and increase LTV by 40%+.",
      deliverables: [
        "Churn prediction models that flag at-risk customers 30-60 days before they cancel",
        "Loyalty program automation that rewards top 20% of customers driving 80% of revenue",
        "Win-back campaigns that reactivate 15-20% of churned customers"
      ]
    },
    {
      id: 5,
      iconGradient: "linear-gradient(135deg, #EF4444, #F87171)",
      icon: "fa-chart-column",
      title: "Analytics That Show Exactly Where to Double ROI",
      description: "I don't just give you dashboards - I tell you what they mean. My frameworks identify the 3 levers that will double your ROI.",
      deliverables: [
        "Custom dashboards showing the 5 metrics that actually matter to revenue",
        "A/B testing frameworks that increase conversion rates by 15-30% per quarter",
        "Monthly optimization sprints delivering 5-10% compound improvements"
      ]
    },
    {
      id: 6,
      iconGradient: "linear-gradient(135deg, #8B5CF6, #A78BFA)",
      icon: "fa-graduation-cap",
      title: "Team Training That Makes Your Team Self-Sufficient",
      description: "I don't create dependence - I create capability. My programs reduce external consulting costs by 70%+ over 2 years.",
      deliverables: [
        "Hands-on platform training (HubSpot/Salesforce/Pipedrive) customized to your workflows",
        "Best practices workshops based on 8+ years of enterprise CRM leadership",
        "30/60/90-day support packages with guaranteed <24h response times"
      ]
    }
  ];

  return (
    <section className={styles.servicesSection} id="revenue-driving-services">
      <div className={styles.servicesContainer}>

        {/* Header */}
        <div className={styles.header}>
          <h2 className={styles.headline}>How I Drive Your Revenue</h2>
          <p className={styles.subheadline}>
            From traffic optimization and UX to CRM and lifecycle automation — measurable ROI in 30 days
          </p>
        </div>

        {/* Services Grid */}
        <div className={styles.servicesGrid}>
          {services.map((service) => (
            <article key={service.id} className={styles.serviceCard}>

              {/* Icon */}
              <div
                className={styles.icon}
                style={{ background: service.iconGradient }}
              >
                <i className={`fa-solid ${service.icon}`}></i>
              </div>

              {/* Title */}
              <h3 className={styles.cardTitle}>{service.title}</h3>

              {/* Description */}
              <p className={styles.description}>{service.description}</p>

              {/* Deliverables */}
              <ul className={styles.deliverables}>
                {service.deliverables.map((item, index) => (
                  <li key={index} className={styles.deliverableItem}>
                    {item}
                  </li>
                ))}
              </ul>

            </article>
          ))}
        </div>

      </div>
    </section>
  );
}
