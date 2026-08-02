#!/usr/bin/env python3
"""Build Omar Faruque's ATS-friendly portfolio CV."""

from pathlib import Path
import shutil

from reportlab.lib import colors
from reportlab.lib.enums import TA_LEFT, TA_RIGHT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import mm
from reportlab.platypus import (
    HRFlowable,
    KeepTogether,
    PageBreak,
    Paragraph,
    SimpleDocTemplate,
    Spacer,
)


ROOT = Path(__file__).resolve().parents[1]
OUTPUT_PDF = ROOT / "output" / "pdf" / "Omar_Faruque_CV.pdf"
PUBLIC_PDF = ROOT / "public" / "Omar_Faruque_CV.pdf"

BLUE = colors.HexColor("#2854E8")
INK = colors.HexColor("#171A21")
MUTED = colors.HexColor("#555B66")
LINE = colors.HexColor("#D4D0C7")


def build_styles():
    base = getSampleStyleSheet()
    return {
        "name": ParagraphStyle(
            "Name",
            parent=base["Normal"],
            fontName="Helvetica-Bold",
            fontSize=27,
            leading=29,
            textColor=INK,
            spaceAfter=4,
        ),
        "role": ParagraphStyle(
            "Role",
            parent=base["Normal"],
            fontName="Helvetica-Bold",
            fontSize=9.2,
            leading=12,
            tracking=1.1,
            textColor=BLUE,
            spaceAfter=7,
        ),
        "contact": ParagraphStyle(
            "Contact",
            parent=base["Normal"],
            fontName="Helvetica",
            fontSize=8.4,
            leading=11,
            textColor=MUTED,
            spaceAfter=12,
        ),
        "section": ParagraphStyle(
            "Section",
            parent=base["Normal"],
            fontName="Helvetica-Bold",
            fontSize=9,
            leading=11,
            tracking=1.2,
            textColor=BLUE,
            spaceBefore=10,
            spaceAfter=5,
        ),
        "summary": ParagraphStyle(
            "Summary",
            parent=base["Normal"],
            fontName="Helvetica",
            fontSize=9.4,
            leading=13.6,
            textColor=INK,
            spaceAfter=3,
        ),
        "body": ParagraphStyle(
            "Body",
            parent=base["Normal"],
            fontName="Helvetica",
            fontSize=8.8,
            leading=12.3,
            textColor=INK,
            spaceAfter=3,
        ),
        "skill": ParagraphStyle(
            "Skill",
            parent=base["Normal"],
            fontName="Helvetica",
            fontSize=8.55,
            leading=12,
            textColor=INK,
            spaceAfter=2.5,
        ),
        "job": ParagraphStyle(
            "Job",
            parent=base["Normal"],
            fontName="Helvetica-Bold",
            fontSize=10.4,
            leading=12.5,
            textColor=INK,
            spaceBefore=6,
            spaceAfter=1,
        ),
        "job_meta": ParagraphStyle(
            "JobMeta",
            parent=base["Normal"],
            fontName="Helvetica",
            fontSize=8.25,
            leading=10.6,
            textColor=MUTED,
            spaceAfter=4,
        ),
        "bullet": ParagraphStyle(
            "Bullet",
            parent=base["Normal"],
            fontName="Helvetica",
            fontSize=8.45,
            leading=11.8,
            textColor=INK,
            leftIndent=11,
            firstLineIndent=-8,
            spaceAfter=2.5,
        ),
        "project": ParagraphStyle(
            "Project",
            parent=base["Normal"],
            fontName="Helvetica-Bold",
            fontSize=9.1,
            leading=11.5,
            textColor=INK,
            spaceBefore=4,
            spaceAfter=2,
        ),
        "footer": ParagraphStyle(
            "Footer",
            parent=base["Normal"],
            fontName="Helvetica",
            fontSize=7.5,
            leading=9,
            textColor=MUTED,
            alignment=TA_RIGHT,
        ),
    }


def section(title, styles):
    return [
        Paragraph(title.upper(), styles["section"]),
        HRFlowable(width="100%", thickness=0.65, color=LINE, spaceAfter=4),
    ]


def bullet(text, styles):
    return Paragraph(f"- {text}", styles["bullet"])


