import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import HomeScreen from '../screens/HomeScreen';
import LoginScreen from '../screens/LoginScreen';
import StaffLogin from '../screens/StaffLogin';
import Students from '../screens/Students';
import TodayAttendance from '../screens/TodayAttendance';
import StudentProfile from '../screens/StudentProfile';

const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="StaffLogin"
          component={StaffLogin}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Students"
          component={Students}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="TodayAttendance"
          component={TodayAttendance}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="StudentProfile"
          component={StudentProfile}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
