// import React, { useState, useEffect } from "react";
// import { Platform, Text, View, StyleSheet, Button } from "react-native";
// import Device from "expo-device";
import * as Location from "expo-location";

// export default function Trial() {
//   const [location, setLocation] = useState(null);
//   const [errorMsg, setErrorMsg] = useState(null);
//   //   const [text, setText] = useState('kali');

//   //   const click = () => {
//   //     let { status } = Location.requestForegroundPermissionsAsync();
//   //     if (status !== "granted") {
//   //       setErrorMsg("Permission to access location was denied");
//   //       // alert('granted');
//   //       return;
//   //     }
//   //   };

//   //   const doit = () => {
//   //     let location = Location.getCurrentPositionAsync({});
//   //     setLocation(location);
//   //     // text = JSON.stringify(location);
//   //     setText(JSON.stringify(location));
//   //   }

//   useEffect(() => {
//     (async () => {
//       //   if (Platform.OS === "android" && !Device.isDevice) {
//       //     setErrorMsg(
//       //       "Oops, this will not work on Snack in an Android Emulator. Try it on your device!"
//       //     );
//       //     return;
//       //   }

//       //   let { status } = await Location.requestForegroundPermissionsAsync();
//       //   if (status !== "granted") {
//       //     setErrorMsg("Permission to access location was denied");
//       //     // alert('granted');
//       //     return;
//       //   }

//       //   let status2  = await Location.enableNetworkProviderAsync();
//       //   if (status2 !== "granted") {
//       //     // setErrorMsg("Permission to access location was denied");
//       //     return;
//       //   }
//       //   else{ alert('granted'); }

//       //   let latitude  = await Location.getLastKnownPositionAsync();
//       // setLocation(latitude);
//       // console.log( latitude);

//     //   let location = await Location.enableNetworkProviderAsync({});
//       let location = await Location.getCurrentPositionAsync({});
//       setLocation(location);
//     })();
//   }, []);

//   let text = "Waiting..";
//   if (errorMsg) {
//     text = errorMsg;
//   } else if (location) {
//     text = JSON.stringify(location);
//   }

//   return (
//     <View style={styles.container}>
//       <Text style={styles.paragraph}>{text}</Text>
//       {/* <Button title="click" onPress={click}></Button> */}
//       <Button
//         title="click"
//         onPress={() => Location.enableNetworkProviderAsync()}
//       ></Button>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     alignItems: "center",
//     justifyContent: "center",
//     padding: 20,
//   },
//   paragraph: {
//     fontSize: 18,
//     textAlign: "center",
//   },
// });

import React, { useEffect, useState } from "react";
import { BackHandler, Button, StyleSheet, Text, View } from "react-native";
import {
  getForegroundPermissionsAsync,
  requestBackgroundPermissionsAsync,
  requestForegroundPermissionsAsync,
  startGeofencingAsync,
} from "expo-location";
import * as Notifications from "expo-notifications";
import { LocationGeofencingEventType } from "expo-location";
import * as TaskManager from "expo-task-manager";

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
      return;
    }
    if (eventType === LocationGeofencingEventType.Enter) {
      console.log("You've entered region:", region);
      alert("you've entered region");
      Notifications.scheduleNotificationAsync({
        content: {
          title: "ENTERED GEOFENCE",
          body: region.identifier,
        },
        trigger: null,
      });
    } else if (eventType === LocationGeofencingEventType.Exit) {
      console.log("You've left region:", region);
      alert("You've left region");
      Notifications.scheduleNotificationAsync({
        content: {
          title: "EXITED GEOFENCE",
          body: region.identifier,
        },
        trigger: null,
      });
      setTimeout(() => {
      BackHandler.exitApp();
    }, 1000);
    }
  }
);

export default function Trial() {
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const setUp = async () => {
      const { granted: notificationsGranted } =
        await Notifications.getPermissionsAsync();
      if (!notificationsGranted) {
        await Notifications.requestPermissionsAsync();
      }

      const { granted: fgGranted } = await getForegroundPermissionsAsync();
      if (!fgGranted) {
        await requestForegroundPermissionsAsync();
        await requestBackgroundPermissionsAsync();
      }

      const geofences = [
        {
          identifier: "Stockholm",
          latitude: 59.332598,
          longitude: 18.035258,
          radius: 10000,
          notifyOnEnter: true,
          notifyOnExit: true,
        },
      ];
      await startGeofencingAsync("GEOFENCE_TASK", geofences);
    };

    setUp();
  }, []);

  const checkLocationHandler = () => {
    const setUp = async () => {
      const { granted: notificationsGranted } =
        await Notifications.getPermissionsAsync();
      if (!notificationsGranted) {
        await Notifications.requestPermissionsAsync();
      }

      const { granted: fgGranted } = await getForegroundPermissionsAsync();
      if (!fgGranted) {
        await requestForegroundPermissionsAsync();
        await requestBackgroundPermissionsAsync();
      }

      const geofences = [
        {
          identifier: "Stockholm",
          latitude: 59.332598,
          longitude: 18.035258,
          radius: 100,
          notifyOnEnter: true,
          notifyOnExit: true,
        },
      ];
      await startGeofencingAsync("GEOFENCE_TASK", geofences);
    };

    setUp();
  };

  return (
    <View style={styles.container}>
      {isLoading ? <Text>App is Loading</Text> : <Text>Loading done</Text>}
      <Button title="Check Location" onPress={checkLocationHandler}></Button>
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
