import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface SwitchTabProps {
    activeTab: 'Diets' | 'Receipts';
    onTabChange: (tab: 'Diets' | 'Receipts') => void;
}

const SwitchTab: React.FC<SwitchTabProps> = ({ activeTab, onTabChange }) => {
    return (
        <View style={styles.switchContainer}>
            <TouchableOpacity
                style={[styles.tab, activeTab === 'Diets' && styles.activeTab]}
                onPress={() => onTabChange('Diets')}
            >
                <Text style={[styles.tabText, activeTab === 'Diets' && styles.activeTabText]}>My Diet</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={[styles.tab, activeTab === 'Receipts' && styles.activeTab]}
                onPress={() => onTabChange('Receipts')}
            >
                <Text style={[styles.tabText, activeTab === 'Receipts' && styles.activeTabText]}>My Receipt</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    switchContainer: {
        flexDirection: 'row',
        backgroundColor: 'rgba(254,211,197,0.81)',
        borderRadius: 10,
        padding: 4,
        marginHorizontal: 10,
    },
    tab: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 8,
        borderRadius: 8,
    },
    activeTab: {
        backgroundColor: '#ff7043',
        borderRadius: 8,
    },
    tabText: {
        fontSize: 16,
        color: 'rgb(194,38,6)',
        // fontWeight: 'bold',
    },
    activeTabText: {
        color: '#ffffff',
        fontWeight: 'bold',
    },
});

export default SwitchTab;