def job(role, company, location, dates, bullets, styles):
    content = [
        Paragraph(role, styles["job"]),
        Paragraph(
            f"<b>{company}</b> | {location} | {dates}",
            styles["job_meta"],
        ),
    ]
    content.extend(bullet(item, styles) for item in bullets)
    return KeepTogether(content)


def draw_page(canvas, document):
    canvas.saveState()
    canvas.setStrokeColor(LINE)
    canvas.setLineWidth(0.55)
    canvas.line(document.leftMargin, 15 * mm, A4[0] - document.rightMargin, 15 * mm)
    canvas.setFont("Helvetica", 7.3)
    canvas.setFillColor(MUTED)
    canvas.drawString(document.leftMargin, 10.5 * mm, "OMAR FARUQUE | CV 2026")
    canvas.drawRightString(
        A4[0] - document.rightMargin,
        10.5 * mm,
        f"PAGE {document.page}",
    )
    canvas.restoreState()


def build_pdf():
    OUTPUT_PDF.parent.mkdir(parents=True, exist_ok=True)
    PUBLIC_PDF.parent.mkdir(parents=True, exist_ok=True)

    styles = build_styles()
    document = SimpleDocTemplate(
        str(OUTPUT_PDF),
        pagesize=A4,
        leftMargin=18 * mm,
        rightMargin=18 * mm,
        topMargin=15 * mm,
        bottomMargin=21 * mm,
        title="Omar Faruque - Project Manager and Cross-Functional Operator",
        author="Omar Faruque",
        subject="Curriculum Vitae",
        keywords="project manager, cross-functional operator, AI delivery, GovTech, SaaS, digital strategy",
    )

    story = [
        Paragraph("OMAR FARUQUE", styles["name"]),
        Paragraph(
            "PROJECT MANAGER | CROSS-FUNCTIONAL OPERATOR",
            styles["role"],
        ),
        Paragraph(
            "Race Course, Dhanmondi Road, Cumilla, Bangladesh &nbsp; | &nbsp; "
            '<link href="mailto:omarfaruque32@gmail.com" color="#2854E8">'
            "omarfaruque32@gmail.com</link> &nbsp; | &nbsp; "
            '<link href="https://www.linkedin.com/in/omarfaruquerajim" color="#2854E8">'
            "linkedin.com/in/omarfaruquerajim</link>",
            styles["contact"],
        ),
    ]

    story.extend(section("Professional Summary", styles))
    story.append(
        Paragraph(
            "Project Manager and cross-functional generalist with experience delivering "
            "technology, AI, digital strategy, recruitment, and international education "
            "initiatives. Skilled at translating complex requirements into structured plans, "
            "coordinating distributed teams, managing stakeholders, and maintaining progress "
            "across competing priorities. Combines technical understanding, commercial "
            "awareness, and strong communication to move projects from idea to execution.",
            styles["summary"],
        )
    )

    story.extend(section("Core Strengths", styles))
    strengths = [
        ("Project Delivery", "Roadmaps, Agile and sprint planning, risk and dependency management, release coordination"),
        ("Product and Technology", "AI and SaaS delivery, requirements definition, QA, acceptance criteria, compliance awareness"),
        ("Business and Growth", "Digital strategy, SEO, content operations, audience understanding, performance reporting"),
        ("People and Communication", "Cross-functional leadership, stakeholder reporting, facilitation, cross-cultural collaboration"),
    ]
    for label, detail in strengths:
        story.append(Paragraph(f"<b>{label}:</b> {detail}", styles["skill"]))

    story.extend(section("Professional Experience", styles))
    story.append(
        job(
            "Senior Project Manager",
            "KI-Quadrat Systemhaus GmbH (KI2)",
            "Vienna, Austria (Remote)",
            "September 2024 - Present",
            [
                "Manage end-to-end execution of a 136-feature roadmap across five AI products, from sprint-ready specifications to production deployment.",
                "Coordinate engineering, QA, leadership, and municipal stakeholders across Austria, Romania, and Germany.",
                "Sequence product dependencies, prioritise backlogs, define acceptance criteria, and maintain release readiness across distributed teams.",
                "Manage delivery risks within ISO 27001, ISO 42001, GDPR, and EU data-residency requirements.",
                "Coordinate a municipal pilot in an on-premise Ubuntu and Hyper-V environment with WireGuard VPN, LDAP/AD, and Cloudflare Tunnel connectivity.",
                "Support version-controlled releases, rollback planning, and post-release quality monitoring through PostHog and Langfuse.",
            ],
            styles,
        )
    )
    story.append(
        job(
            "Project Manager",
            "AI App Company",
            "Berlin, Germany",
            "November 2022 - August 2024",
            [
                "Led planning, execution, and delivery for AI product initiatives with defined scope, clear objectives, and measurable milestones.",
                "Built accountable cross-functional teams around shared delivery outcomes and collaborative workflows.",
                "Maintained momentum through early risk identification, proactive unblocking, and structured communication between stakeholders and engineering.",
            ],
            styles,
        )
    )

    story.append(PageBreak())
    story.extend(section("Professional Experience - Continued", styles))
    story.append(
        job(
            "Digital Marketing Manager",
            "My Digital Consultant",
            "Dhaka, Bangladesh",
            "March 2019 - August 2023",
            [
                "Designed goal-driven digital strategies for SME clients across multiple industries, connecting audience needs to execution.",
                "Improved SEO performance and organic visibility while managing content calendars, email campaigns, reporting, and client communication.",
            ],
            styles,
        )
    )
    story.append(
        job(
            "English Teacher",
            "Uncle Sam's American English School",
            "Shenzhen, China",
            "September 2020 - August 2021",
            [
                "Delivered adaptive lessons for diverse student groups, strengthening facilitation, communication, and audience awareness.",
            ],
            styles,
        )
    )
    story.append(
        job(
            "International Students Recruiter",
            "Elvon International",
            "Nanchang, China",
            "January 2018 - March 2020",
            [
                "Managed end-to-end student application pipelines and institutional relationships across target markets.",
            ],
            styles,
        )
    )

    story.extend(section("Selected Project Stories", styles))
    projects = [
        (
            "Five-product AI roadmap | Product delivery",
            "Converted business priorities into specifications, sprint plans, ownership, and coordinated releases across 136 features and five products.",
        ),
        (
            "Municipal AI pilot | GovTech operations",
            "Coordinated infrastructure readiness, acceptance criteria, delivery risk, and compliance-aware stakeholders for a secure public-service pilot.",
        ),
        (
            "SME digital growth | Business and growth",
            "Structured audience-led strategy, content operations, SEO, and performance reporting to improve visibility and decision-making.",
        ),
    ]
    for title, detail in projects:
        story.append(Paragraph(title, styles["project"]))
        story.append(Paragraph(detail, styles["body"]))

    story.extend(section("Education and Credentials", styles))
    story.append(
        Paragraph(
            "<b>Bachelor of Engineering, Computer Science and Engineering</b><br/>"
            "Jiangxi Normal University | Nanchang, China | September 2017 - June 2021",
            styles["body"],
        )
    )
    story.append(Spacer(1, 2))
    certifications = [
        "Google Project Management Certificate - Google / Coursera",
        "Agile Project Management - Google / Coursera",
        "IT Security Foundations: Core Concepts - LinkedIn Learning",
        "Blockchain Essentials - IBM",
        "Developing Your Leadership Philosophy - LinkedIn Learning",
    ]
    for certification in certifications:
        story.append(bullet(certification, styles))

    story.extend(section("Additional Information", styles))
    story.append(
        Paragraph(
            "<b>Tools:</b> ClickUp, Jira, Notion, GitHub, Postman, Slack",
            styles["skill"],
        )
    )
    story.append(
        Paragraph(
            "<b>Languages:</b> English - Native / Bilingual; Bengali - Native; Chinese (Mandarin) - Elementary",
            styles["skill"],
        )
    )

    document.build(story, onFirstPage=draw_page, onLaterPages=draw_page)
    shutil.copy2(OUTPUT_PDF, PUBLIC_PDF)
    print(f"Built {OUTPUT_PDF}")
    print(f"Copied {PUBLIC_PDF}")


if __name__ == "__main__":
    build_pdf()
