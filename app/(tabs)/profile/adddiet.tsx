import React, { useState } from 'react';
import {View, Text, TextInput, Button, StyleSheet, Image, TouchableOpacity, Platform, ScrollView} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useDietStore } from '@/zustand/diet';
import {router} from "expo-router";

const UploadDietScreen: React.FC = () => {
    const apiKey = "vmg48AzN.7kadZgKHh9vPLjofJzyc2w21lRVSaVTg";
    const url = "https://vision.foodvisor.io/api/1.0/en/analysis/"
    const headers = {"Authorization": "Api-Key vmg48AzN.7kadZgKHh9vPLjofJzyc2w21lRVSaVT"}
    const [imgUri, setImgUri] = useState<string | null>(null);
    const [title, setTitle] = useState<string>('');
    // const [amount, setAmount] = useState<string>('');
    const [date, setDate] = useState<Date>(new Date());
    const [showDatePicker, setShowDatePicker] = useState<boolean>(false);
    const { addDiet } = useDietStore();
    const [loading, setLoading] = useState(false);
    let analysis: string;

    const asyncFetch = async (zip: string) => {
        setLoading(true);

        try {
            const fullFavoritesUrl = `http://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${zip}&days=3`;
            const response = await fetch(fullFavoritesUrl);
            if (!response.ok) throw new Error(`HTTP error in fetch! status: ${response.status}`);
            const data = await response.json();
        } catch (error) {
            console.log('Error in fetch', error);
        } finally {
            setLoading(false);
        }
    };

    const pickImage = async () => {
        // Request media library permissions
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            alert('Sorry, we need media library permissions to make this work!');
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 1,
        });

        if (!result.canceled) {
            setImgUri(result.assets[0].uri);
        }
    };

    const takePhoto = async () => {
        // Request camera permissions
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== 'granted') {
            alert('Sorry, we need camera permissions to make this work!');
            return;
        }

        const result = await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            quality: 1,
        });

        if (!result.canceled) {
            setImgUri(result.assets[0].uri);
        }
    };

    const onDateChange = (event: any, selectedDate?: Date) => {
        setShowDatePicker(Platform.OS === 'ios');
        if (selectedDate) {
            setDate(selectedDate);
        }
    };

    const handleSubmit = () => {
        if (!imgUri || !title ) {
            alert('Please fill all fields before submitting.');
            return;
        }

        addDiet(imgUri, title, analysis);
        alert('Diet added successfully!');
        // Clear form
        setImgUri(null);
        setTitle('');
        setDate(new Date());
        router.navigate("/profile/mydiets");
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
                {imgUri ? (
                    <Image source={{ uri: imgUri }} style={styles.image} />
                ) : (
                    <Text style={styles.imagePlaceholder}>Pick an Image</Text>
                )}
            </TouchableOpacity>
            <Button title="Take a Photo" onPress={takePhoto} />
            <TextInput
                style={styles.input}
                placeholder="Title"
                value={title}
                onChangeText={(text) => setTitle(text)}
            />
            {/*<TextInput*/}
            {/*    style={styles.input}*/}
            {/*    placeholder="Amount"*/}
            {/*    value={amount}*/}
            {/*    onChangeText={(text) => setAmount(text)}*/}
            {/*    keyboardType="numeric"*/}
            {/*/>*/}
            <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.datePickerButton}>
                <Text style={styles.dateText}>Select Date: {date.toDateString()}</Text>
            </TouchableOpacity>
            {showDatePicker && (
                <DateTimePicker
                    value={date}
                    mode="date"
                    display="default"
                    onChange={onDateChange}
                />
            )}
            <Button title="Add Diet" onPress={handleSubmit} />
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f5f5f5',
    },
    imagePicker: {
        height: 200,
        backgroundColor: '#e0e0e0',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        marginBottom: 20,
    },
    image: {
        width: '100%',
        height: '100%',
        borderRadius: 10,
    },
    imagePlaceholder: {
        color: '#777',
        fontSize: 16,
    },
    input: {
        height: 50,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 8,
        marginBottom: 20,
        paddingHorizontal: 10,
        backgroundColor: '#fff',
    },
    datePickerButton: {
        marginBottom: 20,
        paddingVertical: 10,
        backgroundColor: '#00796b',
        borderRadius: 5,
        alignItems: 'center',
    },
    dateText: {
        color: '#fff',
        fontSize: 16,
    },
});

export default UploadDietScreen;
