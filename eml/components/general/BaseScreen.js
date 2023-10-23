import React from 'react';
import { View } from 'react-native';

/**
 * Reusable screen component to provide consistent layout and styling.
 * @param {JSX.Element} children - The child components to render inside the screen.
 * @returns {JSX.Element} The BaseScreen component.
 */
export default function BaseScreen({ children }) {
    return (
        <View className="flex-1 bg-secondary">
            {children}
        </View>
    );
}
