---
target: Smash functionality browser QA and UI/UX review
total_score: 20
max_score: 28
na_heuristics: 7,9,10
p0_count: 0
p1_count: 0
timestamp: 2026-10-04T13-40-37Z
slug: app-sitebreaker-tsx
---
Method: dual-agent (A: smash_design · B: smash_evidence), with additional browser QA by the primary agent.

The core smash sequence works, and the delayed restoration is an improvement. I would call this a working feature that still needs a focused polish pass, rather than release-ready motion.

The use of actual lettering and borders makes the effect specific to this portfolio. The requested character is intentionally conspicuous; I would preserve that choice and refine its behavior. The biggest opportunity is making the destruction feel varied without repeatedly interfering with reading.

## Browser evidence

Inspected desktop at approximately 1280×720 and mobile at 390×844, with repeated animation cycles, keyboard controls, reload persistence, section navigation, and a resize transition.

- Repeated hits fractured real text, then restored it without accumulated fragments or persistent layout damage.
- The damaged state persisted into departure; recovery finished about 820–846 ms after departure began in sampled desktop cycles, consistent with the 350 ms hold plus 480 ms reconstruction.
- Keyboard pause/resume worked. Pause removed fragments and restored text. The paused preference survived reload.
- Navigation remained usable. Returning from the mobile Profile section to the hero restarted movement.
- No browser warning/error logs were observed. Mobile had no horizontal overflow in sampled views.
- Reduced-motion runtime behavior, actual screen-reader announcements, physical touch devices, other browser engines, and long-duration memory/performance were not tested. Source guards are not a substitute for those tests.

## Priority findings

1. **P2 — Resize can leave the rider offscreen with animation still enabled.** After switching to a 390 px viewport and navigating to Profile, the rider stayed at x≈635 in idle state. There were no eligible targets in that viewport. It recovered when returning to the hero. Clamp the current position on resize and give an empty target pool an intentional roaming or resting behavior. Suggested command: `$impeccable harden`.
2. **P2 — Target selection repeats too quickly.** In an 18-second desktop trace, “Projects · Products · People · Growth” was smashed twice consecutively, roughly four seconds apart, before another target was chosen. This weakens the sense of free exploration. Prevent consecutive repeats whenever another reachable target exists; roam longer if only one target is available. Suggested command: `$impeccable animate`.
3. **P2 — Fragments and the rider obscure adjacent content.** Both independent browser reviews saw the hero kicker's debris cross the introduction paragraph; the character also covers parts of the name while moving. Pointer transparency preserves clicks but not readability. Keep impact scatter closer to the target and add a quieter interval between attacks. Suggested command: `$impeccable quieter`.

## Strengths and smaller observations

The real letterforms make the destruction convincing. Recovery reassures the visitor, and the visible pause control gives an immediate escape. The initial surprise works; continuous repetition becomes the weak point of the emotional journey. There is only one animation control, so decision complexity is low.

P3: the button combines a changing action label with aria-pressed; the accessibility tree exposed a checked “Resume animation” control. Use an ordinary changing-label action button or a stable toggle label. The fixed control can also cover a small amount of content near the viewport bottom.

For a hurried recruiter, repeated name/heading destruction interrupts scanning. For a mobile reader, debris and the fixed control occupy proportionally more reading space. For an assistive-technology user, the decoration stays out of the accessibility tree, but toggle semantics deserve refinement.

## Heuristic score

This is a qualitative UX score, not an automated test score.

| Heuristic | Score | Reason |
|---|---:|---|
| Status visibility | 3/4 | Clear control; offscreen idle state misleading |
| Real-world match | 3/4 | Hammer, break, repair sequence reads clearly |
| User control | 3/4 | Effective persistent pause |
| Consistency | 3/4 | Intended playful contrast; toggle semantics need polish |
| Error prevention | 3/4 | Interaction-safe overlay; resize edge case |
| Recognition | 3/4 | Plain control labels |
| Flexibility/efficiency | n/a | Decorative experience |
| Aesthetic restraint | 2/4 | Repetition and adjacent-text overlap |
| Error recovery | n/a | No user-facing error workflow |
| Help/documentation | n/a | Self-explanatory effect |
| Total | 20/28 | Good foundation; targeted refinement needed |

The Impeccable detector reported zero findings in SiteBreaker.tsx. It did not detect the browser-observed timing, target-selection, or legibility concerns.

Questions to consider: fix functional edge cases first, or combine them with motion polish? Keep frequent smashing, increase quiet intervals, or use a short opening sequence?
