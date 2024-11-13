import React, { useState, useEffect } from 'react';
import {View, Text, ScrollView, StyleSheet, Image, Button, Dimensions, ActivityIndicator, Alert} from 'react-native';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import axios from 'axios';
import {Diet, useDietStore} from "@/zustand/diet";

const ChatGPT_KEY = "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";
// Get the screen width
const screenWidth = Dimensions.get('window').width;

type AnalysisPreviewScreenProps = RouteProp<{ params: { newDiet: Diet } }, 'params'>;

const AnalysisPreviewScreen: React.FC = () => {
    const { params: { newDiet } } = useRoute<AnalysisPreviewScreenProps>();
    const [loading, setLoading] = useState(false);
    const navigation = useNavigation();
    const { updateDietAdvice } = useDietStore();
    const [newAdvice, setNewAdvice] = useState<string>(newDiet.advice);

    const parsedDate = new Date(newDiet.date);

    const maxNutrientValue = Math.max(newDiet.total_proteins, newDiet.total_fat, newDiet.total_carbs, newDiet.total_fibers);

    // Function to call ChatGPT API
    const getAdvice = async (retries: number = 0): Promise<void>  => {
        const maxRetries = 3;
        try {
            setLoading(true);
            const response = await axios.post(
                'https://api.openai.com/v1/chat/completions',
                {
                    model: "gpt-3.5-turbo",
                    messages: [
                        {
                            role: "user",
                            content: `Provide a concise, point-by-point analysis and advice 
                                  for this meal in an app-friendly tone. Style like 
                                  "Your meal is nutritious but a bit high in calories 
                                  (or 'Your meal is nutritious and  has a good amount of protein'). 
                                  The food composition is well-balanced to ensure sufficient protein, 
                                  but it could use more fiber."
                                  Limit the response to 40 words:
                                  Calories: ${newDiet.total_calories} Cal;
                                  Proteins: ${newDiet.total_proteins}g;
                                  Fat: ${newDiet.total_fat}g;
                                  Carbs: ${newDiet.total_carbs}g;
                                  Fibers: ${newDiet.total_fibers}g.`
                        }
                    ],
                },
                {
                    headers: {
                        'Authorization': `Bearer ${ChatGPT_KEY}`,
                        'Content-Type': 'application/json',
                    },
                }
            );
            const newAdvice = response.data.choices[0].message.content;
            console.log(newAdvice);
            setNewAdvice(newAdvice);
            updateDietAdvice(newDiet.id, newAdvice);
        } catch (error) {
            if (error.response && error.response.status === 429 && retries < maxRetries) {
                console.warn(`Rate limit hit; retrying in 3 seconds... Attempt ${retries + 1}`);
                await new Promise(resolve => setTimeout(resolve, 3000)); // wait for 3 seconds
                return getAdvice( retries + 1);
            } else {
                console.error("Error fetching advice:", error);
                Alert.alert("Error", "Failed to fetch advice. Please try again later.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.imageContainer}>
                <Image source={{ uri: newDiet.imgUri }} style={styles.dietImage} />
                <View style={styles.totalCaloriesContainer}>
                    <Text style={styles.totalCaloriesText}>  {Math.round(newDiet.total_calories)} Cal   </Text>
                </View>
            </View>

            <View style={styles.nutritionalInfo}>
                <NutrientBar label="Proteins" value={Math.round(newDiet.total_proteins)} color="#FFB6C1" max={maxNutrientValue} />
                <NutrientBar label="Fat" value={Math.round(newDiet.total_fat)} color="#FFD700" max={maxNutrientValue} />
                <NutrientBar label="Carbs" value={Math.round(newDiet.total_carbs)} color="#87CEEB" max={maxNutrientValue} />
                <NutrientBar label="Fibers" value={Math.round(newDiet.total_fibers)} color="#D2B48C" max={maxNutrientValue} />
            </View>

            <View style={styles.buttonContainer}>
                <Button title="Detail" onPress={() => navigation.navigate('AnalysisDetail', { newDiet: { ...newDiet, date: parsedDate.toISOString() } })} />
            </View>

            <View style={styles.analysisContainer}>
                {newDiet.advice === "" ? (
                    <Text> </Text>
                ) : (
                    <Text style={styles.analysisText}>{newAdvice}</Text>
                )}
            </View>
            <View style={styles.buttonContainer2}>
                {loading ? (
                    <ActivityIndicator size="small" color="#0000ff" />
                ) : (
                    <Button title="Get New Advice" onPress={() => getAdvice()} />
                )}
            </View>
        </ScrollView>
    );
};

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
        width: 220,
        height: 220,
        borderRadius: 20,
    },
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
    buttonContainer: {
        marginTop: 20,
        alignItems: 'center',
    },
    buttonContainer2: {
        marginTop: 20,
        alignItems: 'center',
        marginBottom: 50,
    },
    analysisContainer: {
        marginTop: 20,
        padding: 15,
        backgroundColor: '#F5F5F5',
        borderRadius: 10,
    },
    analysisText: {
        fontSize: 16,
        color: '#333',
    },
});

export default AnalysisPreviewScreen;
