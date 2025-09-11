# Overview

PlayOnTable is a web-based multiplayer virtual tabletop gaming platform that allows users to play various card and board games in real-time. The application provides a virtual table where players can drag and manipulate game pieces, cards, and chips in a shared multiplayer environment. The platform supports multiple card deck types (Italian and French decks) and includes features like room creation, real-time synchronization, and private hand management.

# User Preferences

Preferred communication style: Simple, everyday language.
Interface language: Italian - user prefers Italian interface text.

# Recent Changes

## September 11, 2025 - PIXI.js Integration
- **Performance Upgrade**: Converted entire rendering system from HTML/CSS elements to PIXI.js sprites
- **Hardware Acceleration**: Game table now uses canvas rendering with GPU optimization
- **Enhanced Drag & Drop**: Implemented pointer-based interaction system for smooth 60fps gameplay
- **Real-time Sync**: Full integration with Ably multiplayer system via PIXI sprites
- **Memory Optimization**: Centralized texture loading and sprite management
- **Cross-platform**: Improved performance on mobile devices and low-end hardware

## September 10, 2025 - Menu Redesign
- Completely redesigned the main menu to be more modern and intuitive
- Updated interface language to Italian
- Added emoji icons and modern card-based layout
- Improved visual hierarchy with gradients and shadows
- Enhanced user experience with clear action descriptions

# System Architecture

## Frontend Architecture
The frontend combines vanilla technologies with high-performance graphics rendering:
- **HTML5** with semantic structure and PWA capabilities
- **SASS** for modular and maintainable stylesheets 
- **Vanilla JavaScript** with ES6 modules for component organization
- **PIXI.js v8** for hardware-accelerated sprite rendering and game graphics
- **GSAP** library for UI animations (menu system and tutorials)
- **Driver.js** for interactive tutorials and user onboarding

The frontend follows a modular JavaScript architecture with separate files for different concerns:
- `load.js` - Application initialization and menu handling
- `pixiRenderer.js` - **NEW**: PIXI.js sprite rendering and canvas management
- `room.js` - Real-time room management with PIXI integration
- `drag.js` - Legacy drag-and-drop (fallback compatibility)
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
- **Hybrid rendering**: PIXI.js sprites with real-time synchronization across all players
- **Room-based isolation** using nanoid-generated 6-character codes
- **Private hand management** with visual indicators (red borders)
- **Deck shuffling** happens client-side with shared random seeds
- **Sprite synchronization**: Real-time position updates for all game pieces via Ably
- **Performance optimized**: 60fps canvas rendering with efficient memory management

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