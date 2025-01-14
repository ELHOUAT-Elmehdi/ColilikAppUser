import React from "react";
import { View, Text, TouchableOpacity, Image, ScrollView } from "react-native";
import { icons } from "@/constants";
import { useRouter } from "expo-router";

const Delivery = () => {
  const router = useRouter();

  interface Order {
    id: string;
    destination: string;
    status: string;
    date: Date;
  }

  const pendingOrders: Order[] = [
    {
      id: "MAY23230024",
      destination: "Destination",
      status: "Transit",
      date: new Date(),
    },
    {
      id: "MAY23230024",
      destination: "Destination",
      status: "Pending",
      date: new Date(),
    },
  ];

  const recentOrders: Order[] = [
    {
      id: "MAY23230024",
      destination: "Destination",
      status: "Delivered",
      date: new Date(),
    },
    {
      id: "MAY23230024",
      destination: "Destination",
      status: "Cancelled",
      date: new Date(),
    },
  ];

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-200 text-yellow-600";
      case "Transit":
        return "bg-purple-200 text-purple-600";
      case "Delivered":
        return "bg-green-200 text-green-600";
      case "Cancelled":
        return "bg-red-200 text-red-600";
      default:
        return "bg-gray-200 text-gray-600";
    }
  };

  return (
    <View className="flex-1 bg-gray-100 p-5">
      {/* Header */}
      <View className="flex-row justify-between items-center">
        <TouchableOpacity
          onPress={() => router.push("(tabs)/home")}
          className="flex-row items-center"
        >
          <Image source={icons.backArrow} className="w-6 h-6 mr-2" />
          <Text className="text-lg font-bold">Delivery</Text>
        </TouchableOpacity>
        <TouchableOpacity>
          <Image source={icons.list} className="w-12 h-12" />
        </TouchableOpacity>
      </View>

      {/* Create New Order Button */}
      <TouchableOpacity
        className="bg-blue-600 p-4 rounded-lg mt-5"
        onPress={() => router.push("/NewOrder")}
      >
        <Text className="text-white text-center text-lg font-bold">
          Create New Order
        </Text>
      </TouchableOpacity>

      {/* Pending Delivery Section */}
      <ScrollView className="mt-5">
        <Text className="text-lg font-bold">Pending Delivery</Text>
        {pendingOrders.map((order, index) => (
          <View
            key={index}
            className="flex-row bg-white p-4 mt-2 rounded-lg shadow-sm items-center"
          >
            <Image source={icons.box} className="w-10 h-10 mr-4" />
            <View className="flex-1">
              <Text className="text-gray-800 font-bold">{order.id}</Text>
              <Text className="text-gray-600">{order.destination}</Text>
              <Text className="text-gray-400 text-sm">
                {order.date.toDateString()}
              </Text>
            </View>
            <View
              className={`px-3 py-1 rounded-full ${getStatusStyle(order.status)}`}
            >
              <Text className="text-sm font-bold">{order.status}</Text>
            </View>
          </View>
        ))}

        {/* Recent Delivery Section */}
        <Text className="mt-5 text-lg font-bold">Recent Delivery</Text>
        {recentOrders.map((order, index) => (
          <View
            key={index}
            className="flex-row bg-white p-4 mt-2 rounded-lg shadow-sm items-center"
          >
            <Image source={icons.box} className="w-10 h-10 mr-4" />
            <View className="flex-1">
              <Text className="text-gray-800 font-bold">{order.id}</Text>
              <Text className="text-gray-600">{order.destination}</Text>
              <Text className="text-gray-400 text-sm">
                {order.date.toDateString()}
              </Text>
            </View>
            <View
              className={`px-3 py-1 rounded-full ${getStatusStyle(order.status)}`}
            >
              <Text className="text-sm font-bold">{order.status}</Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

export default Delivery;
