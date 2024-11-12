import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import DietListScreen from './MyDiets';
import ReceiptBlogScreen from './MyReceipts';
import {ThemedView} from "@/components/ThemedView";
import {ThemedText} from "@/components/ThemedText";
import {HelloWave} from "@/components/common/HelloWave";
import SwitchTab from './SwitchTab';

const RecordScreen: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'Diets' | 'Receipts'>('Diets');

    const handleTabChange = (tab: 'Diets' | 'Receipts') => {
        setActiveTab(tab);
    };

    return (
        <SafeAreaView style={styles.container}>
            <ThemedView style={styles.titleContainer}>
                <ThemedView style={{ flexDirection: "row" }}>
                    <ThemedText type="title">Record</ThemedText>
                    <HelloWave emoji=" 🍱 " />
                </ThemedView>
            </ThemedView>
            {/* Top navigation bar */}

            {/*<View style={styles.tabBar}>*/}
            {/*    <TouchableOpacity*/}
            {/*        style={[styles.tabButton, activeTab === 'MyDiets' && styles.activeTabButton]}*/}
            {/*        onPress={() => setActiveTab('MyDiets')}*/}
            {/*    >*/}
            {/*        <Text style={[styles.tabText, activeTab === 'MyDiets' && styles.activeTabText]}>*/}
            {/*            Diet*/}
            {/*        </Text>*/}
            {/*    </TouchableOpacity>*/}
            {/*    <TouchableOpacity*/}
            {/*        style={[styles.tabButton, activeTab === 'MyReceipts' && styles.activeTabButton]}*/}
            {/*        onPress={() => setActiveTab('MyReceipts')}*/}
            {/*    >*/}
            {/*        <Text style={[styles.tabText, activeTab === 'MyReceipts' && styles.activeTabText]}>*/}
            {/*            Receipt*/}
            {/*        </Text>*/}
            {/*    </TouchableOpacity>*/}
            {/*</View>*/}

            {/* Render content based on active tab */}
            {/*<View style={styles.contentContainer}>*/}
            {/*    {activeTab === 'MyDiets' ? <DietListScreen /> : <ReceiptBlogScreen />}*/}
            {/*</View>*/}

            <SwitchTab activeTab={activeTab} onTabChange={handleTabChange} />
            <View style={styles.contentContainer}>
                {activeTab === 'Diets' ? <DietListScreen /> : <ReceiptBlogScreen />}
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
    },
    tabBar: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        backgroundColor: '#F4511E',
        paddingVertical: 10,
    },
    tabButton: {
        flex: 1,
        alignItems: 'center',
        paddingVertical: 10,
    },
    activeTabButton: {
        borderBottomWidth: 2,
        borderBottomColor: '#ffffff',
    },
    tabText: {
        fontSize: 16,
        color: '#ffffff',
    },
    activeTabText: {
        fontWeight: 'bold',
    },
    contentContainer: {
        flex: 1,
        padding: 10,
    },
    titleContainer: {
        padding: 8,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
});

export default RecordScreen;
