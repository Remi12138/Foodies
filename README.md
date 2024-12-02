# Foodies: Explore food with AI 👋

Intro here.

## Functionality

### Community

A blog sharing place.

### Explore

Explore food places around the world via list and map.

### Record

**1. Daily Diet Tracking and List Management**
* Keep a record of your diets each day by uploading photos of your food. 
The images are analyzed using the Foodvisor API. 
   * In the preview, you'll see the calorie, protein, fat, carbs, and fiber content of your diet. 
   You’ll also receive a diet grade along with personalized dietary advice powered by the ChatGPT. 
  (If you're not satisfied with the advice, you can request a new one.)
   * Clicking "Details" will show an analysis of every individual food item identified in your diet. 
  Detected food items are marked directly on the uploaded image. 
  You can use buttons below to toggle between viewing all foods or focusing on specific ones.
  Each identified food item comes with a card displaying details such as confidence(accuracy of food identification), 
  calories, quantity, glycemic index, and contents of protein, fat, carbs, and fiber. 
  By tapping a food card, you can highlight its exact location in the image.
* Diet List Management: All uploaded diets are displayed in a list format, allowing you to edit the title and date or 
delete entries as needed.

**2. Receipt Tracking and List Management**
* People often forget the exact amount spent at restaurants, the tip they left, 
or fail to verify if the correct amount was deducted from their bank account. 
In **Foodies**, users can upload and save restaurant receipts while 
setting reminders to follow up on the transaction at a specified time.
* Receipt List Management: All uploaded receipts are displayed in a list format, 
allowing users to edit the title, amount, and reminder time or delete entries as needed.

<img src="/screenshots/000.png" alt="0" height="350">
<img src="/screenshots/001.png" alt="1" height="350">
<img src="/screenshots/002.png" alt="2" height="350">
<img src="/screenshots/003.png" alt="3" height="350">
<img src="/screenshots/004.png" alt="4" height="350">
<img src="/screenshots/005.png" alt="5" height="350">
<img src="/screenshots/006.png" alt="6" height="350">
<img src="/screenshots/007.png" alt="7" height="350">
<img src="/screenshots/008.png" alt="8" height="350">
<img src="/screenshots/009.png" alt="9" height="350">
<img src="/screenshots/010.png" alt="10" height="350">
<img src="/screenshots/011.png" alt="11" height="350">
<img src="/screenshots/012.png" alt="12" height="350">

_Error Handling_

<img src="/screenshots/013.png" alt="13" height="350">
<img src="/screenshots/014.png" alt="14" height="350">

### Profile

1. Settings
2. User authentication

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
