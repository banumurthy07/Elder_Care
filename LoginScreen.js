import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Animated,
} from "react-native";

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);

  // Logo Animation
  const logoScale = useRef(new Animated.Value(0.5)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(logoScale, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(logoOpacity, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleLogin = () => {
    navigation.navigate("Home");
  };

  return (
    <View style={styles.container}>
      
      {/* Logo Animation */}
      <Animated.Image
        source={require("./logo.jpg")}
        style={[
          styles.logo,
          {
            opacity: logoOpacity,
            transform: [{ scale: logoScale }],
          },
        ]}
      />

      <Text style={styles.title}>Welcome Back</Text>
      <Text style={styles.subtitle}>Login to continue</Text>

      {/* Email */}
      <View style={styles.inputContainer}>
        <Text style={styles.floatingLabel}>Email</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter email"
          placeholderTextColor="#9d9d9d"
          onChangeText={setEmail}
        />
      </View>

      {/* Password */}
      <View style={styles.inputContainer}>
        <Text style={styles.floatingLabel}>Password</Text>

        <TextInput
          style={styles.input}
          placeholder="Enter password"
          placeholderTextColor="#9d9d9d"
          secureTextEntry={!showPass}
          onChangeText={setPassword}
        />
        <TouchableOpacity
          style={styles.eyeIcon}
          onPress={() => setShowPass(!showPass)}
        >
          <Image
            source={
              showPass
                ? require("./eye-off.png")
                : require("./eye.png")
            }
            style={styles.eyeImg}
          />
        </TouchableOpacity>
      </View>

      {/* Login Button */}
      <TouchableOpacity style={styles.btn} onPress={handleLogin}>
        <Text style={styles.btnText}>Login</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate("Signup")}>
        <Text style={styles.link}>Don't have an account? Sign Up</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    padding: 25,
    justifyContent: "center",
  },

  logo: {
    width: 100,
    height: 100,
    alignSelf: "center",
    marginBottom: 15,
  },

  title: {
    fontSize: 28,
    fontWeight: "700",
    textAlign: "center",
    color: "#0066cc",
  },

  subtitle: {
    textAlign: "center",
    color: "#5a5a5a",
    marginBottom: 20,
  },

  inputContainer: {
    marginVertical: 10,
  },

  floatingLabel: {
    fontSize: 14,
    color: "#009688",
    marginBottom: 3,
    marginLeft: 5,
  },

  input: {
    padding: 12,
    borderWidth: 1,
    borderColor: "#bfbfbf",
    borderRadius: 8,
    backgroundColor: "#f9f9f9",
    paddingRight: 45,
  },

  eyeIcon: {
    position: "absolute",
    right: 10,
    top: 40,
  },

  eyeImg: {
    width: 22,
    height: 22,
  },

  btn: {
    backgroundColor: "#009688",
    padding: 15,
    borderRadius: 8,
    marginTop: 20,
  },

  btnText: {
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 16,
  },

  link: {
    color: "#0066cc",
    textAlign: "center",
    marginTop: 15,
  },
});
