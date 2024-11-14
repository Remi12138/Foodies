import React, {useEffect, useState} from 'react';
import { View, Text, ScrollView, StyleSheet, Image, Button, Dimensions, ActivityIndicator, Alert } from 'react-native';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { Diet, useDietStore } from "@/zustand/diet";

const ChatGPT_KEY = "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";

const screenWidth = Dimensions.get('window').width;

type AnalysisPreviewScreenProps = RouteProp<{ params: { newDiet: Diet } }, 'params'>;

const AnalysisPreviewScreen: React.FC = () => {
    const { params: { newDiet } } = useRoute<AnalysisPreviewScreenProps>();
    const [loading, setLoading] = useState(false);
    const navigation = useNavigation();
    const { updateDietAdvice } = useDietStore();
    const [newAdvice, setNewAdvice] = useState<string>(newDiet.advice);

    const [adviceText, setAdviceText] = useState<string>("");
    const [adviceGrade, setAdviceGrade] = useState<string>("");
    const [adviceIcon, setAdviceIcon] = useState<string>("");

    const parsedDate = new Date(newDiet.date);
    const maxNutrientValue = Math.max(newDiet.total_proteins, newDiet.total_fat, newDiet.total_carbs, newDiet.total_fibers);

    const parseAdviceResponse = (content: string) => {
        // Adjusted regular expressions to capture content more reliably
        const adviceMatch = content.match(/Advice:\s*(.+?)(?=\s*Grade:|\s*Icon:|$)/s);
        const gradeMatch = content.match(/Grade:\s*([ABC])/);
        const iconMatch = content.match(/Icon:\s*(.+)/);

        // Parse the values, trimming whitespace and setting defaults if not found
        const advice = adviceMatch ? adviceMatch[1].trim() : "No specific advice provided.";
        const grade = gradeMatch ? gradeMatch[1].trim() : "N/A";
        const icon = iconMatch ? iconMatch[1].trim() : "🍽️";

        console.log("Advice:", content);
        console.log("Parsed Advice:", advice);
        console.log("Parsed Grade:", grade);
        console.log("Parsed Icon:", icon);

        return { advice, grade, icon };
    };

    // Function to call ChatGPT API and update advice
    const getAdvice = async (retries: number = 0): Promise<void> => {
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
                                  Limit the response to 40 words.
                                  Include a grade (A, B, or C) based on the nutritional balance:
                                  A = well-balanced, low excess;
                                  B = moderate, needs slight improvement;
                                  C = needs significant improvement.
                                  Also, suggest a suitable icon, like "🔥" for high calories, "🌿" for low fiber, etc.
                                  Response format:
                                  Advice: [Your advice here];
                                  Grade: [A, B, or C];
                                  Icon: [Icon here].
                                  
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
            const content = response.data.choices[0].message.content;
            setNewAdvice(content);
            const { advice, grade, icon } = parseAdviceResponse(content);
            setAdviceText(advice);
            setAdviceGrade(grade);
            setAdviceIcon(icon);
            updateDietAdvice(newDiet.id, content);
        } catch (error) {
            // @ts-ignore
            if (error.response && error.response.status === 429 && retries < maxRetries) {
                await new Promise(resolve => setTimeout(resolve, 3000));
                return getAdvice(retries + 1);
            } else {
                console.error("Error fetching advice:", error);
                Alert.alert("Error", "Failed to fetch advice. Insufficient token. Please try again later.");
            }
        } finally {
            setLoading(false);
        }
    };

    // Parse existing advice if available on initial render
    useEffect(() => {
        if (newDiet.advice !== "") {
            const { advice, grade, icon } = parseAdviceResponse(newDiet.advice);
            setAdviceText(advice);
            setAdviceGrade(grade);
            setAdviceIcon(icon);
        }
    }, [newDiet.advice]);

    // @ts-ignore
    // @ts-ignore
    return (
        <ScrollView style={styles.container}>
            <View style={styles.imageContainer}>
                <Image source={{ uri: newDiet.imgUri }} style={styles.dietImage} />
                <View style={styles.totalCaloriesContainer}>
                    <Text style={styles.totalCaloriesText}> {Math.round(newDiet.total_calories)} Cal </Text>
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
                {newAdvice === "" ? (
                    <Text>No specific advice provided.</Text>
                ) : (
                    <View style={[styles.adviceCard, { backgroundColor: "rgba(252,164,100,0.34)" }]}>
                        <Text style={styles.adviceIcon}>{adviceIcon}</Text>
                        <View style={styles.adviceContent}>
                            <Text style={styles.gradeText}>Grade: {adviceGrade}</Text>
                            <Text style={styles.adviceText}>{adviceText}</Text>
                        </View>
                    </View>
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
        // marginTop: 20,
        alignItems: 'center',
    },
    buttonContainer2: {
        // marginTop: 20,
        alignItems: 'center',
        marginBottom: 50,
    },
    analysisContainer: {
        borderRadius: 10,
        alignItems: 'flex-start',
    },
    adviceCard: {
        marginTop: 20,
        padding: 15,
        backgroundColor: '#FFFAE5',
        borderRadius: 15,
        alignItems: 'center',
        flexDirection: 'row',
    },
    adviceIcon: {
        fontSize: 30,
        marginRight: 10,
    },
    adviceContent: {
        flex: 1,
    },
    gradeText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#58ca5b',
        marginBottom: 5,
    },
    adviceText: {
        fontSize: 16,
        color: '#333',
        lineHeight: 24,
    },
});

export default AnalysisPreviewScreen;
