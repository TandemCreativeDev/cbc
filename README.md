# Clark's Bowling Club Website

<!-- Badges -->

[![Next.js](https://img.shields.io/badge/Next.js-15.1.5-black?style=flat-square&logo=next.js&logoColor=white)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4.1-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Three.js](https://img.shields.io/badge/Three.js-0.172.0-black?style=flat-square&logo=three.js&logoColor=white)](https://threejs.org/)

A dynamic Next.js website for the 6-piece funk/pop band Clark's Bowling Club, featuring bilingual content, interactive 3D elements, and content management via Google Sheets.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Environment Setup](#environment-setup)
- [Content Management](#content-management)
- [Key Components](#key-components)
- [Development](#development)
- [Documentation](#documentation)
- [License](#license)

## Features

✨ **Bilingual Support**: English/French with automatic location detection  
🎵 **Music Integration**: Embedded Spotify, YouTube, and Bandcamp players  
🎯 **3D Interactive Elements**: Three.js powered spinning logo with holographic effects  
📱 **Responsive Design**: Mobile-first approach with Tailwind CSS  
📧 **Contact Forms**: Email integration with bilingual templates  
🗓️ **Tour Management**: Dynamic tour dates with past/future filtering  
🎤 **Lyrics Display**: Searchable lyrics organised by album  
🔍 **SEO Optimised**: Automatic sitemap generation, robots.txt, and LLMs.txt  
♿ **Accessibility**: ARIA labels, keyboard navigation, reduced motion support  
📊 **Dynamic Content**: Pages populated from Google Sheets CMS

## Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) with TypeScript
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) with custom fonts
- **3D Graphics**: [Three.js](https://threejs.org/) for interactive elements
- **Email**: [Nodemailer](https://nodemailer.com/) for contact forms
- **Data**: Google Sheets as CMS via CSV exports
- **Icons**: [React Icons](https://react-icons.github.io/react-icons/) (Font Awesome 6)
- **State**: React Context for language switching
- **Deployment**: Optimised for [Vercel](https://vercel.com/)

## Getting Started

### Prerequisites

- Node.js 18.0 or higher
- npm or yarn package manager

### Installation

1. **Clone the repository**:

- with https:

```bash
git clone https://github.com/TandemCreativeDev/cbc.git
cd cbc
```

- with ssh (recommended):

```bash
git clone git@github.com:TandemCreativeDev/cbc.git
cd cbc
```

2. **Install dependencies**:

```bash
npm install
```

3. **Set up environment variables** (see [Environment Setup](#environment-setup))

4. **Run the development server**:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the site.

## Project Structure

```
src/
├── app/                    # Next.js app router pages
│   ├── api/send-emails/    # Email sending endpoint
│   ├── [page]/             # Dynamic page routes
│   └── _components/        # Page-specific components
├── components/             # Shared components
│   ├── layout/             # Header, footer, navigation
│   └── ui/                 # Reusable UI components
├── context/                # React contexts
├── utils/                  # Utility functions
├── data/                   # Static data files
└── fonts/                  # Custom web fonts
```

## Environment Setup

Create a `.env.local` file in the root directory:

```bash
# Google Sheets Configuration
NEXT_PUBLIC_CSV_URL=https://docs.google.com/spreadsheets/d/[SHEET_ID]/export?format=csv

# Site Configuration
NEXT_PUBLIC_SITE_URL=https://clarksbowlingclub.com

# Email Configuration (SMTP)
EMAIL_HOST=smtp.host.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your@email.com
EMAIL_PASSWORD=your_app_password
```

## Content Management

Content is managed via Google Sheets with specific tab GIDs:

- **About Page**: GID 0 (title, content)
- **Music**: GID 1713768433 (embedded media, categories)
- **Lyrics**: GID 145198726 (songs, albums, lyrics)
- **Tour Page**: GID 127405583 (page content)
- **Tour Dates**: GID 572869052 (events, venues, tickets)

### Sheet Format

Pages use this structure:

```csv
key,english,french
title,About,Bio
content,"Band description...","Description du groupe..."
```

## Key Components

### Language Context

Automatic language detection based on user location, with manual toggle support.

### Navigation Animation

Custom bowling ball indicator that animates between active nav items with CSS animations.

### 3D Logo

Three.js powered spinning logo with holographic effects and mouse tracking.

### Contact Forms

Bilingual email templates with validation and toast notifications.

## Development

### Available Scripts

```bash
# Start development server with Turbopack
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linting
npm run lint
```

### Development Features

- **Hot Reload**: Instant updates during development
- **TypeScript**: Full type safety and IntelliSense
- **Turbopack**: Fast bundling with Next.js 15
- **ESLint**: Code quality enforcement
- **Tailwind CSS**: Utility-first styling with JIT compilation

### Browser Support

Modern browsers with ES6+ support. Graceful degradation for:

- Reduced motion preferences
- JavaScript disabled scenarios
- Legacy browser compatibility

## Key production features

- Automatic sitemap generation including dynamic content
- SEO-friendly meta tags and structured data
- Performance optimisations with Next.js Image component
- Accessibility compliance with ARIA labels and keyboard navigation

## Documentation

### Official Documentation

- **[Next.js](https://nextjs.org/docs)** - React framework documentation
- **[Tailwind CSS](https://tailwindcss.com/docs)** - CSS framework documentation
- **[Three.js](https://threejs.org/docs/)** - 3D graphics library documentation
- **[React Icons](https://react-icons.github.io/react-icons/)** - Icon library documentation
- **[Nodemailer](https://nodemailer.com/about/)** - Email sending library documentation

### Tutorials & Guides

- **[Next.js with Tailwind CSS](https://nextjs.org/docs/app/building-your-application/styling/tailwind-css)** - Official integration guide
- **[Three.js Fundamentals](https://threejs.org/manual/#en/fundamentals)** - Getting started with 3D graphics
- **[React TypeScript Cheatsheet](https://react-typescript-cheatsheet.netlify.app/)** - TypeScript best practices

### Development Guidelines

- Follow TypeScript best practices
- Use Tailwind's utility classes (no custom CSS when possible)
- Ensure accessibility compliance
- Test on multiple devices and browsers
- Maintain bilingual support for new features

---

## Author

[**TandemCreativeDev**](https://github.com/TandemCreativeDev) - hello@runintandem.com

**Clark's Bowling Club** - A 6-piece funk/pop band based in Lyon, France.  
🌐 [Website](https://clarksbowlingclub.com) | 📧 [Contact](mailto:contact@clarksbowlingclub.com) | 🎵 [Spotify](https://open.spotify.com/artist/4K3IjWGpwXYwjyNONZwvMZ)
