#!/usr/bin/env python3
"""Build Omar Faruque's ATS-friendly, one-page project management CV."""

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
            fontSize=25,
            leading=27,
            textColor=INK,
            spaceAfter=4,
        ),
        "role": ParagraphStyle(
            "Role",
            parent=base["Normal"],
            fontName="Helvetica-Bold",
            fontSize=9,
            leading=11,
            tracking=1.1,
            textColor=BLUE,
            spaceAfter=5,
        ),
        "contact": ParagraphStyle(
            "Contact",
            parent=base["Normal"],
            fontName="Helvetica",
            fontSize=8.2,
            leading=10,
            textColor=MUTED,
            spaceAfter=8,
        ),
        "section": ParagraphStyle(
            "Section",
            parent=base["Normal"],
            fontName="Helvetica-Bold",
            fontSize=8.8,
            leading=10.5,
            tracking=1.2,
            textColor=BLUE,
            spaceBefore=7,
            spaceAfter=3,
        ),
        "summary": ParagraphStyle(
            "Summary",
            parent=base["Normal"],
            fontName="Helvetica",
            fontSize=8.8,
            leading=11.8,
            textColor=INK,
            spaceAfter=3,
        ),
        "body": ParagraphStyle(
            "Body",
            parent=base["Normal"],
            fontName="Helvetica",
            fontSize=8.2,
            leading=10.6,
            textColor=INK,
            spaceAfter=2,
        ),
        "skill": ParagraphStyle(
            "Skill",
            parent=base["Normal"],
            fontName="Helvetica",
            fontSize=8.05,
            leading=10.3,
            textColor=INK,
            spaceAfter=1.5,
        ),
        "job": ParagraphStyle(
            "Job",
            parent=base["Normal"],
            fontName="Helvetica-Bold",
            fontSize=9.8,
            leading=11.5,
            textColor=INK,
            spaceBefore=4,
            spaceAfter=1,
        ),
        "job_meta": ParagraphStyle(
            "JobMeta",
            parent=base["Normal"],
            fontName="Helvetica",
            fontSize=7.95,
            leading=9.5,
            textColor=MUTED,
            spaceAfter=2.5,
        ),
        "bullet": ParagraphStyle(
            "Bullet",
            parent=base["Normal"],
            fontName="Helvetica",
            fontSize=8.05,
            leading=10.5,
            textColor=INK,
            leftIndent=11,
            firstLineIndent=-8,
            spaceAfter=1.6,
        ),
        "project": ParagraphStyle(
            "Project",
            parent=base["Normal"],
            fontName="Helvetica-Bold",
            fontSize=8.5,
            leading=10.3,
            textColor=INK,
            spaceBefore=2.5,
            spaceAfter=1,
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
        HRFlowable(width="100%", thickness=0.65, color=LINE, spaceAfter=3),
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
        topMargin=11 * mm,
        bottomMargin=18 * mm,
        title="Omar Faruque - Technical Project Manager",
        author="Omar Faruque",
        subject="Curriculum Vitae",
        keywords="technical project manager, AI delivery, GovTech, SaaS, QA, cross-functional delivery",
    )

    story = [
        Paragraph("OMAR FARUQUE", styles["name"]),
        Paragraph(
            "TECHNICAL PROJECT MANAGER | AI, GOVTECH &amp; SAAS DELIVERY",
            styles["role"],
        ),
        Paragraph(
            "Cumilla, Bangladesh &nbsp; | &nbsp; "
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
            "Technical project manager with experience coordinating AI, GovTech, and SaaS "
            "delivery across distributed European teams. Manages a 136-feature roadmap spanning "
            "five products, translating business priorities into sprint plans, acceptance "
            "criteria, and production releases. Combines project delivery, QA, stakeholder "
            "management, and cross-cultural communication to move complex initiatives from "
            "requirements to reliable execution.",
            styles["summary"],
        )
    )

    story.extend(section("Core Strengths", styles))
    strengths = [
        ("Delivery", "Roadmaps, Agile and sprint planning, risk and dependency management, release coordination"),
        ("Product and QA", "AI and SaaS delivery, requirements definition, acceptance criteria, release validation"),
        ("Stakeholders", "Cross-functional leadership, reporting, facilitation, cross-cultural collaboration"),
        ("Business", "Digital strategy, SEO, content operations, audience insight, performance reporting"),
    ]
    for label, detail in strengths:
        story.append(Paragraph(f"<b>{label}:</b> {detail}", styles["skill"]))

    story.extend(section("Professional Experience", styles))
    story.append(
        job(
            "Senior Project Manager",
            "KI-Quadrat Systemhaus GmbH (KI²)",
            "Vienna, Austria (Remote)",
            "September 2024 - Present",
            [
                "Own end-to-end execution of a 136-feature roadmap across five AI products, from sprint-ready specifications to production deployment.",
                "Coordinate engineering, QA, leadership, and municipal stakeholders across Austria, Romania, and Germany.",
                "Translate product dependencies into prioritised backlogs, acceptance criteria, and release-ready work for distributed teams.",
                "Manage delivery risk within ISO 27001, ISO 42001, GDPR, and EU data residency requirements.",
                "Coordinate a municipal pilot in an on-premises Ubuntu and Hyper-V environment using WireGuard VPN, LDAP/AD, and Cloudflare Tunnel connectivity.",
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
                "Led AI product delivery from scope definition through milestone tracking, keeping engineering and stakeholders aligned on priorities.",
                "Established accountable cross-functional workflows around shared delivery outcomes and clear ownership.",
                "Maintained momentum through early risk identification, proactive unblocking, and structured stakeholder communication.",
            ],
            styles,
        )
    )

    story.extend(section("Earlier and Concurrent Experience", styles))
    story.append(
        job(
            "Digital Marketing Manager (Concurrent)",
            "My Digital Consultant",
            "Dhaka, Bangladesh",
            "March 2019 - August 2023",
            [
                "Designed digital strategies for SME clients and managed SEO, content calendars, email campaigns, reporting, and client communication.",
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
            "International Student Recruiter",
            "Elvon International",
            "Nanchang, China",
            "January 2018 - March 2020",
            [
                "Managed end-to-end student application pipelines and institutional relationships across target markets.",
            ],
            styles,
        )
    )

    story.extend(section("Education and Credentials", styles))
    story.append(
        Paragraph(
            "<b>Bachelor of Engineering in Computer Science and Engineering</b><br/>"
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
            "<b>Languages:</b> Bengali - Native; English - Full professional proficiency; Chinese (Mandarin) - Elementary",
            styles["skill"],
        )
    )

    document.build(story, onFirstPage=draw_page, onLaterPages=draw_page)
    shutil.copy2(OUTPUT_PDF, PUBLIC_PDF)
    print(f"Built {OUTPUT_PDF}")
    print(f"Copied {PUBLIC_PDF}")


if __name__ == "__main__":
    build_pdf()
