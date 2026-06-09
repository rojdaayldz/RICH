import React, { useState } from "react";
import { SafeAreaView, View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { StatusBar } from "expo-status-bar";
import AuthScreen from "./screens/AuthScreen";
import BuketMobileFrontend from "./screens/BuketMobileFrontend";

export default function App() {
  const [user, setUser] = useState(null);

  if (!user) {
    return (
      <SafeAreaView style={styles.page}>
        <StatusBar style="light" />
        <AuthScreen onLogin={setUser} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.page}>
      <StatusBar style="light" />
      <View style={styles.topBar}>
        <View>
          <Text style={styles.logo}>RICH</Text>
          <Text style={styles.userText}>Buket Mobile Front-End · {user.email}</Text>
        </View>
        <TouchableOpacity style={styles.logoutBtn} onPress={() => setUser(null)}>
          <Text style={styles.logoutText}>Çıkış</Text>
        </TouchableOpacity>
      </View>
      <BuketMobileFrontend />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: "#071122" },
  topBar: { paddingTop: 34, paddingHorizontal: 18, paddingBottom: 12, backgroundColor: "#071122", borderBottomColor: "#1e2d4a", borderBottomWidth: 1, flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end" },
  logo: { color: "#fff", fontSize: 24, letterSpacing: 9, fontWeight: "700" },
  userText: { color: "#8ea0ba", fontSize: 11, marginTop: 4 },
  logoutBtn: { borderColor: "#2b4064", borderWidth: 1, borderRadius: 999, paddingVertical: 7, paddingHorizontal: 12 },
  logoutText: { color: "#d7ad5b", fontWeight: "800", fontSize: 12 },
});
