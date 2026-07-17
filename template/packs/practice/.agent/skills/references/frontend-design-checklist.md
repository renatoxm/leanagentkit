# Frontend design checklist

> Disclosed reference for `leanagentkit-frontend-design`. Adapted from
> [anthropics/skills `frontend-design`](https://github.com/anthropics/skills/blob/main/skills/frontend-design/SKILL.md).

## Anti-default looks (AI cluster)

Legitimate for some briefs — **defaults**, not choices, when the brief leaves the
axis free. Prefer a subject-specific direction instead:

1. Warm cream (~`#F4F1EA`) + high-contrast serif display + terracotta accent
2. Near-black + single acid-green or vermilion accent
3. Broadsheet: hairline rules, zero radius, dense newspaper columns

Also treat as default noise unless the brief demands them: purple-on-white /
purple-to-indigo gradients, Inter/Roboto/Arial/system as the personality face,
glow stacks, rounded-full pill clusters, multi-layer card shadows, emoji rows.

**Brief wins:** if the brief asks for one of these looks, follow it exactly.

## Design-plan token system

| Axis | Capture |
|------|---------|
| **Color** | 4–6 named hex values (roles: bg, surface, text, accent, muted…) |
| **Type** | Display (restraint) + body + optional utility/caption face; scale + weights |
| **Layout** | One-sentence concept + ASCII wireframe for the first viewport |
| **Signature** | The single memorable element that embodies the brief |

Map tokens onto the project's real system (`@theme`, CSS variables, theme file) —
do not invent a parallel palette the stack cannot express.

## First-viewport budget (marketing / landing)

Usually only: brand, one headline, one supporting sentence, one CTA group, one
dominant visual. Do not pack stats, schedules, address blocks, or secondary promos
into the hero. Cards belong to interaction containers, not hero decoration.

## Copy as design material

- Name by what people control — not system internals (`Notifications`, not `Webhook config`)
- Active voice; controls say what happens (`Save changes`, not `Submit`)
- Same action name through the flow (`Publish` → toast `Published`)
- Errors: what went wrong + how to fix; no vague apology
- Empty states: invitation to act
- Sentence case, plain verbs, tone matched to brand; one job per element

## Quality floor

- [ ] Responsive down to mobile
- [ ] Visible keyboard focus
- [ ] `prefers-reduced-motion` respected
- [ ] Meaningful contrast for text and controls
- [ ] Images have dimensions / avoid CLS (see performance checklist)
- [ ] No CSS specificity wars (utility/token-first; avoid competing `.section` vs element selectors)

## Self-critique prompts

- Would this look the same for an unrelated product after removing the brand name?
- Is boldness spent in **one** place (the signature), or scattered decoration?
- Remove one accessory before shipping (Chanel rule).
- Does motion serve the subject, or signal "AI-generated"?
