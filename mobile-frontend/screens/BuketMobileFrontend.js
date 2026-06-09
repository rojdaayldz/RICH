import React, { useMemo, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { products } from "../data/demoProducts";

export default function BuketMobileFrontend() {
  const [category, setCategory] = useState("Tümü");
  const [favorites, setFavorites] = useState([]);
  const [cart, setCart] = useState([]);

  const filteredProducts = useMemo(() => {
    return category === "Tümü" ? products : products.filter((p) => p.category === category);
  }, [category]);

  const addToCart = (product) => setCart((prev) => [...prev, product]);
  const toggleFavorite = (product) => {
    setFavorites((prev) => {
      const exists = prev.find((item) => item.id === product.id);
      return exists ? prev.filter((item) => item.id !== product.id) : [...prev, product];
    });
  };

  const renderProduct = ({ item }) => {
    const isFavorite = favorites.find((p) => p.id === item.id);
    return (
      <View style={styles.productCard}>
        <View style={styles.productImage}>
          <Text style={styles.productImageText}>R</Text>
          <Text style={styles.productImageSub}>PREMIUM</Text>
        </View>
        <View style={styles.productBody}>
          <Text style={styles.productMeta}>{item.category} · {item.color} · {item.size}</Text>
          <Text style={styles.productName}>{item.name}</Text>
          <View style={styles.priceRow}>
            <Text style={styles.productPrice}>{item.price} TL</Text>
            <TouchableOpacity style={styles.favCircle} onPress={() => toggleFavorite(item)}>
              <Text style={styles.favText}>{isFavorite ? "♥" : "♡"}</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={styles.primaryButton} onPress={() => addToCart(item)}>
            <Text style={styles.primaryButtonText}>Sepete Ekle</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const total = cart.reduce((sum, item) => sum + item.price, 0);

  return (
    <View style={styles.content}>
      <View style={styles.hero}>
        <Text style={styles.kicker}>BUKET / MOBILE FRONT-END</Text>
        <Text style={styles.title}>Mobil Mağaza</Text>
        <Text style={styles.subtitle}>Kategori, favori ve sepet akışı telefona uygun şekilde gösterilir.</Text>
        <View style={styles.statsRow}>
          <View style={styles.statCard}><Text style={styles.statNumber}>{filteredProducts.length}</Text><Text style={styles.statLabel}>Ürün</Text></View>
          <View style={styles.statCard}><Text style={styles.statNumber}>{favorites.length}</Text><Text style={styles.statLabel}>Favori</Text></View>
          <View style={styles.statCard}><Text style={styles.statNumber}>{cart.length}</Text><Text style={styles.statLabel}>Sepet</Text></View>
        </View>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryBar}>
        {["Tümü", "Kadın", "Erkek", "Bebek", "Aksesuar"].map((item) => (
          <TouchableOpacity key={item} style={[styles.categoryButton, category === item && styles.categoryButtonActive]} onPress={() => setCategory(item)}>
            <Text style={[styles.categoryText, category === item && styles.categoryTextActive]}>{item}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <FlatList data={filteredProducts} keyExtractor={(item) => item.id} renderItem={renderProduct} contentContainerStyle={styles.list} />

      <View style={styles.bottomPanel}>
        <Text style={styles.bottomText}>Sepet: {cart.length} ürün</Text>
        <Text style={styles.bottomTotal}>{total} TL</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  content: { flex: 1, paddingHorizontal: 16 },
  hero: { backgroundColor: "#0b162b", borderColor: "#223452", borderWidth: 1, borderRadius: 20, padding: 16, marginTop: 14, marginBottom: 12 },
  kicker: { color: "#d7ad5b", fontSize: 10, letterSpacing: 2, marginBottom: 6 },
  title: { color: "#fff", fontSize: 28, fontWeight: "800" },
  subtitle: { color: "#91a1b8", marginTop: 5, lineHeight: 18, fontSize: 13 },
  statsRow: { flexDirection: "row", gap: 8, marginTop: 14 },
  statCard: { flex: 1, backgroundColor: "#101f39", borderRadius: 13, paddingVertical: 10, alignItems: "center" },
  statNumber: { color: "#d7ad5b", fontWeight: "900", fontSize: 18 },
  statLabel: { color: "#8ea0ba", fontSize: 11, marginTop: 2 },
  categoryBar: { marginBottom: 10, maxHeight: 39 },
  categoryButton: { borderColor: "#2b3f62", borderWidth: 1, borderRadius: 999, paddingVertical: 8, paddingHorizontal: 13, marginRight: 7, backgroundColor: "#091326" },
  categoryButtonActive: { backgroundColor: "#d7ad5b" },
  categoryText: { color: "#a7b4c7", fontWeight: "800", fontSize: 12 },
  categoryTextActive: { color: "#071122" },
  list: { paddingBottom: 92 },
  productCard: { backgroundColor: "#0d1b33", borderColor: "#223452", borderWidth: 1, borderRadius: 18, overflow: "hidden", marginBottom: 12, flexDirection: "row" },
  productImage: { width: 96, backgroundColor: "#d7ad5b", justifyContent: "center", alignItems: "center" },
  productImageText: { color: "#071122", fontSize: 42, fontWeight: "900" },
  productImageSub: { color: "#071122", fontSize: 9, letterSpacing: 2, marginTop: -4 },
  productBody: { flex: 1, padding: 13 },
  productMeta: { color: "#64748b", letterSpacing: 1.2, fontSize: 10, marginBottom: 5 },
  productName: { color: "#fff", fontSize: 15, fontWeight: "800", marginBottom: 7 },
  priceRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 9 },
  productPrice: { color: "#d7ad5b", fontSize: 16, fontWeight: "800" },
  favCircle: { borderColor: "#334155", borderWidth: 1, borderRadius: 999, width: 34, height: 34, alignItems: "center", justifyContent: "center" },
  favText: { color: "#fff", fontSize: 18 },
  primaryButton: { backgroundColor: "#fff", borderRadius: 10, paddingVertical: 9, alignItems: "center" },
  primaryButtonText: { color: "#071122", fontWeight: "900", fontSize: 12 },
  bottomPanel: { position: "absolute", left: 16, right: 16, bottom: 16, backgroundColor: "#0b162b", borderColor: "#223452", borderWidth: 1, borderRadius: 16, paddingVertical: 12, paddingHorizontal: 14, flexDirection: "row", justifyContent: "space-between" },
  bottomText: { color: "#fff", fontWeight: "800" },
  bottomTotal: { color: "#d7ad5b", fontWeight: "900" },
});
