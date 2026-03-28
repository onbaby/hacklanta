# DuoQ - HacklantaApp

React Native app for the DuoQ project. See the [root README](../README.md) for an overview.

## Quick Start

```sh
npm install
npm start          # start Metro bundler
npm run ios        # run on iOS simulator
npm run android    # run on Android emulator
```

### iOS Setup

First time only:

```sh
bundle install
cd ios && bundle exec pod install && cd ..
```

Re-run `bundle exec pod install` any time you add or update a native dependency.

## Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Start Metro dev server |
| `npm run ios` | Build and run on iOS |
| `npm run android` | Build and run on Android |
| `npm run lint` | Run ESLint |
| `npm test` | Run Jest tests |

## Troubleshooting

- **Pod install fails**: Make sure you have CocoaPods installed (`gem install cocoapods`) and run `bundle exec pod install` from the `ios/` directory.
- **Build fails on Xcode**: Open `ios/HacklantaApp.xcworkspace` (not `.xcodeproj`), clean build folder (Cmd+Shift+K), then rebuild.
- **Metro bundler issues**: Clear cache with `npm start -- --reset-cache`.
- **Android build issues**: Make sure `ANDROID_HOME` is set and you have the correct SDK installed.
