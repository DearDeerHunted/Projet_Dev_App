import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import login from './app/screens/login';
import register from './app/screens/register';
import menu from './app/screens/menu';
import map from './app/screens/map';
import list from './app/screens/list';
import ranking from './app/screens/ranking';

const Stack = createNativeStackNavigator();

export default function App() {
    return(
        <NavigationContainer>
          <Stack.Navigator initialRouteName="login">
            <Stack.Screen name="login" component={login}/>
            <Stack.Screen name="register" component={register}/>
            <Stack.Screen name="menu" component={menu}/>
            <Stack.Screen name="map" component={map}/>
            <Stack.Screen name="list" component={list}/>
            <Stack.Screen name="ranking" component={ranking}/>
          </Stack.Navigator>
        </NavigationContainer>
    );
}
