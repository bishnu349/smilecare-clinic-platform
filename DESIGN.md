# Design Brief — SmileCare Clinic Platform

**Tone**: Professional-modern, premium-accessible, trustworthy-approachable. Healthcare UI that feels human, not sterile.

**Differentiation**: Deep teal primary (H=178) conveys medical trust; warm gold accents (H=68) guide high-priority actions. Dark teal admin sidebar with gold active states creates a signature premium-Indian medical aesthetic. Card-lift transitions deliver tactile feedback without visual noise.

## Implemented Token Values (OKLCH)

| Token | Light L C H | Role |
|-------|-------------|------|
| background | 0.98 0.006 178 | Near-white teal canvas |
| foreground | 0.15 0.02 178 | Deep teal-near-black |
| card | 1.0 0.002 178 | Pure white surfaces |
| primary | 0.44 0.11 178 | Deep teal (#0F766E) |
| accent | 0.68 0.16 68 | Warm gold CTAs |
| sidebar | 0.25 0.06 178 | Dark teal admin nav |

---

## Color Palette

| Token | Light (L C H) | Dark (L C H) | Purpose |
|-------|---------------|-------------|---------|
| **Primary** | `0.42 0.14 240` (deep teal) | `0.7 0.16 240` | Trust, medical, primary CTA, headers |
| **Accent** | `0.6 0.19 55` (warm gold) | `0.65 0.22 55` | High-priority actions, highlights, urgency |
| **Success** | `0.6 0.16 150` (medical green) | `0.65 0.18 150` | Approvals, confirmations, healthy states |
| **Destructive** | `0.55 0.22 25` (alert red) | `0.65 0.19 22` | Warnings, rejections, destructive actions |
| **Neutral** | `0.98–0.94 0.01 240` light / `0.12–0.2 0.01 240` dark | Background, text, borders, subtle dividers |

---

## Typography

| Tier | Font | Usage | Weight/Size |
|------|------|-------|-------------|
| Display | Space Grotesk | Page titles, hero headlines, section headers | 600–700 / 32–48px |
| Body | Plus Jakarta Sans | Paragraphs, cards, form labels, navigation | 400–500 / 14–16px |
| Mono | Geist Mono | Code blocks, appointment IDs, time stamps | 400 / 12–13px |

**Line height**: 1.5 for body, 1.2 for display. **Letter spacing**: normal for body, -0.02em for display.

---

## Structural Zones

| Zone | Background | Border | Purpose |
|------|------------|--------|---------|
| **Header/Nav** | `bg-card` + `border-b border-border` | Subtle separator | Navigation, logo, language switcher |
| **Hero** | `bg-primary/10` + `bg-gradient-to-br` | None | Page entry, prominent CTA staging |
| **Content Cards** | `bg-card` + `shadow-subtle` | `border border-border` | Departments, doctors, testimonials, form sections |
| **Footer** | `bg-muted/40` + `border-t border-border` | Top divider | Contact, links, legal |
| **Sidebar (Admin)** | `bg-sidebar` + `border-r border-sidebar-border` | Right divider | Navigation tree, role indicator |
| **Modals/Popovers** | `bg-popover` + `shadow-elevated` | `border border-border` | Overlays, approval workflows, date pickers |

---

## Spacing & Rhythm

- **Grid**: 8px base unit. Cards use `p-4` (16px) to `p-6` (24px). Sections use `gap-6` to `gap-8`.
- **Density**: Spacious (healthcare apps should not feel cramped). Button height: 40–44px.
- **Radius**: Subtle (10px base, 4px for inputs, 16px for large cards/hero).

---

## Motion & Interaction

- **Smooth Transition**: 300ms cubic-bezier(0.4, 0, 0.2, 1) on all interactive elements.
- **Card Lift**: Hover state applies scale(1.02) + shadow-lg, no bounce.
- **Button States**: Primary CTA (accent gold) on hover: brightened accent + shadow-elevated.
- **Appointment Status**: Color-coded badges (success green, warning gold, destructive red, muted pending).

---

## Component Patterns

| Pattern | Usage | Example |
|---------|-------|---------|
| **CTA Button** | High-priority actions | "Book Appointment", "Approve", "Submit Payment" — use `bg-accent` |
| **Secondary Button** | Lower-priority actions | "Cancel", "Back", "View Details" — use `bg-secondary` + `text-secondary-foreground` |
| **Appointment Card** | Displays appointment info | Doctor name, date/time, status badge, action buttons |
| **Doctor Card** | Featured profiles | Avatar placeholder, name, specialization, "Book with this doctor" CTA |
| **Status Badge** | Appointment/payment state | Color-coded: pending (muted), approved (success), rejected (destructive), completed (border only) |
| **Time Slot Selector** | Queue-based booking | Morning/Afternoon/Evening pills, selected state uses `bg-primary`, unselected `bg-secondary` |
| **Form Field** | User input | `input` token for border, `bg-input` for background, label above using `text-foreground` |

---

## Responsive Design

- **Mobile-first**: `sm:` (640px), `md:` (768px), `lg:` (1024px), `xl:` (1280px).
- **Header**: Hamburger menu on mobile, full nav on desktop.
- **Cards**: Full width mobile, 2–3 columns tablet/desktop.
- **Modals**: Full screen on mobile, centered 90% width tablet, 50% width desktop.

---

## Signature Detail

Warm gold accent buttons (Book, Approve, Submit) paired with teal primary create a visual anchor throughout. Every healthcare interaction — choosing a doctor, approving an appointment, confirming payment — is guided by this accent, making the app feel intentional and human. No generic flat colors; every teal is the same medical trust, every gold action is deliberate guidance.
