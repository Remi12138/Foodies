// import React from 'react';
// import {View, Text, ScrollView, StyleSheet, Image, Dimensions} from 'react-native';
// import { RouteProp, useRoute } from '@react-navigation/native';
// import { Diet } from "@/zustand/diet";
// const screenWidth = Dimensions.get('window').width;
// type AnalysisDetailScreenProps = RouteProp<{ params: { newDiet: Diet } }, 'params'>;
// // Define an array of colors to cycle through for each rectangle
// const recBackgroundColors = [
//     'rgba(255, 99, 71, 0.3)',    // Tomato
//     'rgba(54, 162, 235, 0.3)',   // Blue
//     'rgba(255, 206, 86, 0.3)',   // Yellow
//     'rgba(75, 192, 192, 0.3)',   // Green
//     'rgba(153, 102, 255, 0.3)',  // Purple
//     'rgba(255, 159, 64, 0.3)',   // Orange
// ];
//
// const recBorderColors = [
//     'rgba(255, 99, 71, 0.8)',    // Tomato
//     'rgba(54, 162, 235, 0.8)',   // Blue
//     'rgba(255, 206, 86, 0.8)',   // Yellow
//     'rgba(75, 192, 192, 0.8)',   // Green
//     'rgba(153, 102, 255, 0.8)',  // Purple
//     'rgba(255, 159, 64, 0.8)',   // Orange
// ];
//
// const AnalysisDetailScreen: React.FC = () => {
//     const { params: { newDiet } } = useRoute<AnalysisDetailScreenProps>();
//     const maxNutrientValue = Math.max(newDiet.total_proteins, newDiet.total_fat, newDiet.total_carbs, newDiet.total_fibers);
//     const imageWidth = Dimensions.get('window').width - 40; // Adjusted for padding
//     const imageHeight = 300;
//
//     return (
//         <ScrollView style={styles.container}>
//              {/*<Text style={styles.header}>Analysis Result</Text>*/}
//
//             {/* Display Diet Image */}
//             <View style={[styles.imageContainer, { width: imageWidth, height: imageHeight }]}>
//                 <Image source={{ uri: newDiet.imgUri }} style={[styles.dietImage, { width: imageWidth, height: imageHeight }]} />
//                 {newDiet.foodOptions.map((food, index) => {
//                     const area = food.position.width * food.position.height;
//                     return(
//                         <View
//                             key={index}
//                             style={[
//                                 styles.foodRectangle,
//                                 {
//                                     // Positioning the rectangle based on food.position
//                                     top: food.position.y * imageHeight,
//                                     left: food.position.x * imageWidth,
//                                     width: food.position.width * imageWidth,
//                                     height: food.position.height * imageHeight,
//                                     backgroundColor: recBackgroundColors[index % recBackgroundColors.length], // Cycle through colors
//                                     borderColor: recBorderColors[index % recBorderColors.length],
//                                     zIndex: -area,
//                                 },
//                             ]}
//                         >
//                             <Text style={styles.foodLabel}>{food.name}</Text>
//                         </View>
//                     );
//                 })}
//                 {/*<View style={[styles.foodRectangle, { top: 10, left: 10, width: 100, height: 50 }]}>*/}
//                 {/*    <Text style={styles.foodLabel}>Debug Rect</Text>*/}
//                 {/*</View>*/}
//             </View>
//
//             <Text style={styles.totalCalories}>{newDiet.total_calories} Cal</Text>
//             <View style={styles.foodContainer}>
//                 <View style={styles.nutritionalInfo}>
//                     <NutrientBar label="Proteins" value={Math.round(newDiet.total_proteins)} color="#FFB6C1" max={maxNutrientValue} />
//                     <NutrientBar label="Fat" value={Math.round(newDiet.total_fat)} color="#FFD700" max={maxNutrientValue} />
//                     <NutrientBar label="Carbs" value={Math.round(newDiet.total_carbs)} color="#87CEEB" max={maxNutrientValue} />
//                     <NutrientBar label="Fibers" value={Math.round(newDiet.total_fibers)} color="#D2B48C" max={maxNutrientValue} />
//                 </View>
//             </View>
//             {/* Display each foodOption */}
//             {newDiet.foodOptions.map((food, index) => (
//                 <View key={index} style={styles.foodContainer}>
//                     <Text style={styles.foodHeader}>Food Item #{index + 1}: {food.name}</Text>
//                     <Text style={styles.foodDetailText}>Calories: {Math.round(food.calories)} Cal</Text>
//                     <Text style={styles.foodDetailText}>Confidence: {(food.confidence * 100).toFixed(2)}%</Text>
//                     <Text style={styles.foodDetailText}>Quantity: {food.quantity} g</Text>
//                     <Text style={styles.foodDetailText}>Glycemic Index: {food.glycemic_index}</Text>
//                 </View>
//             ))}
//
//         </ScrollView>
//     );
// };
//
// // Custom component for displaying nutrient bars with background track
// const NutrientBar = ({ label, value, color, max }: { label: string, value: number, color: string, max: number }) => {
//     const barWidth = (value / max) * (screenWidth - 160); // Full width minus padding
//
//     return (
//         <View style={styles.nutrientBarContainer}>
//             <Text style={styles.nutrientLabel}>{label}</Text>
//
//             {/* Background track */}
//             <View style={styles.nutrientBarBackground}>
//                 <View style={[styles.nutrientBar, { backgroundColor: color, width: barWidth }]} />
//             </View>
//
//             <Text style={styles.nutrientValue}>{value} g</Text>
//         </View>
//     );
// };
//
// const styles = StyleSheet.create({
//     container: {
//         padding: 20,
//         backgroundColor: '#fff',
//     },
//     header: {
//         fontSize: 24,
//         fontWeight: 'bold',
//         marginBottom: 20,
//         textAlign: 'center',
//     },
//     imageContainer: {
//         alignItems: 'center',
//         marginBottom: 20,
//     },
//     // dietImage: {
//     //     width: 200,
//     //     height: 200,
//     //     borderRadius: 10,
//     // },
//     dietImage: {
//         width: Dimensions.get('window').width - 40,
//         height: 300,
//         // resizeMode: 'contain',
//         resizeMode: 'cover',
//     },
//     totalCalories: {
//         // position: 'absolute',
//         bottom: 10,
//         backgroundColor: '#E0F7FA',
//         padding: 5,
//         borderRadius: 10,
//         fontSize: 18,
//         fontWeight: 'bold',
//     },
//     foodContainer: {
//         marginVertical: 10,
//         padding: 15,
//         borderRadius: 10,
//         backgroundColor: '#f9f9f9',
//     },
//     foodHeader: {
//         fontSize: 18,
//         fontWeight: 'bold',
//         marginBottom: 10,
//     },
//     nutritionalInfo: {
//         marginTop: 10,
//     },
//     nutrientBarContainer: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         marginBottom: 10,
//     },
//     nutrientLabel: {
//         width: 80,
//         fontSize: 16,
//         fontWeight: 'bold',
//     },
//     nutrientBarBackground: {
//         flex: 1,
//         height: 10,
//         backgroundColor: '#E0E0E0',
//         borderRadius: 5,
//         marginHorizontal: 5,
//         overflow: 'hidden',
//     },
//     nutrientBar: {
//         height: 10,
//         borderRadius: 5,
//     },
//     nutrientValue: {
//         width: 50,
//         textAlign: 'right',
//         fontSize: 16,
//     },
//     totalContainer: {
//         marginTop: 20,
//         padding: 15,
//         borderRadius: 10,
//         backgroundColor: '#f0f0f0',
//     },
//     itemHeader: {
//         fontSize: 18,
//         fontWeight: 'bold',
//         marginBottom: 10,
//     },
//     foodDetailText: {
//         fontSize: 16,
//     },
//     foodRectangle: {
//         position: 'absolute',
//         borderWidth: 2,
//         borderColor: 'rgba(255, 99, 71, 0.8)', // Tomato color with opacity
//         backgroundColor: 'rgba(255, 99, 71, 0.3)', // Light overlay background for visibility
//         justifyContent: 'center',
//         alignItems: 'center',
//     },
//     foodLabel: {
//         color: '#fff',
//         fontWeight: 'bold',
//         fontSize: 12,
//         textAlign: 'center',
//     },
// });
//
// export default AnalysisDetailScreen;

