import React, { useEffect, useState } from "react";
import { BackHandler, Button, StyleSheet, Text, View } from "react-native";
import * as Location from "expo-location";
import * as Notifications from "expo-notifications";
import { LocationGeofencingEventType } from "expo-location";
import * as TaskManager from "expo-task-manager";

export default function Trial() {
  const [locationStatus, setLocationStatus] = useState(
    "No information available"
  );

  const [boolInLocation, setBoolInLocation] = useState(false);
  const [boolNoMock, setBoolNoMock] = useState(false);
  const [showLoginButton, setShowLoginButton] = useState(false);

  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: false,
      shouldSetBadge: false,
    }),
  });

  TaskManager.defineTask(
    "GEOFENCE_TASK",
    ({ data: { eventType, region }, error }) => {
      if (error) {
        // check `error.message` for more details.
        console.log(error.message);
        return;
      }

      if (eventType === LocationGeofencingEventType.Enter) {
        console.log("You've entered region:", region);
        setLocationStatus("You are inside region " + region.identifier);
        _askPermission();
        Notifications.scheduleNotificationAsync({
          content: {
            title: "ENTERED GEOFENCE",
            body: region.identifier,
          },
          trigger: null,
        });
        setBoolInLocation(true);
      } else if (eventType === LocationGeofencingEventType.Exit) {
        setBoolInLocation(false);
        setShowLoginButton(false); 
        console.log("You've left region:", region);
        setLocationStatus(
          "You are outside region " +
            region.identifier +
            " attendance will not be marked!"
        );
        _askPermission();
        alert("You've left region: ", region.identifier.toUpperCase());
        Notifications.scheduleNotificationAsync({
          content: {
            title: "EXITED GEOFENCE",
            body: region.identifier,
          },
          trigger: null,
        });

        //   setTimeout(() => {
        //   BackHandler.exitApp();
        // }, 1000);
      }
    }
  );

  const [isLoading, setIsLoading] = useState(true);
  const [msg, setMsg] = useState(null);

  const _askPermission = async () => {
    try {
      var location = await Location.getCurrentPositionAsync({});
    } catch (err) {
      setMsg(err.message);
      _askPermission();
      return;
    }
    setIsLoading(false);

    text = JSON.stringify(location.mocked);
    if (text == "true") {
      alert("Mocked location detected.");
      setMsg("Mocked location detected");
      setBoolNoMock(false);
      setShowLoginButton(false);

      return;
    } else {
      setMsg("Mock Check Successfull");
      setBoolNoMock(true);
    }
  };

  useEffect(() => {
    (async () => {
      const { granted: notificationsGranted } =
        await Notifications.getPermissionsAsync();
      if (!notificationsGranted) {
        await Notifications.requestPermissionsAsync();
      }

      const { granted: fgGranted } =
        await Location.getForegroundPermissionsAsync();
      if (!fgGranted) {
        setMsg("Permission to access location was denied");
        await Location.requestForegroundPermissionsAsync();
        await Location.requestBackgroundPermissionsAsync();
      }

      await _askPermission();

      const geofences = [
        // {
        //   identifier: "Stockholm",
        //   latitude: 59.332598,
        //   longitude: 18.035258,
        //   radius: 10000,
        //   notifyOnEnter: true,
        //   notifyOnExit: true,
        // },
        {
          identifier: "HOME",
          latitude: 28.705564,
          longitude: 77.1206821,
          radius: 100,
          notifyOnEnter: true,
          notifyOnExit: true,
        },
      ];
      await Location.startGeofencingAsync("GEOFENCE_TASK", geofences);
    })();
  }, []);

  const checkSystem = async () => {
    if (boolInLocation && boolNoMock) {
      setShowLoginButton(true);
      return;
    }
    alert("Get into the region to proceed...")
    setShowLoginButton(false);
  };

  return (
    <View style={styles.container}>
      {isLoading ? (
        <Text>App is Loading...</Text>
      ) : (
        <Text>Welcome to Bractance</Text>
      )}
      <Text>{msg}</Text>
      <Text>{locationStatus}</Text>
      <Button title="Check System" onPress={checkSystem}></Button>
      {showLoginButton ? (
        <Button title="Sign In" onPress={() => {}}></Button>
      ) : null}
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
