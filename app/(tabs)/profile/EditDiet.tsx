import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Platform } from 'react-native';
import { useDietStore } from '@/zustand/diet';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';

type EditDietScreenProps = RouteProp<{ params: { dietId: number } }, 'params'>;

const EditDietScreen: React.FC = () => {
    const { params: { dietId } } = useRoute<EditDietScreenProps>();
    const { diets, editDiet } = useDietStore();
    const navigation = useNavigation();

    const diet = diets.find(d => d.id === dietId);
    const [title, setTitle] = useState(diet ? diet.title : '');
    const [date, setDate] = useState(diet ? new Date(diet.date) : new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);

    const handleSave = () => {
        editDiet(dietId, title, date);
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
            <Text style={styles.label}>Edit Title</Text>
            <TextInput
                style={styles.input}
                value={title}
                onChangeText={setTitle}
            />
            <Text style={styles.label}>Edit Date</Text>
            <Button title="Select Date" onPress={() => setShowDatePicker(true)} />

            {/* Display selected date */}
            <Text style={styles.selectedDate}>{date.toLocaleDateString()}</Text>

            {/* Date Picker for selecting a date */}
            {showDatePicker && (
                <DateTimePicker
                    value={date}
                    mode="date"
                    display={Platform.OS === 'ios' ? 'inline' : 'default'}
                    onChange={handleDateChange}
                />
            )}

            <Button title="Save" onPress={handleSave} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: '#fff' },
    label: { fontSize: 18, marginBottom: 8 },
    input: { borderColor: '#ccc', borderWidth: 1, padding: 10, marginBottom: 20, borderRadius: 5 },
    selectedDate: { fontSize: 16, color: '#333', marginTop: 10, marginBottom: 20 },
});

export default EditDietScreen;
