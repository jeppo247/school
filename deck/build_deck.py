#!/usr/bin/env python3
"""
Upwise Angel Pitch Deck Builder
Builds a 13-slide presentation with clean design, speaker notes, and visual hierarchy.
"""

from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.enum.text import PP_ALIGN, MSO_ANCHOR
from pptx.dml.color import RGBColor
from datetime import datetime

# Color palette: clean, calm, confident
DARK_NAVY = RGBColor(15, 23, 42)  # #0F172A
OFF_WHITE = RGBColor(250, 250, 250)  # #FAFAFA
WARM_CORAL = RGBColor(249, 97, 103)  # #F96167
SLATE = RGBColor(71, 85, 105)  # #47556D
LIGHT_BLUE = RGBColor(225, 238, 250)  # #E1EEFA

def add_title_slide(prs, title, subtitle, footer_text):
    """Add a cover slide."""
    slide = prs.slides.add_slide(prs.slide_layouts[6])  # Blank layout
    background = slide.background
    fill = background.fill
    fill.solid()
    fill.fore_color.rgb = DARK_NAVY

    # Title
    title_box = slide.shapes.add_textbox(Inches(0.5), Inches(2.5), Inches(9), Inches(1.5))
    title_frame = title_box.text_frame
    title_frame.word_wrap = True
    p = title_frame.paragraphs[0]
    p.text = title
    p.font.size = Pt(66)
    p.font.bold = True
    p.font.color.rgb = OFF_WHITE

    # Subtitle
    subtitle_box = slide.shapes.add_textbox(Inches(0.5), Inches(4.2), Inches(9), Inches(2))
    subtitle_frame = subtitle_box.text_frame
    subtitle_frame.word_wrap = True
    p = subtitle_frame.paragraphs[0]
    p.text = subtitle
    p.font.size = Pt(28)
    p.font.color.rgb = LIGHT_BLUE
    p.line_spacing = 1.3

    # Footer
    footer_box = slide.shapes.add_textbox(Inches(0.5), Inches(6.8), Inches(9), Inches(0.8))
    footer_frame = footer_box.text_frame
    p = footer_frame.paragraphs[0]
    p.text = footer_text
    p.font.size = Pt(12)
    p.font.color.rgb = RGBColor(180, 190, 200)

    # Add speaker notes
    notes = slide.notes_slide.notes_text_frame
    notes.text = "Hi. I'm Jesse, founder of Upwise. In the next ten minutes I want to show you a business that I think is the clearest consumer opportunity in Australian education in a generation. Let's start with the problem every Australian parent already knows."

def add_content_slide(prs, title, body_points, footer_stat=None, speaker_notes=""):
    """Add a standard content slide with bullet points."""
    slide = prs.slides.add_slide(prs.slide_layouts[6])  # Blank layout
    background = slide.background
    fill = background.fill
    fill.solid()
    fill.fore_color.rgb = OFF_WHITE

    # Dark header bar
    header_shape = slide.shapes.add_shape(1, Inches(0), Inches(0), Inches(10), Inches(0.8))
    header_shape.fill.solid()
    header_shape.fill.fore_color.rgb = DARK_NAVY
    header_shape.line.color.rgb = DARK_NAVY

    # Title in header: widen to 9" with 0.5" margins, reduce font to 24pt
    title_box = slide.shapes.add_textbox(Inches(0.5), Inches(0.15), Inches(9), Inches(0.6))
    title_frame = title_box.text_frame
    title_frame.word_wrap = True
    p = title_frame.paragraphs[0]
    p.text = title
    p.font.size = Pt(24)
    p.font.bold = True
    p.font.color.rgb = OFF_WHITE

    # Body content
    body_box = slide.shapes.add_textbox(Inches(0.7), Inches(1.2), Inches(8.6), Inches(4.8))
    text_frame = body_box.text_frame
    text_frame.word_wrap = True

    for i, point in enumerate(body_points):
        if i == 0:
            p = text_frame.paragraphs[0]
        else:
            p = text_frame.add_paragraph()
        p.text = point
        p.font.size = Pt(16)
        p.font.color.rgb = SLATE
        p.space_before = Pt(8)
        p.space_after = Pt(12)
        p.level = 0
        p.line_spacing = 1.3

    # Footer stat if provided
    if footer_stat:
        footer_box = slide.shapes.add_textbox(Inches(0.5), Inches(6.2), Inches(9), Inches(0.7))
        footer_frame = footer_box.text_frame
        p = footer_frame.paragraphs[0]
        p.text = footer_stat
        p.font.size = Pt(11)
        p.font.italic = True
        p.font.color.rgb = RGBColor(120, 130, 140)

    # Speaker notes
    if speaker_notes:
        notes = slide.notes_slide.notes_text_frame
        notes.text = speaker_notes

