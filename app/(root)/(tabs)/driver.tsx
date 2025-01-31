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
import { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import MapModal from "@/components/MapModal";
import MapModal2 from "@/components/MapModal";
const Home = () => {
  const [isModalVisible, setModalVisible] = useState(false);
  const [isModalVisible2, setModalVisible2] = useState(false);
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
  const styles2 = StyleSheet.create({
    container: {
      padding: 20,
      width: 350
    },
    card: {
      marginTop: 15,
      backgroundColor: '#fff',
      borderRadius: 10,
      padding: 15,
      marginBottom: 1,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 4,
      elevation: 3,
    },
    locationContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    icon: {
      fontSize: 18,
      color: '#4a90e2',
      marginRight: 10,
    },
    locationText: {
      fontSize: 16,
      color: '#333',
    },
    dottedLine: {
      borderStyle: 'dotted',
      borderWidth: 0.9, // Ajustez l'épaisseur
      borderColor: '#4a90e2',
      height: 20, // Hauteur de la ligne verticale
      marginLeft: 11, // Centré avec l'icône
      marginVertical: 2, // Espacement
      // Assure que la ligne reste centrée
      width: 0, // Garde la ligne uniquement verticale
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
        // Supposons que c'est la date sélectionnée
      
      const formattedDate = date.toISOString().split('T')[0]; // YYYY-MM-DD
      const formattedTime = time.toTimeString().split(' ')[0];
      const deliveryTime = `${formattedDate}T${formattedTime}`

      const payload = {

        deliveryTime,
        latDepart: selectedLocation1.coords.latitude,
        longDepart: selectedLocation1.coords.longitude,
        latDest: selectedLocation2.coords.latitude,
        longDest: selectedLocation2.coords.longitude,

      };

      // Envoyez la requête POST
      const response = await fetch(backendurl + 'api/users/update/' + userId, {
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
    } <FontAwesome5 name="map-marker-alt" style={styles2.icon} />
  };

  const handleCancel = () => {
    setIsFormVisible(false);
  };

  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const onDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (event.type === 'set' && selectedDate) { // Confirmation utilisateur
      setDate(selectedDate);
    }
  };

  const onTimeChange = (event: any, selectedTime?: Date) => {
    setShowTimePicker(false);
    if (event.type === 'set' && selectedTime) {
      setTime(selectedTime);
    }
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

  const [requests1, setRequests1] = useState([]);

  const [loading, setLoading] = useState(true);
  const [isFirstLoad, setIsFirstLoad] = useState(true);

  useEffect(() => {
    // Fonction pour effectuer le fetch
    const fetchRequests = async () => {
      try {
        const response = await fetch(backendurl + `requests/driver/${userId}`);
        const data = await response.json();
        setRequests(data);
        // Mettre à jour l'état avec les requêtes


        // const response2 = await fetch(backendurl + `announcements/${data.announcementId}`);
        // const data1 = await response2.json();
        // setRequests1(data1);
        const validAnnouncements = data
          .filter(item => item.announcementId) // Ne garder que les éléments avec announcementId défini
          .map(item => item.announcementId);

        // Récupérer les détails des annonces en parallèle
        const announcementPromises = validAnnouncements.map(async (announcementId) => {
          const response = await fetch(backendurl + `announcements/${announcementId}`);
          if (!response.ok) throw new Error(`Failed to fetch announcement ${announcementId}`);
          return response.json();
        });

        // Attendre que toutes les requêtes se terminent
        const announcements = await Promise.all(announcementPromises);
        setRequests1(announcements);

        setIsFirstLoad(false); // On indique que le premier chargement est terminé

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

      {isFirstLoad || loading || requests == null || requests.length === 0 ? (
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
          <View style={styles2.container}>
            <Text className="text-lg font-bold">Delivery Request</Text>
            {requests1.map((request) => (
              <View key={request.announcementId} style={styles2.card}>
                <View style={styles2.locationContainer}>
                  <Image source={icons.Currentlockation} style={styles2.icon} />
                  <Text style={styles2.locationText}>{request.depart}</Text>
                </View>
                <View style={styles2.dottedLine}></View>
                <View style={styles2.locationContainer}>
                  <Image source={icons.Location} style={styles2.icon} />
                  <Text style={styles2.locationText}>{request.destination}</Text>
                </View>
              </View>
            ))}
          </View>
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
        <Text>Date sélectionnée : {date.toLocaleDateString()}</Text>
        <Button 
          title="Choisir une date" 
          onPress={() => setShowDatePicker(true)} 
        />
        {showDatePicker && (
          <DateTimePicker
            value={date}
            mode="date"
            display="default"
            onChange={onDateChange}
          />
        )}
      </View>

      <View style={{ marginTop: 20 }}>
        <Text>Heure sélectionnée : {time.toLocaleTimeString()}</Text>
        <Button 
          title="Choisir une heure" 
          onPress={() => setShowTimePicker(true)} 
        />
        {showTimePicker && (
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
            <Button title="Open Map" onPress={() => setModalVisible2(true)} />
            <MapModal2
              visible={isModalVisible2}
              onClose={() => setModalVisible2(false)}
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
