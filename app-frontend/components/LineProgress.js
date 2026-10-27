import { Text, View } from "react-native";
import { Colors } from "../styles/stylesheets";

export default function LineProgress({ current, max }) {
    const pctFilled = ((current / max) * 100).toFixed(2);

    return (
        <View style={{ width: "100%", backgroundColor: Colors.brownBorder.color, height: 10, borderRadius: 10 }}>
            <View style={{ width: `${pctFilled}%`, backgroundColor: Colors.colorPrimary.color, height: '100%', borderRadius: 10 }} />
        </View>
    )
}