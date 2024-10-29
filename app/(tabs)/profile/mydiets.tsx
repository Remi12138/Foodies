import React from 'react';
import {View, Text, Image, FlatList, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView} from 'react-native';
import { useDietStore } from '@/zustand/diet';
import { format } from 'date-fns/format';
import {Ionicons} from "@expo/vector-icons";
import {router} from "expo-router";

const DietBlogScreen: React.FC = () => {
    const { diets, removeDiet } = useDietStore();

    // Sort diets by date (newest first)
    const sortedDiets = diets.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    const renderDietItem = ({ item }: { item: typeof diets[0] }) => (
        <View style={styles.dietCard}>
            <Image source={{ uri: item.imgUri }} style={styles.dietImage} />
            <View style={styles.dietDetails}>
                <Text style={styles.dietTitle}>{item.title}</Text>
                <Text style={styles.dietDate}>{item.analysis}</Text>
                <Text style={styles.dietDate}>{format(new Date(item.date), 'MMM dd, yyyy')}</Text>
                <TouchableOpacity style={styles.deleteButton} onPress={() => removeDiet(item.id)}>
                    <Ionicons name="trash" size={24} color="red" />
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <SafeAreaView >
            <FlatList
                data={sortedDiets}
                keyExtractor={(item) => item.id}
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
        padding: 20,
    },
    backButton: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    backText: {
        fontSize: 18,
        marginLeft: 10,
    },
    flatListContent: {
        marginTop: 20,
        paddingBottom: 20,
        paddingHorizontal: 10,
    },
    dietCard: {
        backgroundColor: '#ffffff',
        borderRadius: 10,
        overflow: 'hidden',
        marginBottom: 15,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 5,
        elevation: 3,
        flexDirection: 'row',
    },
    dietImage: {
        width: 80,
        height: 80,
        borderTopLeftRadius: 10,
        borderBottomLeftRadius: 10,
    },
    dietDetails: {
        flex: 1,
        padding: 10,
        justifyContent: 'space-between',
    },
    dietTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333333',
    },
    dietAmount: {
        fontSize: 14,
        color: '#00796b',
        fontWeight: 'bold',
    },
    dietDate: {
        fontSize: 12,
        color: '#777777',
    },
    deleteButton: {
        padding: 2,
    },
});

export default DietBlogScreen;
