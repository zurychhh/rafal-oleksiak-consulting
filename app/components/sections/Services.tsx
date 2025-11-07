import styles from "./Services.module.css";

export default function Services() {
  const services = [
    {
      id: 1,
      iconGradient: "linear-gradient(135deg, #7B2CBF, #9D4EDD)",
      icon: "fa-chart-line",
      title: "CRM Strategy & Implementation",
      description: "Complete CRM setup, data migration, and process optimization to maximize customer lifetime value and retention rates.",
      deliverables: [
        "HubSpot, Salesforce, Pipedrive setup",
        "Custom workflow automation",
        "Lead scoring & segmentation"
      ]
    },
    {
      id: 2,
      iconGradient: "linear-gradient(135deg, #0066FF, #00BFFF)",
      icon: "fa-envelope",
      title: "Email Marketing Automation",
      description: "Advanced email sequences, behavioral triggers, and personalization strategies that convert prospects into customers.",
      deliverables: [
        "Welcome series optimization",
        "Abandoned cart recovery",
        "Re-engagement campaigns"
      ]
    },
    {
      id: 3,
      iconGradient: "linear-gradient(135deg, #10B981, #34D399)",
      icon: "fa-gears",
      title: "Marketing Automation",
      description: "Multi-channel automation workflows that nurture leads through the entire customer journey with precision.",
      deliverables: [
        "Lead nurturing sequences",
        "Cross-channel integration",
        "Behavioral trigger setup"
      ]
    },
    {
      id: 4,
      iconGradient: "linear-gradient(135deg, #F59E0B, #FBBF24)",
      icon: "fa-users",
      title: "Customer Retention",
      description: "Data-driven retention strategies that increase customer lifetime value and reduce churn through targeted campaigns.",
      deliverables: [
        "Churn prediction models",
        "Loyalty program automation",
        "Win-back campaigns"
      ]
    },
    {
      id: 5,
      iconGradient: "linear-gradient(135deg, #EF4444, #F87171)",
      icon: "fa-chart-column",
      title: "Analytics & Optimization",
      description: "Comprehensive tracking, reporting, and continuous optimization to ensure maximum ROI from your automation efforts.",
      deliverables: [
        "Custom dashboard creation",
        "A/B testing frameworks",
        "Performance optimization"
      ]
    },
    {
      id: 6,
      iconGradient: "linear-gradient(135deg, #8B5CF6, #A78BFA)",
      icon: "fa-graduation-cap",
      title: "Team Training & Support",
      description: "Comprehensive training programs and ongoing support to ensure your team can maintain and optimize systems independently.",
      deliverables: [
        "Platform training sessions",
        "Best practices workshops",
        "Ongoing support packages"
      ]
    }
  ];

  return (
    <section className={styles.servicesSection} id="revenue-driving-services">
      <div className={styles.servicesContainer}>

        {/* Header */}
        <div className={styles.header}>
          <h2 className={styles.headline}>Revenue-Driving Services</h2>
          <p className={styles.subheadline}>
            Comprehensive CRM and marketing automation solutions designed to maximize your owned channel revenue
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
