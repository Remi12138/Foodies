import React, { useEffect } from 'react';
import { View, Text, Image, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useDietStore, Diet } from '@/zustand/diet';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const DietListScreen: React.FC = () => {
    const { diets, loadDiets, removeDiet } = useDietStore();
    const navigation = useNavigation();

    useEffect(() => {
        loadDiets();
    }, []);

    const handleDelete = (id: number) => {
        Alert.alert(
            "Delete Diet",
            "Are you sure you want to delete this diet?",
            [
                { text: "Cancel", style: "cancel" },
                { text: "Delete", style: "destructive", onPress: () => removeDiet(id) }
            ]
        );
    };

    const renderItem = ({ item }: { item: Diet }) => {
        return (
            <View style={styles.dietCard}>
                <TouchableOpacity
                    style={styles.dietContent}
                    onPress={() => navigation.navigate('AnalysisPreview', { newDiet: item })}
                >
                    <Image source={{ uri: item.imgUri }} style={styles.dietImage} />
                    <View style={styles.dietInfo}>
                        <Text style={styles.dietTitle}>{item.title}</Text>
                        <Text style={styles.dietDate}>{new Date(item.date).toLocaleDateString()}</Text>
                        <Text style={styles.dietCalories}>{Math.round(item.total_calories)} Cal</Text>
                    </View>
                </TouchableOpacity>
                <View style={styles.iconButtons}>
                    <TouchableOpacity onPress={() => navigation.navigate('EditDiet', { dietId: item.id })}>
                        <Icon name="pencil" size={24} color="#4CAF50" style={styles.icon} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleDelete(item.id)}>
                        <Icon name="delete" size={24} color="#F44336" style={styles.icon} />
                    </TouchableOpacity>
                </View>
            </View>
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
    dietContent: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
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
    iconButtons: {
        justifyContent: 'space-between',
        alignItems: 'center',
        marginLeft: 10,
    },
    icon: {
        padding: 5,
    },
});

export default DietListScreen;
