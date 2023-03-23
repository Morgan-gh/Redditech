import React, { useState, useEffect } from "react";
import {
  Animated,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  ScrollView,
  View,
  Dimensions,
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import loadingThread from "../assets/loadingThread.gif";
import loadingGif from "../assets/loading.gif";
import loading from "../assets/loading2.gif";

const HomeContent = (props, { route }) => {
  const [menuVisible, setMenuVisible] = useState({});
  const [topThreads, setTopThreads] = useState({});
  const [animation] = useState(new Animated.Value(0));
  const [refreshLoading, setRefreshLoading] = useState(false);
  const [moreDataLoading, setMoreDataLoading] = useState(false);
  const [subreddits, setSubreddits] = useState([]);
  const [url, setUrl] = useState(
    "https://oauth.reddit.com/subreddits/mine/subscriber/?limit=15"
  );
  const [isVisible, setIsVisible] = useState(false);

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
    };
    fetchData();
  }, []);

  const handleScroll = async (event) => {
    event.persist();
    if (event.nativeEvent.contentOffset.y === 0) {
      setRefreshLoading(true);
      var token = await AsyncStorage.getItem("TOKEN");
      const UserSetting = {
        method: "GET",
        url: url,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      // L'utilisateur a fait défiler la vue jusqu'en haut
      // Refresh les données par axios

      axios(UserSetting)
        .then((response) => {
          const post = response;
          setSubreddits(
            response.data.data.children.map((subreddit) => subreddit.data)
          );
        })
        .catch((error) => {
          console.log(error);
        });
      setRefreshLoading(false);
    }

    // L'utilisateur a fait défiler la vue jusqu'en bas
    // Charger plus de données par axios
    if (
      event.nativeEvent.contentOffset.y >=
      event.nativeEvent.contentSize.height -
        (1 + event.nativeEvent.layoutMeasurement.height)
    ) {
      console.log(subreddits[subreddits.length - 1].name);
      setMoreDataLoading(true);
      var token = await AsyncStorage.getItem("TOKEN");
      const UserSetting = {
        method: "GET",
        url: url + "&after=" + subreddits[subreddits.length - 1].name,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      axios(UserSetting)
        .then((response) => {
          if (response.data.data.children.length === 0) {
            setIsVisible(true);
            console.log("No more data");
            setTimeout(() => {
              setIsVisible(false);
            }, 2000);
          } else {
            setSubreddits((prevState) => [
              ...prevState,
              ...response.data.data.children.map((subreddit) => subreddit.data),
            ]);
          }
          setMoreDataLoading(false);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  const handleMenuPress = async (subredditClicked) => {
    // Handle the menu press
    try {
      var token = await AsyncStorage.getItem("TOKEN");
      const UserSetting = {
        method: "GET",
        url: `https://oauth.reddit.com/r/${subredditClicked}/top.json?limit=5`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      if (!menuVisible[subredditClicked]) {
        setMenuVisible((prevState) => ({
          ...prevState,
          [`${subredditClicked}Loading`]: true,
        }));
        await axios(UserSetting)
          .then((response) => {
            const post = response;
            setTopThreads((prevState) => ({
              ...prevState,
              [subredditClicked]: post.data.data.children,
            }));
          })
          .catch((error) => {
            console.log(error);
          });
        setMenuVisible((prevState) => ({
          ...prevState,
          [subredditClicked]: !menuVisible[subredditClicked],
        }));
      }
    } catch (error) {
      console.log(error);
    }

    // Handle the animation
    if (!menuVisible[subredditClicked]) {
      Animated.timing(animation, {
        toValue: 1,
        duration: 250,
        useNativeDriver: true,
      }).start(() =>
        setMenuVisible((prevState) => ({
          ...prevState,
          [subredditClicked]: !menuVisible[subredditClicked],
        }))
      );
    } else {
      Animated.timing(animation, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start(() =>
        setMenuVisible((prevState) => ({
          ...prevState,
          [subredditClicked]: !menuVisible[subredditClicked],
        }))
      );
    }

    setMenuVisible((prevState) => ({
      ...prevState,
      [`${subredditClicked}Loading`]: false,
    }));
  };

  const handleMenuItemPress = (thread, subreddit) => {
    props.navigation.navigate("HomePageDisplay", {
      threadId: thread.data.id, subRedditName: subreddit.display_name_prefixed,
    });
  };

  return (
    <>
      {refreshLoading && (
        <Image style={styles.loadingRefresh} source={loadingGif} />
      )}
      <View
        visible={isVisible}
        style={{
          backgroundColor: "grey",
          top: 0,
          left: vh.width/4,
          padding: 20,
          zIndex: 1,
          width: 160,
          height: 60,
          position: "absolute",
          borderRadius: 30,
          opacity: isVisible ? 1 : 0,
          transition: "opacity 1s",
        }}
      >
        <Text
          style={{
            fontSize: 18,
            top: 15,
            left: 21,
            color: "white",
            fontStyle: "italic",
            position: "absolute",
          }}
        >
          No More Data !
        </Text>
      </View>
      <ScrollView onScroll={handleScroll}>
        {subreddits.map((subreddit) => {
          if (subreddit.display_name.substring(0, 2) === "u_") {
            return null; // ignorer les noms d'utilisateurs
          } else {
            const imageUri = subreddit.icon_img || subreddit.header_img || null;
            const subredditClicked = subreddit.display_name;
            return (
              <View key={subreddit.id} style={styles.container}>
                <View style={styles.bloc}>
                  <Image
                    style={styles.image}
                    source={
                      imageUri
                        ? { uri: imageUri }
                        : require("../assets/icon_white.png")
                    }
                    borderRadius={25}
                    resizeMode="contain"
                  />

                  <View style={styles.textContainer}>
                    <Text style={styles.title}>{subredditClicked}</Text>
                    <Text style={styles.subscribers}>
                      {subreddit.subscribers
                        .toString()
                        .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}{" "}
                      subscribers
                    </Text>
                  </View>
                  {menuVisible[`${subredditClicked}Loading`] && (
                    <Image
                      style={styles.loadingThread}
                      source={loadingThread}
                    />
                  )}
                  <TouchableOpacity
                    onPress={() => handleMenuPress(subredditClicked)}
                    style={styles.menuButton}
                  >
                    <Text style={styles.threadButton}>
                      {menuVisible[subredditClicked] ? "↑" : "↓"}
                    </Text>
                  </TouchableOpacity>
                </View>

                {menuVisible[subredditClicked] && (
                  <Animated.View style={[styles.list, { opacity: animation }]}>
                    {topThreads[subredditClicked]?.map((thread) => (
                      <TouchableOpacity
                        key={thread.data.id}
                        onPress={() => handleMenuItemPress(thread, subreddit)}
                        style={styles.menuItem}
                      >
                        <Text>{thread.data.title}</Text>
                      </TouchableOpacity>
                    ))}
                  </Animated.View>
                )}
              </View>
            );
          }
        })}
      </ScrollView>
      {moreDataLoading && <Image style={styles.loadingMore} source={loading} />}
    </>
  );
};

const vh = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flexDirection: "column",
    padding: 10,
    backgroundColor: "white",
    justifyContent: "space-between",
    alignItems: "center",
  },
  loadingThread: {
    width: 80,
    height: 80,
    position: "absolute",
    right: 35,
  },
  loadingMore: {
    width: 150,
    height: 150,
    bottom: vh.height / 4,
    alignSelf: "center",
    resizeMode: "contain",
    position: "absolute",
  },
  loadingRefresh: {
    width: 100,
    height: 50,
    alignSelf: "center",
    resizeMode: "contain",
    position: "relative",
    backgroundColor: "transparent",
  },
  bloc: {
    flexDirection: "row",
    width: "104%",
    padding: 10,
    backgroundColor: "white",
    justifyContent: "space-between",
    alignItems: "center",
  },
  image: {
    width: 100,
    height: 100,
  },
  textContainer: {
    right: 40,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
  },
  subscribers: {
    color: "gray",
  },
  menuButton: {
    padding: 10,
    backgroundColor: "gray",
    borderRadius: 5,
  },
  threadButton: {
    color: "white",
  },
  list: {
    top: 10,
    backgroundColor: "#FFFFFF",
    elevation: 5,
  },
  menuItem: {
    padding: 10,
  },
});

export default HomeContent;
