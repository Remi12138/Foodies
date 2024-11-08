import React from 'react';
import { View, Text, ScrollView, StyleSheet, Image, Button, Dimensions } from 'react-native';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import { Diet } from "@/zustand/diet";

// Get the screen width
const screenWidth = Dimensions.get('window').width;

type AnalysisPreviewScreenProps = RouteProp<{ params: { newDiet: Diet } }, 'params'>;

const AnalysisPreviewScreen: React.FC = () => {
    const { params: { newDiet } } = useRoute<AnalysisPreviewScreenProps>();
    const parsedDate = new Date(newDiet.date);
    const navigation = useNavigation();

    // Function to calculate max nutrient value for scaling bar lengths
    const maxNutrientValue = Math.max(newDiet.total_proteins, newDiet.total_fat, newDiet.total_carbs, newDiet.total_fibers);

    return (
        <ScrollView style={styles.container}>
            {/*<Text style={styles.header}>Analysis Result</Text>*/}

            {/* Displaying diet image */}
            <View style={styles.imageContainer}>
                <Image source={{ uri: newDiet.imgUri }} style={styles.dietImage} />
                {/*<Text style={styles.totalCalories}>{newDiet.total_calories} Cal</Text>*/}
                <View style={styles.totalCaloriesContainer}>
                    <Text style={styles.totalCaloriesText}>  {Math.round(newDiet.total_calories)} Cal   </Text>
                </View>
            </View>

            {/* Nutritional Breakdown */}
            <View style={styles.nutritionalInfo}>
                <NutrientBar label="Proteins" value={Math.round(newDiet.total_proteins)} color="#FFB6C1" max={maxNutrientValue} />
                <NutrientBar label="Fat" value={Math.round(newDiet.total_fat)} color="#FFD700" max={maxNutrientValue} />
                <NutrientBar label="Carbs" value={Math.round(newDiet.total_carbs)} color="#87CEEB" max={maxNutrientValue} />
                <NutrientBar label="Fibers" value={Math.round(newDiet.total_fibers)} color="#D2B48C" max={maxNutrientValue} />
            </View>

            {/* Detail Button */}
            <View style={styles.buttonContainer}>
                <Button title="Detail" onPress={() => navigation.navigate('AnalysisDetail', { newDiet: { ...newDiet, date: parsedDate.toISOString() } })} />
            {/*    <Button title="Details" onPress={() =>*/}
            {/*        navigation.reset({*/}
            {/*            index: 1,*/}
            {/*            routes: [*/}
            {/*                { name: "index" },*/}
            {/*                { name: "detaildiet", params: { newDiet: { ...newDiet, date: parsedDate.toISOString() } } },*/}
            {/*                { name: "AnalysisDetail", params: { newDiet: { ...newDiet, date: parsedDate.toISOString() } } }*/}
            {/*            ],*/}
            {/*})} />*/}
            </View>
        </ScrollView>
    );
};

// Custom component for displaying nutrient bars with background track
const NutrientBar = ({ label, value, color, max }: { label: string, value: number, color: string, max: number }) => {
    const barWidth = (value / max) * (screenWidth - 160); // Full width minus padding

    return (
        <View style={styles.nutrientBarContainer}>
            <Text style={styles.nutrientLabel}>{label}</Text>

            {/* Background track */}
            <View style={styles.nutrientBarBackground}>
                <View style={[styles.nutrientBar, { backgroundColor: color, width: barWidth }]} />
            </View>

            <Text style={styles.nutrientValue}>{value} g</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 20,
        backgroundColor: '#fff',
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    imageContainer: {
        alignItems: 'center',
        marginBottom: 20,
    },
    dietImage: {
        width: 220,
        height: 220,
        borderRadius: 20,
    },
    // totalCalories: {
    //     position: 'absolute',
    //     bottom: 10,
    //     backgroundColor: '#e7fcff',
    //     padding: 5,
    //     // borderRadius: 50,
    //     fontSize: 18,
    //     color: 'rgba(4,171,167,0.88)',
    //     fontWeight: 'bold',
    // },
    totalCaloriesContainer: {
        position: 'absolute',
        bottom: 8,
        backgroundColor: '#E0F7FA',
        padding: 5,
        borderRadius: 0,
    },
    totalCaloriesText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'rgba(2,152,148,0.88)',
    },
    nutritionalInfo: {
        marginTop: 10,
    },
    nutrientBarContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    nutrientLabel: {
        width: 80,
        fontSize: 16,
        fontWeight: 'bold',
    },
    nutrientBarBackground: {
        flex: 1,
        height: 10,
        backgroundColor: '#E0E0E0',  // Gray background track
        borderRadius: 5,
        marginHorizontal: 5,
        overflow: 'hidden',  // Ensures rounded corners on top bar
    },
    nutrientBar: {
        height: 10,
        borderRadius: 5,
    },
    nutrientValue: {
        width: 50,
        textAlign: 'right',
        fontSize: 16,
    },
    buttonContainer: {
        marginTop: 20,
        alignItems: 'center',
    },
});

export default AnalysisPreviewScreen;
