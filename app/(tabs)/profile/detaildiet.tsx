import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';

type AnalyzeResultScreenProps = RouteProp<{ params: { analysisData: any } }, 'params'>;

const AnalyzeResultScreen: React.FC = () => {
    const { params: { analysisData } } = useRoute<AnalyzeResultScreenProps>();

    return (
        <ScrollView style={styles.container}>
            {/*<Text style={styles.header}>Analysis Result</Text>*/}

            {analysisData.items.map((item, index) => {
                const foodOption = item.food[0];
                const topNutrients = Object.entries(foodOption.food_info.nutrition)
                    .filter(([key, value]) => value && value > 0 && key !== "glycemic_index")
                    .sort(([, valueA], [, valueB]) => valueB - valueA)
                    .slice(0, 5);

                return (
                    <View key={index} style={styles.itemContainer}>
                        <Text style={styles.itemHeader}>Food Item #{index + 1}:</Text>
                        <View style={styles.foodDetailContainer}>
                            <Text style={styles.foodDetailText}>Name: {foodOption.food_info.display_name}</Text>
                            <Text style={styles.foodDetailText}>Confidence: {(foodOption.confidence * 100).toFixed(2)}%</Text>
                            <Text style={styles.foodDetailText}>
                                Quantity: {foodOption.food_info.quantity || foodOption.food_info.g_per_serving} g
                            </Text>
                            <Text style={styles.foodDetailText}>Glycemic Index: {foodOption.food_info.nutrition.glycemic_index}</Text>
                            <Text style={styles.foodDetailText}>Main Nutritional Info:</Text>
                            {topNutrients.map(([key, value]) => (
                                <Text key={key} style={styles.foodDetailText}>  {key}: {value}</Text>
                            ))}
                        </View>
                    </View>
                );
            })}
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
});

export default AnalyzeResultScreen;
