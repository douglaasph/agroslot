import {
    Modal,
    View,
    StyleSheet,
    Pressable,
    Platform,
} from 'react-native';

import { BlurView } from 'expo-blur';
import { Colors } from '../styles/stylesheets';

export default function Popup({
    visible,
    onClose,
    children,
}) {
    return (
        <ModalContainer visible={visible}
            onClose={onClose}
        >
            <View style={styles.content}>
                {children}
            </View>
        </ModalContainer>
    );
}

export function ModalContainer({
    visible,
    onClose,
    children,
}) {
    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={onClose}
            statusBarTranslucent
        >
            <View style={styles.overlay}>
                <Pressable
                    style={StyleSheet.absoluteFill}
                    onPress={onClose}
                >
                    <BlurView
                        intensity={50}
                        tint="dark"
                        style={StyleSheet.absoluteFill}
                    />
                </Pressable>
                {children}
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
        backgroundColor:
            Platform.OS === 'android'
                ? 'rgba(0, 0, 0, 0.25)'
                : 'transparent',
    },
    content: {
        width: '100%',
        maxWidth: 420,
        backgroundColor: Colors.whiteBackground.backgroundColor,
        padding: 24,
        borderRadius: 16,
        elevation: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 12,
    },
});