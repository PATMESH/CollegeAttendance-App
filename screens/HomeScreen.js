import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import * as Location from 'expo-location';
import * as LocalAuthentication from 'expo-local-authentication';
import Modal from 'react-native-modal';
import AsyncStorage from '@react-native-async-storage/async-storage';

const collegeLocation = { latitude: 10.95540815715271,  longitude:  77.95481055369386 };
const allowedDistance = 40000;
const maxWaitTimeInSeconds = 10;

export default function HomeScreen() {
  const [locationPermission, setLocationPermission] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);
  const [message, setMessage] = useState('');
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    getLocationPermission();
  }, []);

  const getLocationPermission = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync({
        accuracy: Location.Accuracy.High,
        maximumAge: 1000,
      });

      if (status === 'granted') {
        setLocationPermission(true);
      } else {
        showAlert('Location Permission', 'Location permission not granted');
      }
    } catch (error) {
      console.error('Error requesting location permission:', error);
      showAlert('Error', 'Failed to request location permission. Please try again.');
    }
  };

  const getCurrentLocation = async () => {
    if (!locationPermission) {
      showAlert('Location Permission', 'Location permission not granted');
      return;
    }
  
    setLoading(true);
  
    try {
      let inCollege = false;
      let continueWatching = true;
  
      const locationWatcher = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.BestForNavigation,
          timeInterval: 2000,
        },
        (location) => {
          const { latitude, longitude } = location.coords;
          const distance = calculateDistance({ latitude, longitude }, collegeLocation);
          console.log(distance);
          if (distance >= 30000) {
            continueWatching = false;
          }
  
          if (distance < allowedDistance) {
            inCollege = true;
            locationWatcher.remove();
            authenticateUser();
            setLoading(false);
          }
  
          if (!continueWatching) {
            locationWatcher.remove();
            setLoading(false);
            showAlert('Location Error', 'You are not in the college location');
          }
        }
      );
  
      setTimeout(() => {
        if (!inCollege && continueWatching) {
          locationWatcher.remove();
          setLoading(false);
          showAlert('Location Error', 'You are not in the college location');
        }
      }, maxWaitTimeInSeconds * 1000 * 3);
    } catch (error) {
      console.error('Error fetching current location:', error);
      showAlert('Error', 'Failed to fetch location. Please try again.');
    }
  };
  
  
  
  const calculateDistance = (coords1, coords2) => {
    const R = 6371;
    const dLat = toRadians(coords2.latitude - coords1.latitude);
    const dLon = toRadians(coords2.longitude - coords1.longitude);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRadians(coords1.latitude)) * Math.cos(toRadians(coords2.latitude)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c * 1000;
  };

  const toRadians = (degree) => degree * (Math.PI / 180);

  const showAlert = (title, msg) => {
    setModalVisible(true);
    setMessage(msg);
  };

  const closeModal = () => setModalVisible(false);

  const authenticateUser = async () => {
    const hasBiometrics = await LocalAuthentication.hasHardwareAsync();

    if (!hasBiometrics) {
      showAlert('Biometric Error', 'Biometric authentication is not available on this device');
      return;
    }

    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: 'Authenticate to mark attendance',
    });

    if (result.success) {
      storeAttendance();
    } else {
      showAlert('Authentication Failed', 'Authentication failed');
    }
  };

  const storeAttendance = async () => {
    try {
      const todayDate = new Date().toISOString().split('T')[0];
      const registerNumber = await AsyncStorage.getItem('regno');
      console.log(todayDate);
      console.log(registerNumber);
      await markAttendance(todayDate, registerNumber);
    } catch (error) {
      console.error('Error storing attendance:', error);
      showAlert('Error', 'Failed to store attendance. Please try again.');
    }
  };

  const markAttendance = async (date, registerNumber) => {
    try {
      const apiUrl = 'https://vsbec-placement-backend.onrender.com/student/markAttendance';
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          date,
          registerNumber,
        }),
      })
      if (response.ok) {
        const res = await response.json();
        console.log( res.message || res.error );
        showAlert('Success', res.message || res.error);
      } else {
        console.error('Error marking attendance on the backend:', response.statusText);
        showAlert('Backend Error', response.error);
      }
    } catch (error) {
      console.error('Error marking attendance:', error);
      showAlert('Error', 'Failed to mark attendance. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <Image source={require("../Image/logo.png")} style={styles.logo} />
      <Text style={styles.appTitle}>Attendance App</Text>
      <Text style={styles.description}>
        Welcome to the Attendance App. Mark your attendance securely and effortlessly!
      </Text>
      <TouchableOpacity
        style={styles.touchableButton}
        onPress={getCurrentLocation}
        activeOpacity={0.8}
      >
        {isLoading ? (
          <ActivityIndicator size={27} color="#ffe9fe" style={{ height: 27 }} />
        ) : (
          <Text style={styles.buttonText}>Mark Attendance</Text>
        )}
      </TouchableOpacity>
      <Modal
        isVisible={isModalVisible}
        animationIn="fadeIn"
        animationOut="fadeOut"
      >
        <View style={styles.modal}>
          <Text style={styles.modalTitle}>{message}</Text>
          <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f2f2f2',
  },
  logo: {
    width: 180,
    height: 180,
    marginBottom: 20,
  },
  appTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  description: {
    fontSize: 18,
    textAlign: 'center',
    marginHorizontal: 30,
    marginBottom: 40,
    color: '#666',
  },
  touchableButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 15,
    marginBottom: 40,
    width: '80%',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  modal: {
    backgroundColor: 'rgba(255, 255, 255, 0.93)',
    padding: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    borderColor: '#81198a',
    borderWidth: 2,
  },
  modalTitle: {
    fontSize: 18,
    marginBottom: 10,
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#333',
  },
  closeButton: {
    backgroundColor: '#c22323',
    padding: 10,
    borderRadius: 10,
    marginTop: 10,
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});
