# Foodies: Your Ultimate Food Companion 👋

**Foodies** is your go-to app for everything food! Here's what makes it amazing:

- Explore: Discover top restaurants and hidden gems around you. 🗺️
- Share: Join the Foodies community to share and read food blogs. 🌍
- Track: Manage your diet with nutrition analysis and receipt tracking. 🥗🧾

From food adventures to expense recorder, **Foodies** brings joy and ease
to every meal. Let’s make every bite unforgettable! 🍕🍔🍩

## Figma Design

[Figma Link](https://www.figma.com/design/sTu1e6FdJQHvlvGti3yjgC/590_Foodies?node-id=0-1&t=mubX4gAmvMdYqTMR-1)

## Native device features

1. **Media**: image selection from the device gallery.
2. **Location**: fetch the device's system location.
3. **File System**: save image files to the app's document directory
   (a persistent storage location on the device).
4. **Networking**: communicate with APIs.
5. **Notifications**: send and receive push notifications using Expo's notification service.
6. **App Appearance**: respond to system-wide appearance settings (light/dark mode).
7. **Linking**: open URLs and could link to yelp app.

## Data sources

1. **Local Data Storage**
   - **AsyncStorage**: key-value storage for custom type `diet` and `receipt`, for user `authentication session`, and for user `blog draft` saving and retrieving.
   - **File System**: use expo-file-system to save and manage uploaded image files e.g. `blog posting`, `diet`, and `receipt`.
2. **Cloud Services**
   - **Firebase**
     - Firestore database for `user info`, `blog collections`, `blog covers index`, and so on.
     - Authentication for user account management like `authentication`, `password retrieve`,`email verification`.
     - Cloud storage for `blog images` and `user avatar`.
3. **Third-Party APIs**
   - Restaurant Explore [Yelp Fusion](https://fusion.yelp.com)
   - Food Analysis [Foodvisor](https://www.foodvisor.io/en/vision/) [will end during January 2025]
   - AI Advice [OpenAI](https://platform.openai.com/docs/overview)

## Third-party libraries

1. **UI Components & Styling**
   - **React Navigation**: navigate between screens with stacks, tabs, or drawers.
2. **State Management**
   - **Zustand**: lightweight and intuitive global state management.
3. **Networking**
   - **Axios**: library for HTTP requests and API communication.
4. **Data Management**
   - **AsyncStorage**: local key-value storage for small data.
5. **Authentication**
   - **Firebase Auth**: authentication solution from Firebase (email).
6. **Maps & Location**
   - **React Native Maps**: map rendering using Google Maps.
   - **Expo Location**: fetch device GPS and geofencing capabilities.
7. **Push Notifications**
   - **Expo Notifications**: send and receive push notifications.
8. **Utilities**
   - **React Native Reanimated**: advanced animation library.

## Disclose use of ChatGPT

- imgHash
  - To save computing resources, check whether the image analysis result
    is already stored before sending an image to the API for analysis.
    However, two identical images may have different `imgUri` values due to
    random numbers appended to the file names. With the help of ChatGPT,
    compute an `imgHash` directly from the image content to determine
    whether the two images are the same.
- Save the image to a permanent location
  - Use `AsyncStorage` to store custom type `diet` and `receipt` on device.  
    When the app is restarted or reloaded (like after a `git clone`), imgUri
    no longer exist. The reason is that the ImagePicker often generate temporary
    file URIs (e.g., `/data/user/0/...`) that are valid only for the current
    app session. With the help of ChatGPT, re-write the code to save the image
    to a permanent location using `expo-file-system`, making images persist
    across sessions and reloads.
- notification trigger channelId for Android
  - When upgrade Expo SDK to version `52.0`, notification cannot display in
    `Android`. With the help of ChatGPT, add notification trigger channelId for `Android`.

## Backend Design

### Database

We leverage Firestore database to make CRUD operations for user essential data such as user profile, blog posts, blog covers, and blog favorite collections.

Well designed for fast content retrieving: BlogCovers serves as a centralized summary of all users' blogs, functioning like a book's catalog. Each entry in BlogCovers points to the detailed blog content stored within the respective user's profile. This design improves performance by reducing waiting times when retrieving new content, simplifies indexing, and optimizes API payloads and token usage.

### Storage

For serving and storing large content data such as post images.

## Functionality

### Community

A blog sharing place.

1. Post creation: User can create a post with 1-9 images, title, and content. Additionally, user can drage images to adjust order and link a restaurant from yelp.

2. Post likes: User can favor a post and view them in collections. The likes count will increase or decrease accordingly and visible for everyone.

3. Post deletion: User can delete a post if necessary

4. Post draft auto saving: unpublished draft of post will be saved to async-storage if user stop typing for a while automatically, giving user anthoer chance to get them back!

<img src="/screenshots/015.png" alt="0" height="350">
<img src="/screenshots/016.png" alt="1" height="350">
<img src="/screenshots/017.png" alt="2" height="350">

### Explore

Explore food places around the world via list and map.

### Record

**1. Daily Diet Tracking and List Management**

- Keep a record of your diets each day by uploading photos of your food.
  The images are analyzed using the Foodvisor API.
  - In the preview, you'll see the calorie, protein, fat, carbs, and fiber content of your diet.
    You’ll also receive a diet grade along with personalized dietary advice powered by the ChatGPT.
    (If you're not satisfied with the advice, you can request a new one.)
  - Clicking "Details" will show an analysis of every individual food item identified in your diet.
    Detected food items are marked directly on the uploaded image.
    You can use buttons below to toggle between viewing all foods or focusing on specific ones.
    Each identified food item comes with a card displaying details such as confidence(accuracy of food identification),
    calories, quantity, glycemic index, and contents of protein, fat, carbs, and fiber.
    By tapping a food card, you can highlight its exact location in the image.
- Diet List Management: All uploaded diets are displayed in a list format, allowing you to edit the title and date or
  delete entries as needed.

**2. Receipt Tracking and List Management**

- People often forget the exact amount spent at restaurants, the tip they left,
  or fail to verify if the correct amount was deducted from their bank account.
  In **Foodies**, users can upload and save restaurant receipts while
  setting reminders to follow up on the transaction at a specified time.
- Receipt List Management: All uploaded receipts are displayed in a list format,
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

1. User profile: display of user avatar, user id, and allow user update avatar.
2. User settings: update name, change password, and account deletion
3. USer sign out

## API

- Restaurant Explore [Yelp Fusion](https://fusion.yelp.com)
- Food Analysis [Foodvisor](https://www.foodvisor.io/en/vision/)
- AI Advice [OpenAI](https://platform.openai.com/docs/overview)

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

- Light and dark mode components: This app has light and dark mode support. The useColorScheme hook lets you inspect what the user's current color scheme is, and so you can adjust Ul colors accordingly.

- Animations: This template includes an example of an animated component. The components/ HelloWave.tsx component uses the powerful react-native-reanimated library to create a waving hand animation. The components/ParallaxScrollView.tsx component provides a parallax effect for the header image.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Issues

App reloads whenever 'r' key pressed in simulator ('R' is fine).
The issue is reported on the Expo GitHub Issues page.
Many people have the same problem after updating Expo to version 52.0.

[Open Issue #20233](https://github.com/expo/expo/issues/20233)

## Dark Mode Screenshots

<img src="/screenshots/dark000.png" alt="d0" height="350">
<img src="/screenshots/dark001.png" alt="d1" height="350">
<img src="/screenshots/dark002.png" alt="d2" height="350">
<img src="/screenshots/dark004.png" alt="d4" height="350">
<img src="/screenshots/dark003.png" alt="d3" height="350">
