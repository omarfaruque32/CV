const experiences = [
  {
    period: "Sep 2024 — Present",
    role: "Senior Project Manager",
    company: "KI-Quadrat Systemhaus GmbH (KI²)",
    location: "Vienna, Austria · Remote",
    summary:
      "Leading end-to-end delivery of sovereign AI products for European municipalities, with compliance and operational trust built into every release.",
    highlights: [
      "Own a 136-feature roadmap from sprint-ready specification through production deployment.",
      "Sequence dependencies across five AI products, including citizen services, legal, funding, and permit workflows.",
      "Coordinate distributed engineering, QA, municipal stakeholders, and secure on-premise pilot deployments.",
    ],
  },
  {
    period: "Nov 2022 — Aug 2024",
    role: "Project Manager",
    company: "AI App Company",
    location: "Berlin, Germany",
    summary:
      "Delivered AI product initiatives through structured planning, clear objectives, and measurable milestones.",
    highlights: [
      "Built and managed accountable cross-functional teams around shared delivery outcomes.",
      "Maintained velocity through early risk identification, proactive unblocking, and clear stakeholder communication.",
    ],
  },
  {
    period: "Mar 2019 — Aug 2023",
    role: "Digital Marketing Manager",
    company: "My Digital Consultant",
    location: "Dhaka, Bangladesh",
    summary:
      "Designed goal-driven digital strategies for SME clients across multiple verticals.",
    highlights: [
      "Improved SEO performance and organic visibility across client portfolios.",
      "Managed social content, email campaigns, and performance reporting.",
    ],
  },
];

const earlierExperience = [
  {
    period: "Sep 2020 — Aug 2021",
    role: "English Teacher",
    company: "Uncle Sam’s American English School · Shenzhen, China",
  },
  {
    period: "Jan 2018 — Mar 2020",
    role: "International Students Recruiter",
    company: "Elvon International · Nanchang, China",
  },
];

const capabilities = [
  {
    label: "Delivery",
    items: [
      "Agile & sprint planning",
      "Backlog prioritisation",
      "Release management",
      "Risk surfacing",
    ],
  },
  {
    label: "Leadership",
    items: [
      "Cross-timezone teams",
      "Stakeholder reporting",
      "Vendor management",
      "Dependency sequencing",
    ],
  },
  {
    label: "Governance",
    items: [
      "ISO 27001",
      "ISO 42001",
      "GDPR-ready architecture",
      "Compliance documentation",
    ],
  },
  {
    label: "AI & Technology",
    items: [
      "RAG pipelines",
      "Multi-tenant SaaS",
      "LLM integration",
      "EU data residency",
    ],
  },
];

const certifications = [
  "Google Project Management Certificate — Google / Coursera",
  "Agile Project Management — Google / Coursera",
  "IT Security Foundations: Core Concepts — LinkedIn Learning",
  "Blockchain Essentials — IBM",
  "Developing Your Leadership Philosophy — LinkedIn Learning",
];

const tools = ["ClickUp", "Jira", "Notion", "GitHub", "Postman", "Slack"];

