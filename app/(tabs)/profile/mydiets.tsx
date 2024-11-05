import React, { useEffect } from 'react';
import { View, Text, Image, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useDietStore, Diet } from '@/zustand/diet';
import { useNavigation } from '@react-navigation/native';

const DietListScreen: React.FC = () => {
    const { diets, loadDiets } = useDietStore();
    const navigation = useNavigation();

    useEffect(() => {
        loadDiets(); // Load diets from AsyncStorage on component mount
    }, []);

    const renderItem = ({ item }: { item: Diet }) => {
        return (
            <TouchableOpacity
                style={styles.dietCard}
                onPress={() => navigation.navigate('detaildiet', { newDiet: item })}
            >
                <Image source={{ uri: item.imgUri }} style={styles.dietImage} />
                <View style={styles.dietInfo}>
                    <Text style={styles.dietTitle}>{item.title}</Text>
                    <Text style={styles.dietDate}>{new Date(item.date).toLocaleDateString()}</Text>
                    <Text style={styles.dietCalories}>{Math.round(item.total_calories)} Cal</Text>
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <View style={styles.container}>
            <FlatList
                data={diets}
                renderItem={renderItem}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={styles.listContent}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    listContent: {
        padding: 20,
    },
    dietCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
        marginVertical: 10,
        backgroundColor: '#f5f5f5',
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 1.41,
        elevation: 2,
    },
    dietImage: {
        width: 60,
        height: 60,
        borderRadius: 30,
        marginRight: 15,
    },
    dietInfo: {
        flex: 1,
    },
    dietTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    dietDate: {
        fontSize: 14,
        color: '#888',
        marginTop: 4,
    },
    dietCalories: {
        fontSize: 14,
        color: '#333',
        marginTop: 4,
    },
});

export default DietListScreen;
