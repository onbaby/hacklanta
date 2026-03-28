# DuoQ

A mobile app for gamers to find their perfect duo partner. Swipe through player profiles, match based on games, rank, play style, and schedule, then chat with your new teammate.

Built with React Native + TypeScript.

## Features

- **Profile Cards** — Swipe-based discovery with photos, top games, ranks, play styles, schedules, and hinge-style prompts
- **Profile Editor** — Edit your photos, bio, games, schedule, and preferences with a live "View" preview of how others see you
- **Messages** — Chat with your matches
- **Smart Matching** — Filter by games, rank, play schedule, platform, and preferences

## Tech Stack

- React Native 0.84
- TypeScript
- React Navigation (bottom tabs + native stack)
- react-native-svg, react-native-video, @react-native-community/blur
- Custom glassmorphism UI components

## Getting Started

### Prerequisites

- Node.js 18+
- Xcode 15+ (for iOS)
- CocoaPods
- Android Studio (for Android)

Complete the [React Native environment setup](https://reactnative.dev/docs/set-up-your-environment) first.

### Install

```sh
cd HacklantaApp
npm install
```

For iOS:

```sh
bundle install
cd ios && bundle exec pod install && cd ..
```

### Run

Start the Metro bundler:

```sh
npm start
```

Then in a separate terminal:

```sh
# iOS
npm run ios

# Android
npm run android
```

## Project Structure

```
HacklantaApp/src/
  assets/          # Images, fonts, video
  components/      # Reusable UI (ProfileCard, PlayStyleBadge, TopGameEntry)
  constants/       # Mock data
  navigation/      # AppNavigator (tab bar + stack)
  screens/         # Home, Profile, Messages, Chat, Login, Welcome
  types/           # TypeScript interfaces
  utils/           # Helpers
```
