# Genspark Design Guidelines

## Design Approach
**Reference-Based Approach**: Drawing inspiration from modern educational platforms (Duolingo's gamification, Khan Academy's lesson structure) combined with developer tools (VS Code's code editor aesthetics, Linear's clean interface) and Material 3 design system with soft-neumorphism treatment.

## Core Design Principles
- Material 3 + Soft-Neumorphism aesthetic with rounded corners and subtle shadows
- Smooth transitions and micro-interactions throughout
- Progressive Web App optimized for mobile, tablet, desktop, and installable experiences
- Gamified learning with visual feedback for achievements and progress

## Color System

### Primary & Accent
- Primary: Electric Blue `#005BFF`
- Secondary: Neon Purple `#9A5BFF`
- Accent/Gold: `#FFB100`

### Light Theme
- Background: `#F2F3F5`
- Card: `#FFFFFF`
- Text Primary: `#212121`
- Text Secondary: `#555555`
- Divider: `#E0E0E0`

### Dark Theme
- Background: `#121212`
- Card: `#1E1E1E`
- Text Primary: `#F2F3F5`
- Text Secondary: `#AAAAAA`
- Divider: `#2C2C2C`

### Feedback Colors
- Error: `#FF4D4D`
- Success: `#28C76F`
- Warning: `#FF9F43`
- Info/Hint: `#00B8D9`

### Code Editor Themes
**Dark Mode**: Background `#1E1E1E`, Text `#F8F8F2`, Keywords `#FF79C6`, Strings `#F1FA8C`, Functions `#50FA7B`, Comments `#6272A4`

**Light Mode**: Background `#F9F9F9`, Text `#212121`, Keywords `#0000FF`, Strings `#A31515`, Functions `#795E26`, Comments `#6A9955`

## Typography
- **Primary Font**: Inter or System UI stack for interface elements
- **Code Font**: Fira Code or JetBrains Mono for code blocks and compiler
- **Headings**: Bold weights (600-700) with tight line-height
- **Body**: Regular (400) and Medium (500) weights
- **Code**: Monospace with syntax highlighting per theme

## Layout System
**Spacing**: Strict 8px grid system (8, 16, 24, 32, 40, 48px)
- Mobile: 16px horizontal padding, 8-16px vertical spacing
- Tablet/Desktop: 24-32px horizontal padding, 16-24px vertical spacing

**Responsive Breakpoints**:
- Mobile: < 768px (single column, bottom nav)
- Tablet: 768-1024px (optimized layout)
- Desktop: > 1024px (sidebar navigation option)

## Component Library

### Navigation
- **Bottom Nav Bar** (Mobile): 5 items - Home, Explore, AI, Practice, Profile with icons and labels, active state with primary color
- **Sidebar** (Desktop): Collapsible sidebar with same 5 sections, logo at top
- **Top Header**: Logo/back button, page title, action buttons (contextual)

### Cards & Containers
- **Lesson Cards**: Rounded corners (12px), subtle shadow, white/card background, hover lift effect
- **Language Cards**: Logo icon, title, description, progress indicator, favorite star
- **Achievement Badges**: Circular or shield-shaped with gold accent, unlock animations
- **Stat Cards**: XP, Streak, Points displayed in compact cards with icons

### Interactive Elements
- **Primary Buttons**: Electric Blue fill, white text, rounded (8px), shadow on press
- **Secondary Buttons**: Outlined with primary color, transparent background
- **Chips**: Small rounded pills for filters, tags, suggestions (8px border radius)
- **Code Blocks**: Syntax-highlighted, copy button, language label, scrollable
- **Progress Bars**: Gradient from primary to secondary, rounded caps, percentage label

### Content Blocks
- **Lesson Reader**: Sticky section navigator on side/top, scrollable content area, code examples integrated inline
- **Chat Interface**: Message bubbles (user: primary color, AI: card background), code blocks in messages, suggestion chips below
- **Code Editor**: Line numbers, syntax highlighting, toolbar (Run/Clear/Stop), input/output panels, language selector dropdown
- **Quiz Questions**: Question card with options, timer badge, progress dots, submit button

### Modals & Overlays
- **Alerts**: Centered card with icon, message, action buttons
- **Bottom Sheets** (Mobile): Swipeable modal from bottom for filters, settings
- **Full Screen Modals**: Lesson completion, quiz results, achievement unlocked

### Loading & Empty States
- **Skeletons**: Shimmer animation on card/list placeholders matching layout
- **Spinners**: Primary color circular loader for async actions
- **Empty States**: Illustration + message + CTA button for no content scenarios

## Screen-Specific Guidelines

### Onboarding & Welcome
- Full-screen slides with illustrations, feature highlights, gradient backgrounds (primary to secondary)
- Large typography for headlines, clear CTAs, skip button always visible

### Home Dashboard
- Greeting banner with user name and avatar
- Quick action cards (2x2 grid on mobile, horizontal on tablet/desktop)
- XP/Streak/Badges row with visual icons
- Recommended lessons carousel with horizontal scroll
- Trending languages section

### Language Library & Detail
- Search bar at top, filter chips below
- Grid layout: 2 columns mobile, 3-4 columns desktop
- Language detail: Hero section with logo and description, tabs for Lessons/Compiler/AI, progress chart

### AI Tutor Chat
- Full-height chat container, message history scrollable
- Input field fixed at bottom with send button and voice icon
- Code blocks formatted with syntax highlighting within messages
- Suggestion chips appear below AI responses

### Compiler/Editor
- Split view: Editor (60%) + Output (40%) on desktop, tabbed on mobile
- Dark/light editor theme matching app theme
- Toolbar with Run button (success green), Clear, Stop, language dropdown
- Input section collapsible, output terminal with copy button

### Progress & Profile
- Charts with primary/secondary gradients for XP over time
- Badge gallery grid with locked/unlocked states (grayscale vs. color)
- Certificate cards downloadable with share button
- Profile stats in card grid format

## Animations & Interactions
- **Page Transitions**: Slide left/right for navigation stack, fade for tabs
- **Pull-to-Refresh**: Standard mobile pattern with spinner
- **Swipe Gestures**: Swipe quiz cards, dismiss notifications
- **Button Press**: Subtle scale down (0.95) with shadow lift
- **Achievement Unlock**: Confetti + badge zoom-in animation
- **Minimal Use**: Keep animations functional, avoid excessive decorative motion

## Platform-Specific Adaptations
- **Mobile**: Bottom navigation, full-width components, touch-optimized tap targets (44px minimum)
- **Desktop**: Sidebar navigation, multi-column layouts, keyboard shortcuts, hover states
- **PWA**: App icons, splash screens, offline messaging, install prompt

## Accessibility
- Color contrast meets WCAG AA standards (4.5:1 for text)
- Interactive elements 44px minimum touch target
- Focus indicators visible on keyboard navigation
- Screen reader labels on all icons and images
- Light/Dark/System theme options for visual comfort