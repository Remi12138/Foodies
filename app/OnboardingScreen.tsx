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
            pages={[
                {
                    backgroundColor: 'rgba(252,139,62,0.86)',
                    image: <Image style={styles.image} source={require('@/assets/images/boarding_welcome.png')} />,
                    title: 'Welcome to Foodies',
                    subtitle: 'Your ultimate food journey starts here! \n 🍕🍔🌮🍩 ',
                    titleStyles: styles.title,
                    subTitleStyles: styles.subtitle,
                },
                {
                    backgroundColor: 'rgba(242,102,21,0.87)',
                    image: <Image style={styles.image} source={require('@/assets/images/boarding_blog.png')} />,
                    title: 'Foodies Community',
                    subtitle: 'Share and explore food blogs from restaurants around the world. 🌍',
                    titleStyles: styles.title2,
                    subTitleStyles: styles.subtitle2,
                },
                {
                    backgroundColor: 'rgba(255,133,52,0.85)',
                    image: <Image style={styles.image} source={require('@/assets/images/boarding_explore.png')} />,
                    title: 'Find Restaurants',
                    subtitle: 'Discover the hottest spots around! 🗺️',
                    titleStyles: styles.title,
                    subTitleStyles: styles.subtitle,
                },
                {
                    backgroundColor: 'rgba(204,71,4,0.77)',
                    image: <Image style={styles.image} source={require('@/assets/images/boarding_diet.png')} />,
                    title: 'Record Diet',
                    subtitle: 'Upload diet pics for nutrition analysis and personalized advice. 🥗',
                    titleStyles: styles.title2,
                    subTitleStyles: styles.subtitle2,
                },
                {
                    backgroundColor: '#ffc57e',
                    image: <Image style={styles.image} source={require('@/assets/images/boarding_receipt.png')} />,
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
        width: 350,
        height: 350,
        borderRadius: 50,
        resizeMode: 'contain',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#333',
    },
    title2: {
        fontSize: 28,
        fontWeight: 'bold',
        color: 'rgb(235,235,235)',
    },
    subtitle2: {
        fontSize: 20,
        color: 'rgba(255,255,255,0.79)',
        lineHeight: 35,
    },
    subtitle: {
        fontSize: 20,
        color: '#656060',
        lineHeight: 35,
    },
});

export default OnboardingScreen;
