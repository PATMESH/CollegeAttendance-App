import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import moment from "moment";
import { FontAwesome } from "@expo/vector-icons";

const StudentProfile = ({ route }) => {
  const { student } = route.params;

  const DetailRow = ({ icon, text }) => (
    <View style={styles.detailRow}>
      <FontAwesome
        name={icon}
        size={20}
        color="#333"
        style={styles.detailIcon}
      />
      <Text style={styles.detailText}>{text}</Text>
    </View>
  );

  const isPresentOnDate = (date) => {
    const attendanceEntry = student.attendance.find((entry) =>
      moment(entry.date).isSame(date, "day")
    );
    return attendanceEntry ? attendanceEntry.isPresent : false;
  };

  const past15Days = Array.from({ length: 15 }, (_, index) =>
    moment().subtract(index, "days")
  );

  const perfectAttendance =
    past15Days.every((date) => isPresentOnDate(date)) && past15Days.length > 0;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.profileCard}>
        <View style={styles.profileHeader}>
          <FontAwesome name="user-circle" size={80} color="#007bff" />
          <Text style={styles.profileName}>{student.name}</Text>
        </View>
        <View style={styles.profileDetails}>
          <DetailRow icon="id-card" text={student.registerNumber} />
          <DetailRow icon="envelope" text={student.email} />
          <DetailRow icon="building" text={student.department} />
          <DetailRow icon="graduation-cap" text={student.year} />
          <DetailRow icon="users" text={student.section} />
        </View>
      </View>
      <View style={styles.attendanceContainer}>
        <Text style={styles.attendanceTitle}>Past 15 Days Attendance</Text>
        <ScrollView style={{ paddingTop: 10 }}>
          {past15Days.map((date, index) => (
            <View
              key={index}
              style={[
                styles.attendanceCard,
                {
                  backgroundColor: isPresentOnDate(date)
                    ? "green"
                    : perfectAttendance
                    ? "gold"
                    : "gray",
                },
              ]}
            >
              <Text style={styles.dateText}>
                {moment(date).format("YYYY-MM-DD")}
              </Text>
              <Text style={styles.statusText}>
                {isPresentOnDate(date) ? "Present" : "Absent"}
              </Text>
            </View>
          ))}
        </ScrollView>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ebebeb",
    padding: 10,
    paddingTop: 50,
  },
  profileCard: {
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 15,
    marginBottom: 20,
  },
  profileHeader: {
    alignItems: "center",
    marginBottom: 15,
  },
  profileName: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 10,
    color: "#333",
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  detailIcon: {
    marginRight: 10,
  },
  detailText: {
    fontSize: 18,
    color: "#333",
  },
  attendanceContainer: {
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 15,
    paddingBottom: 50,
  },
  attendanceTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  attendanceCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "green",
    borderRadius: 10,
    padding: 10,
    marginBottom: 5,
  },
  dateText: {
    fontSize: 16,
    color: "#fff",
  },
  statusText: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "bold",
  },
});

export default StudentProfile;