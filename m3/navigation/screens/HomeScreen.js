import React, { useRef, useState, useEffect } from "react";
import { View, Text, StyleSheet, Image, Dimensions } from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import loading from "../../assets/loading2.gif";
import Home from "../../pages/HomeContent";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Header } from "react-native/Libraries/NewAppScreen";
import { NavigationContainer } from "@react-navigation/native";
import HomePageDisplay from "../../pages/HomeDisplay";

const vh = Dimensions.get("window");

const Stack = createNativeStackNavigator();

const HomeScreen = (props) => {
  const [url, setUrl] = useState(
    "https://oauth.reddit.com/subreddits/mine/subscriber/?limit=15"
  );
  const [subreddits, setSubreddits] = useState();
  const [firstLoading, setFirstLoading] = useState(true);
  const [dataOrNot, setDataOrNot] = useState(false);
  const [userInfo, setUserInfo] = useState({});
  // • Display posts from the subreddits the user is subbed to // La requete fonctionne pas pour le moment (/subreddits/mine/subscriber)
  // • Display a subreddit basic information. The bare minimum is to display the name, title, number of subscribers, description, and header image
  // • Subscribe/Unsubscribe to a subreddit
  // • Display a post basic information. The bare minimum is to display the title, author, number of comments, number of upvotes, and the post image;

  useEffect(() => {
    const fetchData = async () => {
      var token = await AsyncStorage.getItem("TOKEN");
      const UserSetting = {
        method: "GET",
        url: url,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      await axios(UserSetting)
        .then((response) => {
          const post = response;
          setSubreddits(
            response.data.data.children.map((subreddit) => subreddit.data)
          );
        })
        .catch((error) => {
          console.log(error);
        });

      const UserInfo = {
        method: "GET",
        url: "https://oauth.reddit.com/api/v1/me",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      await axios(UserInfo)
        .then((response) => {
          setUserInfo(response.data);
          setFirstLoading(false);
        })
        .catch((error) => {
          console.log(error);
        });
    };
    fetchData();
  }, []);

  return (
    <View style={{ width: vh.width, height: "100%"}}>
      {firstLoading ? (
        <Image style={styles.loading} source={loading} />
      ) : (
        <>
          <View style={styles.barTop}>
            <Image
              style={styles.barTopImage}
              source={{ uri: userInfo.snoovatar_img }}
            />
            <Text style={styles.barTopText}>
              {userInfo.subreddit.display_name}
            </Text>
          </View>

            <Stack.Navigator name="HomeNavigator" screenOptions={{ headerShown: false }} >
              <Stack.Screen name="HomeInitial" component={Home} />
              <Stack.Screen name="HomePageDisplay" component={HomePageDisplay} />
            </Stack.Navigator>

        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  loading: {
    width: 150,
    height: 150,
    top: vh.height / 2 - vh.height / 8,
    alignSelf: "center",
    resizeMode: "contain",
    position: "absolute",
    zIndex: 1,
  },
  barTop: {
    flexDirection: "row-reverse",
    flexWrap: "wrap",
    width: "100%",
    backgroundColor: "#FFFFFF",
    paddingTop: 50,
    paddingBottom: 20,
    borderBottomColor: "#DCDCDC",
    borderBottomWidth: 1,
  },
  barTopChild: {
    flexDirection: "row",
    padding: 10,
    backgroundColor: "white",
  },
  barTopImage: {
    width: 50,
    height: 50,
    borderRadius: 100,
    marginRight: 10,
    resizeMode: "contain",
  },
  barTopText: {
    paddingTop: 14,
    fontSize: 16,
    fontWeight: "bold",
    color: "#FF8700",
  },
});

export default HomeScreen;