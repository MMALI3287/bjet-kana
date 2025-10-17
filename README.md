# BJET Kana - Japanese Kana Learning Platform

A standalone, minimalist platform for learning and practicing Japanese Hiragana and Katakana.

## Features

- **Kana Training**: Master Hiragana and Katakana with comprehensive coverage
- **4 Game Modes**: Pick, Reverse-Pick, Input, and Reverse-Input
- **Customization**: 100+ themes, 28 Japanese fonts
- **Statistics**: Track your progress with detailed analytics
- **Audio Feedback**: Optional sound effects for interaction
- **Responsive Design**: Works on desktop, tablet, and mobile

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3001](http://localhost:3001) in your browser.

### Build for Production

```bash
npm run build
npm start
```

## Tech Stack

- Next.js 15
- React 19
- TypeScript
- Tailwind CSS
- Zustand (State Management)
- Framer Motion

## Project Structure

```
bjet-kana/
├── app/              # Next.js app router pages
├── components/       # React components
├── lib/              # Utilities and hooks
├── static/           # Static data (kana, themes, fonts)
├── store/            # Zustand stores
└── public/           # Static assets
```

## License

Based on KanaDojo - AGPL 3.0 License
