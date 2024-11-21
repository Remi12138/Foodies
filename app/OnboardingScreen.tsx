import React from "react";
import { Image, StyleSheet } from "react-native";
import Onboarding from "react-native-onboarding-swiper";

interface OnboardingScreenProps {
    onDone: () => void;
}

const OnboardingScreen: React.FC<OnboardingScreenProps> = ({ onDone }) => {
    return (
        <Onboarding
            onSkip={onDone}
            onDone={onDone}
            // pages={[
            //     {
            //         backgroundColor: '#a6e4d0',
            //         image: (
            //             <Image
            //                 source={require("@/assets/images/restaurant1.png")}
            //                 style={{ width: 200, height: 200, resizeMode: "contain" }}
            //             />
            //         ),
            //         title: 'Track Your Meals',
            //         subtitle: 'Keep an eye on your delicious bites!',
            //     },
            //     {
            //         backgroundColor: '#fdeb93',
            //         image: (
            //             <Image
            //                 source={require("@/assets/images/restaurant1.png")}
            //                 style={{ width: 200, height: 200, resizeMode: "contain" }}
            //             />
            //         ),
            //         title: 'Find Restaurants',
            //         subtitle: 'Discover the hottest spots around!',
            //     },
            //     {
            //         backgroundColor: '#e9bcbe',
            //         image: (
            //             <Image
            //                 source={require("@/assets/images/restaurant1.png")}
            //                 style={{ width: 200, height: 200, resizeMode: "contain" }}
            //             />
            //         ),
            //         title: 'Plan Your Diet',
            //         subtitle: 'Eat smart, live better.',
            //     },
            // ]}
            pages={[
                {
                    backgroundColor: '#fff',
                    image: <Image style={styles.image} source={require('@/assets/images/restaurant1.png')} />,
                    title: 'Welcome to Foodies',
                    subtitle: 'Your ultimate food journey starts here! \n 🍕🍔🌮🍩 ',
                    titleStyles: styles.title,
                    subTitleStyles: styles.subtitle,
                },
                {
                    backgroundColor: '#fdeb93',
                    image: <Image style={styles.image} source={require('@/assets/images/restaurant1.png')} />,
                    title: 'Foodies Community',
                    subtitle: 'Share and explore food blogs from restaurants around the world. 🌍',
                    titleStyles: styles.title,
                    subTitleStyles: styles.subtitle,
                },
                {
                    backgroundColor: '#e9bcbe',
                    image: <Image style={styles.image} source={require('@/assets/images/restaurant1.png')} />,
                    title: 'Find Restaurants',
                    subtitle: 'Discover the hottest spots around! 🗺️',
                    titleStyles: styles.title,
                    subTitleStyles: styles.subtitle,
                },
                {
                    backgroundColor: '#bde0fe',
                    image: <Image style={styles.image} source={require('@/assets/images/restaurant1.png')} />,
                    title: 'Record Diet',
                    subtitle: 'Upload diet pics for nutrition analysis and personalized advice. 🥗',
                    titleStyles: styles.title,
                    subTitleStyles: styles.subtitle,
                },
                {
                    backgroundColor: '#ffc6ff',
                    image: <Image style={styles.image} source={require('@/assets/images/restaurant1.png')} />,
                    title: 'Track Expenses',
                    subtitle: 'Upload receipts and set reminders for transaction checks. 💳',
                    titleStyles: styles.title,
                    subTitleStyles: styles.subtitle,
                },
            ]}
        />
    );
};

const styles = StyleSheet.create({
    image: {
        width: 200,
        height: 200,
        resizeMode: 'contain',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#333',
    },
    subtitle: {
        fontSize: 20,
        color: '#666',
        lineHeight: 28,
    },
});

export default OnboardingScreen;
