import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native';
import { FontAwesome } from '@expo/vector-icons'; 

const TodayAttendance = ({ route, navigation }) => {
  const { department, year, section } = route.params;
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <View style={styles.headerContent}>
          <Text style={styles.headerText}>{department} - {year}</Text>
          {section !== '' && <Text style={styles.sectionText}>Section: {section}</Text>}
        </View>
      </View>
      {loading ? (
        <ActivityIndicator size="large" color="#007bff" style={styles.loadingIndicator} />
      ) : (
        <FlatList
          data={students}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.studentCard}
              onPress={() => navigation.navigate('StudentDetails', { student: item })}
            >
              <View>
                <Text style={styles.studentName}>{item.name}</Text>
                <Text style={styles.studentDetails}>Register Number: {item.registerNumber}</Text>
              </View>
              <FontAwesome
                name={item.isPresent ? 'check-circle' : 'circle'}
                size={28}
                color={item.isPresent ? 'green' : 'gray'}
              />
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
    justifyContent: 'center',
    paddingHorizontal: 15,
    paddingBottom: 20,
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
});

export default TodayAttendance;
