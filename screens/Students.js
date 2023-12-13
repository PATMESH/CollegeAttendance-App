import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

const Students = ({ route, navigation }) => {
  const { department, year, section } = route.params;
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [todayAttendance, setTodayAttendance] = useState(false);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const apiUrl = 'https://vsbec-placement-backend.onrender.com/student/all';
        const response = await fetch(apiUrl);
        const data = await response.json();
        const filteredStudents = data.filter(student => {
          return (
            student.department === department &&
            student.year === year &&
            (section === '' || student.section === section)
          );
        });

        setStudents(filteredStudents);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching students:', error);
        setLoading(false);
      }
    };

    fetchStudents();
  }, [department, year, section]);

  const handleToggleAttendance = () => {
    setTodayAttendance(prevAttendance => !prevAttendance);
  };

  const getBorderColor = (item) => {
    if (todayAttendance) {
      return item.attendance.some(entry => entry.date === todayDateString && entry.isPresent) ? 'green' : 'gray';
    } else {
      return '#9d83b6b8';
    }
  };
  
  const navigateToProfile = (student) => {
    navigation.navigate('StudentProfile', { student });
  };

  const todayDateString = new Date().toISOString().split('T')[0]; 

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <View style={styles.headerContent}>
          <Text style={styles.headerText}>{department} - {year}</Text>
          {section !== '' && <Text style={styles.sectionText}>Section: {section}</Text>}
        </View>
        <TouchableOpacity onPress={handleToggleAttendance} style={styles.todayAttendanceButton}>
          <Text style={styles.todayAttendanceButtonText}>Today's Attendance</Text>
        </TouchableOpacity>
      </View>
      {loading ? (
        <ActivityIndicator size="large" color="#007bff" style={styles.loadingIndicator} />
      ) : (
        <FlatList
          data={students}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[styles.studentCard, { borderColor: getBorderColor(item) }]}
              onPress={() => navigateToProfile(item)}
            >
              <View>
                <Text style={styles.studentName}>{item.name}</Text>
                <Text style={styles.studentDetails}>Register Number: {item.registerNumber}</Text>
              </View>
              {todayAttendance ? (
                <FontAwesome
                  name={item.attendance.some(entry => entry.date === todayDateString && entry.isPresent) ? 'check-circle' : 'times-circle-o'}
                  size={28}
                  color={item.attendance.some(entry => entry.date === todayDateString && entry.isPresent) ? 'green' : 'grey'}
                />
              ) : (
                <Text>></Text>
              )}
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ebebeb',
  },
  headerContainer: {
    backgroundColor: '#326ef1',
    height: '20%',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingBottom:20,
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  headerContent: {
    alignItems: 'flex-start',
  },
  headerText: {
    fontSize: 34,
    fontWeight: 'bold',
    color: '#fff',
  },
  sectionText: {
    fontSize: 25,
    color: '#fff',
  },
  todayAttendanceButton: {
    backgroundColor: '#a200ff',
    padding: 10,
    borderRadius: 8,
  },
  todayAttendanceButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  loadingIndicator: {
    marginTop: 20,
  },
  studentCard: {
    borderWidth: 1,
    borderColor: '#9d83b6b8', 
    borderRadius: 15,
    padding: 10,
    marginVertical: 10,
    marginHorizontal: 15,
    backgroundColor: '#ebedf1',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  studentName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333',
  },
  studentDetails: {
    fontSize: 16,
    color: '#555',
  },
  arrow: {
    fontSize: 28,
    color: '#007bff',
  },
});

export default Students;