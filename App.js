import { StatusBar } from "expo-status-bar";
import { Button, ScrollView, StyleSheet, Text, View } from "react-native";

import Geofence from "react-native-expo-geofence";
import Trial from "./Trial";
import TrialThree from "./TrialThree";
import TrialTwo from "./TrialTwo";

export default function App() {

  return (
    // <ScrollView>
    // <View style={styles.container} >
    //   <Text>Open up App.js to start working on your app!</Text>
    //   <Button title="but" onPress={getByProximity}></Button>
    //   <StatusBar style="auto" />
    // </View>
    // </ScrollView>
    
    <View style={styles.container} >
      <Trial></Trial>
       <TrialTwo></TrialTwo>
       {/* <TrialThree></TrialThree> */}
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
