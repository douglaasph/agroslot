import { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';

export default function DropdownC() {
    const [categoria, setCategoria] = useState(null);

    const categorias = [
        { label: 'Agricultura', value: 'agricultura' },
        { label: 'Pecuária', value: 'pecuaria' },
        { label: 'Fruticultura', value: 'fruticultura' },
    ];

    return (
        <View style={styles.container}>
            <Dropdown
                style={styles.dropdown}
                placeholderStyle={styles.placeholder}
                selectedTextStyle={styles.selectedText}
                data={categorias}
                labelField="label"
                valueField="value"
                placeholder="Selecione uma categoria"
                value={categoria}
                onChange={item => setCategoria(item.value)}
                maxHeight={250}
                activeColor="#E8F5E9"
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 15,
        width: '100%'
    },
    label: {
        fontSize: 16,
        marginBottom: 8,
    },
    dropdown: {
        height: 50,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 12,
    },
    placeholder: {
        color: '#999',
    },
    selectedText: {
        color: '#333',
    },
});