import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Image, Dimensions, Button, TouchableOpacity } from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import { Diet } from "@/zustand/diet";

const screenWidth = Dimensions.get('window').width;
type AnalysisDetailScreenProps = RouteProp<{ params: { newDiet: Diet } }, 'params'>;

const recBackgroundColors = [
    'rgba(255, 99, 71, 0.3)',    // Tomato
    'rgba(54, 162, 235, 0.3)',   // Blue
    'rgba(255, 206, 86, 0.3)',   // Yellow
    'rgba(75, 192, 192, 0.3)',   // Green
    'rgba(153, 102, 255, 0.3)',  // Purple
    'rgba(255, 159, 64, 0.3)',   // Orange
];

const recBorderColors = [
    'rgba(255, 99, 71, 0.8)',    // Tomato
    'rgba(54, 162, 235, 0.8)',   // Blue
    'rgba(255, 206, 86, 0.8)',   // Yellow
    'rgba(75, 192, 192, 0.8)',   // Green
    'rgba(153, 102, 255, 0.8)',  // Purple
    'rgba(255, 159, 64, 0.8)',   // Orange
];

const AnalysisDetailScreen: React.FC = () => {
    const { params: { newDiet } } = useRoute<AnalysisDetailScreenProps>();
    const [selectedFoodIndex, setSelectedFoodIndex] = useState<number | null>(null);
    const imageWidth = Dimensions.get('window').width - 40;
    const imageHeight = 300;

    return (
        <ScrollView style={styles.container}>
            {/* Display Diet Image */}
            <View style={[styles.imageContainer, { width: imageWidth, height: imageHeight }]}>
                <Image source={{ uri: newDiet.imgUri }} style={[styles.dietImage, { width: imageWidth, height: imageHeight }]} />

                {/* Display rectangles based on selection */}
                {newDiet.foodOptions.map((food, index) => {
                    if (selectedFoodIndex !== null && selectedFoodIndex !== index) return null;

                    return (
                        <View
                            key={index}
                            style={[
                                styles.foodRectangle,
                                {
                                    top: food.position.y * imageHeight,
                                    left: food.position.x * imageWidth,
                                    width: food.position.width * imageWidth,
                                    height: food.position.height * imageHeight,
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

            {/* Button to show all rectangles */}
            <View style={styles.buttonContainer}>
                <Button title="Show All Food Detected" onPress={() => setSelectedFoodIndex(null)} />
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
    },
    imageContainer: {
        alignItems: 'center',
        marginBottom: 20,
    },
    dietImage: {
        resizeMode: 'cover',
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
});

export default AnalysisDetailScreen;
