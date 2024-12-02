import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Platform, TouchableOpacity, } from 'react-native';
import { useDietStore } from '@/zustand/diet';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';
import {ThemedView} from "@/components/ThemedView";
import {ThemedText} from "@/components/ThemedText";
import { useThemeColor } from "@/hooks/useThemeColor";

type EditDietScreenProps = RouteProp<{ params: { dietId: number } }, 'params'>;

const EditDietScreen: React.FC = () => {
    const { params: { dietId } } = useRoute<EditDietScreenProps>();
    const { diets, editDiet } = useDietStore();
    const navigation = useNavigation();
    const textColor = useThemeColor({}, "text");

    const diet = diets.find(d => d.id === dietId);
    const [title, setTitle] = useState(diet ? diet.title : '');
    const [date, setDate] = useState(diet ? new Date(diet.date) : new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);

    const handleSave = () => {
        editDiet(dietId, title, date.toISOString());
        navigation.goBack();
    };

    const handleDateChange = (event: any, selectedDate: Date | undefined) => {
        setShowDatePicker(false); // Hide the picker after selecting a date
        if (selectedDate) {
            setDate(selectedDate);
        }
    };

    if (!diet) return null;

    return (
        <View style={styles.container}>
            <ThemedText style={styles.label}>Edit Title</ThemedText>
            <TextInput
                style={[styles.input, { color: textColor }]}
                value={title}
                onChangeText={setTitle}
            />
            <ThemedText style={styles.label}>Edit Date</ThemedText>

            <TouchableOpacity onPress={() => setShowDatePicker(true)}>
                <TextInput
                    style={[styles.input, { color: textColor }]}
                    placeholder="Select date"
                    placeholderTextColor={textColor + "99"}
                    value={new Date(date).toLocaleDateString()}
                    editable={false}
                />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.datePickerButton}>
                <Text style={styles.dateText}>Select Date</Text>
            </TouchableOpacity>
            {showDatePicker && (
                <DateTimePicker
                    value={new Date(date)}
                    mode="date"
                    display={Platform.OS === 'ios' ? 'inline' : 'default'}
                    onChange={handleDateChange}
                />
            )}


            <Button title="Save" onPress={handleSave} color="#F4511E" />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        // backgroundColor: '#fff'
    },
    label: {
        fontSize: 18,
        marginTop: 8,
        marginBottom: 8,
        fontWeight: '600',
    },
    input: {
        borderColor: '#ccc',
        borderWidth: 1,
        padding: 10,
        marginBottom: 20,
        borderRadius: 5
    },
    selectedDate: {
        fontSize: 16,
        color: '#333',
        marginTop: 10,
        marginBottom: 20
    },
    datePickerButton: {
        marginBottom: 20,
        paddingVertical: 10,
        backgroundColor: '#f46b42',
        borderRadius: 5,
        alignItems: 'center',
    },
    dateText: {
        color: '#fff',
        fontSize: 16,
    },
});

export default EditDietScreen;
