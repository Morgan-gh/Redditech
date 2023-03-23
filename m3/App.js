import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from './pages/Login';
import MainContainer from './pages/MainContainer';

/**Launcher of the app, when the function is called, it will return the Login page and when the user is logged in, it will return the MainContainer page
 * @name App
 * 
 * @returns {JSX.Element} Login page or MainContainer page
 */

const App = () => {

  const Stack = createNativeStackNavigator();

  return (
    <>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="MainContainer" component={MainContainer} />
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
};

export default App;