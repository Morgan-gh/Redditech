import { useState, React, useRef } from "react";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { StyleSheet, TextInput, View, Text, Pressable, Image, SafeAreaView, ScrollView, StatusBar } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { Video, AVPlaybackStatus } from 'expo-av';

const SearchScreen = () => {

  const [value_data, setValue] = useState("");
  const video = useRef(null);
  const [status, setStatus] = useState({});

  var ImReady = true;

  const display = (
    <View style={styles.widthVar}>
      <View style={{ width: "100%", flexDirection: "row", justifyContent: "center", padding: 10 }}>
        <Image style={{ width: 200, height: 200, borderRadius: 10 }} source={{ uri: "https://cdn-icons-png.flaticon.com/512/1400/1400850.png" }} />
      </View>
      <View style={{ width: "100%", textAlign: "center", padding: 20 }}>
        <Text style={{ textAlign: "center" }}>Here you can search for SubReddit"s Informations
          or the <Text
            style={{ color: "red", fontWeight: "bold" }}>HOT</Text>/<Text
              style={{ color: "#008FFF", fontWeight: "bold" }}>NEW</Text>/<Text
                style={{ color: "#FFE400", fontWeight: "bold" }}>TOP</Text> and <Text
                  style={{ color: "#00E762", fontWeight: "bold" }}>RISING</Text> Posts on all Reddit</Text>
      </View>
    </View>
  )

  const [ChangePage, setChangePage] = useState(display);

  const [styleHot, setStyleHot] = useState("white");
  const [styleTextHot, setStyleTextHot] = useState("red");

  const [styleNew, setStyleNew] = useState("white");
  const [styleTextNew, setStyleTextNew] = useState("#008FFF");

  const [styleTop, setStyleTop] = useState("white");
  const [styleTextTop, setStyleTextTop] = useState("#FFE400");

  const [styleRising, setStyleRising] = useState("white");
  const [styleTextRising, setStyleTextRising] = useState("#00E762");

  const [afterHot, setAfterHot] = useState();
  const [afterNew, setAfterNew] = useState();
  const [afterTop, setAfterTop] = useState();
  const [afterRising, setAfterRising] = useState();

  const max = 10;

  const scrollViewRef = useRef(null);

  const [ImHot, setImHot] = useState(false);
  const [ImNew, setImNew] = useState(false);
  const [ImTop, setImTop] = useState(false);
  const [ImRising, setImRising] = useState(false);

  const [arrayToDisplayHot, setArrayHot] = useState([]);
  const [arrayToDisplayTop, setArrayTop] = useState([]);
  const [arrayToDisplayNew, setArrayNew] = useState([]);
  const [arrayToDisplayRising, setArrayRising] = useState([]);

  const urlHot = "https://oauth.reddit.com/r/all/hot?limit=10";
  const urlNew = "https://oauth.reddit.com/r/all/new?limit=10";
  const urlTop = "https://oauth.reddit.com/r/all/top?limit=10";
  const urlRising = "https://oauth.reddit.com/r/all/rising?limit=10";
  const urlSub = "https://oauth.reddit.com/api/subscribe";

  const handleSub = async () => {

    setArrayNew([])
    setArrayTop([])
    setArrayRising([])
    setArrayHot([])

    let token = await AsyncStorage.getItem("TOKEN");

    const config = {
      method: "POST",
      url: urlSub,
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/x-www-form-urlencoded"
      },
      data: {
        "action": "sub",
        "sr_name": value_data
      }
    };

    await axios(config).then(reponse => {
      handleSearch()


    }).catch((error) => {
      console.log(error);
    })
  }

  const handleUnsub = async () => {

    let token = await AsyncStorage.getItem("TOKEN");

    const config = {
      method: "POST",
      url: urlSub,
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/x-www-form-urlencoded"
      },
      data: {
        "action": "unsub",
        "sr_name": value_data
      }
    };
    await axios(config).then(reponse => {
      handleSearch()


    }).catch((error) => {
      console.log(error);
    })
  }

  const handleSearch = async () => {

    setStyleHot("white");
    setStyleTextHot("red");
    setStyleNew("white");
    setStyleTextNew("#008FFF");
    setStyleTop("white");
    setStyleTextTop("#FFE400");
    setStyleRising("white");
    setStyleTextRising("#00E762");

    setImHot(false);
    setImNew(false);
    setImTop(false);
    setImRising(false);

    let token = await AsyncStorage.getItem("TOKEN");

    const config = {
      method: "GET",
      url: `https://oauth.reddit.com/r/${value_data}/about`,
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    };

    await axios(config).then(reponse => {

      console.log("🥶🥶🥶🥶🥶🥶🥶 " + JSON.stringify(reponse));

      let subunsub = reponse.data.data.user_is_subscriber;

      if (reponse.data.data.community_icon === "" && reponse.data.data.icon_img === "") {
        var variableSub = (
          <View style={styles.widthVar}>
            <View style={styles.headerSub}>
              <View style={styles.headerImage}>
                <Image style={{ width: 100, height: 100, borderRadius: 10 }} source={{ uri: "https://cdn-icons-png.flaticon.com/512/7465/7465691.png" }} />
              </View>
              <View style={styles.headerText}>
                <Text>{reponse.data.data.display_name_prefixed}</Text>
                <Text>{reponse.data.data.title}</Text>
                <Text>Subcribers : {reponse.data.data.subscribers}</Text>
                <Text>Active Users : {reponse.data.data.active_user_count}</Text>
                {subunsub ? (
                  <Pressable style={styles.pressableSub} onPress={handleUnsub}>
                    <Text style={{ textAlign: "center", fontSize: 15 }}>Unsub</Text>
                  </Pressable>
                ) : (
                  <Pressable style={styles.pressableUnsub} onPress={handleSub}>
                    <Text style={{ textAlign: "center", fontSize: 15 }}>Sub</Text>
                  </Pressable>
                )}
              </View>
            </View>
            <Text>{reponse.data.data.public_description}</Text>
          </View>
        )
      }

      else if (reponse.data.data.icon_img === "") {

        var variableSub = (
          <View style={styles.widthVar}>
            <View style={styles.headerSub}>
              <View style={styles.headerImage}>
                <Image style={{ width: 100, height: 100, borderRadius: 10 }} source={{ uri: reponse.data.data.community_icon.slice(0, String(reponse.data.data.community_icon).indexOf("?")) }} />
              </View>
              <View style={styles.headerText}>
                <Text>{reponse.data.data.display_name_prefixed}</Text>
                <Text>{reponse.data.data.title}</Text>
                <Text>Subcribers : {reponse.data.data.subscribers}</Text>
                <Text>Active Users : {reponse.data.data.active_user_count}</Text>
                {subunsub ? (
                  <Pressable style={styles.pressableSub} onPress={handleUnsub}>
                    <Text style={{ textAlign: "center", fontSize: 15 }}>Unsub</Text>
                  </Pressable>
                ) : (
                  <Pressable style={styles.pressableUnsub} onPress={handleSub}>
                    <Text style={{ textAlign: "center", fontSize: 15 }}>Sub</Text>
                  </Pressable>
                )}
              </View>
            </View>
            <Text>{reponse.data.data.public_description}</Text>
          </View>
        )

      }

      else if (reponse.data.data.community_icon === "") {

        var variableSub = (
          <View style={styles.widthVar}>
            <View style={styles.headerSub}>
              <View style={styles.headerImage}>
                <Image style={{ width: 100, height: 100, borderRadius: 10 }} source={{ uri: reponse.data.data.icon_img }} />
              </View>
              <View style={styles.headerText}>
                <Text>{reponse.data.data.display_name_prefixed}</Text>
                <Text>{reponse.data.data.title}</Text>
                <Text>Subcribers : {reponse.data.data.subscribers}</Text>
                <Text>Active Users : {reponse.data.data.active_user_count}</Text>
                {subunsub ? (
                  <Pressable style={styles.pressableSub} onPress={handleUnsub}>
                    <Text style={{ textAlign: "center", fontSize: 15 }}>Unsub</Text>
                  </Pressable>
                ) : (
                  <Pressable style={styles.pressableUnsub} onPress={handleSub}>
                    <Text style={{ textAlign: "center", fontSize: 15 }}>Sub</Text>
                  </Pressable>
                )}
              </View>
            </View>
            <Text>{reponse.data.data.public_description}</Text>
          </View>
        )
      }

      else {
        var variableSub = (
          <View style={styles.widthVar}>
            <View style={styles.headerSub}>
              <View style={styles.headerImage}>
                <Image style={{ width: 100, height: 100, borderRadius: 10 }} source={{ uri: reponse.data.data.community_icon.slice(0, String(reponse.data.data.community_icon).indexOf("?")) }} />
              </View>
              <View style={styles.headerText}>
                <Text>{reponse.data.data.display_name_prefixed}</Text>
                <Text>{reponse.data.data.title}</Text>
                <Text>Subcribers : {reponse.data.data.subscribers}</Text>
                <Text>Active Users : {reponse.data.data.active_user_count}</Text>
                {subunsub ? (
                  <Pressable style={styles.pressableSub} onPress={handleUnsub}>
                    <Text style={{ textAlign: "center", fontSize: 15 }}>Unsub</Text>
                  </Pressable>
                ) : (
                  <Pressable style={styles.pressableUnsub} onPress={handleSub}>
                    <Text style={{ textAlign: "center", fontSize: 15 }}>Sub</Text>
                  </Pressable>
                )}
              </View>
            </View>
            <Text>{reponse.data.data.public_description}</Text>
          </View>
        )
      }

      setChangePage(variableSub);

    }).catch(error => {
      console.log("🚨SUB_ERROR🚨 " + error);

      const variableSubError = (
        <View style={styles.widthVar}>
          <View style={styles.hotError}>
            <Image style={{ width: 100, height: 100 }} source={{ uri: "https://www.redditinc.com/assets/images/site/value_evolve.png" }} />
            <Text>This SubReddit doesn"t exist !</Text>
          </View>
        </View>
      )

      setChangePage(variableSubError);
    })
  }

  const handleHot = async () => {

    setArrayNew([])
    setArrayTop([])
    setArrayRising([])

    setStyleHot("red");
    setStyleTextHot("white");

    setStyleNew("white");
    setStyleTextNew("#008FFF");
    setStyleTop("white");
    setStyleTextTop("#FFE400");
    setStyleRising("white");
    setStyleTextRising("#00E762");

    setImHot(true);
    setImNew(false);
    setImTop(false);
    setImRising(false);

    let token = await AsyncStorage.getItem("TOKEN");

    const config = {
      method: "GET",
      url: urlHot,
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    };

    await axios(config).then(reponse => {

      setAfterHot(reponse.data.data.after)

      for (let min = 0; min < max; min++) {

        if (reponse.data.data.children[min].data.is_video) {

          var variableHot = (
            <View style={styles.widthVar} key={reponse.data.data.children[min].data.id}>
              <View style={styles.containVID}>
                <Text>{reponse.data.data.children[min].data.title}</Text>
                <Text>{reponse.data.data.children[min].data.subreddit_name_prefixed}</Text>
                <Text>{reponse.data.data.children[min].data.ups}<Ionicons name="caret-up-outline" size={20} color="tomato" /></Text>
              </View>
              <View>
                <Video
                  ref={video}
                  style={styles.video}
                  source={{
                    uri: reponse.data.data.children[min].data.secure_media.reddit_video.fallback_url,
                  }}
                  useNativeControls
                  resizeMode="contain"
                  isLooping
                  onPlaybackStatusUpdate={status => setStatus(() => status)}
                />
              </View>
            </View>
          )
        }

        else if (reponse.data.data.children[min].data.hasOwnProperty("preview")) {

          let url = reponse.data.data.children[min].data.preview.images[0].source.url

          var variableHot = (
            <View style={styles.widthVar} key={reponse.data.data.children[min].data.id}>
              <View style={styles.contain}>
                <Image style={{ width: 200, height: 200, borderRadius: 10 }} source={{ uri: url.replace("amp;", "").replace("amp;", "") }} />
                <View style={{ textAlign: "center" }}>
                  <Text>{reponse.data.data.children[min].data.subreddit_name_prefixed}</Text>
                  <Text>{reponse.data.data.children[min].data.ups}<Ionicons name="caret-up-outline" size={20} color="tomato" /></Text>
                </View>
              </View>
              <Text>{reponse.data.data.children[min].data.title}</Text>
            </View>
          )
        }
        else {
          var variableHot = (
            <View style={styles.widthVar} key={reponse.data.data.children[min].data.id}>
              <Text>{reponse.data.data.children[min].data.title}</Text>
              <Text>{reponse.data.data.children[min].data.subreddit_name_prefixed}</Text>
            </View>
          )
        }

        arrayToDisplayHot.push(variableHot)

      }

      setChangePage(arrayToDisplayHot);

    }).catch(error => {
      console.log("🔥HOT_ERROR🔥 " + error);

      const variableHotError = (
        <View style={styles.widthVar}>
          <View style={styles.hotError}>
            <Image style={{ width: 100, height: 100 }} source={{ uri: "https://cdn-icons-png.flaticon.com/512/785/785116.png" }} />
            <Text>Post Not Avaible</Text>
          </View>
        </View>
      )

      setChangePage(variableHotError);
    })
  }

  const handleNew = async () => {

    setArrayHot([])
    setArrayTop([])
    setArrayRising([])

    setStyleNew("#008FFF");
    setStyleTextNew("white");

    setStyleHot("white");
    setStyleTextHot("red");
    setStyleTop("white");
    setStyleTextTop("#FFE400");
    setStyleRising("white");
    setStyleTextRising("#00E762");

    setImHot(false);
    setImNew(true);
    setImTop(false);
    setImRising(false);

    let token = await AsyncStorage.getItem("TOKEN");

    const config = {
      method: "GET",
      url: urlNew,
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    }

    await axios(config).then(reponse => {

      setAfterNew(reponse.data.data.after)

      for (let min = 0; min < max; min++) {

        if (reponse.data.data.children[min].data.is_video) {

          var variableNew = (
            <View style={styles.widthVar} key={reponse.data.data.children[min].data.id}>
              <View style={styles.containVID}>
                <Text>{reponse.data.data.children[min].data.title}</Text>
                <Text>{reponse.data.data.children[min].data.subreddit_name_prefixed}</Text>
                <Text>{reponse.data.data.children[min].data.ups}<Ionicons name="caret-up-outline" size={20} color="tomato" /></Text>
              </View>
              <View>
                <Video
                  ref={video}
                  style={styles.video}
                  source={{
                    uri: reponse.data.data.children[min].data.secure_media.reddit_video.fallback_url,
                  }}
                  useNativeControls
                  resizeMode="contain"
                  isLooping
                  onPlaybackStatusUpdate={status => setStatus(() => status)}
                />
              </View>
            </View>
          )
        }

        else if (reponse.data.data.children[min].data.hasOwnProperty("preview")) {

          let url = reponse.data.data.children[min].data.preview.images[0].source.url

          var variableNew = (
            <View style={styles.widthVar} key={reponse.data.data.children[min].data.id}>
              <View style={styles.contain}>
                <Image style={{ width: 200, height: 200, borderRadius: 10 }} source={{ uri: url.replace("amp;", "").replace("amp;", "") }} />
                <View style={{ textAlign: "center" }}>
                  <Text>{reponse.data.data.children[min].data.subreddit_name_prefixed}</Text>
                  <Text>{reponse.data.data.children[min].data.ups}<Ionicons name="caret-up-outline" size={20} color="tomato" /></Text>
                </View>
              </View>
              <Text>{reponse.data.data.children[min].data.title}</Text>
            </View>
          )
        }
        else {
          var variableNew = (
            <View style={styles.widthVar} key={reponse.data.data.children[min].data.id}>
              <Text>{reponse.data.data.children[min].data.title}</Text>
              <Text>{reponse.data.data.children[min].data.subreddit_name_prefixed}</Text>
            </View>
          )
        }

        arrayToDisplayNew.push(variableNew)
      }

      setChangePage(arrayToDisplayNew);

    }).catch(error => {
      console.log("📰NEW_ERROR📰 " + error);

      const variableNewError = (
        <View>
          <View style={styles.widthVar}>
            <View style={styles.hotError}>
              <Image style={{ width: 100, height: 100 }} source={{ uri: "https://cdn-icons-png.flaticon.com/512/741/741867.png" }} />
              <Text>Post Not Avaible</Text>
            </View>
          </View>
        </View>
      )

      setChangePage(variableNewError);
    })
  }

  const handleTop = async () => {

    setArrayNew([])
    setArrayHot([])
    setArrayRising([])

    setStyleTop("#FFE400");
    setStyleTextTop("white")

    setStyleHot("white");
    setStyleTextHot("red");
    setStyleNew("white");
    setStyleTextNew("#008FFF");
    setStyleRising("white");
    setStyleTextRising("#00E762");

    setImHot(false);
    setImNew(false);
    setImTop(true);
    setImRising(false);

    let token = await AsyncStorage.getItem("TOKEN");

    const config = {
      method: "GET",
      url: urlTop,
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    };

    await axios(config).then(reponse => {

      setAfterTop(reponse.data.data.after)

      for (let min = 0; min < max; min++) {

        if (reponse.data.data.children[min].data.is_video) {

          var variableTop = (
            <View style={styles.widthVar} key={reponse.data.data.children[min].data.id}>
              <View style={styles.containVID}>
                <Text>{reponse.data.data.children[min].data.title}</Text>
                <Text>{reponse.data.data.children[min].data.subreddit_name_prefixed}</Text>
                <Text>{reponse.data.data.children[min].data.ups}<Ionicons name="caret-up-outline" size={20} color="tomato" /></Text>
              </View>
              <View>
                <Video
                  ref={video}
                  style={styles.video}
                  source={{
                    uri: reponse.data.data.children[min].data.secure_media.reddit_video.fallback_url,
                  }}
                  useNativeControls
                  resizeMode="contain"
                  isLooping
                  onPlaybackStatusUpdate={status => setStatus(() => status)}
                />
              </View>
            </View>
          )
        }

        else if (reponse.data.data.children[min].data.hasOwnProperty("preview")) {

          let url = reponse.data.data.children[min].data.preview.images[0].source.url

          var variableTop = (
            <View style={styles.widthVar} key={reponse.data.data.children[min].data.id}>
              <View style={styles.contain}>
                <Image style={{ width: 200, height: 200, borderRadius: 10 }} source={{ uri: url.replace("amp;", "").replace("amp;", "") }} />
                <View style={{ textAlign: "center" }}>
                  <Text>{reponse.data.data.children[min].data.subreddit_name_prefixed}</Text>
                  <Text>{reponse.data.data.children[min].data.ups}<Ionicons name="caret-up-outline" size={20} color="tomato" /></Text>
                </View>
              </View>
              <Text>{reponse.data.data.children[min].data.title}</Text>
            </View>
          )
        }
        else {
          var variableTop = (
            <View style={styles.widthVar} key={reponse.data.data.children[min].data.id}>
              <Text>{reponse.data.data.children[min].data.title}</Text>
              <Text>{reponse.data.data.children[min].data.subreddit_name_prefixed}</Text>
            </View>
          )
        }

        arrayToDisplayTop.push(variableTop)
      }

      setChangePage(arrayToDisplayTop);

    }).catch(error => {
      console.log("🏆TOP_ERROR🏆 " + error);

      const variableTopError = (
        <View>
          <View style={styles.widthVar}>
            <View style={styles.hotError}>
              <Image style={{ width: 100, height: 100 }} source={{ uri: "https://cdn-icons-png.flaticon.com/512/1486/1486474.png" }} />
              <Text>Post Not Avaible</Text>
            </View>
          </View>
        </View>
      )

      setChangePage(variableTopError);
    })
  }


  const handleRising = async () => {

    setArrayNew([])
    setArrayTop([])
    setArrayHot([])

    setStyleRising("#00E762");
    setStyleTextRising("white");

    setStyleHot("white");
    setStyleTextHot("red");
    setStyleNew("white");
    setStyleTextNew("#008FFF");
    setStyleTop("white");
    setStyleTextTop("#FFE400")

    setImHot(false);
    setImNew(false);
    setImTop(false);
    setImRising(true);

    let token = await AsyncStorage.getItem("TOKEN");

    const config = {
      method: "GET",
      url: urlRising,
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    }

    await axios(config).then(reponse => {

      setAfterRising(reponse.data.data.after)

      for (let min = 0; min < max; min++) {

        if (reponse.data.data.children[min].data.is_video) {

          var variableRising = (
            <View style={styles.widthVar} key={reponse.data.data.children[min].data.id}>
              <View style={styles.containVID}>
                <Text>{reponse.data.data.children[min].data.title}</Text>
                <Text>{reponse.data.data.children[min].data.subreddit_name_prefixed}</Text>
                <Text>{reponse.data.data.children[min].data.ups}<Ionicons name="caret-up-outline" size={20} color="tomato" /></Text>
              </View>
              <View>
                <Video
                  ref={video}
                  style={styles.video}
                  source={{
                    uri: reponse.data.data.children[min].data.secure_media.reddit_video.fallback_url,
                  }}
                  useNativeControls
                  resizeMode="contain"
                  isLooping
                  onPlaybackStatusUpdate={status => setStatus(() => status)}
                />
              </View>
            </View>
          )
        }

        else if (reponse.data.data.children[min].data.hasOwnProperty("preview")) {

          let url = reponse.data.data.children[min].data.preview.images[0].source.url

          var variableRising = (
            <View style={styles.widthVar} key={reponse.data.data.children[min].data.id}>
              <View style={styles.contain}>
                <Image style={{ width: 200, height: 200, borderRadius: 10 }} source={{ uri: url.replace("amp;", "").replace("amp;", "") }} />
                <View style={{ textAlign: "center" }}>
                  <Text>{reponse.data.data.children[min].data.subreddit_name_prefixed}</Text>
                  <Text>{reponse.data.data.children[min].data.ups}<Ionicons name="caret-up-outline" size={20} color="tomato" /></Text>
                </View>
              </View>
              <Text>{reponse.data.data.children[min].data.title}</Text>
            </View>
          )
        }
        else {
          var variableRising = (
            <View style={styles.widthVar} key={reponse.data.data.children[min].data.id}>
              <Text>{reponse.data.data.children[min].data.title}</Text>
              <Text>{reponse.data.data.children[min].data.subreddit_name_prefixed}</Text>
            </View>
          )
        }

        arrayToDisplayRising.push(variableRising)
      }

      setChangePage(arrayToDisplayRising);

    }).catch(error => {
      console.log("↗️RISING_ERROR↗️ " + error);

      const variableRisingError = (
        <View>
          <View style={styles.widthVar}>
            <View style={styles.hotError}>
              <Image style={{ width: 100, height: 100 }} source={{ uri: "https://cdn-icons-png.flaticon.com/512/1007/1007266.png" }} />
              <Text>Post Not Avaible</Text>
            </View>
          </View>
        </View>
      )

      setChangePage(variableRisingError);
    })
  }

  const handleScroll = async (event) => {
    event.persist();

    if (event.nativeEvent.contentOffset.y >= (event.nativeEvent.contentSize.height - 2 - (event.nativeEvent.layoutMeasurement.height))) {

      var token = await AsyncStorage.getItem("TOKEN");


      if (ImHot && ImReady) {

        ImReady = false
        const config = {
          method: "GET",
          url: urlHot + "&after=" + afterHot,
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        }
        await axios(config).then(reponse => {

          setAfterHot(reponse.data.data.after)

          for (let min = 0; min < max; min++) {

            if (reponse.data.data.children[min].data.is_video) {

              var variableHot = (
                <View style={styles.widthVar} key={reponse.data.data.children[min].data.id}>
                  <View style={styles.containVID}>
                    <Text>{reponse.data.data.children[min].data.title}</Text>
                    <Text>{reponse.data.data.children[min].data.subreddit_name_prefixed}</Text>
                    <Text>{reponse.data.data.children[min].data.ups}<Ionicons name="caret-up-outline" size={20} color="tomato" /></Text>
                  </View>
                  <View>
                    <Video
                      ref={video}
                      style={styles.video}
                      source={{
                        uri: reponse.data.data.children[min].data.secure_media.reddit_video.fallback_url,
                      }}
                      useNativeControls
                      resizeMode="contain"
                      isLooping
                      onPlaybackStatusUpdate={status => setStatus(() => status)}
                    />
                  </View>
                </View>
              )
            }

            else if (reponse.data.data.children[min].data.hasOwnProperty("preview")) {

              let url = reponse.data.data.children[min].data.preview.images[0].source.url

              var variableHot = (
                <View style={styles.widthVar} key={reponse.data.data.children[min].data.id}>
                  <View style={styles.contain}>
                    <Image style={{ width: 200, height: 200, borderRadius: 10 }} source={{ uri: url.replace("amp;", "").replace("amp;", "") }} />
                    <View style={{ textAlign: "center" }}>
                      <Text>{reponse.data.data.children[min].data.subreddit_name_prefixed}</Text>
                      <Text>{reponse.data.data.children[min].data.ups}<Ionicons name="caret-up-outline" size={20} color="tomato" /></Text>
                    </View>
                  </View>
                  <Text>{reponse.data.data.children[min].data.title}</Text>
                </View>
              )
            }
            else {
              var variableHot = (
                <View style={styles.widthVar} key={reponse.data.data.children[min].data.id}>
                  <Text>{reponse.data.data.children[min].data.title}</Text>
                  <Text>{reponse.data.data.children[min].data.subreddit_name_prefixed}</Text>
                </View>
              )
            }

            setArrayHot(arrayToDisplayHot => [...arrayToDisplayHot, variableHot]);
          }

          setChangePage(arrayToDisplayHot);

        }).catch(error => {
          console.log(error);
        })
        ImReady = true;
      }
      else if (ImNew && ImReady) {

        ImReady = false
        const config = {
          method: "GET",
          url: urlNew + "&after=" + afterNew,
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        }
        await axios(config).then(reponse => {

          setAfterNew(reponse.data.data.after)

          for (let min = 0; min < max; min++) {

            if (reponse.data.data.children[min].data.is_video) {

              var variableNew = (
                <View style={styles.widthVar} key={reponse.data.data.children[min].data.id}>
                  <View style={styles.containVID}>
                    <Text>{reponse.data.data.children[min].data.title}</Text>
                    <Text>{reponse.data.data.children[min].data.subreddit_name_prefixed}</Text>
                    <Text>{reponse.data.data.children[min].data.ups}<Ionicons name="caret-up-outline" size={20} color="tomato" /></Text>
                  </View>
                  <View>
                    <Video
                      ref={video}
                      style={styles.video}
                      source={{
                        uri: reponse.data.data.children[min].data.secure_media.reddit_video.fallback_url,
                      }}
                      useNativeControls
                      resizeMode="contain"
                      isLooping
                      onPlaybackStatusUpdate={status => setStatus(() => status)}
                    />
                  </View>
                </View>
              )
            }

            else if (reponse.data.data.children[min].data.hasOwnProperty("preview")) {

              let url = reponse.data.data.children[min].data.preview.images[0].source.url

              var variableNew = (
                <View style={styles.widthVar} key={reponse.data.data.children[min].data.id}>
                  <View style={styles.contain}>
                    <Image style={{ width: 200, height: 200, borderRadius: 10 }} source={{ uri: url.replace("amp;", "").replace("amp;", "") }} />
                    <View style={{ textAlign: "center" }}>
                      <Text>{reponse.data.data.children[min].data.subreddit_name_prefixed}</Text>
                      <Text>{reponse.data.data.children[min].data.ups}<Ionicons name="caret-up-outline" size={20} color="tomato" /></Text>
                    </View>
                  </View>
                  <Text>{reponse.data.data.children[min].data.title}</Text>
                </View>
              )
            }
            else {
              var variableNew = (
                <View style={styles.widthVar} key={reponse.data.data.children[min].data.id}>
                  <Text>{reponse.data.data.children[min].data.title}</Text>
                  <Text>{reponse.data.data.children[min].data.subreddit_name_prefixed}</Text>
                </View>
              )
            }

            setArrayNew(arrayToDisplayNew => [...arrayToDisplayNew, variableNew]);
          }

          setChangePage(arrayToDisplayNew);

        }).catch(error => {
          console.log(error);
        })
        ImReady = true;
      }
      else if (ImTop && ImReady) {

        ImReady = false
        const config = {
          method: "GET",
          url: urlTop + "&after=" + afterTop,
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        }
        await axios(config).then(reponse => {

          setAfterTop(reponse.data.data.after)

          for (let min = 0; min < max; min++) {

            if (reponse.data.data.children[min].data.is_video) {

              var variableTop = (
                <View style={styles.widthVar} key={reponse.data.data.children[min].data.id}>
                  <View style={styles.containVID}>
                    <Text>{reponse.data.data.children[min].data.title}</Text>
                    <Text>{reponse.data.data.children[min].data.subreddit_name_prefixed}</Text>
                    <Text>{reponse.data.data.children[min].data.ups}<Ionicons name="caret-up-outline" size={20} color="tomato" /></Text>
                  </View>
                  <View>
                    <Video
                      ref={video}
                      style={styles.video}
                      source={{
                        uri: reponse.data.data.children[min].data.secure_media.reddit_video.fallback_url,
                      }}
                      useNativeControls
                      resizeMode="contain"
                      isLooping
                      onPlaybackStatusUpdate={status => setStatus(() => status)}
                    />
                  </View>
                </View>
              )
            }

            else if (reponse.data.data.children[min].data.hasOwnProperty("preview")) {

              let url = reponse.data.data.children[min].data.preview.images[0].source.url

              var variableTop = (
                <View style={styles.widthVar} key={reponse.data.data.children[min].data.id}>
                  <View style={styles.contain}>
                    <Image style={{ width: 200, height: 200, borderRadius: 10 }} source={{ uri: url.replace("amp;", "").replace("amp;", "") }} />
                    <View style={{ textAlign: "center" }}>
                      <Text>{reponse.data.data.children[min].data.subreddit_name_prefixed}</Text>
                      <Text>{reponse.data.data.children[min].data.ups}<Ionicons name="caret-up-outline" size={20} color="tomato" /></Text>
                    </View>
                  </View>
                  <Text>{reponse.data.data.children[min].data.title}</Text>
                </View>
              )
            }
            else {
              var variableTop = (
                <View style={styles.widthVar} key={reponse.data.data.children[min].data.id}>
                  <Text>{reponse.data.data.children[min].data.title}</Text>
                  <Text>{reponse.data.data.children[min].data.subreddit_name_prefixed}</Text>
                </View>
              )
            }

            setArrayTop(arrayToDisplayTop => [...arrayToDisplayTop, variableTop]);
          }

          setChangePage(arrayToDisplayTop);

        }).catch(error => {
          console.log(error);
        })
        ImReady = true;
      }
      else if (ImRising && ImReady) {

        ImReady = false
        const config = {
          method: "GET",
          url: urlRising + "&after=" + afterRising,
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        }
        await axios(config).then(reponse => {

          setAfterRising(reponse.data.data.after)

          for (let min = 0; min < max; min++) {

            if (reponse.data.data.children[min].data.is_video) {

              var variableRising = (
                <View style={styles.widthVar} key={reponse.data.data.children[min].data.id}>
                  <View style={styles.containVID}>
                    <Text>{reponse.data.data.children[min].data.title}</Text>
                    <Text>{reponse.data.data.children[min].data.subreddit_name_prefixed}</Text>
                    <Text>{reponse.data.data.children[min].data.ups}<Ionicons name="caret-up-outline" size={20} color="tomato" /></Text>
                  </View>
                  <View>
                    <Video
                      ref={video}
                      style={styles.video}
                      source={{
                        uri: reponse.data.data.children[min].data.secure_media.reddit_video.fallback_url,
                      }}
                      useNativeControls
                      resizeMode="contain"
                      isLooping
                      onPlaybackStatusUpdate={status => setStatus(() => status)}
                    />
                  </View>
                </View>
              )
            }

            else if (reponse.data.data.children[min].data.hasOwnProperty("preview")) {

              let url = reponse.data.data.children[min].data.preview.images[0].source.url

              var variableRising = (
                <View style={styles.widthVar} key={reponse.data.data.children[min].data.id}>
                  <View style={styles.contain}>
                    <Image style={{ width: 200, height: 200, borderRadius: 10 }} source={{ uri: url.replace("amp;", "").replace("amp;", "") }} />
                    <View style={{ textAlign: "center" }}>
                      <Text>{reponse.data.data.children[min].data.subreddit_name_prefixed}</Text>
                      <Text>{reponse.data.data.children[min].data.ups}<Ionicons name="caret-up-outline" size={20} color="tomato" /></Text>
                    </View>
                  </View>
                  <Text>{reponse.data.data.children[min].data.title}</Text>
                </View>
              )
            }
            else {
              var variableRising = (
                <View style={styles.widthVar} key={reponse.data.data.children[min].data.id}>
                  <Text>{reponse.data.data.children[min].data.title}</Text>
                  <Text>{reponse.data.data.children[min].data.subreddit_name_prefixed}</Text>
                </View>
              )
            }

            setArrayRising(arrayToDisplayRising => [...arrayToDisplayRising, variableRising]);
          }

          setChangePage(arrayToDisplayRising);

        }).catch(error => {
          console.log(error);
        })
        ImReady = true;
      }
    }
  }

  return (
    <>
      <View style={styles.row}>
        <View style={styles.searchSection}>
          <Ionicons style={styles.searchIcon} name="search" size={25} color="black" />
          <TextInput style={styles.search} placeholder="Search SubReddit here !" onChangeText={(value) => setValue(value)}></TextInput>
          <Pressable style={styles.but} onPress={handleSearch}>
            <Text style={styles.align}>Send</Text>
          </Pressable>
        </View>
        <View style={styles.headerButtons}>
          <Pressable style={[styles.butHot, { backgroundColor: styleHot }]} onPress={handleHot}>
            <Text style={[styles.alignHot, { color: styleTextHot }]}>Hot</Text>
          </Pressable>
          <Pressable style={[styles.butNew, { backgroundColor: styleNew }]} onPress={handleNew}>
            <Text style={[styles.alignNew, { color: styleTextNew }]}>New</Text>
          </Pressable>
          <Pressable style={[styles.butTop, { backgroundColor: styleTop }]} onPress={handleTop}>
            <Text style={[styles.alignTop, { color: styleTextTop }]}>Top</Text>
          </Pressable>
          <Pressable style={[styles.butRising, { backgroundColor: styleRising }]} onPress={handleRising}>
            <Text style={[styles.alignRising, { color: styleTextRising }]}>Rising</Text>
          </Pressable>
        </View>
      </View>
      <SafeAreaView style={styles.container_main}>
        <ScrollView style={styles.scrollView} ref={scrollViewRef} onScroll={handleScroll}>
          {ChangePage}
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  pressableSub: {
    backgroundColor: "tomato",
    padding: 7,
    width: "35%",
    marginTop: 15,
    borderRadius: 10,
    marginLeft: "2%"
  },
  pressableUnsub: {
    backgroundColor: "#00E762",
    padding: 7,
    width: "35%",
    marginTop: 15,
    borderRadius: 10,
    marginLeft: "2%"
  },
  containVID: {
    width: "100%",
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 10,
    marginBottom: 10
  },
  contain: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 10,
    marginBottom: 10
  },
  hotError: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
  },
  backgroundVideo: {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  video: {
    alignSelf: "center",
    width: 320,
    height: 200,
  },
  container_main: {
    flex: 1,
    paddingTop: StatusBar.currentHeight,
  },
  scrollView: {
    backgroundColor: "transparent",
  },
  row: {
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#DCDCDc",
    paddingBottom: 10,
    paddingTop: 55,
  },
  but: {
    padding: 10,
    width: "20%",
    borderRadius: 100,
    backgroundColor: "tomato"
  },
  butHot: {
    padding: 10,
    borderWidth: 1,
    width: "20%",
    borderRadius: 100,
    borderColor: "red",
  },
  butNew: {
    padding: 10,
    borderWidth: 1,
    width: "20%",
    borderRadius: 100,
    borderColor: "#008FFF",
  },
  butTop: {
    padding: 10,
    borderWidth: 1,
    width: "20%",
    borderRadius: 100,
    borderColor: "#FFE400",
  },
  butRising: {
    padding: 10,
    borderWidth: 1,
    width: "20%",
    borderRadius: 100,
    borderColor: "#00E762",
  },
  searchSection: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
  },
  search: {
    width: "60%",
    borderWidth: 1,
    borderColor: "tomato",
    padding: 10,
    borderRadius: 100,
  },
  headerButtons: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    padding: 10,
    paddingTop: 15,
  },
  align: {
    textAlign: "center",
    color: "black",
  },
  alignHot: {
    textAlign: "center",
    color: "red"
  },
  alignNew: {
    textAlign: "center",
    color: "#008FFF"
  },
  alignTop: {
    textAlign: "center",
    color: "#FFE400"
  },
  alignRising: {
    textAlign: "center",
    color: "#00E762"
  },
  searchIcon: {
    fontSize: 30,
  },
  widthVar: {
    marginTop: 40,
    width: "90%",
    marginLeft: "5%",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: "#DCDCDC"
  },
  headerSub: {
    width: "100%",
    flexDirection: "row",
    paddingBottom: 15
  },
  headerImage: {
    width: "35%"
  },
  headerText: {
    width: "60%",
  },
  color: {
    borderColor: "red"
  }
});

export default SearchScreen;