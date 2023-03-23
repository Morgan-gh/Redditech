// =====
// Basics Requirements for this Page :
//   • Display the user’s profile. The bare minimum is to display the profile picture, username, and description
//   • Display at least 6 of the user’s settings
//   • Be able to update at least 6 of the user’s settings
// =====

// =====
// Import des librairies nécessaires
// =====
import { useState, React, useEffect } from 'react';
import { Switch, View, Text, Image, Pressable, StyleSheet, SafeAreaView, ScrollView, StatusBar } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { SelectList } from 'react-native-dropdown-select-list'
import loading from "../../assets/loading.gif";

const UserScreen = (props) => {
  // =====
  // Création des Hooks
  // =====
  const [username, setUsername] = useState("");
  const [description, setDescription] = useState("");
  const [image_profil, setImageProfil] = useState("../../assets/user.png");
  const [privateFrom, setPrivateFrom] = useState("");
  const [privateFromApi, setPrivateFromApi] = useState("");
  const [language, setLanguage] = useState("");
  const [languageApi, setLanguageApi] = useState("");
  const [more_18, setMore_18] = useState(false);
  const [more_18Api, setMore_18Api] = useState("");
  const [emailNewFollow, setEmailNewFollow] = useState(false);
  const [emailNewFollowApi, setEmailNewFollowApi] = useState("");
  const [emailComment, setEmailComment] = useState(false);
  const [emailCommentApi, setEmailCommentApi] = useState("");
  const [emailPost, setEmailPost] = useState(false);
  const [emailPostApi, setEmailPostApi] = useState("");
  const [nightmode, setNightmode] = useState(false);
  const [nightmodeApi, setNightmodeApi] = useState("");
  const [mention, setMention] = useState(false);
  const [mentionApi, setMentionApi] = useState("");

  const [loaded, setLoaded] = useState(false);
  const [data, setData] = useState(false);

  // =====
  // Fonction qui permet d'actualiser les variables pour les Hooks
  // =====
  function getMe(reponse) {
    setPrivateFromApi(String(reponse.data.accept_pms));
    setLanguageApi(String(reponse.data.country_code));
    setMore_18Api(String(reponse.data.search_include_over_18));
    setEmailNewFollowApi(String(reponse.data.email_user_new_follower));
    setEmailCommentApi(String(reponse.data.email_comment_reply));
    setEmailPostApi(String(reponse.data.email_post_reply));
    setNightmodeApi(String(reponse.data.nightmode));
    setNightmode(Boolean(reponse.data.nightmode));
    setMentionApi(String(reponse.data.email_username_mention));
    setMention(Boolean(reponse.data.email_username_mention));
    setPrivateFrom(String(reponse.data.accept_pms));
    setLanguage(String(reponse.data.country_code));
    setMore_18(Boolean(reponse.data.search_include_over_18));
    setEmailNewFollow(Boolean(reponse.data.email_user_new_follower));
    setEmailComment(Boolean(reponse.data.email_comment_reply));
    setEmailPost(Boolean(reponse.data.email_post_reply));
  }

  // =====
  // Création des listes pour les SelectLists
  // =====
  const privates = [{ value: "everyone" }, { value: "whitelisted" }];
  const lang = [
    { value: `FR` },
    { value: `IT` },
    { value: `GB` },
    { value: `US` },
    { value: `JP` },
  ];
  const bool = [{ value: "true" }, { value: "false" }];

  // =====
  // Fonction qui supprime le TOKEN du LocalStorage et redirige vers la page "Login"
  // =====
  const handleDisco = async () => {
    await AsyncStorage.removeItem('TOKEN');
    props.navigation.navigate("Login");
  }

  // =====
  // Fonction qui envoie une requête PATCH pour modifier les settings de l'utilisateur en fonction des choix selectionnés dans les SelectLists
  //    Appel à la Fonction "getMe" pour actualiser les données
  // =====
  const send = async () => {
    var token = await AsyncStorage.getItem("TOKEN");
    const patchData = {
      method: "PATCH",
      url: "https://oauth.reddit.com/api/v1/me/prefs",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: {
        accept_pms: privateFrom,
        country_code: language,
        email_user_new_follower: emailNewFollow,
        search_include_over_18: more_18,
        email_comment_reply: emailComment,
        email_post_reply: emailPost,
        nightmode: nightmode,
        email_username_mention: mention,
      },
    };
    axios(patchData)
      .then((reponse) => {
        const refresh = {
          method: "GET",
          url: "https://oauth.reddit.com/api/v1/me/prefs",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
        axios(refresh)
          .then((reponse) => {
            getMe(reponse);
          })
          .catch((error) => {
            console.log("⚠️ " + error);
          });
      })
      .catch((error) => {
        console.log("⚠️ " + error);
      });
  };

  // =====
  // Instantiation et envoie des requêtes pour obtenir le profil et les settings modifiables
  // =====
  useEffect(() => {
    const fetchData = async () => {
      var token = await AsyncStorage.getItem("TOKEN");
      const UserProfil = {
        method: "GET",
        url: "https://oauth.reddit.com/api/v1/me",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const UserSetting = {
        method: "GET",
        url: "https://oauth.reddit.com/api/v1/me/prefs",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      axios(UserProfil)
        .then((reponse) => {
          AsyncStorage.setItem("USERNAME", reponse.data.name);
          setUsername(reponse.data.name);
          setDescription(reponse.data.subreddit.public_description);
          setImageProfil(
            reponse.data.subreddit.icon_img.slice(
              0,
              String(reponse.data.subreddit.icon_img).indexOf("?")
            )
          );
        })
        .catch((error) => {
          console.log("⚠️ " + error);
        });
      axios(UserSetting)
        .then((reponse) => {
          getMe(reponse);
          setLoaded(true);
        })
        .catch((error) => {
          console.log("⚠️ " + error);
        });
    };
    fetchData();
  }, []);

  // =====
  // Retourne la page
  // =====
  if (loaded) {
    return (
      <>

        <View style={styles.row}>
          <View style={{ width: '40%', flexDirection: "row", justifyContent: 'center' }}>
            <Image style={{ width: 100, height: 100, borderRadius: 10 }} source={{ uri: image_profil }} />
          </View>
          <View style={{ width: '55%' }}>
            <Text>Welcome <Text style={{ color: 'tomato', fontWeight: 'bold' }}>{username}</Text></Text>
            <Text style={{ marginTop: 15 }}>{description}</Text>
          </View>
        </View>
        <SafeAreaView style={styles.container_main}>
          <ScrollView style={styles.scrollView}>

            <View style={{ width: '90%', marginLeft: '5%', flexDirection: 'row', justifyContent: 'space-between', marginBottom: 40 }}>
              <View style={{ width: '40%' }}>
                <Text style={{ textAlign: 'center', marginBottom: 5 }}>Private Message</Text>
                <SelectList
                  value={privateFromApi}
                  save="value"
                  placeholder={privateFrom}
                  setSelected={setPrivateFrom}
                  data={privates}
                />
              </View>
              <View style={{ width: '40%' }}>
                <Text style={{ textAlign: 'center', marginBottom: 5 }}>Language</Text>
                <SelectList
                  value={language}
                  save="value"
                  placeholder={languageApi}
                  setSelected={setLanguage}
                  data={lang}
                />
              </View>
            </View>




            <View style={{ marginBottom: 20 }}>
              <View style={{ width: '90%', marginLeft: '5%', marginTop: 20, flexDirection: 'row', justifyContent: 'space-between' }}>

                <View style={{ width: '30%', flexDirection: 'row', justifyContent: 'center', flexWrap: 'wrap' }}>
                  <Text style={{ textAlign: 'center', width: '100%' }}>18+</Text>
                  <Switch
                    trackColor={{ false: "#ff0000", true: "#00ff00" }}
                    thumbColor={more_18 ? "#ffffff" : "#ffffff"}
                    onValueChange={() => {
                      more_18 ? setMore_18(false) : setMore_18(true)

                    }
                    }
                    value={more_18}
                  />
                </View>

                <View style={{ width: '30%', flexDirection: 'row', justifyContent: 'center', flexWrap: 'wrap' }}>
                  <Text style={{ textAlign: 'center', width: '100%' }}>Notif. Follower</Text>
                  <Switch
                    trackColor={{ false: "#ff0000", true: "#00ff00" }}
                    thumbColor={emailNewFollow ? "#ffffff" : "#ffffff"}
                    onValueChange={() => {
                      emailNewFollow ? setEmailNewFollow(false) : setEmailNewFollow(true)

                    }
                    }
                    value={emailNewFollow}
                  />
                </View>

                <View style={{ width: '30%', flexDirection: 'row', justifyContent: 'center', flexWrap: 'wrap' }}>
                  <Text style={{ textAlign: 'center', width: '100%' }}>Notif. comment</Text>
                  <Switch
                    trackColor={{ false: "#ff0000", true: "#00ff00" }}
                    thumbColor={emailComment ? "#ffffff" : "#ffffff"}
                    onValueChange={() => {
                      emailComment ? setEmailComment(false) : setEmailComment(true)

                    }
                    }
                    value={emailComment}
                  />
                </View>
              </View>

              <View style={{ width: '90%', marginLeft: '5%', marginTop: 20, flexDirection: 'row', justifyContent: 'space-between' }}>
                <View style={{ width: '30%', flexDirection: 'row', justifyContent: 'center', flexWrap: 'wrap' }}>
                  <Text>Notif. post</Text>
                  <Switch
                    trackColor={{ false: "#ff0000", true: "#00ff00" }}
                    thumbColor={emailPost ? "#ffffff" : "#ffffff"}
                    onValueChange={() => {
                      emailPost ? setEmailPost(false) : setEmailPost(true)

                    }
                    }
                    value={emailPost}
                  />
                </View>
                <View style={{ width: '30%', flexDirection: 'row', justifyContent: 'center', flexWrap: 'wrap' }}>
                  <Text>Nightmode</Text>
                  <Switch
                    trackColor={{ false: "#ff0000", true: "#00ff00" }}
                    thumbColor={nightmode ? "#ffffff" : "#ffffff"}
                    onValueChange={() => {
                      nightmode ? setNightmode(false) : setNightmode(true)

                    }
                    }
                    value={nightmode}
                  />
                </View>
                <View style={{ width: '30%', flexDirection: 'row', justifyContent: 'center', flexWrap: 'wrap' }}>
                  <Text>Notif. mention</Text>
                  <Switch
                    trackColor={{ false: "#ff0000", true: "#00ff00" }}
                    thumbColor={mention ? "#ffffff" : "#ffffff"}
                    onValueChange={() => {
                      mention ? setMention(false) : setMention(true)

                    }
                    }
                    value={mention}
                  />
                </View>
              </View>
            </View>

            <View style={{ width: '100%', flexDirection: 'row', justifyContent: 'space-evenly', marginTop: 40 }}>
              <View  >
                <Pressable onPress={send} style={{ backgroundColor: 'white', padding: 10, borderRadius: 100, borderWidth: 1, borderColor: 'tomato' }}>
                  <Text style={{}}>Valid Edit</Text>
                </Pressable>
              </View>
              <View>
                <Pressable onPress={handleDisco} style={{ backgroundColor: 'black', padding: 10, borderRadius: 100, borderWidth: 1, borderColor: 'white' }}>
                  <Text style={{ color: 'white' }}>Disconnect</Text>
                </Pressable>
              </View>
            </View>

          </ScrollView>
        </SafeAreaView>
      </>
    );
  } else {
    return (
      <>
        <Image
          source={loading}
          style={{ width: 150, height: 150, position: "absolute", left: "30%", top: "30%" }}
        />
      </>
    );
  }
};

// =====
// Création du Style
// =====
const styles = StyleSheet.create({
  container_main: {
    flex: 1,
    paddingTop: StatusBar.currentHeight,
  },
  scrollView: {
    backgroundColor: 'transparent',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  row: {
    width: '100%',
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "tomato",
    paddingBottom: 10,
    paddingTop: 55,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    flexWrap: 'wrap'
  },
});
export default UserScreen;
