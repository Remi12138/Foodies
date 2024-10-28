# Foodies: Explore food with AI 👋

Intro here.

## Functionality

### Community

A blog sharing place.

### Explore

Explore food places around the world via list and map.

### People

Add/View followers

### Profile

1. Manage receipts
2. Find out food details e.g. calories
3. Settings
4. User authentication

## API

- Restaurant Explore [Yelp Fusion](https://fusion.yelp.com)
- Food Info [Foodvisor](https://www.foodvisor.io/en/vision/)
- AI [OpenAI](https://platform.openai.com/docs/overview)
- IP Geolocation [IPInfo.io](https://ipinfo.io)

## Firebase

- https://console.firebase.google.com/project/tapteam-foodies

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
    npx expo start
   ```

   or

   ```bash
    npm start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

3. Development

- File-based routing: This app has two screens: app/(tabs)/ index.tsx and app/(tabs)/explore.tsx. The layout file in app/(tabs)/\_layout.tsx sets up the tab navigator.

- Android, iOS, and web support: You can open this project on Android, iOS, and the web. To open the web version, press w in the terminal running this project.

- Images: For static images, you can use the @2x and @3x suffixes to provide files for different screen densities

- Custom fonts: Open app/\_layout.tsx to see how to load custom fonts such as this one.

- Light and dark mode components: This app has light and dark mode support. The useColorScheme) hook lets you inspect what the user's current color scheme is, and so you can adjust Ul colors accordingly.

- Animations: This template includes an example of an animated component. The components/ HelloWave.tsx component uses the powerful react-native-reanimated library to create a waving hand animation. The components/ParallaxScrollView.tsx component provides a parallax effect for the header image.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.
