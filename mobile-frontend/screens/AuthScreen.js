import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";

export default function AuthScreen({ onLogin }) {
  const [mode, setMode] = useState("login");
  const [name, setName] = useState("Buket KARACALI");
  const [email, setEmail] = useState("buket@rich.com");
  const [password, setPassword] = useState("123456");

  const submit = () => {
    if (!email || !password) return Alert.alert("Eksik Bilgi", "E-posta ve şifre zorunludur.");
    onLogin({ id: 1, name, email, token: "mobile-demo-token" });
  };

  return (
    <View style={styles.wrap}>
      <View style={styles.card}>
        <Text style={styles.logo}>RICH</Text>
        <Text style={styles.kicker}>BUKET · MOBILE FRONT-END</Text>
        <Text style={styles.title}>{mode === "login" ? "Giriş Yap" : "Kayıt Ol"}</Text>

        {mode === "register" && <TextInput style={styles.input} placeholder="Ad Soyad" placeholderTextColor="#60718d" value={name} onChangeText={setName} />}
        <TextInput style={styles.input} placeholder="E-posta" placeholderTextColor="#60718d" value={email} onChangeText={setEmail} autoCapitalize="none" />
        <TextInput style={styles.input} placeholder="Şifre" placeholderTextColor="#60718d" value={password} onChangeText={setPassword} secureTextEntry />

        <TouchableOpacity style={styles.button} onPress={submit}>
          <Text style={styles.buttonText}>{mode === "login" ? "Giriş Yap" : "Kayıt Ol"}</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setMode(mode === "login" ? "register" : "login")}>
          <Text style={styles.switchText}>{mode === "login" ? "Hesabın yok mu? Kayıt ol" : "Hesabın var mı? Giriş yap"}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, backgroundColor: "#071122", justifyContent: "center", padding: 18 },
  card: { backgroundColor: "#0b162b", borderColor: "#223452", borderWidth: 1, borderRadius: 22, padding: 20 },
  logo: { color: "#fff", fontSize: 38, letterSpacing: 13, textAlign: "center", marginBottom: 12, fontWeight: "700" },
  kicker: { color: "#d7ad5b", textAlign: "center", letterSpacing: 3, fontSize: 10, marginBottom: 18 },
  title: { color: "#fff", fontSize: 25, fontWeight: "700", textAlign: "center", marginBottom: 18 },
  input: { backgroundColor: "#101f39", borderColor: "#2b4064", borderWidth: 1, color: "#fff", borderRadius: 12, padding: 14, marginBottom: 10 },
  button: { backgroundColor: "#d7ad5b", borderRadius: 12, padding: 14, alignItems: "center", marginTop: 4 },
  buttonText: { color: "#071122", fontWeight: "800" },
  switchText: { color: "#d7ad5b", textAlign: "center", marginTop: 15, fontWeight: "700" },
});
