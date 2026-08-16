const experiences = [
  {
    period: "Sep 2024 — Present",
    role: "Senior Project Manager",
    company: "KI-Quadrat Systemhaus GmbH (KI²)",
    location: "Vienna, Austria · Remote",
    summary:
      "Lead complex AI and GovTech delivery from roadmap to release, aligning distributed teams and municipal stakeholders around clear outcomes.",
    highlights: [
      "Manage a 136-feature roadmap across five AI products, converting business priorities into sprint-ready plans.",
      "Coordinate engineering, QA, leadership, and municipal stakeholders across Austria, Romania, and Germany.",
      "Manage risks, dependencies, acceptance criteria, release readiness, and compliance-sensitive deployments.",
    ],
  },
  {
    period: "Nov 2022 — Aug 2024",
    role: "Project Manager",
    company: "AI App Company",
    location: "Berlin, Germany",
    summary:
      "Managed AI product initiatives through structured planning, clear scope, and measurable milestones.",
    highlights: [
      "Built accountable cross-functional teams around shared delivery goals.",
      "Maintained momentum through proactive risk management, unblocking, and stakeholder communication.",
    ],
  },
  {
    period: "Mar 2019 — Aug 2023",
    role: "Digital Marketing Manager",
    company: "My Digital Consultant",
    location: "Dhaka, Bangladesh",
    summary:
      "Connected strategy, audience insight, and execution for SME clients across multiple industries.",
    highlights: [
      "Improved organic visibility through SEO and goal-driven content strategy.",
      "Managed campaign calendars, email delivery, performance reporting, and client communication.",
    ],
  },
];

const earlierExperience = [
  {
    period: "Sep 2020 — Aug 2021",
    role: "English Teacher",
    company: "Uncle Sam’s American English School · Shenzhen, China",
    value: "Built facilitation, adaptability, and audience-aware communication.",
  },
  {
    period: "Jan 2018 — Mar 2020",
    role: "International Students Recruiter",
    company: "Elvon International · Nanchang, China",
    value: "Managed relationships and end-to-end student application pipelines.",
  },
];

const selectedWork = [
  {
    number: "01",
    label: "Product delivery",
    title: "A five-product AI roadmap",
    proof: "136 features · 05 products",
    challenge:
      "Align multiple AI products, dependencies, and stakeholders within one delivery system.",
    contribution:
      "Turn business priorities into specifications, sprint plans, clear ownership, and coordinated releases.",
    outcome:
      "Created greater visibility across dependencies and a more predictable path from decision to delivery.",
  },
  {
    number: "02",
    label: "GovTech operations",
    title: "Municipal AI pilot delivery",
    proof: "Austria · Romania · Germany",
    challenge:
      "Deliver public-service AI in environments shaped by trust, security, and infrastructure constraints.",
    contribution:
      "Coordinate on-premise readiness, acceptance criteria, delivery risk, and compliance-aware stakeholders.",
    outcome:
      "Helped move pilots forward with stronger operational clarity and stakeholder confidence.",
  },
  {
    number: "03",
    label: "Business & growth",
    title: "Digital growth for SMEs",
    proof: "SEO · Content · Reporting",
    challenge:
      "Bring focus and measurement to fragmented digital channels across different client industries.",
    contribution:
      "Structure audience-led strategies, campaign calendars, content delivery, and performance reporting.",
    outcome:
      "Improved organic visibility and gave clients clearer information for marketing decisions.",
  },
];