def add_stat_slide(prs, title, main_stat, stat_label, supporting_points, speaker_notes=""):
    """Add a slide with a large stat callout."""
    slide = prs.slides.add_slide(prs.slide_layouts[6])
    background = slide.background
    fill = background.fill
    fill.solid()
    fill.fore_color.rgb = OFF_WHITE

    # Header bar
    header_shape = slide.shapes.add_shape(1, Inches(0), Inches(0), Inches(10), Inches(0.8))
    header_shape.fill.solid()
    header_shape.fill.fore_color.rgb = DARK_NAVY
    header_shape.line.color.rgb = DARK_NAVY

    # Title: widen text box to 9" to prevent wrapping, with 0.5" margins, reduce to 24pt
    title_box = slide.shapes.add_textbox(Inches(0.5), Inches(0.15), Inches(9), Inches(0.6))
    title_frame = title_box.text_frame
    title_frame.word_wrap = True
    p = title_frame.paragraphs[0]
    p.text = title
    p.font.size = Pt(24)
    p.font.bold = True
    p.font.color.rgb = OFF_WHITE

    # Large stat box
    stat_box = slide.shapes.add_textbox(Inches(1), Inches(1.3), Inches(3.5), Inches(2))
    text_frame = stat_box.text_frame
    text_frame.word_wrap = True
    p = text_frame.paragraphs[0]
    p.text = main_stat
    p.font.size = Pt(60)
    p.font.bold = True
    p.font.color.rgb = WARM_CORAL

    # Stat label
    label_box = slide.shapes.add_textbox(Inches(1), Inches(3.2), Inches(3.5), Inches(0.6))
    label_frame = label_box.text_frame
    p = label_frame.paragraphs[0]
    p.text = stat_label
    p.font.size = Pt(13)
    p.font.color.rgb = SLATE
    p.font.bold = True

    # Supporting points on right
    support_box = slide.shapes.add_textbox(Inches(5), Inches(1.3), Inches(4.5), Inches(4.5))
    support_frame = support_box.text_frame
    support_frame.word_wrap = True

    for i, point in enumerate(supporting_points):
        if i == 0:
            p = support_frame.paragraphs[0]
        else:
            p = support_frame.add_paragraph()
        p.text = point
        p.font.size = Pt(14)
        p.font.color.rgb = SLATE
        p.space_before = Pt(6)
        p.space_after = Pt(10)
        p.line_spacing = 1.2

    if speaker_notes:
        notes = slide.notes_slide.notes_text_frame
        notes.text = speaker_notes