export default function Home() {
  return (
    <main id="main-content">
      <a className="skip-link" href="#profile">
        Skip to profile
      </a>

      <header className="site-header">
        <a className="brand" href="#top" aria-label="Omar Faruque — Home">
          <span>OF</span>
        </a>
        <nav aria-label="Primary navigation">
          <a href="#profile">Profile</a>
          <a href="#experience">Experience</a>
          <a href="#capabilities">Capabilities</a>
          <a href="#contact">Contact</a>
        </nav>
        <a className="header-link" href="/Omar_Faruque_CV.pdf" download>
          Download CV <span aria-hidden="true">↘</span>
        </a>
      </header>

      <section className="hero" id="top" aria-labelledby="hero-title">
        <div className="hero-index" aria-hidden="true">
          PORTFOLIO / 2026
        </div>
        <div className="hero-title-wrap">
          <p className="eyebrow">Senior Tech Project Manager</p>
          <h1 id="hero-title">
            Omar
            <br />
            <em>Faruque.</em>
          </h1>
        </div>
        <div className="hero-intro">
          <p className="hero-kicker">AI · GovTech · Cross-functional execution</p>
          <p>
            I translate complex technical roadmaps into structured, predictable
            execution — aligning product, engineering, and leadership around
            outcomes that scale.
          </p>
          <div className="hero-actions">
            <a className="primary-action" href="#experience">
              Explore my experience <span aria-hidden="true">↓</span>
            </a>
            <a
              className="text-action"
              href="mailto:omarfaruque32@gmail.com"
            >
              Email me <span aria-hidden="true">↗</span>
            </a>
          </div>
        </div>
      </section>

      <section className="proof-strip" aria-label="Career highlights">
        <div>
          <strong>136</strong>
          <span>feature roadmap owned end to end</span>
        </div>
        <div>
          <strong>05</strong>
          <span>AI products sequenced in one platform</span>
        </div>
        <div>
          <strong>03</strong>
          <span>European markets served</span>
        </div>
        <div className="proof-note">
          <span className="status-dot" aria-hidden="true" />
          Based in Bangladesh · Working across time zones
        </div>
      </section>

      <section className="section-grid profile-section" id="profile">
        <div className="section-marker">
          <span>01 / 05</span>
          <p>Profile</p>
        </div>
        <div className="section-content profile-copy">
          <p className="display-copy">
            Building execution systems for ambitious, compliance-critical
            technology.
          </p>
          <div className="profile-columns">
            <p>
              I specialise in AI, SaaS, and GovTech delivery across distributed
              teams. My work turns high-complexity initiatives into visible,
              dependable progress through clear ownership, tight sequencing,
              and practical release discipline.
            </p>
            <p>
              From EU data residency and ISO-aligned architecture to municipal
              pilots and cross-timezone sprint planning, I create the conditions
              for teams and stakeholders to trust every milestone.
            </p>
          </div>
        </div>
      </section>

      <section className="section-grid experience-section" id="experience">
        <div className="section-marker">
          <span>02 / 05</span>
          <p>Experience</p>
        </div>
        <div className="section-content">
          <div className="section-heading-row">
            <h2>Selected experience</h2>
            <a href="/Omar_Faruque_CV.pdf" target="_blank" rel="noreferrer">
              View full CV <span aria-hidden="true">↗</span>
            </a>
          </div>

          <div className="experience-list">
            {experiences.map((experience, index) => (
              <article className="experience-item" key={experience.company}>
                <div className="experience-meta">
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <time>{experience.period}</time>
                </div>
                <div className="experience-role">
                  <h3>{experience.role}</h3>
                  <p>{experience.company}</p>
                  <span>{experience.location}</span>
                </div>
                <div className="experience-detail">
                  <p>{experience.summary}</p>
                  <ul>
                    {experience.highlights.map((highlight) => (
                      <li key={highlight}>{highlight}</li>
                    ))}
                  </ul>
                </div>
              </article>
            ))}
          </div>

          <div className="earlier-work">
            <p className="eyebrow">Earlier experience</p>
            {earlierExperience.map((experience) => (
              <div className="earlier-row" key={experience.role}>
                <time>{experience.period}</time>
                <strong>{experience.role}</strong>
                <span>{experience.company}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="impact-band" aria-labelledby="impact-title">
        <div>
          <p className="eyebrow">Current focus</p>
          <h2 id="impact-title">Sovereign AI for public services.</h2>
        </div>
        <p>
          Delivering trustworthy municipal assistants across Austria, Romania,
          and Germany — connecting complex institutional knowledge to accurate,
          citizen-facing answers while keeping data residency and compliance at
          the centre of the platform.
        </p>
        <div className="impact-tags" aria-label="Governance focus">
          <span>ISO 27001</span>
          <span>ISO 42001</span>
          <span>GDPR</span>
        </div>
      </section>

      <section className="section-grid capabilities-section" id="capabilities">
        <div className="section-marker">
          <span>03 / 05</span>
          <p>Capabilities</p>
        </div>
        <div className="section-content">
          <h2>How I move work forward</h2>
          <div className="capability-grid">
            {capabilities.map((capability, index) => (
              <article className="capability" key={capability.label}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <h3>{capability.label}</h3>
                <ul>
                  {capability.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
          <div className="tools-row">
            <p>Tools I work with</p>
            <div>
              {tools.map((tool) => (
                <span key={tool}>{tool}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section-grid credentials-section" id="credentials">
        <div className="section-marker">
          <span>04 / 05</span>
          <p>Credentials</p>
        </div>
        <div className="section-content credentials-layout">
          <div className="education-block">
            <p className="eyebrow">Education</p>
            <h2>Bachelor of Engineering</h2>
            <p>Computer Science & Engineering</p>
            <div>
              <strong>Jiangxi Normal University</strong>
              <span>Nanchang, China · 2017 — 2021</span>
            </div>
          </div>
          <div className="certification-block">
            <p className="eyebrow">Certifications</p>
            <ol>
              {certifications.map((certification) => (
                <li key={certification}>{certification}</li>
              ))}
            </ol>
          </div>
          <div className="language-block">
            <p className="eyebrow">Languages</p>
            <div>
              <span>English</span>
              <strong>Native / Bilingual</strong>
            </div>
            <div>
              <span>Bengali</span>
              <strong>Native</strong>
            </div>
            <div>
              <span>Chinese (Mandarin)</span>
              <strong>Elementary</strong>
            </div>
          </div>
        </div>
      </section>

      <section className="contact-section" id="contact">
        <div className="contact-index">05 / 05</div>
        <p className="eyebrow">Let’s build with clarity</p>
        <h2>
          Have a complex roadmap?
          <br />
          <em>Let’s make it executable.</em>
        </h2>
        <div className="contact-actions">
          <a href="mailto:omarfaruque32@gmail.com">
            omarfaruque32@gmail.com <span aria-hidden="true">↗</span>
          </a>
          <a
            href="https://www.linkedin.com/in/omarfaruquerajim"
            target="_blank"
            rel="noreferrer"
          >
            LinkedIn <span aria-hidden="true">↗</span>
          </a>
          <a href="/Omar_Faruque_CV.pdf" download>
            Download CV <span aria-hidden="true">↓</span>
          </a>
        </div>
      </section>

      <footer>
        <span>© 2026 Omar Faruque</span>
        <span>Senior Tech Project Manager · AI & GovTech Delivery</span>
        <a href="#top">Back to top ↑</a>
      </footer>
    </main>
  );
}
