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
import loadingThreadPage from "../assets/loadingThreadPage.gif";
import loadingImageThread from "../assets/loadingImageThread.gif";
import Icon from "react-native-vector-icons/AntDesign";
import { WebView } from "react-native-webview";
import axios from "axios";
import { Video } from "expo-av";
import { LogBox } from "react-native";
import ImageHeaderScrollView, {
  TriggeringView,
} from "react-native-image-header-scroll-view";
import * as Animatable from "react-native-animatable";

LogBox.ignoreLogs(["source.uri should not be an empty string"]);

const HomeDisplay = (props) => {
  var threadId = props.route.params.threadId;
  var subredditName = props.route.params.subRedditName;

  if (threadId == undefined) {
    threadId = props.route.params.params.threadId;
    subredditName = props.route.params.params.subRedditName;
  }

  const [loading, setLoading] = useState();
  const [post, setPost] = useState({});
  const [comments, setComments] = useState([]);
  const [subreddit, setSubreddit] = useState({});
  const [modalVisible, setModalVisible] = useState(false);
  const [loadingImage, setLoadingImage] = useState(false);
  const [bannerImage, setBannerImage] = useState("");
  const [isSubscribed, setIsSubscribed] = useState();
  var score;
  var Fixed = false;
  const [firstLoad, setFirstLoad] = useState(true);
  const navRefView = useRef(null);
  const navFixedView = useRef(null);

  function formatNumber(number) {
    const suffixes = ["", "K", "M", "MM"];
    let suffixIndex = 0;

    while (number >= 1000 && suffixIndex < suffixes.length - 1) {
      number /= 1000;
      suffixIndex++;
    }

    const formattedNumber =
      parseFloat(number.toFixed(2)) + suffixes[suffixIndex];

    return formattedNumber;
  }

  const handleScroll = (event) => {
    const scrollPosition = event.nativeEvent.contentOffset.y;
    if (scrollPosition >= 100 && !Fixed) {
      // déclencher votre événement ici
      setFirstLoad(false);
      navRefView.current.fadeIn(1);
      navFixedView.current.fadeOut(1);
      Fixed = true;
    } else if (scrollPosition < 100 && Fixed) {
      navRefView.current.fadeOut(1);
      navFixedView.current.fadeIn(1);
      Fixed = false;
    }
  };

  const toggleModal = () => {
    setModalVisible(!modalVisible);
  };

  const toggleLoading = () => {
    setLoadingImage(!loadingImage);
  };

  const generateRandomColor = () => {
    const randomColor = Math.floor(Math.random() * 16777215).toString(16);
    return "#" + randomColor;
  };

  const handleSub = async () => {
    var token = await AsyncStorage.getItem("TOKEN");
    console.log(threadId);
    // TODO ajouter les vérifications
    return await axios
      .post(
        `https://oauth.reddit.com/api/vote`,
        {
          dir: 1,
          id: `t3_${threadId}`,
          // rank: 2
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      )
      .then((data) => {
        setIsSubscribed(true);
        return data.data.data;
      });
  };

  const handleUnsub = async () => {
    var token = await AsyncStorage.getItem("TOKEN");
    console.log(threadId);
    // TODO ajouter les vérifications
    return await axios
      .post(
        `https://oauth.reddit.com/api/vote`,
        {
          dir: -1,
          id: `t3_${threadId}`,
          // rank: 2
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      )
      .then((data) => {
        setIsSubscribed(false);
        return data.data.data;
      });
  };

  const fetchComments = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://www.reddit.com/${subredditName}/comments/${threadId}.json`
      );
      const json = await response.json();
      setComments(json[1].data.children);
      await setPost(json[0].data.children[0].data);
      await setPost((prevState) => {
        const updatedPost = {
          ...prevState,
          score: formatNumber(prevState.score),
        };
        return updatedPost;
      });
      await setIsSubscribed(json[0].data.children[0].data.likes);
      console.log(json[0].data.children[0].data.likes);
    } catch (error) {
      console.error(error);
    }
    try {
      const response = await fetch(
        `https://www.reddit.com/${subredditName}/about.json`
      );
      const json = await response.json();
      setSubreddit(json.data);
      setBannerImage(json.data.banner_background_image.split("?")[0]);
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  const handleProfil = (author) => {
    // props.navigation.navigate("HomeProfil", { author: author });
    console.log(props.navigation.navigate);
  };

  const renderComments = (comments) => {
    return (
      <>
        {comments.map((comment) => {
          const replies = comment.data.replies?.data?.children;
          return (
            <View
              key={comment.data.id}
              style={[
                styles.commentContainer,
                { borderColor: generateRandomColor() },
              ]}
            >
              {comment.data.author && comment.data.body ? (
                <View style={styles.commentText}>
                  <TouchableOpacity>
                    <Text style={styles.author}>{comment.data.author}</Text>
                  </TouchableOpacity>
                  <Text style={styles.comment}>{comment.data.body}</Text>
                </View>
              ) : null}
              {replies && renderComments(replies)}
            </View>
          );
        })}
      </>
    );
  };

  useEffect(() => {
    fetchComments();
  }, [threadId]);

  return (
    <>
      <ImageHeaderScrollView
        maxHeight={400}
        minHeight={300}
        fadeOutForeground
        style={{ width: "100%", height: "100%" }}
        overScrollMode="never"
        minOverlayOpacity={0}
        maxOverlayOpacity={0}
        onScroll={handleScroll}
        renderForeground={() => (
          <Animatable.View style={styles.headerAnimated} ref={navFixedView}>
            {!loading && (
              <View style={{ top: 0, width: "100%" }}>
                <View style={styles.subRedditHeader}>
                  <Image
                    style={{ width: 50, height: 50, borderRadius: 30 }}
                    source={{ uri: subreddit ? subreddit.icon_img : null }}
                  />
                  <Text
                    style={{
                      alignItems: "center",
                      color: bannerImage == "" ? "black" : "white",
                      top: 12,
                      left: 5,
                      fontSize: 18,
                      fontWeight: "800",
                    }}
                  >
                    {post.subreddit_name_prefixed}
                  </Text>
                </View>
                <Image
                  source={{ uri: bannerImage }}
                  style={{ width: vh.width, height: 100, resizeMode: "cover" }}
                />
                <Text
                  style={{ color: "black", fontSize: 17, fontWeight: "bold" }}
                >
                  {post.title}
                </Text>
                <View
                  styles={{
                    flexDirection: "row",
                    borderTopWidth: 1,
                    borderBottomWidth: 1,
                  }}
                >
                  {post.is_video == true ? (
                    <Video
                      style={{ width: 300, height: 240, left: 6 }}
                      source={{
                        uri: post.secure_media.reddit_video.fallback_url,
                      }}
                      useNativeControls
                      // resizeMode="contain"
                      isLooping
                    />
                  ) : (
                    <TouchableOpacity
                      onPress={() => {
                        toggleModal();
                        toggleLoading();
                      }}
                      style={styles.icon}
                    >
                      <Image
                        style={styles.icon}
                        source={{
                          uri: `${post.url}`.includes("i.redd.it")
                            ? post.url
                            : post.thumbnail,
                        }}
                      />
                    </TouchableOpacity>
                  )}
                  {`${post.url}`.includes("//i.") ? null : (
                    <TouchableOpacity
                      style={{ bottom: 3, position: "absolute" }}
                      onPress={() => {
                        toggleModal();
                        toggleLoading();
                      }}
                    >
                      <Text>{post.url}</Text>
                    </TouchableOpacity>
                  )}
                  <View
                    style={{
                      color: "black",
                      flexDirection: "column",
                      position: "absolute",
                      right: 20,
                    }}
                  >
                    <TouchableOpacity
                      title="Sub"
                      onPress={handleSub}
                      style={{ top: 60, left: 9 }}
                    >
                      <Icon
                        name="caretup"
                        size={40}
                        color={isSubscribed == true ? "orange" : "gray"}
                        style={{
                          position: "relative",
                        }}
                      />
                      <Text
                        style={{
                          color: "gray",
                          position: "relative",
                          bottom: 10,
                          left: 10,
                        }}
                      >
                        Up
                      </Text>
                    </TouchableOpacity>
                    <Text style={{ top: 60, left: 5 }}>{post.score}</Text>
                    <TouchableOpacity
                      title="Unsub"
                      onPress={handleUnsub}
                      style={{ top: 60, left: 10 }}
                    >
                      <Text
                        style={{ color: "gray", position: "relative", top: 10 }}
                      >
                        Down
                      </Text>
                      <Icon
                        name="caretdown"
                        size={40}
                        color={isSubscribed == false ? "orange" : "gray"}
                        style={{
                          position: "relative",
                        }}
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            )}
          </Animatable.View>
        )}
        renderTouchableFixedForeground={() => (
          <>
            <Animatable.View
              style={{
                height: "100%",
                width: "100%",
                top: 0,
                display: firstLoad ? "none" : "flex",
              }}
              ref={navRefView}
            >
              {!loading && (
                <>
                  <Text
                    style={{
                      color: "black",
                      fontSize: 17,
                      fontWeight: "bold",
                    }}
                  >
                    {post.title}
                  </Text>
                  <View
                    styles={{
                      flexDirection: "row",
                      borderTopWidth: 1,
                      borderBottomWidth: 1,
                    }}
                  >
                    {post.is_video == true ? (
                      <Video
                        style={{ width: 300, height: 240, left: 6 }}
                        source={{
                          uri: post.secure_media.reddit_video.fallback_url,
                        }}
                        useNativeControls
                        // resizeMode="contain"
                        isLooping
                      />
                    ) : (
                      <TouchableOpacity
                        onPress={() => {
                          toggleModal();
                          toggleLoading();
                        }}
                        style={styles.icon}
                      >
                        <Image
                          style={styles.icon}
                          source={{
                            uri: `${post.url}`.includes("i.redd.it")
                              ? post.url
                              : post.thumbnail,
                          }}
                        />
                      </TouchableOpacity>
                    )}
                    {`${post.url}`.includes("//i.") ? null : (
                      <TouchableOpacity
                        style={{ bottom: 3, position: "absolute" }}
                        onPress={() => {
                          toggleModal();
                          toggleLoading();
                        }}
                      >
                        <Text>{post.url}</Text>
                      </TouchableOpacity>
                    )}
                    <View
                      style={{
                        color: "black",
                        flexDirection: "column",
                        position: "absolute",
                        right: 20,
                      }}
                    >
                      <TouchableOpacity
                        title="Sub"
                        onPress={handleSub}
                        style={{ top: 60, left: 9 }}
                      >
                        <Icon
                          name="caretup"
                          size={40}
                          color={isSubscribed == true ? "orange" : "gray"}
                          style={{
                            position: "relative",
                          }}
                        />
                        <Text
                          style={{
                            color: "gray",
                            position: "relative",
                            bottom: 10,
                            left: 10,
                          }}
                        >
                          Up
                        </Text>
                      </TouchableOpacity>
                      <Text style={{ top: 60, left: 5 }}>{post.score}</Text>
                      <TouchableOpacity
                        title="Unsub"
                        onPress={handleUnsub}
                        style={{ top: 60, left: 10 }}
                      >
                        <Text
                          style={{
                            color: "gray",
                            position: "relative",
                            top: 10,
                          }}
                        >
                          Down
                        </Text>
                        <Icon
                          name="caretdown"
                          size={40}
                          color={isSubscribed == false ? "orange" : "gray"}
                          style={{
                            position: "relative",
                          }}
                        />
                      </TouchableOpacity>
                    </View>
                  </View>
                </>
              )}
            </Animatable.View>
          </>
        )}
      >
        <TriggeringView style={{ backgroundColor: "white" }}>
          {!loading && (
            <ScrollView style={styles.container}>
              <View style={{ width: "100%" }}>
                {loadingImage ? (
                  <Image
                    source={loadingImageThread}
                    style={styles.loadingImageThread}
                  />
                ) : null}
                <Modal visible={modalVisible} animationType="slide">
                  {`${post.url}`.includes("//i.") ? (
                    <View style={styles.modalContainer}>
                      <TouchableOpacity
                        onPress={() => {
                          toggleModal();
                          toggleLoading();
                        }}
                      >
                        <Image
                          style={styles.modalImage}
                          source={{
                            uri: `${post.url}`.includes("//i.")
                              ? post.url
                              : post.thumbnail,
                          }}
                        />
                      </TouchableOpacity>
                    </View>
                  ) : (
                    <View style={{ flex: 1 }}>
                      <TouchableOpacity
                        onPress={() => {
                          toggleModal();
                          toggleLoading();
                        }}
                      >
                        <Icon
                          name="closecircleo"
                          size={40}
                          style={{
                            position: "relative",
                            left: 10,
                            zIndex: 1,
                            color: "black",
                          }}
                        />
                      </TouchableOpacity>
                      <WebView source={{ uri: post.url }} style={{ flex: 1 }} />
                    </View>
                  )}
                </Modal>
              </View>
              {renderComments(comments)}
            </ScrollView>
          )}
        </TriggeringView>
      </ImageHeaderScrollView>
      {loading && <Image source={loadingThreadPage} style={styles.loading} />}
    </>
  );
};
export default HomeDisplay;

const vh = Dimensions.get("window");
const styles = StyleSheet.create({
  headerAnimated: {
    top: 0,
    height: "100%",
  },
  subRedditHeader: {
    flexDirection: "row",
    position: "absolute",
    zIndex: 1,
    top: 25,
    left: 15,
  },
  loading: {
    width: 150,
    height: 150,
    bottom: vh.height / 4,
    alignSelf: "center",
    resizeMode: "contain",
    position: "absolute",
  },
  icon: {
    width: 300,
    height: 240,
    left: 6,
    resizeMode: "contain",
  },
  link: {
    color: "blue",
    fontSize: 15,
    fontWeight: "bold",
    bottom: 15,
  },
  loadingImageThread: {
    width: 150,
    height: 150,
    alignSelf: "center",
    resizeMode: "contain",
    position: "absolute",
    top: 60,
  },
  container: {
    padding: 5,
  },
  commentText: {
    backgroundColor: "white",
    padding: 10,
    borderRadius: 10,
  },
  commentContainer: {
    marginLeft: 15,
    marginTop: 10,
    borderLeftWidth: 1,
    borderTopWidth: 1,
    borderRadius: 10,
  },
  modalImage: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
  },
  author: {
    fontWeight: "bold",
  },
  comment: {
    marginTop: 5,
  },
});
