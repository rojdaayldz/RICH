import React, { useEffect, useState } from "react";
import { SafeAreaView, Text, FlatList, View, StyleSheet } from "react-native";

const API_BASE_URL = "http://localhost:5227";

export default function App() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/products`)
      .then((res) => res.json())
      .then(setProducts)
      .catch((err) => console.log("API hatası:", err));
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.logo}>RICH</Text>
      <Text style={styles.title}>Mobil Ürün Listesi</Text>
      <FlatList
        data={products}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.name}>{item.name}</Text>
            <Text>{item.category} / {item.renk} / {item.beden}</Text>
            <Text>{item.price} TL</Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, backgroundColor: "#071225" },
  logo: { color: "#fff", fontSize: 34, letterSpacing: 8, textAlign: "center", marginBottom: 16 },
  title: { color: "#d6a84f", fontSize: 18, marginBottom: 16 },
  card: { backgroundColor: "#fff", padding: 14, borderRadius: 10, marginBottom: 10 },
  name: { fontWeight: "bold", fontSize: 16 }
});
