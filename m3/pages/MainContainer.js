import * as React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "react-native-vector-icons/Ionicons";

import HomeScreen from "../navigation/screens/HomeScreen";
import UserScreen from "../navigation/screens/UserScreen";
import SearchScreen from "../navigation/screens/SearchScreen";

const homeName = "Home";
const searchName = "Search";
const userName = "User";

const Tab = createBottomTabNavigator();

export default function MainContainer({ navigation }) {
  return (
    <>
      <Tab.Navigator
        initialRouteName="homeName"
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === "homeName") {
              iconName = focused ? "home" : "home-outline";
            } else if (route.name === "searchName") {
              iconName = focused ? "search" : "search-outline";
            } else if (route.name === "userName") {
              iconName = focused ? "person" : "person-outline";
            }

            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: "tomato",
          tabBarInactiveTintColor: "grey",
          tabBarStyle: { height: 70 },
          headerShown: false,
          tabBarShowLabel: false,
        })}
      >
        <Tab.Screen name="homeName" component={HomeScreen} />
        <Tab.Screen name="searchName" component={SearchScreen} />
        <Tab.Screen name="userName" component={UserScreen} />
      </Tab.Navigator>
    </>
  );
}
