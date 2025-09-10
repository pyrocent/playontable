# Overview

PlayOnTable is a web-based multiplayer virtual tabletop gaming platform that allows users to play various card and board games in real-time. The application provides a virtual table where players can drag and manipulate game pieces, cards, and chips in a shared multiplayer environment. The platform supports multiple card deck types (Italian and French decks) and includes features like room creation, real-time synchronization, and private hand management.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
The frontend is built using vanilla technologies for simplicity and performance:
- **HTML5** with semantic structure and PWA capabilities
- **SASS** for modular and maintainable stylesheets 
- **Vanilla JavaScript** with ES6 modules for component organization
- **GSAP** library for smooth drag-and-drop interactions and animations
- **Driver.js** for interactive tutorials and user onboarding

The frontend follows a modular JavaScript architecture with separate files for different concerns:
- `load.js` - Application initialization and menu handling
- `room.js` - Real-time room management and game state
- `drag.js` - Drag-and-drop functionality for game pieces
- `tutorial.js` - User onboarding and help system
- `ably.js` - Real-time communication wrapper
- `decks.js` - Card deck definitions and management

## Backend Architecture
The backend uses a minimal Python FastAPI server with the following structure:
- **FastAPI** as the main web framework
- **Static file serving** for frontend assets
- **SPA routing** with catch-all route serving the main HTML file
- **Authentication endpoint** for real-time service integration

The server architecture prioritizes simplicity with a single main server file and one API endpoint for authentication.

## Real-time Communication
- **Ably** service handles all real-time multiplayer functionality
- **Channel-based messaging** using room codes as channel identifiers
- **Event-driven architecture** for game actions (drag, turn, hide, chip placement)
- **Token-based authentication** through the FastAPI backend

## PWA Features
The application is designed as a Progressive Web App with:
- **Service Worker** registration for offline capabilities
- **Web App Manifest** for native app-like experience
- **Responsive design** supporting multiple screen orientations
- **Security headers** configured for production deployment

## Game State Management
- **Client-side state** with real-time synchronization across all players
- **Room-based isolation** using nanoid-generated 6-character codes
- **Private hand management** with visual indicators (red borders)
- **Deck shuffling** happens client-side with shared random seeds

# External Dependencies

## Real-time Services
- **Ably** - Real-time messaging and presence management for multiplayer functionality
- **Authentication endpoint** - Custom FastAPI endpoint for Ably token generation

## Frontend Libraries
- **GSAP** - Animation library for drag-and-drop interactions and smooth movements
- **Driver.js** - Interactive tutorial and spotlight system for user onboarding
- **Nanoid** - Cryptographically secure room code generation

## Hosting and Infrastructure
- **Vercel** - Primary hosting platform with automatic deployments
- **Vercel Blob Storage** - Static asset storage for card images and game pieces
- **Ionos** - Domain registration and DNS management

## Analytics and Monitoring
- **Vercel Analytics** - User behavior tracking and performance monitoring
- **Vercel Speed Insights** - Core web vitals and performance metrics

## Styling and Fonts
- **Google Fonts** - Outfit font family for consistent typography
- **SASS** - CSS preprocessing for modular stylesheets

## Security and Performance
- **Security headers** configured via Vercel for XSS protection, content sniffing prevention
- **Android App Links** configuration for TWA (Trusted Web Activity) support
- **SEO optimization** with sitemap, robots.txt, and structured metadata