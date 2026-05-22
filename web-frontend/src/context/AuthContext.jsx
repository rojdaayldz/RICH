import React, { createContext, useState } from "react";

export const AuthContext = createContext();

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || (import.meta.env.DEV ? "http://localhost:5227" : "");
const API_URL = `${API_BASE_URL}/api/auth`;

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [cart, setCart] = useState([]);

  const login = async (email, password) => {
    try {
      const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) return false;

      const data = await response.json();
      localStorage.setItem("user", JSON.stringify(data));
      setUser(data);
      return true;
    } catch (error) {
      console.error("Login hatası:", error);
      return false;
    }
  };

const register = async (name, email, password) => {
    try {
      const response = await fetch(`${API_URL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: name,
          email,
          password,
        }),
      });

      if (!response.ok) return false;

      const data = await response.json(); // { message, userId, fullName, email }
      localStorage.setItem("user", JSON.stringify(data)); // tarayıcıya kaydet
      setUser(data); // state'e yaz, sayfa yenilenince kaybolmaz
      return true;

    } catch (error) {
      console.error("Register hatası:", error);
      return false;
    }
  };

  const logout = async () => {
    await fetch(`${API_URL}/logout`, { method: "POST" });
    localStorage.removeItem("user");
    setUser(null);
  };

  const deleteAccount = async () => {
    if (!user?.userId) return false;

<<<<<<< HEAD
    try {
      const response = await fetch(`${API_URL}/delete/${encodeURIComponent(user.userId)}`, {
        method: "DELETE",
      });

      if (response.ok) {
        localStorage.removeItem("user");
        setUser(null);
        return true;
      }

      const error = await response.json().catch(() => null);
      console.error("Hesap silme hatasi:", error?.message || response.statusText);
      return false;
    } catch (error) {
      console.error("Hesap silme hatasi:", error);
      return false;
    }
=======
    const response = await fetch(`${API_URL}/delete/${user.userId}`, {
      method: "DELETE",
    });

    if (response.ok) {
      localStorage.removeItem("user");
      setUser(null);
      return true;
    }

    return false;
>>>>>>> d3f01afddca5b77247ebfe72b70466fbb430e9bc
  };

  const addToCart = (product) => {
    const cartProduct = {
      ...product,
      cartId: Date.now(),
      ad: product.ad || product.name,
      fiyat: product.fiyat || product.price,
      resim: product.resim || product.image,
      stok: product.stok,
    };

    setCart((prev) => [...prev, cartProduct]);
    alert(`${cartProduct.ad} sepete eklendi! 🛒`);
  };

  const removeFromCart = (cartId) => {
    setCart((prev) => prev.filter((item) => item.cartId !== cartId));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        cart,
        addToCart,
        removeFromCart,
        deleteAccount,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
