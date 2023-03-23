import * as React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useState, useEffect, useRef } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  Image,
  StyleSheet,
  Text,
  View,
  Dimensions,
  ScrollView,
  TouchableOpacity,
  Modal,
} from "react-native";
import { LogBox } from "react-native";
import ImageHeaderScrollView, {
  TriggeringView,
} from "react-native-image-header-scroll-view";
import * as Animatable from "react-native-animatable";

LogBox.ignoreLogs(["source.uri should not be an empty string"]);

const HomeDisplay = (props) => {
  return (
    <>
      <ImageHeaderScrollView
        maxHeight={200}
        minHeight={100}
        fadeOutForeground
        style={{ width: "100%", height: "100%" }}
        overScrollMode="never"
        minOverlayOpacity={0}
        maxOverlayOpacity={0}
      >
        <TriggeringView style={{ backgroundColor: "white" }}></TriggeringView>
      </ImageHeaderScrollView>
    </>
  );
};
export default HomeDisplay;

const vh = Dimensions.get("window");
const styles = StyleSheet.create({});
