---
name: Purina Sales Excellence
colors:
  surface: '#f9f9f9'
  surface-dim: '#dadada'
  surface-bright: '#f9f9f9'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f3f3f3'
  surface-container: '#eeeeee'
  surface-container-high: '#e8e8e8'
  surface-container-highest: '#e2e2e2'
  on-surface: '#1a1c1c'
  on-surface-variant: '#5e3f3c'
  inverse-surface: '#2f3131'
  inverse-on-surface: '#f1f1f1'
  outline: '#926e6a'
  outline-variant: '#e8bcb8'
  surface-tint: '#c00015'
  primary: '#bf0014'
  on-primary: '#ffffff'
  primary-container: '#e91c24'
  on-primary-container: '#ffffff'
  inverse-primary: '#ffb4ac'
  secondary: '#5f5e5e'
  on-secondary: '#ffffff'
  secondary-container: '#e4e2e1'
  on-secondary-container: '#656464'
  tertiary: '#006396'
  on-tertiary: '#ffffff'
  tertiary-container: '#007dbb'
  on-tertiary-container: '#ffffff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffdad6'
  primary-fixed-dim: '#ffb4ac'
  on-primary-fixed: '#410002'
  on-primary-fixed-variant: '#93000d'
  secondary-fixed: '#e4e2e1'
  secondary-fixed-dim: '#c8c6c5'
  on-secondary-fixed: '#1b1c1c'
  on-secondary-fixed-variant: '#474746'
  tertiary-fixed: '#cce5ff'
  tertiary-fixed-dim: '#91cdff'
  on-tertiary-fixed: '#001e31'
  on-tertiary-fixed-variant: '#004b72'
  background: '#f9f9f9'
  on-background: '#1a1c1c'
  surface-variant: '#e2e2e2'
  pure-white: '#FFFFFF'
  success-green: '#28A745'
  incentive-gold: '#FFD700'
typography:
  display-lg:
    fontFamily: Inter
    fontSize: 48px
    fontWeight: '800'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 32px
  headline-md:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-bold:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '700'
    lineHeight: 20px
    letterSpacing: 0.05em
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  unit: 8px
  gutter: 24px
  margin-desktop: 64px
  margin-mobile: 16px
  max-width: 1440px
---

## Brand & Style

This design system translates a heritage-rich consumer brand into a high-performance sales incentive environment. The brand personality is **authoritative, energetic, and dependable**, designed to motivate sales teams while maintaining the professional rigor expected in a corporate enterprise tool.

The visual style is **Corporate Modern with a Performance Edge**. It utilizes high-contrast visuals and significant whitespace to ensure clarity of data, while leveraging the brand's iconic red to drive urgency and highlight achievements. The aesthetic is clean and systematic, avoiding decorative elements in favor of functional clarity and a sense of institutional momentum.

## Colors

The palette is anchored by a high-energy "Performance Red" (#E91C24), used strategically for primary actions, progress indicators, and key achievement callouts. To maintain professional readability, #2B2B2B serves as the secondary color for deep structural elements and primary typography.

The background architecture relies on a "Layered White" approach, using #FFFFFF for card surfaces and #F8F8F8 for page backgrounds to create subtle, clean separation without the use of heavy borders. A curated set of functional colors for success and incentives provides the necessary feedback for a sales-driven environment.

## Typography

The typography system is built entirely on **Inter**, utilizing its full range of weights to create a highly legible, data-centric hierarchy. 

Headlines use heavy weights (700-800) to command attention and convey strength. For the sales tool context, a specific "Label Bold" style is introduced for data headers and secondary navigation, using uppercase styling and increased letter spacing to provide a structural, "dashboard" feel. Body text remains neutral and functional, ensuring long-form reports and incentive rules are easily digestible.

## Layout & Spacing

The system uses a **Fixed Grid** approach for desktop dashboards to ensure data density remains consistent and readable. A 12-column grid system is standard, with 24px gutters providing ample breathing room between complex data visualizations.

- **Desktop:** 12 columns, 64px outer margins, 1440px max-width.
- **Tablet:** 8 columns, 32px outer margins.
- **Mobile:** 4 columns, 16px outer margins, transitioning to a fluid stack.

Spacing follows a strict 8px linear scale. Vertical rhythm is critical; related data points use 8px spacing, while distinct sections are separated by 32px or 48px to maintain a clear visual hierarchy.

## Elevation & Depth

Hierarchy is established through **Tonal Layers** rather than aggressive shadows. This design system treats the interface as a series of physical "sheets" of information:

1.  **Base (F8F8F8):** The canvas for the application.
2.  **Surface (FFFFFF):** White cards or panels used to group related metrics and content.
3.  **Accent Elevation:** Only primary action buttons or active modal windows receive a subtle, low-opacity shadow (4% - 8% black) with a large blur radius (16px+) to create a "floating" effect without appearing heavy.

Soft, 1px strokes in a slightly darker neutral (#E0E0E0) are used for card borders to ensure definition on high-brightness displays.

## Shapes

The shape language is **Soft (0.25rem)**, leaning towards a more traditional corporate aesthetic. This minimal rounding provides a modern touch while maintaining the "squared-off" professional feel associated with high-stakes financial and sales data.

Larger components like primary dashboard cards should use `rounded-lg` (0.5rem) to soften the overall layout. Interactive elements like checkboxes and input fields strictly follow the 0.25rem standard.

## Components

### Buttons
Primary buttons are solid Red (#E91C24) with White text, using heavy Inter weights. Secondary buttons use the #2B2B2B outline style. Hover states for primary actions involve a subtle darken of the red, rather than a color shift.

### Cards
Cards are the primary container for the sales tool. They feature a white background, 1px light gray border, and 0.5rem corner radius. Metric cards include a "Trend Indicator" in the top right using functional green or red.

### Input Fields
Inputs use a standard 1px border (#2B2B2B at 20% opacity). When focused, the border transitions to a 2px Red (#E91C24) stroke to clearly indicate the active state.

### Chips & Badges
Used for status (e.g., "In Progress," "Achieved"). These utilize a "de-saturated background" style—pale versions of the functional colors with high-contrast bold text of the same hue.

### Progress Bars
Progress bars utilize the primary Red for the fill, set against a light gray track. For incentive milestones, a "Gold" marker can be used to signify peak performance targets.