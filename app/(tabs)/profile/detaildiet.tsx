import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import {Diet} from "@/zustand/diet";

type AnalyzeResultScreenProps = RouteProp<{ params: { newDiet: Diet } }, 'params'>;

const AnalyzeResultScreen: React.FC = () => {
    const { params: { newDiet } } = useRoute<AnalyzeResultScreenProps>();
    const parsedDate = new Date(newDiet.date);

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.header}>Analysis Result</Text>

            {newDiet.foodOptions.map((food, index) => (
                <View key={index} style={styles.itemContainer}>
                    <Text style={styles.itemHeader}>Food Item #{index + 1}:</Text>
                    <View style={styles.foodDetailContainer}>
                        <Text style={styles.foodDetailText}>Name: {food.name}</Text>
                        <Text style={styles.foodDetailText}>Confidence: {(food.confidence * 100).toFixed(2)}%</Text>
                        <Text style={styles.foodDetailText}>Quantity: {food.quantity} g</Text>
                        <Text style={styles.foodDetailText}>Glycemic Index: {food.glycemic_index}</Text>

                        <Text style={styles.foodDetailText}>Main Nutritional Info:</Text>
                        <Text style={styles.foodDetailText}>Calories: {food.calories} kcal</Text>
                        <Text style={styles.foodDetailText}>Proteins: {food.proteins} g</Text>
                        <Text style={styles.foodDetailText}>Fat: {food.fat} g</Text>
                        <Text style={styles.foodDetailText}>Carbs: {food.carbs} g</Text>
                        <Text style={styles.foodDetailText}>Fibers: {food.fibers} g</Text>

                        <Text style={styles.foodDetailText}>Top Nutrients:</Text>
                        {food.topNutrients.map(([key, value]) => (
                            <Text key={key} style={styles.foodDetailText}>  {key}: {value}</Text>
                        ))}
                    </View>
                </View>
            ))}

            {/* Displaying total values for all items */}
            <View style={styles.totalContainer}>
                <Text style={styles.itemHeader}>Total Nutritional Values:</Text>
                <Text style={styles.foodDetailText}>Total Calories: {newDiet.total_calories} kcal</Text>
                <Text style={styles.foodDetailText}>Total Proteins: {newDiet.total_proteins} g</Text>
                <Text style={styles.foodDetailText}>Total Fat: {newDiet.total_fat} g</Text>
                <Text style={styles.foodDetailText}>Total Carbs: {newDiet.total_carbs} g</Text>
                <Text style={styles.foodDetailText}>Total Fibers: {newDiet.total_fibers} g</Text>
            </View>
        </ScrollView>
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
    },
    itemContainer: {
        marginVertical: 10,
        padding: 15,
        borderRadius: 10,
        backgroundColor: '#f9f9f9',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 1.41,
        elevation: 2,
    },
    itemHeader: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    foodDetailContainer: {
        marginVertical: 5,
    },
    foodDetailText: {
        fontSize: 16,
    },
    totalContainer: {
        marginTop: 20,
        padding: 15,
        borderRadius: 10,
        backgroundColor: '#f0f0f0',
    },
});

export default AnalyzeResultScreen;
