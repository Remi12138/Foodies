import React from "react";
import { Image } from "react-native";
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
                    backgroundColor: '#a6e4d0',
                    image: (
                        <Image
                            source={require("@/assets/images/restaurant1.png")}
                            style={{ width: 200, height: 200, resizeMode: "contain" }}
                        />
                    ),
                    title: 'Track Your Meals',
                    subtitle: 'Keep an eye on your delicious bites!',
                },
                {
                    backgroundColor: '#fdeb93',
                    image: (
                        <Image
                            source={require("@/assets/images/restaurant1.png")}
                            style={{ width: 200, height: 200, resizeMode: "contain" }}
                        />
                    ),
                    title: 'Find Restaurants',
                    subtitle: 'Discover the hottest spots around!',
                },
                {
                    backgroundColor: '#e9bcbe',
                    image: (
                        <Image
                            source={require("@/assets/images/restaurant1.png")}
                            style={{ width: 200, height: 200, resizeMode: "contain" }}
                        />
                    ),
                    title: 'Plan Your Diet',
                    subtitle: 'Eat smart, live better.',
                },
            ]}
        />
    );
};

export default OnboardingScreen;
