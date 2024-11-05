import React, {useEffect, useState} from 'react';
import { View, Text, ScrollView, StyleSheet, Image, Dimensions, Button, TouchableOpacity } from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import { Diet } from "@/zustand/diet";

const screenWidth = Dimensions.get('window').width;
const containerWidth = screenWidth - 40; // Fixed width for food item display container
const displayWidth = screenWidth - 80; // Fixed width for display img container

type AnalysisDetailScreenProps = RouteProp<{ params: { newDiet: Diet } }, 'params'>;

const recBackgroundColors = [
    'rgba(252,134,164, 0.3)',    // Tomato
    'rgba(54, 162, 235, 0.3)',   // Blue
    'rgba(255, 235, 86, 0.3)',   // Yellow
    'rgba(75, 192, 192, 0.3)',   // Green
    'rgba(153, 102, 255, 0.3)',  // Purple
    'rgba(255, 159, 64, 0.3)',   // Orange
];

const recBorderColors = [
    'rgba(252,134,164, 0.8)',    // Tomato
    'rgba(54, 162, 235, 0.8)',   // Blue
    'rgba(255, 235, 86,0.8)',   // Yellow
    'rgba(75, 192, 192, 0.8)',   // Green
    'rgba(153, 102, 255, 0.8)',  // Purple
    'rgba(255, 159, 64, 0.8)',   // Orange
];

const AnalysisDetailScreen: React.FC = () => {
    const { params: { newDiet } } = useRoute<AnalysisDetailScreenProps>();
    const [selectedFoodIndex, setSelectedFoodIndex] = useState<number | null>(null);
    // const imageWidth = Dimensions.get('window').width - 100;
    // const imageHeight = 300;

    const [displayHeight, setDisplayHeight] = useState(displayWidth); // Initialize with a square layout

    useEffect(() => {
        // Fetch the original image dimensions
        Image.getSize(newDiet.imgUri, (width, height) => {
            const aspectRatio = width / height;
            const calculatedHeight = displayWidth / aspectRatio;
            setDisplayHeight(calculatedHeight);
        });
    }, [newDiet.imgUri]);


    return (
        <ScrollView contentContainerStyle={styles.container}>
            {/* Display Diet Image */}
            <View style={[styles.imageContainer, ]}>
                <Image source={{ uri: newDiet.imgUri }} style={[styles.dietImage, { width: displayWidth, height: displayHeight }]} />

                {/* Display rectangles based on selection */}
                {newDiet.foodOptions.map((food, index) => {
                    if (selectedFoodIndex !== null && selectedFoodIndex !== index) return null;

                    return (
                        <View
                            key={index}
                            style={[
                                styles.foodRectangle,
                                {
                                    top: food.position.y * displayHeight,
                                    left: food.position.x * displayWidth,
                                    width: food.position.width * displayWidth,
                                    height: food.position.height * displayHeight,
                                    backgroundColor: recBackgroundColors[index % recBackgroundColors.length],
                                    borderColor: recBorderColors[index % recBorderColors.length],
                                },
                            ]}
                        >
                            <Text style={styles.foodLabel}>{food.name}</Text>
                        </View>
                    );
                })}
            </View>

            {/* Buttons for each food item in multiple rows */}
            <View style={styles.foodButtonsContainer}>
                <TouchableOpacity
                    onPress={() => setSelectedFoodIndex(null)}
                    style={[
                        styles.foodButton,
                        { backgroundColor: selectedFoodIndex === null ? 'rgba(255, 99, 71, 0.8)' : '#E0E0E0' } // Highlight "All" button if selected
                    ]}
                >
                    <Text style={styles.foodButtonText}>All</Text>
                </TouchableOpacity>
                {newDiet.foodOptions.map((food, index) => (
                    <TouchableOpacity
                        key={index}
                        onPress={() => setSelectedFoodIndex(index)}
                        style={[
                            styles.foodButton,
                            {
                                backgroundColor: selectedFoodIndex === index
                                    ? recBackgroundColors[index % recBackgroundColors.length]
                                    : '#E0E0E0', // Default background
                            },
                        ]}
                    >
                        <Text style={styles.foodButtonText}>{food.name}</Text>
                    </TouchableOpacity>
                ))}
            </View>

            {/* Display each foodOption as clickable items */}
            {newDiet.foodOptions.map((food, index) => (
                <TouchableOpacity key={index} onPress={() => setSelectedFoodIndex(index)}>
                    <View style={[
                        styles.foodContainer,
                        {
                            backgroundColor: selectedFoodIndex === index
                                ? recBackgroundColors[index % recBackgroundColors.length]
                                : '#f9f9f9' // Default background
                        }
                    ]}>
                        <Text style={styles.foodHeader}>Food Item #{index + 1}: {food.name}</Text>

                        <View style={styles.detailsRow}>
                            {/* Left column */}
                            <View style={styles.column}>
                                <View style={styles.detailRow}>
                                    <Text style={styles.detailLabel}>Confidence:</Text>
                                    <Text style={styles.detailValue}>{(food.confidence * 100).toFixed(2)}%</Text>
                                </View>
                                <View style={styles.detailRow}>
                                    <Text style={styles.detailLabel}>Calories:</Text>
                                    <Text style={styles.detailValue}>{Math.round(food.calories)} Cal</Text>
                                </View>
                                <View style={styles.detailRow}>
                                    <Text style={styles.detailLabel}>Quantity:</Text>
                                    <Text style={styles.detailValue}>{food.quantity} g</Text>
                                </View>
                                <View style={styles.detailRow}>
                                    <Text style={styles.detailLabel}>Glycemic Index:</Text>
                                    <Text style={styles.detailValue}>{food.glycemic_index}</Text>
                                </View>
                            </View>

                            {/* Right column */}
                            <View style={styles.column}>
                                <View style={styles.detailRow}>
                                    <Text style={styles.detailLabel}>Proteins:</Text>
                                    <Text style={styles.detailValue}>{food.proteins.toFixed(1)} g</Text>
                                </View>
                                <View style={styles.detailRow}>
                                    <Text style={styles.detailLabel}>Fat:</Text>
                                    <Text style={styles.detailValue}>{food.fat.toFixed(1)} g</Text>
                                </View>
                                <View style={styles.detailRow}>
                                    <Text style={styles.detailLabel}>Carbs:</Text>
                                    <Text style={styles.detailValue}>{food.carbs.toFixed(1)} g</Text>
                                </View>
                                <View style={styles.detailRow}>
                                    <Text style={styles.detailLabel}>Fibers:</Text>
                                    <Text style={styles.detailValue}>{food.fibers.toFixed(1)} g</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                </TouchableOpacity>
            ))}
        </ScrollView>
    );
};

