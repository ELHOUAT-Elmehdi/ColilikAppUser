import React, { useEffect, useRef, useState } from "react";
import {
  SafeAreaView,
  Text,
  View,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
  Animated,
  Pressable,
  StyleSheet,
  Button,
  Modal,
} from "react-native";
import { useRouter } from "expo-router";
import { icons, images } from "@/constants";
import { useUserContext } from "@/app/userContext";
import DateTimePicker from "@react-native-community/datetimepicker";
import MapModal from "@/components/MapModal";

const Home = () => {
  const [isModalVisible, setModalVisible] = useState(false);

  const [selectedLocation1, setSelectedLocation1] = useState<{
    address: string;
    coords: { latitude: number; longitude: number };
  } | null>(null);
  const [selectedLocation2, setSelectedLocation2] = useState<{
    address: string;
    coords: { latitude: number; longitude: number };
  } | null>(null);

  const handleSelectLocation1 = (
    address: string,
    coords: { latitude: number; longitude: number }
  ) => {
    setSelectedLocation1({ address, coords });
  };
  const handleSelectLocation2 = (
    address: string,
    coords: { latitude: number; longitude: number }
  ) => {
    setSelectedLocation2({ address, coords });
  };
  const styles = StyleSheet.create({
    deliveryText: {
      fontSize: 14,
      marginTop: 20,
      color: "#666",
      textAlign: "center",
    },
    modalContent: {
      flex: 1,
      backgroundColor: "white",
      padding: 30,
      justifyContent: "center",
    },
    mapContainer: {
      height: 210,
      marginVertical: 20,
    },
  });
  const styles1 = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      padding: 20,
    },
    title: {
      fontSize: 24,
      fontWeight: "bold",
      marginBottom: 20,
    },
    locationContainer: {
      marginVertical: 20,
      padding: 10,
      backgroundColor: "#f9f9f9",
      borderRadius: 8,
      borderWidth: 1,
      borderColor: "#ddd",
    },
    info: {
      fontSize: 16,
      marginBottom: 5,
    },
  });
  const [isFormVisible, setIsFormVisible] = useState(false);

  const backendurl: string = "http://192.168.1.115:8080/";
  const handleSubmit = async () => {
    // Vérifiez que tous les champs sont remplis
    if (!date || !time || !selectedLocation1 || !selectedLocation2) {
      alert('Please fill in all the fields before submitting.');
      return;
    }

    try {
      // Récupérez les données à envoyer
      const payload = {
        date: date.toISOString().split('T')[0], // Format YYYY-MM-DD
        time: time.toLocaleTimeString(), // Format HH:mm:ss
        startLocation: {
          address: selectedLocation1.address,
          latitude: selectedLocation1.coords.latitude,
          longitude: selectedLocation1.coords.longitude,
        },
        endLocation: {
          address: selectedLocation2.address,
          latitude: selectedLocation2.coords.latitude,
          longitude: selectedLocation2.coords.longitude,
        },
      };

      // Envoyez la requête POST
      const response = await fetch(backendurl + 'api/users/' + userId, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      // Gérez la réponse
      if (response.ok) {
        const result = await response.json();
        console.log('Delivery details saved successfully:', result);
        alert('Details submitted successfully!');
        handleCancel(); // Optionnel : réinitialiser ou fermer le formulaire
      } else {
        console.error('Failed to submit delivery details:', response.statusText);
        alert('Failed to submit details. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting delivery details:', error);
      alert('An error occurred. Please try again.');
    }
  };





  const handleCancel = () => {
    setIsFormVisible(false);
  };

  const [date, setDate] = useState(new Date());
  const [show, setShow] = useState(false);
  const [showTime, setShowTime] = useState(false);
  const [time, setTime] = useState(new Date());

  const onChange = (event: any, selectedDate: Date | undefined) => {
    const currentDate = selectedDate || date;
    setShow(false);
    setDate(currentDate);
  };
  const onTimeChange = (event: any, selectedTime: Date | undefined) => {
    const currentTime = selectedTime || time;
    setShowTime(false); // hide the time picker
    setTime(currentTime); // update the time
  };
  const showTimepicker = () => {
    setShowTime(true); // show the time picker
  };

  const showDatepicker = () => {
    setShow(true);
  };
  const router = useRouter();
  const { imageUri, setImageUri } = useUserContext();
  const [user, setUser] = useState<string>("Guest");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isProfileVisible, setIsProfileVisible] = useState<boolean>(false);
  const slideAnim = useRef(
    new Animated.Value(-Dimensions.get("window").width),
  ).current;
  const userId = "1";
  const fetchUserById = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(
        backendurl + `api/users/${userId}`,
      );

      if (!response.ok) {
        throw new Error("Failed to fetch user data");
      }

      const data = await response.json();

      if (data && data.userId) {
        setUser(data.fullName || "Guest");
        setImageUri(
          backendurl + `api/users/imageProfil/${data.userId}?timestamp=${new Date().getTime()}`,
        );
      } else {
        setUser("Guest");
        setImageUri(null);
      }
    } catch (error: any) {
      setError(error.message || "Unable to fetch user data");
      setUser("Guest");
      setImageUri(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUserById();
  }, []);

  const toggleProfile = () => {
    if (isProfileVisible) {
      Animated.timing(slideAnim, {
        toValue: -Dimensions.get("window").width,
        duration: 300,
        useNativeDriver: true,
      }).start(() => setIsProfileVisible(false));
    } else {
      setIsProfileVisible(true);
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  };

  const navigationToConfig = () => {
    router.push({
      pathname: "/(root)/(userSettings)/userConfig",
      params: {
        userId: userId,
      },
    });
  };


  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    // Fonction pour effectuer le fetch
    const fetchRequests = async () => {
      try {
        const response = await fetch(backendurl + `requests/driver/${userId}`);
        const data = await response.json();
        setRequests(data); // Mettre à jour l'état avec les requêtes
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    // Appeler fetchRequests immédiatement
    fetchRequests();

    // Utiliser setInterval pour faire le fetch toutes les 2 secondes
    const intervalId = setInterval(fetchRequests, 2000);

    // Nettoyage de l'intervalle lors du démontage du composant
    return () => clearInterval(intervalId);
  }, [userId]);


  return (
    <SafeAreaView className="flex-1 bg-gray-100 relative">
      <View className="flex-row justify-between items-center p-5">
        <TouchableOpacity onPress={toggleProfile}>
          <Image
            source={imageUri ? { uri: imageUri } : icons.GreyUser}
            className="w-12 h-12 rounded-full"
          />
        </TouchableOpacity>
        {isLoading ? (
          <ActivityIndicator size="small" color="#000" />
        ) : (
          <Text className="text-xl font-bold">Hello, {user}!</Text>
        )}
        <TouchableOpacity>
          <Image source={icons.notification} className="w-6 h-6" />
        </TouchableOpacity>
      </View>

      <View className="mx-5 h-[25%] bg-blue-700 rounded-lg p-5 flex justify-center items-center">
        <Text className="text-white text-base">Total Balance</Text>
        <TouchableOpacity className="mt-2">
          <Text className="text-white text-2xl">****</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <View className="flex-row justify-between mx-5 mt-4">
          <View className="flex-1 bg-white-50 rounded-lg p-5 ml-2 items-center justify-center">
            <Image
              source={images.scooter}
              className="max-w-full max-h-64"
              resizeMode="contain"
            />
            <Text style={styles.deliveryText}>
              You currently have no delivery request.{"\n"}Wait a moment!
            </Text>
          </View>
        </View>
      ) : (
        <View className="flex-row justify-between mx-5 mt-4">
          {requests.length === 0 ? (
            <View className="flex-1 bg-white-50 rounded-lg p-5 ml-2 items-center justify-center">
              <Image
                source={images.scooter}
                className="max-w-full max-h-64"
                resizeMode="contain"
              />
              <Text style={styles.deliveryText}>
                You currently have no delivery request.{"\n"}Wait a moment!
              </Text>
            </View>
          ) : (
            <View>
              {requests.map((request) => (
                <View key={request.id}>
                  <Text>{`Request ID: ${request.id}`}</Text>
                  <Text>{`Announcement ID: ${request.announcementId}`}</Text>
                </View>
              ))}
            </View>
          )}
        </View>
      )}


      {isProfileVisible && (
        <Pressable
          onPress={toggleProfile}
          className="absolute top-0 left-0 w-full h-full bg-black/50"
        />
      )}

      <Animated.View
        style={{
          transform: [{ translateX: slideAnim }],
        }}
        className="absolute top-0 left-0 h-full w-[60%] bg-white shadow-lg z-50"
      >
        <View className="bg-blue-700 p-5 items-center">
          <Image
            source={imageUri ? { uri: imageUri } : icons.GreyUser}
            className="w-20 h-20 rounded-full"
          />
          <Text className="text-white text-lg font-bold mt-2">{user}</Text>
          <Text className="text-white text-sm mt-1">⭐ 4.8</Text>
        </View>

        <View className="p-5">
          <TouchableOpacity
            className="flex-row items-center mb-5"
            onPress={navigationToConfig}
          >
            <Image source={icons.GreyUser} className="w-5 h-5" />
            <Text className="text-base ml-2">Edit Profile</Text>
          </TouchableOpacity>

          <View className="mt-5 border-t border-gray-200" />

          <TouchableOpacity className="flex-row items-center mt-5">
            <Image source={icons.list} className="w-5 h-5" />
            <Text className="text-base ml-2">Delivery History</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
      <View className="absolute bottom-1 left-0 right-0 flex-row items-center justify-between p-5 ">
        <Text className="font-bold">Schedule a delivery</Text>
        <TouchableOpacity onPress={() => setIsFormVisible(true)}>
          <Image source={icons.add} className="w-9 h-9" />
        </TouchableOpacity>
      </View>
      <Modal visible={isFormVisible} animationType="slide">
        <View style={styles.modalContent}>
          <Text className="text-lg font-bold mb-4">Add Delivery Details</Text>
          <View>
            <Text>Selected Date: {date.toLocaleDateString()}</Text>
            <Button onPress={showDatepicker} title="Select Date" />
            {show && (
              <DateTimePicker
                value={date}
                mode="date"
                display="default"
                onChange={onChange}
              />
            )}
          </View>
          <View style={{ marginTop: 20 }}>
            <Text>Selected Time: {time.toLocaleTimeString()}</Text>
            <Button onPress={showTimepicker} title="Select Time" />

            {showTime && (
              <DateTimePicker
                value={time}
                mode="time"
                display="default"
                onChange={onTimeChange}
              />
            )}
          </View>






          <View style={styles1.container}>
            <Text className="mb-2">Select Start Location:</Text>
            {selectedLocation1 && (
              <View style={styles1.locationContainer}>
                <Text style={styles1.info}>Address: {selectedLocation1.address}</Text>
                <Text style={styles1.info}>
                  Latitude: {selectedLocation1.coords.latitude}
                </Text>
                <Text style={styles1.info}>
                  Longitude: {selectedLocation1.coords.longitude}
                </Text>
              </View>
            )}
            <Button title="Open Map" onPress={() => setModalVisible(true)} />
            <MapModal
              visible={isModalVisible}
              onClose={() => setModalVisible(false)}
              onSelectLocation={handleSelectLocation1}
            />
          </View>

          <View style={styles1.container}>
            <Text className="mb-2">Select End Location:</Text>
            {selectedLocation2 && (
              <View style={styles1.locationContainer}>
                <Text style={styles1.info}>Address: {selectedLocation2.address}</Text>
                <Text style={styles1.info}>
                  Latitude: {selectedLocation2.coords.latitude}
                </Text>
                <Text style={styles1.info}>
                  Longitude: {selectedLocation2.coords.longitude}
                </Text>
              </View>
            )}
            <Button title="Open Map" onPress={() => setModalVisible(true)} />
            <MapModal
              visible={isModalVisible}
              onClose={() => setModalVisible(false)}
              onSelectLocation={handleSelectLocation2}
            />
          </View>


          <View style={{ marginBottom: 10 }}>
            <Button
              title="Submit"
              onPress={handleSubmit}
            />
          </View>
          <View style={{ marginBottom: 10 }}>
            <Button
              title="Cancel"
              color="red"
              onPress={handleCancel}
            />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default Home;