const capabilities = [
  {
    label: "Project Delivery",
    items: [
      "Roadmap development",
      "Agile & sprint planning",
      "Risk & dependency management",
      "Release coordination",
    ],
  },
  {
    label: "Product & Technology",
    items: [
      "AI & SaaS delivery",
      "Requirements definition",
      "QA & acceptance criteria",
      "Compliance awareness",
    ],
  },
  {
    label: "Business & Growth",
    items: [
      "Digital strategy",
      "SEO & content",
      "Audience understanding",
      "Performance reporting",
    ],
  },
  {
    label: "People & Communication",
    items: [
      "Cross-functional leadership",
      "Stakeholder reporting",
      "Facilitation & teaching",
      "Cross-cultural collaboration",
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

const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Omar Faruque",
  jobTitle: "Project Manager and Cross-Functional Operator",
  email: "mailto:omarfaruque32@gmail.com",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Cumilla",
    addressCountry: "Bangladesh",
  },
  alumniOf: {
    "@type": "CollegeOrUniversity",
    name: "Jiangxi Normal University",
  },
  worksFor: {
    "@type": "Organization",
    name: "KI-Quadrat Systemhaus GmbH",
  },
  sameAs: ["https://www.linkedin.com/in/omarfaruquerajim"],
  knowsAbout: [
    "Project Management",
    "AI Product Delivery",
    "GovTech",
    "SaaS",
    "Digital Strategy",
    "Cross-Functional Leadership",
  ],
};

export default function Home() {
  return (
    <>
      <a className="skip-link" href="#main-content">
        Skip to main content
      </a>

      <header className="site-header">
        <a className="brand" href="#top" aria-label="Omar Faruque — Home">
          <span>OF</span>
        </a>
        <nav aria-label="Primary navigation">
          <a href="#profile">Profile</a>
          <a href="#experience">Experience</a>
          <a href="#work">Work</a>
          <a href="#capabilities">Capabilities</a>
          <a href="#contact">Contact</a>
        </nav>
        <a
          className="header-link"
          href="/Omar_Faruque_CV.pdf"
          download
          aria-label="Download Omar Faruque’s CV"
        >
          Download CV <span aria-hidden="true">↘</span>
        </a>
      </header>

      <main id="main-content" tabIndex={-1}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(personSchema).replace(/</g, "\\u003c"),
          }}
        />

      <section className="hero" id="top" aria-labelledby="hero-title">
        <div className="hero-index" aria-hidden="true">
          PORTFOLIO / 2026
        </div>
        <div className="hero-title-wrap">
          <p className="eyebrow">Project Manager & Cross-Functional Operator</p>
          <h1 id="hero-title">
            Omar
            <br />
            <em>Faruque.</em>
          </h1>
        </div>
        <div className="hero-intro">
          <p className="hero-kicker">Projects · Products · People · Growth</p>
          <p>
            I turn complex ideas into clear, executable projects — connecting
            strategy, people, and delivery across technology, operations, and
            growth.
          </p>
          <div className="hero-actions">
            <a className="primary-action" href="#work">
              See how I work <span aria-hidden="true">↓</span>
            </a>
            <a className="text-action" href="mailto:omarfaruque32@gmail.com">
              Email me <span aria-hidden="true">↗</span>
            </a>
          </div>
        </div>
      </section>

      <section className="proof-strip" aria-label="Career highlights">
        <div>
          <strong>136</strong>
          <span>feature roadmap managed end to end</span>
        </div>
        <div>
          <strong>05</strong>
          <span>AI products coordinated in one platform</span>
        </div>
        <div>
          <strong>03</strong>
          <span>European markets supported</span>
        </div>
        <div className="proof-note">
          <span className="status-dot" aria-hidden="true" />
          <span>Based in Bangladesh · Working across time zones</span>
        </div>
      </section>

      <section className="section-grid profile-section" id="profile">
        <div className="section-marker">
          <span>01 / 06</span>
          <p>Profile</p>
        </div>
        <div className="section-content profile-copy">
          <p className="display-copy">
            Project management is my core discipline. Breadth is the advantage
            I bring.
          </p>
          <div className="profile-columns">
            <p>
              I’m a project manager and cross-functional generalist with
              experience across AI products, GovTech, digital strategy,
              recruitment, and international education. I bring structure to
              ambiguity, turn priorities into plans, and keep teams moving
              toward shared outcomes.
            </p>
            <p>
              My range helps me see the whole system: customer needs,
              commercial context, technical constraints, stakeholder
              expectations, and the communication required to connect them.
            </p>
          </div>
        </div>
      </section>

      <section className="section-grid experience-section" id="experience">
        <div className="section-marker">
          <span>02 / 06</span>
          <p>Experience</p>
        </div>
        <div className="section-content">
          <div className="section-heading-row">
            <h2>Experience with a clear through-line</h2>
            <a
              href="/Omar_Faruque_CV.pdf"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="View Omar Faruque’s full CV in a new tab"
            >
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
            <p className="eyebrow">Earlier experience, lasting value</p>
            {earlierExperience.map((experience) => (
              <div className="earlier-row" key={experience.role}>
                <time>{experience.period}</time>
                <div>
                  <strong>{experience.role}</strong>
                  <span>{experience.company}</span>
                </div>
                <p>{experience.value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="impact-band" aria-labelledby="impact-title">
        <div>
          <p className="eyebrow">The thread through my work</p>
          <h2 id="impact-title">Clarity, coordination, momentum.</h2>
        </div>
        <p>
          Across AI delivery, marketing, recruitment, and teaching, the work has
          always been the same at its core: understand people, organise
          complexity, communicate clearly, and move outcomes forward.
        </p>
        <div className="impact-tags" aria-label="Operating strengths">
          <span>Strategy</span>
          <span>Delivery</span>
          <span>Communication</span>
          <span>Adaptability</span>
        </div>
      </section>

      <section className="section-grid work-section" id="work">
        <div className="section-marker">
          <span>03 / 06</span>
          <p>Selected work</p>
        </div>
        <div className="section-content">
          <div className="section-heading-row work-heading">
            <h2>Problems I help teams move through</h2>
            <p>Three snapshots of how I connect strategy to execution.</p>
          </div>
          <div className="work-list">
            {selectedWork.map((project) => (
              <article className="work-card" key={project.title}>
                <div className="work-card-topline">
                  <span>{project.number}</span>
                  <p>{project.label}</p>
                </div>
                <h3>{project.title}</h3>
                <strong>{project.proof}</strong>
                <dl>
                  <div>
                    <dt>Challenge</dt>
                    <dd>{project.challenge}</dd>
                  </div>
                  <div>
                    <dt>My contribution</dt>
                    <dd>{project.contribution}</dd>
                  </div>
                  <div>
                    <dt>Outcome</dt>
                    <dd>{project.outcome}</dd>
                  </div>
                </dl>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section-grid capabilities-section" id="capabilities">
        <div className="section-marker">
          <span>04 / 06</span>
          <p>Capabilities</p>
        </div>
        <div className="section-content">
          <h2>A generalist toolkit, organised around delivery</h2>
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
          <span>05 / 06</span>
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
        <div className="contact-index">06 / 06</div>
        <p className="eyebrow">Let’s create forward motion</p>
        <h2>
          Have an idea, team, or roadmap?
          <br />
          <em>Let’s move it forward.</em>
        </h2>
        <div className="contact-actions">
          <a href="mailto:omarfaruque32@gmail.com">
            omarfaruque32@gmail.com <span aria-hidden="true">↗</span>
          </a>
          <a
            href="https://www.linkedin.com/in/omarfaruquerajim"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Omar Faruque on LinkedIn (opens in a new tab)"
          >
            LinkedIn <span aria-hidden="true">↗</span>
          </a>
          <a
            href="/Omar_Faruque_CV.pdf"
            download
            aria-label="Download Omar Faruque’s CV"
          >
            Download CV <span aria-hidden="true">↓</span>
          </a>
        </div>
      </section>

      </main>

      <footer>
        <span>© 2026 Omar Faruque</span>
        <span>Project Manager & Cross-Functional Operator</span>
        <a href="#top">Back to top ↑</a>
      </footer>
    </>
  );
}
