import React, { createContext, useState } from "react";

export const AuthContext = createContext();

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || (import.meta.env.DEV ? "http://localhost:5227" : "");
const API_URL = `${API_BASE_URL}/api/auth`;
const USERS_KEY = "rich_demo_users";
const USER_KEY = "user";

const readUsers = () => {
  try { return JSON.parse(localStorage.getItem(USERS_KEY)) || []; }
  catch { return []; }
};

const writeUsers = (users) => localStorage.setItem(USERS_KEY, JSON.stringify(users));

const normalizeUser = (u) => ({
  userId: u.userId || u.id || Date.now(),
  fullName: u.fullName || u.name || u.email,
  email: u.email,
  phone: u.phone || u.phoneNumber || "",
  token: u.token || "demo-local-token",
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem(USER_KEY);
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });

  const [cart, setCart] = useState([]);

  const saveSession = (data) => {
    const normalized = normalizeUser(data);
    localStorage.setItem(USER_KEY, JSON.stringify(normalized));
    setUser(normalized);
    return true;
  };

  const loginLocal = (email, password) => {
    const users = readUsers();
    let found = users.find((u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password);

    if (!found && email && password) {
      // Demo fallback: video/test sırasında backend yoksa giriş yine çalışsın.
      found = { userId: Date.now(), fullName: email.split("@")[0], email, password };
      users.push(found);
      writeUsers(users);
    }

    return found ? saveSession(found) : false;
  };

  const registerLocal = (name, email, password, phone = "") => {
    if (!email || !password) return false;
    const users = readUsers();
    const existingIndex = users.findIndex((u) => u.email.toLowerCase() === email.toLowerCase());

    const newUser = {
      userId: existingIndex >= 0 ? users[existingIndex].userId : Date.now(),
      fullName: name || email.split("@")[0],
      email,
      password,
      phone,
      phoneNumber: phone,
    };

    if (existingIndex >= 0) users[existingIndex] = newUser;
    else users.push(newUser);

    writeUsers(users);
    return saveSession(newUser);
  };

  const login = async (email, password) => {
    if (API_BASE_URL) {
      try {
        const response = await fetch(`${API_URL}/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });

        if (response.ok) {
          const data = await response.json();
          return saveSession(data);
        }
      } catch (error) {
        console.warn("API login çalışmadı, demo login kullanılacak:", error);
      }
    }

    return loginLocal(email, password);
  };

  const register = async (name, email, password, phone = "") => {
    const payload = { fullName: name, name, email, password };
    if (phone) {
      payload.phone = phone;
      payload.phoneNumber = phone;
    }

    if (API_BASE_URL) {
      try {
        const response = await fetch(`${API_URL}/register`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (response.ok) {
          const data = await response.json();
          return saveSession(data);
        }
      } catch (error) {
        console.warn("API register çalışmadı, demo register kullanılacak:", error);
      }
    }

    return registerLocal(name, email, password, phone);
  };

  const logout = async () => {
    if (API_BASE_URL) {
      try { await fetch(`${API_URL}/logout`, { method: "POST" }); } catch {}
    }
    localStorage.removeItem(USER_KEY);
    setUser(null);
  };

  const deleteAccount = async () => {
    if (!user?.email) return false;

    if (API_BASE_URL && user?.userId) {
      try {
        await fetch(`${API_URL}/delete/${encodeURIComponent(user.userId)}`, { method: "DELETE" });
      } catch {}
    }

    const users = readUsers().filter((u) => u.email.toLowerCase() !== user.email.toLowerCase());
    writeUsers(users);
    localStorage.removeItem(USER_KEY);
    setUser(null);
    return true;
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
    alert(`${cartProduct.ad} sepete eklendi!`);
  };

  const removeFromCart = (cartId) => {
    setCart((prev) => prev.filter((item) => item.cartId !== cartId));
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, cart, addToCart, removeFromCart, deleteAccount }}>
      {children}
    </AuthContext.Provider>
  );
};
