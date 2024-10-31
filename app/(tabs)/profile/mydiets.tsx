import React from 'react';
import { View, Text, Image, FlatList, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { useDietStore } from '@/zustand/diet';
import { format } from 'date-fns';
import { Ionicons } from "@expo/vector-icons";

const DietBlogScreen: React.FC = () => {
    const { diets, removeDiet } = useDietStore();

    const sortedDiets = diets.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    const renderDietItem = ({ item }: { item: typeof diets[0] }) => (
        <View style={styles.dietCard}>
            <Image source={{ uri: item.imgUri }} style={styles.dietImage} />
            <View style={styles.dietDetails}>
                <Text style={styles.dietTitle}>{item.title}</Text>
                <Text style={styles.dietDate}>{format(new Date(item.date), 'MMM dd, yyyy')}</Text>

                {/* Display totals */}
                <Text style={styles.dietStats}>Calories: {item.total_calories} kcal</Text>
                <Text style={styles.dietStats}>Proteins: {item.total_proteins} g</Text>
                <Text style={styles.dietStats}>Fat: {item.total_fat} g</Text>
                <Text style={styles.dietStats}>Carbs: {item.total_carbs} g</Text>
                <Text style={styles.dietStats}>Fibers: {item.total_fibers} g</Text>

                <TouchableOpacity style={styles.deleteButton} onPress={() => removeDiet(item.id)}>
                    <Ionicons name="trash" size={20} color="red" />
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <FlatList
                data={sortedDiets}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderDietItem}
                contentContainerStyle={styles.flatListContent}
                showsVerticalScrollIndicator={false}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    flatListContent: {
        paddingVertical: 20,
    },
    dietCard: {
        backgroundColor: '#fff',
        borderRadius: 10,
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 5,
        elevation: 3,
        overflow: 'hidden',
    },
    dietImage: {
        width: 80,
        height: 80,
    },
    dietDetails: {
        flex: 1,
        padding: 10,
    },
    dietTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 5,
    },
    dietDate: {
        fontSize: 12,
        color: '#777',
        marginBottom: 5,
    },
    dietStats: {
        fontSize: 14,
        color: '#333',
        marginBottom: 3,
    },
    foodOptionContainer: {
        marginTop: 10,
        backgroundColor: '#f0f0f0',
        padding: 10,
        borderRadius: 8,
    },
    foodOptionHeader: {
        fontSize: 15,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    foodDetail: {
        fontSize: 13,
        color: '#555',
    },
    nutrientDetail: {
        fontSize: 12,
        color: '#777',
    },
    deleteButton: {
        alignSelf: 'flex-start',
        marginTop: 10,
    },
});

export default DietBlogScreen;