// Custom component for displaying nutrient bars with background track
const NutrientBar = ({ label, value, color, max }: { label: string, value: number, color: string, max: number }) => {
    const barWidth = (value / max) * (screenWidth - 160);

    return (
        <View style={styles.nutrientBarContainer}>
            <Text style={styles.nutrientLabel}>{label}</Text>
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
        alignItems: 'center',
        justifyContent: 'center',
    },
    imageContainer: {
        alignItems: 'center',
        marginBottom: 20,
        justifyContent: 'center',
        flexDirection: 'column',
    },
    dietImage: {
        resizeMode: 'contain',
    },
    foodRectangle: {
        position: 'absolute',
        borderWidth: 2,
        justifyContent: 'center',
        alignItems: 'center',
    },
    foodLabel: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 12,
        textAlign: 'center',
    },
    foodContainer: {
        width: containerWidth,
        marginVertical: 10,
        padding: 15,
        borderRadius: 10,
    },
    foodHeader: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    detailsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    column: {
        flex: 1,
        paddingHorizontal: 5,
    },
    detailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 5,
    },
    detailLabel: {
        fontSize: 16,
        textAlign: 'left',
    },
    detailValue: {
        fontSize: 16,
        textAlign: 'right',
    },
    foodDetailText: {
        fontSize: 16,
        marginBottom: 5,
    },
    buttonContainer: {
        marginTop: 10,
        marginBottom: 20,
        alignItems: 'center',
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
        backgroundColor: '#E0E0E0',
        borderRadius: 5,
        marginHorizontal: 5,
        overflow: 'hidden',
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
    foodButtonsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap', // Allow buttons to wrap to the next line
        justifyContent: 'center', // Center buttons within the container
        paddingVertical: 10,
    },
    foodButton: {
        backgroundColor: '#E0E0E0',
        paddingHorizontal: 15,
        paddingVertical: 8,
        borderRadius: 20,
        margin: 5, // Space between buttons
    },
    foodButtonText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#333',
    },
});

export default AnalysisDetailScreen;
