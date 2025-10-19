# Design Guidelines: Chat Screenshot Editor

## Design Approach

**Reference-Based Approach** drawing inspiration from:
- **Primary**: Discord (dark theme aesthetics), Telegram (clean UI patterns), WhatsApp (familiar green accent)
- **Secondary**: Canva (approachable creative tools), Stripe (elegant pricing pages)
- **Rationale**: This is an entertainment/creative tool requiring visual appeal and platform familiarity

## Core Design Elements

### A. Color Palette

**Dark Mode (Primary)**
- Background: 220 15% 12% (deep navy-slate)
- Surface: 220 13% 18% (elevated cards/panels)
- Surface Variant: 220 12% 22% (chat bubbles, input fields)
- Primary: 142 76% 36% (WhatsApp-inspired green for CTAs)
- Accent: 235 86% 65% (vibrant blue for Discord references)
- Text Primary: 0 0% 98%
- Text Secondary: 220 9% 65%
- Border: 220 13% 25%

**Light Mode**
- Background: 0 0% 98%
- Surface: 0 0% 100%
- Primary: 142 76% 36%
- Text Primary: 220 15% 12%

### B. Typography

**Font Stack**: 
- Primary: 'Inter' (Google Fonts) - body text, UI elements
- Secondary: 'DM Sans' (Google Fonts) - headings, emphasis
- Monospace: 'JetBrains Mono' (Google Fonts) - chat timestamps, metadata

**Hierarchy**:
- Hero Heading: 5xl/6xl, DM Sans, font-bold (48-60px)
- Section Headings: 3xl/4xl, DM Sans, font-semibold (30-36px)
- Card Titles: xl/2xl, DM Sans, font-medium (20-24px)
- Body Text: base/lg, Inter, font-normal (16-18px)
- Chat Messages: sm/base, Inter (14-16px)
- Timestamps: xs, JetBrains Mono (12px)

### C. Layout System

**Spacing Primitives**: Consistent use of Tailwind units 2, 4, 6, 8, 12, 16
- Component padding: p-4, p-6, p-8
- Section spacing: py-12, py-16, py-20
- Card gaps: gap-4, gap-6
- Margins: m-2, m-4, m-8

**Containers**:
- Editor workspace: max-w-7xl (full editing canvas)
- Pricing sections: max-w-6xl
- Text content: max-w-4xl
- Chat previews: max-w-md (mobile-first chat width)

### D. Component Library

**Navigation**
- Sticky header with logo, navigation links, "Get Started" CTA
- Transparent background with backdrop-blur on scroll
- Mobile: Hamburger menu with slide-in drawer

**Hero Section**
- Split layout: Left (headline + CTA), Right (animated chat preview mockup)
- Headline: "Create Realistic Chat Screenshots in Seconds"
- Subheadline explaining platforms (WhatsApp, Instagram, Discord, Telegram)
- Primary CTA: "Start Editing Free" (green button)
- Background: Subtle gradient overlay with chat bubble pattern

**Editor Interface**
- Three-panel layout:
  1. Platform selector sidebar (left, w-64): Icon buttons for each platform
  2. Chat canvas (center): Phone mockup frame with editable messages
  3. Properties panel (right, w-80): Message customization (sender, text, timestamp, avatar)
- Floating toolbar above chat: Add message, delete, duplicate, export
- Screenshot counter badge (top-right): "2/3 free screenshots remaining"

**Message Editing Components**
- Chat bubbles with platform-specific styling (rounded corners, colors, tail indicators)
- Inline editing: Click message to edit text
- Avatar uploader: Circle avatar with upload overlay
- Timestamp picker: Time selection dropdown
- Message type toggles: Sent/Received, read receipts, typing indicators

**Pricing Cards**
- Three-tier layout (grid-cols-1 md:grid-cols-3)
- Tier 1 "Starter": 15 screenshots - $3.99 (most popular badge)
- Tier 2 "Pro": 25 screenshots - $6.99
- Tier 3 "Unlimited": Unlimited - $15.99 (best value badge)
- Card design: Elevated surface, border accent on hover, checkmark feature list
- Stripe integration for payments

**Features Section**
- Grid layout (2 columns desktop, 1 mobile)
- Feature cards with Heroicons, title, description
- Features: Multi-platform support, Custom avatars, Timestamp control, Export HD, Realistic styling, Dark/Light themes

**Export Modal**
- Overlay with backdrop blur
- Preview thumbnail of screenshot
- Format selection: PNG, JPG
- Quality slider
- Download button with loading state

### E. Animations

**Use Sparingly**:
- Hero chat preview: Gentle float/pulse animation
- Button hover: Subtle scale (scale-105) and shadow increase
- Card hover: Translate-y lift (transform -translate-y-1)
- Message add: Fade-in from bottom (opacity + translate)
- Modal entrance: Scale + fade (scale-95 to scale-100)
- No page scroll animations, no auto-playing carousels

## Images

**Hero Section**: 
- Right side: Isometric illustration or 3D render of a smartphone displaying a chat interface with multiple platform tabs visible. The screen should show a realistic WhatsApp-style conversation. Background: gradient blend from dark blue to deep purple with floating chat bubble shapes.
- Style: Modern, slightly playful, high-quality 3D render or illustration

**Features Section**:
- Each platform card: Small icon representing WhatsApp, Instagram, Discord, Telegram logos (use CDN or icon fonts)
- No large feature images needed; focus on icons and clean layout

**Platform Selector**:
- Platform logos displayed as icon buttons in the sidebar
- Use official brand colors when logo is selected

## Additional Guidelines

- Maintain generous whitespace; avoid cluttered interfaces
- Chat canvas uses authentic platform UI patterns (WhatsApp green bubbles, Discord dark theme, etc.)
- Responsive breakpoints: Mobile-first, then md: (768px), lg: (1024px), xl: (1280px)
- Form inputs: Rounded borders (rounded-lg), focus ring with primary color
- Consistent border-radius: rounded-lg (cards), rounded-full (avatars, pills)
- Shadow hierarchy: shadow-sm (inputs), shadow-md (cards), shadow-xl (modals)
- Accessibility: ARIA labels on all interactive elements, keyboard navigation support, high contrast ratios