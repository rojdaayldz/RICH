import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { demoProducts } from "../data/demoProducts";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  (import.meta.env.DEV ? "http://localhost:5227" : "");

const API_URL = API_BASE_URL ? `${API_BASE_URL}/api/products` : "";

// Shimmer / Skeleton kart bileşeni
const SkeletonCard = () => (
  <div style={styles.card}>
    <div
      style={{
        ...styles.imgBox,
        background:
          "linear-gradient(90deg, #111f3a 25%, #162035 50%, #111f3a 75%)",
        backgroundSize: "200% 100%",
        animation: "shimmer 1.5s infinite",
      }}
    />
    <div style={{ padding: "16px" }}>
      <div style={styles.skeletonLine} />
      <div style={{ ...styles.skeletonLine, width: "60%", marginTop: "8px" }} />
      <div style={{ ...styles.skeletonLine, width: "40%", marginTop: "12px" }} />
    </div>
  </div>
);

function UrunDetay({ selectedCategory }) {
  const { addToCart } = useContext(AuthContext);

  const [urunler, setUrunler] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fRenk, setFRenk] = useState("");
  const [fBeden, setFBeden] = useState("");

  const getDemoProducts = () => {
    return selectedCategory
      ? demoProducts.filter((product) => product.category === selectedCategory)
      : demoProducts;
  };

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError("");

      try {
        if (!API_URL) {
          setUrunler(getDemoProducts());
          return;
        }

        const url = selectedCategory
          ? `${API_URL}?category=${selectedCategory}`
          : API_URL;

        const res = await fetch(url);

        if (!res.ok) {
          throw new Error("API yanıt vermedi.");
        }

        const contentType = res.headers.get("content-type") || "";

        if (!contentType.includes("application/json")) {
          throw new Error("API JSON formatında yanıt vermedi.");
        }

        const data = await res.json();

        if (!Array.isArray(data)) {
          throw new Error("API ürün listesi döndürmedi.");
        }

        setUrunler(data);
      } catch (err) {
        console.warn("API erişilemedi, demo ürünler gösteriliyor:", err);
        setUrunler(getDemoProducts());
        setError("");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [selectedCategory]);

  const handleAddToFavorite = (product) => {
    let favs = JSON.parse(localStorage.getItem("rich_favorites")) || [];

    if (!favs.find((f) => f.id === product.id)) {
      favs.push({
        ...product,
        ad: product.name,
        fiyat: product.price,
        resim: product.image,
      });

      localStorage.setItem("rich_favorites", JSON.stringify(favs));
    }

    alert(`${product.name} favorilere eklendi! ❤️`);
  };

  const filtered = urunler.filter((u) => {
    const renkMatch = fRenk ? u.renk === fRenk : true;
    const bedenMatch = fBeden ? u.beden === fBeden : true;
    return renkMatch && bedenMatch;
  });

  const categoryLabel = {
    kadin: "Kadın",
    erkek: "Erkek",
    bebek: "Bebek",
    aksesuar: "Aksesuar",
  };

  return (
    <div style={styles.page}>
      <style>{`
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>

      <div style={styles.header}>
        <h2 style={styles.title}>
          {selectedCategory
            ? categoryLabel[selectedCategory] || selectedCategory
            : "Tüm Ürünler"}
          {!loading && <span style={styles.count}> ({filtered.length} ürün)</span>}
        </h2>

        <div style={styles.filters}>
          <select
            style={styles.select}
            value={fRenk}
            onChange={(e) => setFRenk(e.target.value)}
          >
            <option value="">Renk</option>
            {[...new Set(urunler.map((u) => u.renk).filter(Boolean))].map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>

          <select
            style={styles.select}
            value={fBeden}
            onChange={(e) => setFBeden(e.target.value)}
          >
            <option value="">Beden</option>
            {[...new Set(urunler.map((u) => u.beden).filter(Boolean))].map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>

          {(fRenk || fBeden) && (
            <button
              style={styles.clearBtn}
              onClick={() => {
                setFRenk("");
                setFBeden("");
              }}
            >
              Temizle ✕
            </button>
          )}
        </div>
      </div>

      {error && <div style={styles.errorBox}>⚠️ {error}</div>}

      {loading && (
        <div style={styles.grid}>
          {[1, 2, 3, 4].map((i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      )}

      {!loading && !error && filtered.length === 0 && (
        <div style={styles.empty}>
          <div style={{ fontSize: "48px", marginBottom: "16px" }}>🔍</div>
          <h3
            style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              color: "#f0f0f0",
              marginBottom: "8px",
            }}
          >
            {selectedCategory
              ? `${categoryLabel[selectedCategory] || selectedCategory} ürünü bulunamadı.`
              : "Ürün bulunamadı."}
          </h3>
          <p
            style={{
              color: "#4a5568",
              fontFamily: "'Jost', sans-serif",
              fontSize: "13px",
            }}
          >
            Farklı bir kategori veya filtre deneyin.
          </p>
        </div>
      )}

      {!loading && filtered.length > 0 && (
        <div style={styles.grid}>
          {filtered.map((u) => (
            <div key={u.id} style={styles.card} className="modern-product-card">
              <div style={styles.imgBox}>
                <img
                  src={u.image}
                  alt={u.name}
                  style={{
                    ...styles.img,
                    filter:
                      u.stok === 0 ? "grayscale(100%) brightness(0.5)" : "none",
                  }}
                />

                <button
                  onClick={() => handleAddToFavorite(u)}
                  style={styles.favBtn}
                  title="Favorilere Ekle"
                >
                  ♡
                </button>

                {u.stok === 0 && (
                  <span style={{ ...styles.badge, background: "#e57373" }}>
                    TÜKENDİ
                  </span>
                )}

                {u.stok > 0 && u.stok <= 3 && (
                  <span
                    style={{
                      ...styles.badge,
                      background: "#c8a96e",
                      color: "#0a0f1e",
                    }}
                  >
                    SON {u.stok} ÜRÜN
                  </span>
                )}
              </div>

              <div style={styles.info}>
                <p style={styles.meta}>
                  {u.renk} · {u.beden}
                </p>
                <h3 style={styles.name}>{u.name}</h3>
                <p style={styles.price}>
                  {u.price?.toLocaleString("tr-TR")} TL
                </p>

                <button
                  onClick={() =>
                    addToCart({
                      ...u,
                      ad: u.name,
                      fiyat: u.price,
                      resim: u.image,
                    })
                  }
                  disabled={u.stok === 0}
                  style={{
                    ...styles.cartBtn,
                    opacity: u.stok === 0 ? 0.4 : 1,
                    cursor: u.stok === 0 ? "not-allowed" : "pointer",
                  }}
                >
                  {u.stok === 0 ? "Stokta Yok" : "Sepete Ekle"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const styles = {
  page: {
    padding: "32px 40px",
    background: "#0a0f1e",
    minHeight: "60vh",
  },
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: "28px",
    flexWrap: "wrap",
    gap: "12px",
  },
  title: {
    fontFamily: "'Cormorant Garamond', Georgia, serif",
    fontSize: "26px",
    fontWeight: "400",
    color: "#f0f0f0",
    letterSpacing: "2px",
  },
  count: {
    fontFamily: "'Jost', sans-serif",
    fontSize: "13px",
    color: "#4a5568",
    letterSpacing: "0",
  },
  filters: {
    display: "flex",
    gap: "10px",
    alignItems: "center",
    flexWrap: "wrap",
  },
  select: {
    background: "#0d1526",
    border: "1px solid #1e2d4a",
    borderRadius: "4px",
    color: "#a0aec0",
    fontFamily: "'Jost', sans-serif",
    fontSize: "12px",
    letterSpacing: "1px",
    padding: "8px 14px",
    cursor: "pointer",
    outline: "none",
  },
  clearBtn: {
    background: "none",
    border: "1px solid #1e2d4a",
    borderRadius: "4px",
    color: "#e57373",
    fontFamily: "'Jost', sans-serif",
    fontSize: "11px",
    letterSpacing: "1px",
    padding: "8px 14px",
    cursor: "pointer",
  },
  errorBox: {
    background: "rgba(229,115,115,0.1)",
    border: "1px solid rgba(229,115,115,0.3)",
    borderRadius: "4px",
    color: "#e57373",
    fontFamily: "'Jost', sans-serif",
    fontSize: "13px",
    padding: "14px 20px",
    marginBottom: "24px",
  },
  empty: {
    textAlign: "center",
    padding: "80px 20px",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
    gap: "20px",
  },
  card: {
    background: "#0d1526",
    border: "1px solid #1e2d4a",
    borderRadius: "8px",
    overflow: "hidden",
    transition: "border-color 0.2s, background 0.2s",
  },
  imgBox: {
    position: "relative",
    height: "220px",
    overflow: "hidden",
    background: "#111f3a",
  },
  img: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    transition: "transform 0.3s",
  },
  favBtn: {
    position: "absolute",
    top: "10px",
    right: "10px",
    background: "rgba(10,15,30,0.8)",
    border: "1px solid #1e2d4a",
    borderRadius: "50%",
    width: "34px",
    height: "34px",
    color: "#a0aec0",
    fontSize: "16px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "color 0.2s, border-color 0.2s",
  },
  badge: {
    position: "absolute",
    bottom: "10px",
    left: "10px",
    color: "#fff",
    fontFamily: "'Jost', sans-serif",
    fontSize: "10px",
    letterSpacing: "1.5px",
    padding: "4px 10px",
    borderRadius: "2px",
    textTransform: "uppercase",
  },
  info: {
    padding: "16px 18px 20px",
  },
  meta: {
    fontFamily: "'Jost', sans-serif",
    fontSize: "11px",
    letterSpacing: "1.5px",
    color: "#4a5568",
    textTransform: "uppercase",
    marginBottom: "6px",
  },
  name: {
    fontFamily: "'Cormorant Garamond', Georgia, serif",
    fontSize: "17px",
    fontWeight: "400",
    color: "#f0f0f0",
    marginBottom: "8px",
    lineHeight: "1.3",
  },
  price: {
    fontFamily: "'Cormorant Garamond', Georgia, serif",
    fontSize: "18px",
    color: "#c8a96e",
    marginBottom: "14px",
  },
  cartBtn: {
    width: "100%",
    background: "#ffffff",
    color: "#0a0f1e",
    border: "none",
    borderRadius: "4px",
    padding: "10px",
    fontFamily: "'Jost', sans-serif",
    fontSize: "11px",
    letterSpacing: "2px",
    textTransform: "uppercase",
    transition: "background 0.2s",
  },
  skeletonLine: {
    background:
      "linear-gradient(90deg, #111f3a 25%, #162035 50%, #111f3a 75%)",
    backgroundSize: "200% 100%",
    animation: "shimmer 1.5s infinite",
    borderRadius: "3px",
    height: "12px",
    width: "80%",
  },
};

export default UrunDetay;