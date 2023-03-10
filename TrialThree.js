import React, { useState, useEffect } from "react";
import { Platform, Text, View, StyleSheet, BackHandler } from "react-native";
import Constants from "expo-constants";
import * as Location from "expo-location";

export default function TrialThree() {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    (async () => {

      let { status } = await Location.requestBackgroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    })();
  }, []);

  let text = "Waiting..";
  if (errorMsg) {
    text = errorMsg;
  } else if (location) {
    text = JSON.stringify(location);
    var longitude = location.coords.longitude;
    var latitude = location.coords.latitude;
    var speed = location.coords.speed;
    var accuracy = location.coords.accuracy;
    var mock = "false";
    console.log(location.mocked);
    // alert("Elegible :)");
  }

  if (location && location.mocked === true) {
    alert("mocklocation detected");
    mock = "true";
    // setTimeout(() => {
    //   BackHandler.exitApp();
    // }, 2000);
  }

  return (
    <View style={styles.container}>
      {/* <Text style={styles.paragraph}>{text}</Text> */}
      <Text>mock: {mock}</Text>
      <Text>longitude: {longitude} </Text>
      {/* <Text>mockStatus: {location.mocked}</Text> */}
      <Text>latitude: {latitude}</Text>
      <Text>accuracy: {accuracy}</Text>
      <Text>speed: {speed}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  paragraph: {
    fontSize: 18,
    textAlign: "center",
  },
});
