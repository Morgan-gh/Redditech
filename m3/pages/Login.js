import { Image, View, StyleSheet, Pressable, Text, Button } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as React from 'react';
import * as WebBrowser from 'expo-web-browser';
import { makeRedirectUri, useAuthRequest } from 'expo-auth-session';
import base64 from 'react-native-base64';
import axios from 'axios';
import { LogBox } from 'react-native';

WebBrowser.maybeCompleteAuthSession();

const clientId = "V3QpV_axOINzx03gbRkQUQ";
const scopes = ['account,identity,edit,flair,history,modconfig,modflair,modlog,modposts,modwiki,mysubreddits,privatemessages,read,report,save,submit,subscribe,vote,wikiedit,wikiread'];
const redirectUri = 'exp://10.20.84.53:19000';
const url = "https://www.reddit.com/api/v1/access_token";

const discovery = {
  authorizationEndpoint: 'https://www.reddit.com/api/v1/authorize',
};

const Login = ({ navigation }) => {
  const [request, response, promptAsync] = useAuthRequest(
    {
      clientId: clientId,
      scopes: scopes,
      redirectUri: redirectUri,
    },
    discovery
  );

  React.useEffect(() => {
    if (response?.type === 'success') {
      const { code } = response.params;
      const config = {
        method: 'POST',
        url: url,
        headers: {
          "Content-type": "application/x-www-form-urlencoded",
          "Authorization": "Basic " + base64.encode(`${clientId}:`)
        },
        data: {
          grant_type: 'authorization_code',
          code: code,
          redirect_uri: redirectUri,
        }
      };

      axios(config).then(reponse => {
        console.log('🗿 ', reponse.data.access_token);
        AsyncStorage.setItem('TOKEN', reponse.data.access_token);
        AsyncStorage.setItem('clientId', clientId);
        AsyncStorage.setItem('redirectUri', redirectUri);
        navigation.navigate('MainContainer');
      }).catch(error => {
        console.log('⚠️ ' + error);
      })
    }
  }, [response]);


  return (
    <>
      <View style={{ width: "100%", height: "100%", backgroundColor: "#F2F6F7" }}>

        <View style={styles.flex}>

          <Image source={require("./../assets/login_round.png")} style={{ width: "auto", height: "100%" }} />

        </View>

        <View style={{ marginTop: 20 }}>

          <Text style={styles.text_com}>CONNECT YOU WITH  YOUR REDDIT ACCOUNT</Text>

        </View>

        <View style={{ marginTop: 20, width: '80%', marginLeft: '10%' }}>

          <Pressable style={styles.button} disabled={!request} title="Login" onPress={() => { promptAsync(); }}>
            <Text style={styles.text}>Sign In</Text>
          </Pressable>

        </View>

        <View style={{ backgroundColor: '#FF4502', borderRadius: 100, marginTop: 20, width: '50%', marginLeft: '25%' }}>
          <Text style={styles.made}>Made By M3 Team</Text>
        </View>

      </View>
    </>
  );

};

const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 100,
    backgroundColor: "black",
  },
  text: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: "bold",
    letterSpacing: 0.25,
    color: "white",
  },
  text_com: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: "bold",
    letterSpacing: 0.25,
    color: "#79888D",
    paddingVertical: 30,
    textAlign: "center",
  },
  made: {
    fontSize: 12,
    lineHeight: 21,
    fontWeight: "bold",
    letterSpacing: 0.25,
    paddingVertical: 10,
    paddingHorizontal: 32,
    color: "#FFFFFF",
    textAlign: "center",
    borderRadius: 16
  },
  flex: {
    width: "100%",
    height: "50%",
    backgroundColor: "#F2F6F7",
  },
});

export default Login;