import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DropDownPicker from "react-native-dropdown-picker";

const StaffLogin = ({ navigation }) => {
  const [password, setPassword] = useState("");
  const [department, setDepartment] = useState("");
  const [year, setYear] = useState("");
  const [section, setSection] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const sectionValues = ["A", "B", "C"];
  const yearValues = ["First", "Second", "Third", "Final"];
  const actualPassword = "VSBEC2002";

  const handleLogin = async () => {
    if (!password || !department || !year) {
      setError("Please fill in all the details.");
      return;
    }
    setLoading(true);

    if (password === actualPassword) {
      setLoading(false);
      navigation.navigate("Students", {
        department: department,
        year: year,
        section: section,
      });
    } else {
      setError("Enter correct Password");
      setTimeout(() => {
        setLoading(false);
      }, 1000);
    }
  };

  const departmentData = [
    { label: "CSE", value: "CSE", key: "1" },
    { label: "ECE", value: "ECE", key: "2" },
    { label: "IT", value: "IT", key: "3" },
    { label: "EEE", value: "EEE", key: "4" },
    { label: "CIVIL", value: "CIVIL", key: "5" },
    { label: "CHEMICAL", value: "CHEMICAL", key: "6" },
    { label: "MECH", value: "MECH", key: "7" },
    { label: "BME", value: "BME", key: "8" },
    { label: "BIO-TECH", value: "BIO-TECH", key: "9" },
    { label: "AIDS", value: "AIDS", key: "10" },
    { label: "CSBS", value: "CSBS", key: "11" },
  ];

  const [openD, setOpenD] = useState(false);
  const [openS, setOpenS] = useState(false);
  const [openY, setOpenY] = useState(false);

  return (
    <View style={styles.container}>
      <Image source={require("../Image/logo.png")} style={styles.logo} />
      <View style={styles.logincontainer}>
        <Text style={styles.header}>Login</Text>
        <TextInput
          value={password}
          style={styles.input}
          placeholder="Password"
          onChangeText={setPassword}
          secureTextEntry={true}
        />
        <DropDownPicker
          style={styles.input}
          open={openD}
          value={department}
          items={departmentData}
          setOpen={setOpenD}
          setValue={setDepartment}
          zIndex={3}
          dropDownContainerStyle={{ width: 315, borderRadius: 12 }}
          placeholder="Department"
        />
        <DropDownPicker
          style={styles.input}
          open={openY}
          value={year}
          items={yearValues.map((value) => ({
            label: value,
            value,
            key: value,
          }))}
          setOpen={setOpenY}
          setValue={setYear}
          zIndex={2}
          dropDownContainerStyle={{ width: 315, borderRadius: 12 }}
          placeholder="Year"
        />
        <DropDownPicker
          style={styles.input}
          open={openS}
          value={section}
          items={sectionValues.map((value) => ({
            label: value,
            value,
            key: value,
          }))}
          setOpen={setOpenS}
          setValue={setSection}
          zIndex={1}
          dropDownContainerStyle={{ width: 315, borderRadius: 12 }}
          placeholder="Section"
        />
        <Text
          style={{
            height: 25,
            color: "red",
            fontWeight: "bold",
            textAlign: "center",
          }}
        >
          {error}
        </Text>
        <TouchableOpacity onPress={handleLogin} style={styles.loginButton}>
          {loading ? (
            <ActivityIndicator
              size="small"
              color="#ffffff"
              style={styles.loadingIndicator}
            />
          ) : (
            <Text style={styles.loginButtonText}>Login</Text>
          )}
        </TouchableOpacity>
        <Text style={styles.link} onPress={() => navigation.navigate("Login")}>
          Student?
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f2f2f2",
  },
  logo: {
    width: 170,
    height: 170,
    marginBottom: 5,
  },
  logincontainer: {
    position: "relative",
    paddingLeft: 16,
    paddingTop: 1,
    paddingRight: 16,
    paddingBottom: 20,
    borderRadius: 10,
    borderRadius: 30,
  },
  header: {
    textAlign: "center",
    fontSize: 40,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    width: 315,
    height: 50,
    borderColor: "#68a4ff",
    fontSize: 17,
    borderWidth: 1,
    borderRadius: 10,
    backgroundColor: "white",
    padding: 10,
    marginBottom: 10,
    position: "relative",
  },
  picker: {
    backgroundColor: "white",
    height: 45,
    width: 310,
    marginBottom: 15,
    borderRadius: 12,
  },
  loginButton: {
    backgroundColor: "#007bff",
    padding: 15,
    borderRadius: 10,
    width: 300,
  },

  loginButtonText: {
    color: "white",
    textAlign: "center",
  },

  link: {
    marginTop: 12,
    color: "#5656c0",
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default StaffLogin;
