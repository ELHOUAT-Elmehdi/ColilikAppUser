import React, { useEffect, useState } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
  Alert,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";

const { width, height } = Dimensions.get("window");

interface MapModalProps {
  visible: boolean;
  onClose: () => void;
  onSelectLocation: (
    address: string,
    coords: { latitude: number; longitude: number },
  ) => void;
}

const MapModal: React.FC<MapModalProps> = ({
  visible,
  onClose,
  onSelectLocation,
}) => {
  const [userLocation, setUserLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [selectedCoords, setSelectedCoords] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [address, setAddress] = useState<string>("");

  useEffect(() => {
    const fetchLocation = async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          Alert.alert(
            "Permission Denied",
            "Location access is required to select a location.",
            [{ text: "OK", onPress: onClose }],
          );
          return;
        }

        const location = await Location.getCurrentPositionAsync({});
        setUserLocation(location.coords);
      } catch (error) {
        Alert.alert(
          "Error",
          "Unable to fetch your location. Please try again.",
        );
        onClose();
      }
    };

    fetchLocation();
  }, []);

  const handleMapPress = async (event: any) => {
    const { latitude, longitude } = event.nativeEvent.coordinate;
    setSelectedCoords({ latitude, longitude });

    try {
      const result = await Location.reverseGeocodeAsync({
        latitude,
        longitude,
      });
      const formattedAddress = `${result[0]?.name || "Unknown"}, ${result[0]?.region || "Unknown"}`;
      setAddress(formattedAddress);
    } catch {
      Alert.alert("Error", "Unable to fetch the address for this location.");
    }
  };

  const handleValidate = () => {
    if (selectedCoords && address) {
      onSelectLocation(address, selectedCoords);
      onClose();
    } else {
      Alert.alert(
        "No Location Selected",
        "Please select a location on the map.",
      );
    }
  };

  if (!userLocation) {
    return (
      <Modal visible={visible} animationType="slide" transparent={false}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
          <Text>Fetching your location...</Text>
          <TouchableOpacity
            style={[styles.button, styles.cancelButton, { marginTop: 20 }]}
            onPress={onClose}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    );
  }

  return (
    <Modal visible={visible} animationType="slide" transparent={false}>
      <View style={styles.container}>
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: userLocation.latitude,
            longitude: userLocation.longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }}
          onPress={handleMapPress}
        >
          {selectedCoords && (
            <Marker
              coordinate={selectedCoords}
              title="Selected Location"
              description={address || "Fetching address..."}
            />
          )}
        </MapView>
        <View style={styles.actionContainer}>
          <TouchableOpacity
            style={[styles.button, styles.confirmButton]}
            onPress={handleValidate}
          >
            <Text style={styles.confirmButtonText}>Confirm</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.cancelButton]}
            onPress={onClose}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
  actionContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    padding: 10,
    backgroundColor: "#ffffff",
    borderTopWidth: 1,
    borderTopColor: "#ddd",
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    borderWidth: 2,
  },
  confirmButton: {
    backgroundColor: "#007bff", // Blue background
    borderColor: "#007bff", // Blue border
  },
  confirmButtonText: {
    color: "white", // White text
    fontSize: 16,
    fontWeight: "bold",
  },
  cancelButton: {
    backgroundColor: "transparent",
    borderColor: "#007bff", // Blue border
  },
  cancelButtonText: {
    color: "#007bff", // Blue text
    fontSize: 16,
    fontWeight: "bold",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
});

export default MapModal;
const handleLocationSelect = (coordinate: { latitude: number, longitude: number }, locationType: string) => {
  setFormData((prevState) => ({
    ...prevState,
    [locationType]: coordinate,
  }));
};