def main():
    # Create presentation
    prs = Presentation()
    prs.slide_width = Inches(10)
    prs.slide_height = Inches(7.5)

    # Slide 1: Cover
    add_title_slide(
        prs,
        "Upwise",
        "Strong foundations in maths and English — built session by session.",
        f"Jesse [Last Name], Founder · {datetime.now().strftime('%B %Y')} · upwise.com.au"
    )

    # Slide 2: The Problem — Now includes Victoria A$1.2B as a supporting point
    add_stat_slide(
        prs,
        "The Problem: Kitchen Table",
        "42%",
        "of Australian schools teach with qualified teacher shortage",
        [
            "82% of primary teachers report their job damages their mental health",
            "1 in 3 Year 3 students below literacy proficiency",
            "Victoria's A$1.2B catch-up program 'did not significantly improve outcomes' — Auditor-General, 2024. The problem isn't money. It's the delivery model."
        ],
        "Imagine a parent sitting at the kitchen table. Their Year 3 child hands them a report card that says 'Developing — needs additional support.' They call the school. The teacher is managing 28 kids with one aide and has no time for intervention. This isn't hypothetical. 35% of Australian parents already pay for tutoring to close the gap. They're not buying ambition. They're buying reassurance that their child won't be left behind."
    )

    # Slide 3: The Market (was Slide 4)
    add_content_slide(
        prs,
        "The Market: Parents Are Already Paying",
        [
            "A$2.2 billion tutoring market in Australia — nearly doubled in 5 years",
            "35% of Australian parents pay for tutoring. 18% spend A$100–150 per week",
            "Kumon: A$160/month per subject (A$3,840/year for Maths + English)",
            "Cluey: A$45–70/hour for 1:1 online tutors",
            "Upwise redirects this spend toward a model that actually scales"
        ],
        footer_stat="Note: This is money Australian parents are spending right now, today.",
        speaker_notes="Note what this slide is not. It's not a hockey-stick forecast or a TAM calculation from a McKinsey report. It's the money Australian parents are spending right now, today, on supplemental learning that isn't built for them. Our job is redirection, not creation."
    )

    # Slide 4: Why Now (was Slide 5)
    add_content_slide(
        prs,
        "Why Now: Three Forces Converging",
        [
            "1. The science: Benjamin Bloom proved 1:1 mastery tutoring produces +2.0 standard deviations (98th percentile vs classroom average)",
            "2. The economics: LLM inference costs collapsed 150–1000× in five years (A$60/M tokens → A$0.40–A$2.50)",
            "3. The adoption: Parents normalised digital-first learning during lockdowns. Willingness to pay for purposeful screen education is at all-time highs",
            "For 40 years, the 2-Sigma Problem was: we know it works, but can't afford it. That just changed."
        ],
        speaker_notes="Bloom's 2-Sigma Problem, 1984: one-on-one mastery tutoring produces outcomes that classroom teaching can't match. We've known this for forty years. We couldn't do anything about it because one tutor per child wasn't economical. That changed, quietly, in the last eighteen months."
    )

    # Slide 5: What Upwise Does (was Slide 6)
    add_content_slide(
        prs,
        "What Upwise Does",
        [
            "Diagnose: Adaptive assessment pinpoints exact learning gaps",
            "Learn: 20 minutes a day. Questions stay in the 80% win-rate sweet spot — challenging enough to grow, easy enough to stay confident",
            "Master: Skills only lock in after proven mastery. Spaced repetition holds learning in long-term memory",
            "Scope: Maths, reading, writing, spelling, grammar. Prep–Year 6. ACARA-aligned.",
            "Pricing: A$39/month single child · A$59/month family (up to 4 children)"
        ],
        speaker_notes="Twenty minutes a day. Adaptive. Mastery-based. The kid can't jump ahead until they've actually understood. Which means every session builds on solid ground — no accumulating gaps."
    )

    # Slide 6: Parent Layer (was Slide 7)
    add_content_slide(
        prs,
        "The Parent Layer: Our Differentiator",
        [
            "Research shows AI tutoring works best paired with a human guide — up to 2 standard deviations above classroom average",
            "Daily briefing before each session: what your child is working on, what to watch for",
            "Real-time nudges when they get stuck — with exact wording you can use",
            "Weekly reports clear enough to share with the classroom teacher",
            "Every incumbent (Kumon, Mathletics, IXL, Reading Eggs) treats parents as data recipients. None as the guide. This is the empty quadrant — where the research is strongest."
        ],
        footer_stat="No teaching degree required.",
        speaker_notes="This is the deliberate bet. We're not replacing parents. We're not replacing teachers. We're giving parents the one thing they've always lacked: a map. What to say when their child is stuck. What to reinforce at dinner. Where the real gap is. The research — Bloom, Kulik, RAND, the 2025 meta-analysis — consistently finds the strongest outcomes come from AI-plus-human, not AI-alone."
    )

    # Slide 7: The Evidence (was Slide 8)
    add_content_slide(
        prs,
        "The Evidence: Four Decades, Four Studies",
        [
            "Bloom (1984): 1:1 mastery tutoring → +2.0 SD (98th percentile)",
            "Kulik & Kulik (1990): Meta-analysis of 108 mastery learning studies → +0.4–0.64 SD",
            "RAND / Carnegie (2014): Cognitive Tutor Algebra RCT → +0.43 SD improvement",
            "Systematic Review (2025): 48 AI tutoring studies — consistent gains, strongest with human guide",
            "Upwise is the first Australian operationalisation of forty years of validated learning science."
        ],
        footer_stat="This isn't experimental. It's proven. Four times over.",
        speaker_notes="Our credibility isn't 'we built an AI.' Our credibility is a forty-year research lineage that four generations of learning scientists agree on. Upwise is the first Australian operationalisation of it."
    )

    # Slide 8: Competition (was Slide 9) — with visual 2x2 map
    slide = prs.slides.add_slide(prs.slide_layouts[6])
    background = slide.background
    fill = background.fill
    fill.solid()
    fill.fore_color.rgb = OFF_WHITE

    # Header bar
    header_shape = slide.shapes.add_shape(1, Inches(0), Inches(0), Inches(10), Inches(0.8))
    header_shape.fill.solid()
    header_shape.fill.fore_color.rgb = DARK_NAVY
    header_shape.line.color.rgb = DARK_NAVY

    # Title
    title_box = slide.shapes.add_textbox(Inches(0.5), Inches(0.15), Inches(8.5), Inches(0.6))
    title_frame = title_box.text_frame
    p = title_frame.paragraphs[0]
    p.text = "Competition: The Empty Quadrant"
    p.font.size = Pt(32)
    p.font.bold = True
    p.font.color.rgb = OFF_WHITE

    # Draw 2x2 positioning map
    # Map dimensions: 8" wide x 4.5" tall, centered horizontally
    map_left = Inches(1)
    map_top = Inches(1.2)
    map_width = Inches(8)
    map_height = Inches(4.5)

    # Center of map for axis crossing
    center_x = map_left + map_width / 2
    center_y = map_top + map_height / 2

    # Draw horizontal axis (X-axis: Breadth-first ← → Mastery-based)
    h_axis = slide.shapes.add_connector(1, map_left, center_y, map_left + map_width, center_y)
    h_axis.line.color.rgb = SLATE
    h_axis.line.width = Pt(2)

    # Draw vertical axis (Y-axis: Parent-invisible ↔ Parent-as-guide)
    v_axis = slide.shapes.add_connector(1, center_x, map_top, center_x, map_top + map_height)
    v_axis.line.color.rgb = SLATE
    v_axis.line.width = Pt(2)

    # Axis labels
    # X-axis labels
    x_left_label = slide.shapes.add_textbox(map_left, center_y + Inches(0.25), Inches(1.2), Inches(0.3))
    x_left_frame = x_left_label.text_frame
    p = x_left_frame.paragraphs[0]
    p.text = "Breadth-first"
    p.font.size = Pt(10)
    p.font.color.rgb = SLATE
    p.alignment = PP_ALIGN.CENTER

    x_right_label = slide.shapes.add_textbox(map_left + map_width - Inches(1.2), center_y + Inches(0.25), Inches(1.2), Inches(0.3))
    x_right_frame = x_right_label.text_frame
    p = x_right_frame.paragraphs[0]
    p.text = "Mastery-based"
    p.font.size = Pt(10)
    p.font.color.rgb = SLATE
    p.alignment = PP_ALIGN.CENTER

    # Y-axis labels
    y_bottom_label = slide.shapes.add_textbox(center_x - Inches(0.8), map_top + map_height - Inches(0.25), Inches(1.6), Inches(0.25))
    y_bottom_frame = y_bottom_label.text_frame
    p = y_bottom_frame.paragraphs[0]
    p.text = "Parent-invisible"
    p.font.size = Pt(9)
    p.font.color.rgb = SLATE
    p.alignment = PP_ALIGN.CENTER

    y_top_label = slide.shapes.add_textbox(center_x - Inches(0.8), map_top - Inches(0.3), Inches(1.6), Inches(0.25))
    y_top_frame = y_top_label.text_frame
    p = y_top_frame.paragraphs[0]
    p.text = "Parent-as-guide"
    p.font.size = Pt(9)
    p.font.color.rgb = SLATE
    p.alignment = PP_ALIGN.CENTER

    # Position competitors in quadrants
    # Bottom-left (breadth + parent-invisible)
    bl_box = slide.shapes.add_textbox(map_left + Inches(0.3), center_y + Inches(0.6), Inches(2.8), Inches(1.2))
    bl_frame = bl_box.text_frame
    bl_frame.word_wrap = True
    p = bl_frame.paragraphs[0]
    p.text = "Kumon\nCluey\nMatrix\nKip McGrath\nKinetic Education"
    p.font.size = Pt(9)
    p.font.color.rgb = SLATE
    p.line_spacing = 1.1

    # Bottom-right (mastery + parent-invisible)
    br_box = slide.shapes.add_textbox(center_x + Inches(0.5), center_y + Inches(0.6), Inches(2.8), Inches(1.2))
    br_frame = br_box.text_frame
    br_frame.word_wrap = True
    p = br_frame.paragraphs[0]
    p.text = "Mathspace\nReading Eggs\nMathletics\nProdigy\nMatific"
    p.font.size = Pt(9)
    p.font.color.rgb = SLATE
    p.line_spacing = 1.1

    # Top-left (breadth + parent-as-guide) — empty
    tl_box = slide.shapes.add_textbox(map_left + Inches(0.3), map_top + Inches(0.3), Inches(2.8), Inches(1.2))
    tl_frame = tl_box.text_frame
    p = tl_frame.paragraphs[0]
    p.text = "(empty)"
    p.font.size = Pt(9)
    p.font.color.rgb = RGBColor(180, 180, 180)
    p.font.italic = True

    # Top-right (mastery + parent-as-guide) — UPWISE, highlighted
    # Add coral background rectangle behind "Upwise"
    coral_bg = slide.shapes.add_shape(1, center_x + Inches(0.3), map_top + Inches(0.15), Inches(2.3), Inches(0.8))
    coral_bg.fill.solid()
    coral_bg.fill.fore_color.rgb = RGBColor(249, 97, 103)  # Warm coral
    coral_bg.fill.transparency = 0.7  # Semi-transparent
    coral_bg.line.color.rgb = WARM_CORAL
    coral_bg.line.width = Pt(1.5)

    tr_box = slide.shapes.add_textbox(center_x + Inches(0.4), map_top + Inches(0.25), Inches(2.1), Inches(0.6))
    tr_frame = tr_box.text_frame
    p = tr_frame.paragraphs[0]
    p.text = "UPWISE"
    p.font.size = Pt(14)
    p.font.bold = True
    p.font.color.rgb = OFF_WHITE  # Use off-white text for contrast on coral background
    p.alignment = PP_ALIGN.CENTER

    # Supporting callout stats below map
    support_box = slide.shapes.add_textbox(Inches(0.7), Inches(6), Inches(8.6), Inches(0.8))
    support_frame = support_box.text_frame
    support_frame.word_wrap = True
    p = support_frame.paragraphs[0]
    p.text = "Cluey FY25 loss: A$5.5M  |  No Australian incumbent owns parent-as-guide mastery"
    p.font.size = Pt(10)
    p.font.italic = True
    p.font.color.rgb = RGBColor(120, 130, 140)

    notes = slide.notes_slide.notes_text_frame
    notes.text = "Look at the quadrant Upwise sits in. Now look at how empty it is. Not because it's a bad quadrant — because no Australian incumbent has built for it. Cluey is losing money doing 1:1 human. Kumon is still running physical franchises in 2026. The IXLs and Mathletics of the world won't even look at you as a parent. That's our wedge."

    # Slide 9: Business Model (was Slide 10)
    add_content_slide(
        prs,
        "Business Model: Subscription, Software Margins",
        [
            "17,100 families at A$39/single + A$59/family blend = A$10M ARR",
            "That's just 1.1% of Australia's 1.52M primary-aged households",
            "Or 4.5% of the 380,000 households already paying for supplemental learning",
            "Software gross margins: 75–80% (LLM inference cost continues to fall)",
            "Comparable: 3P Learning (Mathletics) delivered A$110M global revenue on software. Mathspace bootstrapped profitable."
        ],
        footer_stat="17,000 families. In a country with 1.52M primary households, 380K already pay for tutoring.",
        speaker_notes="17,000 families. In a country with 1.52 million primary-age households, of which 380,000 already pay for tutoring. This is not a moonshot. This is arithmetic."
    )

    # Slide 10: Safety & Trust (was Slide 11)
    add_content_slide(
        prs,
        "Safety & Trust",
        [
            "Closed, curriculum-constrained system — no open chat, no ads, no third-party trackers",
            "20-minute bounded sessions — less screen time than YouTube, designed to end on a win",
            "Every session visible to the parent — mandatory, not optional",
            "Australian-owned and operated. Data stays in Australia.",
            "Designed to Australian eSafety Commissioner guidance",
            "The parents most concerned about AI safety are the ones most willing to pay once convinced."
        ],
        speaker_notes="Every parent we've spoken to has the same question: is it safe? Is it just more screen time? Is it going to replace me as the parent? Our answer, on each: closed system, twenty minutes, parent-guided. Not a chatbot. Not an ad-driven app. Not a babysitter."
    )

    # Slide 11: Traction (placeholder with structured boxes) (was Slide 12)
    slide = prs.slides.add_slide(prs.slide_layouts[6])
    background = slide.background
    fill = background.fill
    fill.solid()
    fill.fore_color.rgb = OFF_WHITE

    # Header bar
    header_shape = slide.shapes.add_shape(1, Inches(0), Inches(0), Inches(10), Inches(0.8))
    header_shape.fill.solid()
    header_shape.fill.fore_color.rgb = DARK_NAVY
    header_shape.line.color.rgb = DARK_NAVY

    # Title
    title_box = slide.shapes.add_textbox(Inches(0.5), Inches(0.15), Inches(8.5), Inches(0.6))
    title_frame = title_box.text_frame
    p = title_frame.paragraphs[0]
    p.text = "Traction"
    p.font.size = Pt(32)
    p.font.bold = True
    p.font.color.rgb = OFF_WHITE

    # Instruction text
    instr_box = slide.shapes.add_textbox(Inches(0.7), Inches(0.95), Inches(8.6), Inches(0.3))
    instr_frame = instr_box.text_frame
    p = instr_frame.paragraphs[0]
    p.text = "Replace with actual numbers before pitching. Angels reward precision over puffery."
    p.font.size = Pt(10)
    p.font.italic = True
    p.font.color.rgb = RGBColor(120, 130, 140)

    # 2x2 grid of dashed placeholder boxes
    PLACEHOLDER_GRAY = RGBColor(208, 208, 208)
    box_width = Inches(3.5)
    box_height = Inches(2.2)
    gap = Inches(0.4)
    start_left = Inches(0.8)
    start_top = Inches(1.5)

    # Function to draw dashed-outline box (approximated with shapes)
    def add_placeholder_box(slide, left, top, width, height, title, subtitle):
        # Draw rectangle with dashed outline
        rect = slide.shapes.add_shape(1, left, top, width, height)
        rect.fill.background()
        rect.line.color.rgb = PLACEHOLDER_GRAY
        rect.line.width = Pt(2)
        rect.line.dash_style = 3  # Dashed line

        # Title text
        title_box = slide.shapes.add_textbox(left + Inches(0.2), top + Inches(0.3), width - Inches(0.4), Inches(0.6))
        title_frame = title_box.text_frame
        title_frame.word_wrap = True
        p = title_frame.paragraphs[0]
        p.text = title
        p.font.size = Pt(13)
        p.font.italic = True
        p.font.color.rgb = PLACEHOLDER_GRAY
        p.font.bold = True

        # Subtitle text
        sub_box = slide.shapes.add_textbox(left + Inches(0.2), top + Inches(1.0), width - Inches(0.4), Inches(0.8))
        sub_frame = sub_box.text_frame
        sub_frame.word_wrap = True
        p = sub_frame.paragraphs[0]
        p.text = subtitle
        p.font.size = Pt(10)
        p.font.italic = True
        p.font.color.rgb = RGBColor(180, 180, 180)

    # Top-left: Waitlist count
    add_placeholder_box(
        slide,
        start_left,
        start_top,
        box_width,
        box_height,
        "[Waitlist count]",
        "[growth rate %/week]"
    )

    # Top-right: Acquisition signal
    add_placeholder_box(
        slide,
        start_left + box_width + gap,
        start_top,
        box_width,
        box_height,
        "[Acquisition signal]",
        "Organic or paid channel"
    )

    # Bottom-left: Beta signals
    add_placeholder_box(
        slide,
        start_left,
        start_top + box_height + gap,
        box_width,
        box_height,
        "[User engagement]",
        "Retention, session count, NPS"
    )

    # Bottom-right: LOIs / advocacy
    add_placeholder_box(
        slide,
        start_left + box_width + gap,
        start_top + box_height + gap,
        box_width,
        box_height,
        "[School conversations]",
        "LOIs, advisors, inbound press"
    )

    # Speaker notes
    notes = slide.notes_slide.notes_text_frame
    notes.text = "Founder to draft based on actual numbers. Include: waitlist size + growth rate, CAC / organic acquisition from waitlist campaigns, paid or organic channel tests, beta / early-user signals (session engagement, retention, parent NPS), LOIs, teacher/school conversations, advisor endorsements, press or inbound interest. Be honest — angels reward precision about early signals more than puffed-up vanity metrics."

    # Slide 12: Team (placeholder with structured boxes) (was Slide 13)
    slide = prs.slides.add_slide(prs.slide_layouts[6])
    background = slide.background
    fill = background.fill
    fill.solid()
    fill.fore_color.rgb = OFF_WHITE

    # Header bar
    header_shape = slide.shapes.add_shape(1, Inches(0), Inches(0), Inches(10), Inches(0.8))
    header_shape.fill.solid()
    header_shape.fill.fore_color.rgb = DARK_NAVY
    header_shape.line.color.rgb = DARK_NAVY

    # Title
    title_box = slide.shapes.add_textbox(Inches(0.5), Inches(0.15), Inches(8.5), Inches(0.6))
    title_frame = title_box.text_frame
    p = title_frame.paragraphs[0]
    p.text = "Team"
    p.font.size = Pt(32)
    p.font.bold = True
    p.font.color.rgb = OFF_WHITE

    # Instruction text
    instr_box = slide.shapes.add_textbox(Inches(0.7), Inches(0.95), Inches(8.6), Inches(0.3))
    instr_frame = instr_box.text_frame
    p = instr_frame.paragraphs[0]
    p.text = "Angels invest in people. Be specific about why you, why now, why this."
    p.font.size = Pt(10)
    p.font.italic = True
    p.font.color.rgb = RGBColor(120, 130, 140)

    # 3-column layout for team members
    PLACEHOLDER_GRAY = RGBColor(208, 208, 208)
    col_width = Inches(2.8)
    col_height = Inches(3.5)
    gap = Inches(0.35)
    start_left = Inches(0.7)
    start_top = Inches(1.5)

    # Function to draw team member placeholder box
    def add_team_box(slide, left, top, width, height, role_label, name_label, note=""):
        # Draw rectangle with dashed outline
        rect = slide.shapes.add_shape(1, left, top, width, height)
        rect.fill.background()
        rect.line.color.rgb = PLACEHOLDER_GRAY
        rect.line.width = Pt(2)
        rect.line.dash_style = 3  # Dashed line

        # Headshot placeholder (simulate with a rectangle)
        headshot = slide.shapes.add_shape(1, left + Inches(0.3), top + Inches(0.3), width - Inches(0.6), Inches(1.5))
        headshot.fill.solid()
        headshot.fill.fore_color.rgb = RGBColor(240, 240, 240)
        headshot.line.color.rgb = PLACEHOLDER_GRAY
        headshot.line.width = Pt(1)

        headshot_label = slide.shapes.add_textbox(left + Inches(0.3), top + Inches(0.8), width - Inches(0.6), Inches(0.5))
        headshot_frame = headshot_label.text_frame
        headshot_frame.word_wrap = True
        p = headshot_frame.paragraphs[0]
        p.text = "[Headshot]"
        p.font.size = Pt(9)
        p.font.italic = True
        p.font.color.rgb = RGBColor(180, 180, 180)
        p.alignment = PP_ALIGN.CENTER

        # Role and name
        name_box = slide.shapes.add_textbox(left + Inches(0.2), top + Inches(1.95), width - Inches(0.4), Inches(1.0))
        name_frame = name_box.text_frame
        name_frame.word_wrap = True
        p = name_frame.paragraphs[0]
        p.text = role_label
        p.font.size = Pt(10)
        p.font.italic = True
        p.font.color.rgb = PLACEHOLDER_GRAY
        p.font.bold = True

        p2 = name_frame.add_paragraph()
        p2.text = name_label
        p2.font.size = Pt(9)
        p2.font.italic = True
        p2.font.color.rgb = RGBColor(180, 180, 180)
        p2.space_before = Pt(6)

        # Optional note
        if note:
            p3 = name_frame.add_paragraph()
            p3.text = note
            p3.font.size = Pt(8)
            p3.font.italic = True
            p3.font.color.rgb = RGBColor(200, 200, 200)
            p3.space_before = Pt(4)

    # Left column: Founder
    add_team_box(
        slide,
        start_left,
        start_top,
        col_width,
        col_height,
        "[Founder]",
        "[Name + 1-line credential]"
    )

    # Middle column: Co-founder (optional)
    add_team_box(
        slide,
        start_left + col_width + gap,
        start_top,
        col_width,
        col_height,
        "[Co-founder/Key hire]",
        "[Name + credential]",
        "optional"
    )

    # Right column: Advisors
    add_team_box(
        slide,
        start_left + 2 * (col_width + gap),
        start_top,
        col_width,
        col_height,
        "[Advisors]",
        "Names + committed angels"
    )

    notes = slide.notes_slide.notes_text_frame
    notes.text = "Founder-specific. Include: founder bio (1–2 lines) why you can build this, any co-founders (name, role, one-line credential), any advisors or angel commitments already (edtech, consumer subscription, AU education), key hires planned with this round. Angels invest in people. Be specific about why you, why now, why this."

    # Slide 13: The Ask (restructured to avoid overlap) (was Slide 14)
    slide = prs.slides.add_slide(prs.slide_layouts[6])
    background = slide.background
    fill = background.fill
    fill.solid()
    fill.fore_color.rgb = DARK_NAVY

    # LEFT HALF (60%): Ask details, clear vertical hierarchy
    left_width = Inches(6)
    left_left = Inches(0.5)

    # Main title: "Raising A$[XXX]" — single line, compact
    title_box = slide.shapes.add_textbox(left_left, Inches(0.5), left_width - Inches(0.3), Inches(0.55))
    title_frame = title_box.text_frame
    title_frame.word_wrap = True
    p = title_frame.paragraphs[0]
    p.text = "Raising A$[XXX]"
    p.font.size = Pt(28)
    p.font.bold = True
    p.font.color.rgb = OFF_WHITE

    # Subtitle: "to reach..."
    subtitle_box = slide.shapes.add_textbox(left_left, Inches(1.15), left_width - Inches(0.3), Inches(0.5))
    subtitle_frame = subtitle_box.text_frame
    subtitle_frame.word_wrap = True
    p = subtitle_frame.paragraphs[0]
    p.text = "to reach A$[X]M ARR by [milestone]"
    p.font.size = Pt(14)
    p.font.italic = True
    p.font.color.rgb = RGBColor(200, 210, 220)

    # Gap
    # Use of Funds header
    use_of_funds_label = slide.shapes.add_textbox(left_left, Inches(1.85), left_width - Inches(0.3), Inches(0.3))
    use_frame = use_of_funds_label.text_frame
    p = use_frame.paragraphs[0]
    p.text = "USE OF FUNDS"
    p.font.size = Pt(11)
    p.font.bold = True
    p.font.color.rgb = RGBColor(180, 190, 200)

    # Use of funds breakdown (could be bars or text)
    uof_box = slide.shapes.add_textbox(left_left, Inches(2.25), left_width - Inches(0.3), Inches(1.0))
    uof_frame = uof_box.text_frame
    uof_frame.word_wrap = True

    uof_points = [
        "Product development: 40%",
        "Growth & acquisition: 40%",
        "Operations & overhead: 20%"
    ]

    for i, point in enumerate(uof_points):
        if i == 0:
            p = uof_frame.paragraphs[0]
        else:
            p = uof_frame.add_paragraph()
        p.text = point
        p.font.size = Pt(12)
        p.font.color.rgb = OFF_WHITE
        p.space_before = Pt(3)
        p.space_after = Pt(5)

    # Gap
    # Runway
    runway_label = slide.shapes.add_textbox(left_left, Inches(3.4), left_width - Inches(0.3), Inches(0.3))
    runway_frame = runway_label.text_frame
    p = runway_frame.paragraphs[0]
    p.text = "RUNWAY & MILESTONES"
    p.font.size = Pt(11)
    p.font.bold = True
    p.font.color.rgb = RGBColor(180, 190, 200)

    runway_box = slide.shapes.add_textbox(left_left, Inches(3.8), left_width - Inches(0.3), Inches(1.8))
    runway_text = runway_box.text_frame
    runway_text.word_wrap = True

    runway_points = [
        "Runway: [X] months",
        "Milestones:",
        "→ Product launch (month [X])",
        "→ Waitlist conversion (month [X])",
        "→ A$[X]k ARR (month [X])",
        "→ CAC payback proof (month [X])"
    ]

    for i, point in enumerate(runway_points):
        if i == 0:
            p = runway_text.paragraphs[0]
        else:
            p = runway_text.add_paragraph()
        p.text = point
        p.font.size = Pt(11)
        p.font.color.rgb = OFF_WHITE
        if point.startswith("Runway") or point.startswith("Milestones"):
            p.font.bold = True
        if point.startswith("→"):
            p.level = 1
        p.space_before = Pt(2)
        p.space_after = Pt(4)

    # RIGHT HALF (40%): Vision statement, large and visual
    right_left = Inches(6)
    vision_box = slide.shapes.add_textbox(right_left, Inches(0.8), Inches(3.5), Inches(4.5))
    vision_frame = vision_box.text_frame
    vision_frame.word_wrap = True
    p = vision_frame.paragraphs[0]
    p.text = "A generation of Australian children that never fall behind."
    p.font.size = Pt(22)
    p.font.bold = True
    p.font.color.rgb = WARM_CORAL
    p.line_spacing = 1.5

    # Contact at bottom
    contact_box = slide.shapes.add_textbox(Inches(0.5), Inches(6.5), Inches(9), Inches(0.7))
    contact_frame = contact_box.text_frame
    p = contact_frame.paragraphs[0]
    p.text = "jesse@activedigital.fund · upwise.com.au"
    p.font.size = Pt(11)
    p.font.color.rgb = RGBColor(150, 160, 170)
    p.alignment = PP_ALIGN.CENTER

    notes = slide.notes_slide.notes_text_frame
    notes.text = "Here's the ask. Here's what it funds. Here's what you get back — not in dollar terms, though I'm happy to walk through projections. In impact terms, this funds the build and the first 12 months of disciplined growth. A generation of Australian kids that don't fall behind. That's the thing worth building."

    # Save
    prs.save("upwise-angel-deck.pptx")
    print("✓ Saved: upwise-angel-deck.pptx")
    print(f"✓ Total slides: {len(prs.slides)}")

if __name__ == "__main__":
    main()
