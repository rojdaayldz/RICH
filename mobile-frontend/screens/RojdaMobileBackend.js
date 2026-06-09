import React, { useState } from "react";
import { ScrollView, View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { products } from "../data/demoProducts";

const apiEndpoints = {
  products: { method: "GET", path: "/api/products", description: "Mobil uygulama ürün listesini REST API üzerinden ister.", response: { success: true, count: products.length, data: products.slice(0, 3) } },
  detail: { method: "GET", path: "/api/products/1", description: "Ürün detay ekranı için seçilen ürünün bilgisini döner.", response: { success: true, data: products[0] } },
  login: { method: "POST", path: "/api/auth/login", description: "Mobil kullanıcı giriş isteğini test eder.", response: { success: true, token: "mobile-demo-token", user: { id: 1, username: "mobile_user" } } },
  cart: { method: "POST", path: "/api/cart", description: "Mobil sepete ürün ekleme isteğini test eder.", response: { success: true, cartId: "RICH-CART-001", itemCount: 3 } },
  order: { method: "POST", path: "/api/orders", description: "Mobil sipariş oluşturma isteğini test eder.", response: { success: true, orderId: "RICH-MOB-2026-001", status: "created", total: 2920 } },
};

export default function RojdaMobileBackend() {
  const [selectedKey, setSelectedKey] = useState("products");
  const [testResult, setTestResult] = useState(null);
  const selected = apiEndpoints[selectedKey];

  const runTest = () => setTestResult({
    endpoint: selected.path,
    method: selected.method,
    status: 200,
    time: new Date().toLocaleTimeString("tr-TR"),
  });

  return (
    <ScrollView style={styles.content} contentContainerStyle={styles.scrollPad}>
      <View style={styles.hero}>
        <Text style={styles.kicker}>ROJDA / MOBILE BACK-END</Text>
        <Text style={styles.title}>Mobil API Testi</Text>
        <Text style={styles.subtitle}>REST endpointleri, JSON response ve işlem sonucu tek ekranda gösterilir.</Text>
        <View style={styles.statusRow}>
          <Text style={styles.statusPill}>REST API</Text>
          <Text style={styles.statusPill}>JSON</Text>
          <Text style={styles.statusPill}>200 OK</Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Endpointler</Text>
      {Object.entries(apiEndpoints).map(([key, e]) => (
        <TouchableOpacity key={key} style={[styles.endpointCard, selectedKey === key && styles.endpointCardActive]} onPress={() => setSelectedKey(key)}>
          <Text style={styles.endpointMethod}>{e.method}</Text>
          <Text style={styles.endpointPath}>{e.path}</Text>
          <Text style={styles.endpointDesc}>{e.description}</Text>
        </TouchableOpacity>
      ))}

      <View style={styles.responseBox}>
        <Text style={styles.responseTitle}>Response Preview</Text>
        <Text style={styles.responsePath}>{selected.method} {selected.path}</Text>
        <Text style={styles.jsonText}>{JSON.stringify(selected.response, null, 2)}</Text>
        <TouchableOpacity style={styles.primaryButton} onPress={runTest}>
          <Text style={styles.primaryButtonText}>REST API İsteğini Test Et</Text>
        </TouchableOpacity>
      </View>

      {testResult && (
        <View style={styles.testResult}>
          <Text style={styles.resultTitle}>Son Test Sonucu</Text>
          <Text style={styles.resultLine}>Endpoint: {testResult.endpoint}</Text>
          <Text style={styles.resultLine}>Method: {testResult.method}</Text>
          <Text style={styles.resultLine}>Status: {testResult.status}</Text>
          <Text style={styles.resultLine}>Saat: {testResult.time}</Text>
          <Text style={styles.successText}>Mobil uygulama REST API isteği başarıyla simüle edildi.</Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: { flex: 1, backgroundColor: "#071122", paddingHorizontal: 16 },
  scrollPad: { paddingBottom: 28 },
  hero: { backgroundColor: "#0b162b", borderColor: "#223452", borderWidth: 1, borderRadius: 20, padding: 16, marginTop: 14, marginBottom: 14 },
  kicker: { color: "#d7ad5b", fontSize: 10, letterSpacing: 2, marginBottom: 6 },
  title: { color: "#fff", fontSize: 28, fontWeight: "800" },
  subtitle: { color: "#91a1b8", marginTop: 5, lineHeight: 18, fontSize: 13 },
  statusRow: { flexDirection: "row", gap: 7, marginTop: 14, flexWrap: "wrap" },
  statusPill: { backgroundColor: "#101f39", color: "#dbeafe", borderRadius: 999, paddingVertical: 7, paddingHorizontal: 10, fontSize: 11, fontWeight: "800" },
  sectionTitle: { color: "#d7ad5b", fontSize: 18, fontWeight: "900", marginBottom: 10 },
  endpointCard: { backgroundColor: "#0d1b33", borderColor: "#223452", borderWidth: 1, borderRadius: 15, padding: 12, marginBottom: 9 },
  endpointCardActive: { borderColor: "#d7ad5b", backgroundColor: "#101f39" },
  endpointMethod: { color: "#4ade80", fontWeight: "900", fontSize: 12 },
  endpointPath: { color: "#fff", fontSize: 14, fontWeight: "800", marginTop: 4 },
  endpointDesc: { color: "#91a1b8", lineHeight: 18, fontSize: 12, marginTop: 4 },
  responseBox: { backgroundColor: "#0d1b33", borderColor: "#223452", borderWidth: 1, borderRadius: 18, padding: 14, marginTop: 8 },
  responseTitle: { color: "#d7ad5b", fontWeight: "900", fontSize: 15 },
  responsePath: { color: "#91a1b8", marginTop: 3, marginBottom: 10, fontSize: 12 },
  jsonText: { backgroundColor: "#050b16", borderColor: "#1f2f4a", borderWidth: 1, borderRadius: 12, color: "#b7e4c7", fontFamily: "monospace", padding: 12, lineHeight: 18, fontSize: 11 },
  primaryButton: { backgroundColor: "#d7ad5b", paddingVertical: 12, borderRadius: 12, alignItems: "center", marginTop: 12 },
  primaryButtonText: { color: "#071122", fontWeight: "900", fontSize: 12 },
  testResult: { backgroundColor: "#0b162b", borderColor: "#223452", borderWidth: 1, borderRadius: 16, padding: 14, marginTop: 14 },
  resultTitle: { color: "#d7ad5b", fontWeight: "900", marginBottom: 8 },
  resultLine: { color: "#dbeafe", marginBottom: 5, fontSize: 12 },
  successText: { color: "#4ade80", fontWeight: "800", marginTop: 7, fontSize: 12 },
});
