# ChatSnap - Chat Screenshot Generator

## Overview
ChatSnap is a freemium web application that allows users to create realistic fake chat screenshots for WhatsApp, Instagram, Discord, and Telegram. Users can customize messages, timestamps, sender names, and export high-quality screenshots.

## Tech Stack
- **Frontend**: React, TypeScript, Tailwind CSS, Shadcn UI, Wouter
- **Backend**: Express.js, Node.js
- **Storage**: In-memory storage (MemStorage)
- **Payment**: Stripe integration for tiered pricing
- **Export**: html2canvas for screenshot generation

## Features
- Platform selector (WhatsApp, Instagram, Discord, Telegram)
- Message editor with customizable properties
- Accurate UI replicas for each platform
- Freemium model: 3 free screenshots, paid tiers for more
- Screenshot export functionality
- Dark/light theme toggle
- Usage tracking and counter

## Pricing Tiers
- **Free**: 3 screenshots
- **Starter**: $3.99 for 15 screenshots
- **Pro**: $6.99 for 25 screenshots
- **Unlimited**: $15.99 for unlimited screenshots

## Project Structure
- `/client/src/pages/home.tsx` - Main editor page
- `/client/src/components/` - Reusable React components
- `/client/src/components/platforms/` - Platform-specific chat UI components
- `/shared/schema.ts` - Shared data models and types
- `/server/routes.ts` - API endpoints
- `/server/storage.ts` - In-memory storage implementation

## Current Status
Phase 1: Schema & Frontend components completed
- All data models defined
- All React components built with exceptional visual quality
- Platform-specific chat UIs accurately replicate WhatsApp, Instagram, Discord, and Telegram
- Pricing and payment UI components ready
- Dark mode support implemented

Next: Backend implementation with Stripe integration and session management
