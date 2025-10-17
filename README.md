# 🈂️ BJET Kana

**A modern, minimalist platform for mastering Japanese Hiragana and Katakana**

BJET Kana is a standalone web application designed to help you learn and practice Japanese kana characters through interactive games, comprehensive testing, and detailed progress tracking.

---

## ✨ Features

### 📚 Learning Modes

- **Training Mode**: Practice with 4 different game modes

  - **Pick**: Select the correct romaji for the displayed kana
  - **Reverse Pick**: Select the correct kana for the displayed romaji
  - **Input**: Type the romaji for the displayed kana
  - **Reverse Input**: Type the kana for the displayed romaji

- **Test Mode**: Comprehensive assessments to evaluate your knowledge

  - Choose from 10, 20, 30, 50, or 100 questions
  - Mix of Pick, Input, and Writing challenges
  - Detailed results with performance analytics
  - Review your answers and track improvements

- **Timed Challenge**: Race against the clock to answer as many questions as possible

### 🎨 Customization

- **100+ Themes**: Choose from a vast collection of color schemes

  - Base themes (Light, Dark)
  - Seasonal themes
  - Nature-inspired palettes
  - Vibrant color options
  - And many more!

- **28 Japanese Fonts**: Select your preferred font style for optimal reading practice

- **Flexible Settings**:
  - Toggle audio feedback
  - Customize game behavior
  - Adjust display preferences
  - Configure keyboard shortcuts

### 📊 Statistics & Progress Tracking

- Detailed analytics for each kana character
- Track accuracy and speed
- View historical performance
- Identify areas for improvement
- Monitor learning progress over time

### 🎯 Additional Features

- **Subset Selection**: Focus on specific kana groups (Basic, Dakuten, Combo, etc.)
- **Responsive Design**: Seamless experience on desktop, tablet, and mobile
- **Audio Feedback**: Optional sound effects for interactions
- **Keyboard Shortcuts**: Navigate efficiently with hotkeys
- **Visual Feedback**: Animations and confetti for achievements
- **Progress Indicators**: Real-time feedback during games

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm or yarn package manager

### Installation

1. Clone the repository:

```bash
git clone https://github.com/MMALI3287/bjet-kana.git
cd bjet-kana
```

2. Install dependencies:

```bash
npm install
```

### Development

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3001](http://localhost:3001) in your browser to see the application.

### Build for Production

Create an optimized production build:

```bash
npm run build
```

Start the production server:

```bash
npm start
```

The application will be available at [http://localhost:3001](http://localhost:3001).

---

## 🛠️ Tech Stack

### Core Technologies

- **[Next.js 15](https://nextjs.org/)** - React framework with App Router
- **[React 19](https://react.dev/)** - UI library
- **[TypeScript](https://www.typescriptlang.org/)** - Type safety
- **[Tailwind CSS 4](https://tailwindcss.com/)** - Utility-first CSS framework

### State Management & Animation

- **[Zustand](https://zustand-demo.pmnd.rs/)** - Lightweight state management
- **[Motion](https://motion.dev/)** (Framer Motion) - Smooth animations

### UI Components & Utilities

- **[Radix UI](https://www.radix-ui.com/)** - Accessible component primitives
- **[Lucide React](https://lucide.dev/)** - Beautiful icon library
- **[FontAwesome](https://fontawesome.com/)** - Additional icons
- **[Canvas Confetti](https://www.npmjs.com/package/canvas-confetti)** - Celebration effects
- **[use-sound](https://www.joshwcomeau.com/react/announcing-use-sound-react-hook/)** - Audio feedback
- **[react-timer-hook](https://www.npmjs.com/package/react-timer-hook)** - Timer functionality

---

## 📁 Project Structure

```
bjet-kana/
├── app/                      # Next.js App Router
│   ├── kana/                # Kana training pages
│   │   └── train/           # Game mode routes
│   ├── test/                # Test mode pages
│   │   ├── start/           # Active test
│   │   └── results/         # Test results
│   ├── preferences/         # Settings page
│   ├── statistics/          # Stats page
│   ├── layout.tsx           # Root layout
│   └── page.tsx             # Home page
│
├── components/              # React components
│   ├── Kana/               # Kana-specific components
│   │   ├── Game/           # Game mode components
│   │   └── KanaCards/      # Kana card displays
│   ├── Test/               # Test mode components
│   ├── Settings/           # Settings components
│   ├── Statistics/         # Statistics components
│   ├── reusable/           # Shared components
│   │   ├── Game/           # Common game elements
│   │   └── Menu/           # Navigation components
│   └── ui/                 # Base UI components
│
├── lib/                     # Utilities and helpers
│   ├── hooks/              # Custom React hooks
│   ├── generateKanaQuestions.ts
│   ├── helperFunctions.ts
│   ├── keyMappings.ts
│   └── utils.ts
│
├── static/                  # Static data
│   ├── kana.ts             # Kana character data
│   ├── themes.ts           # Theme definitions
│   ├── fonts.ts            # Font configurations
│   ├── styles.ts           # Shared styles
│   ├── icons.tsx           # Icon exports
│   └── info.tsx            # Info content
│
├── store/                   # Zustand state stores
│   ├── useKanaStore.ts     # Kana game state
│   ├── useTestStore.ts     # Test mode state
│   ├── useStatsStore.ts    # Statistics state
│   └── useThemeStore.ts    # Theme preferences
│
├── hooks/                   # Additional hooks
│   └── useTimer.ts
│
└── public/                  # Static assets
    └── sounds/             # Audio files
        ├── click/
        └── error/
```

---

## 🎮 How to Use

1. **Start Learning**: Navigate to the Kana menu from the home page
2. **Select Subsets**: Choose which kana characters to practice
3. **Pick a Mode**: Select from Pick, Input, or their reverse variants
4. **Practice**: Answer questions and build your knowledge
5. **Test Yourself**: Take comprehensive tests to evaluate progress
6. **Track Stats**: View your performance in the Statistics section
7. **Customize**: Adjust themes, fonts, and settings in Preferences

---

## 🤝 Contributing

Contributions are welcome! If you'd like to contribute:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📧 Contact

For questions, suggestions, or feedback, please open an issue on GitHub.

---

**Happy Learning! がんばって！ (Ganbatte!)**
