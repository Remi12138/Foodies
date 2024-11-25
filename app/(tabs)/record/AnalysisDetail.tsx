import React, {useEffect, useState} from 'react';
import { View, Text, ScrollView, StyleSheet, Image, Dimensions, Button, TouchableOpacity } from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import { Diet } from "@/zustand/diet";
import {ThemedView} from "@/components/ThemedView";
import {ThemedText} from "@/components/ThemedText";
import { useThemeColor } from "@/hooks/useThemeColor";

const screenWidth = Dimensions.get('window').width;
const containerWidth = screenWidth - 40; // Fixed width for food item display container
const displayWidth = screenWidth - 80; // Fixed width for display img container

type AnalysisDetailScreenProps = RouteProp<{ params: { newDiet: Diet } }, 'params'>;

const recBackgroundColors = [
    'rgba(252,134,164, 0.3)',
    'rgba(54, 162, 235, 0.3)',
    'rgba(255, 235, 86, 0.3)',
    'rgba(75, 192, 192, 0.3)',
    'rgba(153, 102, 255, 0.3)',
    'rgba(255, 159, 64, 0.3)',
];

const recBorderColors = [
    'rgba(252,134,164, 0.8)',
    'rgba(54, 162, 235, 0.8)',
    'rgba(255, 235, 86,0.8)',
    'rgba(75, 192, 192, 0.8)',
    'rgba(153, 102, 255, 0.8)',
    'rgba(255, 159, 64, 0.8)',
];

const AnalysisDetailScreen: React.FC = () => {
    const { params: { newDiet } } = useRoute<AnalysisDetailScreenProps>();
    const [selectedFoodIndex, setSelectedFoodIndex] = useState<number | null>(null);
    const backgroundColor = useThemeColor({}, "background");
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
                        { backgroundColor: selectedFoodIndex === null
                                ? 'rgba(255, 99, 71, 0.8)'
                                : backgroundColor } // Highlight "All" button if selected
                    ]}
                >
                    <ThemedText style={styles.foodButtonText}>All</ThemedText>
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
                                    : backgroundColor, // Default background
                            },
                        ]}
                    >
                        <ThemedText style={styles.foodButtonText}>{food.name}</ThemedText>
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
                                : backgroundColor  // Default background
                        }
                    ]}>
                        <ThemedText style={styles.foodHeader}>Food Item #{index + 1}: {food.name}</ThemedText>

                        <View style={styles.detailsRow}>
                            {/* Left column */}
                            <View style={styles.column}>
                                <View style={styles.detailRow}>
                                    <ThemedText style={styles.detailLabel}>Confidence:</ThemedText>
                                    <ThemedText style={styles.detailValue}>{(food.confidence * 100).toFixed(2)}%</ThemedText>
                                </View>
                                <View style={styles.detailRow}>
                                    <ThemedText style={styles.detailLabel}>Calories:</ThemedText>
                                    <ThemedText style={styles.detailValue}>{Math.round(food.calories)} Cal</ThemedText>
                                </View>
                                <View style={styles.detailRow}>
                                    <ThemedText style={styles.detailLabel}>Quantity:</ThemedText>
                                    <ThemedText style={styles.detailValue}>{food.quantity} g</ThemedText>
                                </View>
                                <View style={styles.detailRow}>
                                    <ThemedText style={styles.detailLabel}>Glycemic Index:</ThemedText>
                                    <ThemedText style={styles.detailValue}>{food.glycemic_index}</ThemedText>
                                </View>
                            </View>

                            {/* Right column */}
                            <View style={styles.column}>
                                <View style={styles.detailRow}>
                                    <ThemedText style={styles.detailLabel}>Proteins:</ThemedText>
                                    <ThemedText style={styles.detailValue}>{food.proteins.toFixed(1)} g</ThemedText>
                                </View>
                                <View style={styles.detailRow}>
                                    <ThemedText style={styles.detailLabel}>Fat:</ThemedText>
                                    <ThemedText style={styles.detailValue}>{food.fat.toFixed(1)} g</ThemedText>
                                </View>
                                <View style={styles.detailRow}>
                                    <ThemedText style={styles.detailLabel}>Carbs:</ThemedText>
                                    <ThemedText style={styles.detailValue}>{food.carbs.toFixed(1)} g</ThemedText>
                                </View>
                                <View style={styles.detailRow}>
                                    <ThemedText style={styles.detailLabel}>Fibers:</ThemedText>
                                    <ThemedText style={styles.detailValue}>{food.fibers.toFixed(1)} g</ThemedText>
                                </View>
                            </View>
                        </View>
                    </View>
                </TouchableOpacity>
            ))}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 20,
        // backgroundColor: '#fff',
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
        borderColor: '#ccc',
        borderWidth: 1,
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
        borderColor: '#ccc',
        borderWidth: 1,
    },
    foodButtonText: {
        fontSize: 14,
        fontWeight: 'bold',
        // color: '#333',
    },
});

export default AnalysisDetailScreen;
