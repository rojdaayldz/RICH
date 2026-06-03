import React, { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const Register = ({ setActiveTab }) => {
  const { register } = useContext(AuthContext);

  const [form, setForm] = useState({ isim: "", soyisim: "", email: "", phone: "", password: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = (field, value) => {
    if (field === "isim" && !value.trim()) return "İsim boş bırakılamaz.";
    if (field === "soyisim" && !value.trim()) return "Soyisim boş bırakılamaz.";
    if (field === "email") {
      if (!value) return "Email boş bırakılamaz.";
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return "Geçerli bir email adresi girin.";
    }
    if (field === "phone" && value && !/^\+?[0-9\s()-]{10,20}$/.test(value)) {
  return "Geçerli bir telefon numarası girin.";
}

if (field === "password") {
      if (value.length < 8) return "En az 8 karakter olmalıdır.";
      if (!/[A-Z]/.test(value)) return "En az bir büyük harf içermelidir.";
      if (!/[a-z]/.test(value)) return "En az bir küçük harf içermelidir.";
      if (!/[0-9]/.test(value)) return "En az bir rakam içermelidir.";
    }
    return "";
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
    setErrors((p) => ({ ...p, [name]: validate(name, value), submit: "" }));
  };

  const isFormValid =
    form.isim.trim() && form.soyisim.trim() && form.email.trim() && form.password.trim() &&
    !errors.isim && !errors.soyisim && !errors.email && !errors.phone && !errors.password;

  const getStrength = (pw) => {
    let s = 0;
    if (pw.length >= 8) s++;
    if (/[A-Z]/.test(pw)) s++;
    if (/[a-z]/.test(pw)) s++;
    if (/[0-9]/.test(pw)) s++;
    if (/[^A-Za-z0-9]/.test(pw)) s++;
    return s;
  };

  const strengthColor = (s) => s <= 2 ? "#e57373" : s <= 3 ? "#c8a96e" : "#68d391";
  const strengthLabel = (s) => s <= 2 ? "Zayıf" : s <= 3 ? "Orta" : "Güçlü";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const success = await register(`${form.isim} ${form.soyisim}`, form.email, form.password, form.phone);
      if (success) {
        alert("✅ Kayıt işlemi başarılı! Giriş yapabilirsiniz.");
        setActiveTab("login");
      } else {
        setErrors((p) => ({ ...p, submit: "E-posta zaten kayıtlı veya geçersiz veri." }));
      }
    } catch {
      setErrors((p) => ({ ...p, submit: "Sunucuya bağlanılamadı. Lütfen tekrar deneyin." }));
    } finally {
      setLoading(false);
    }
  };

  const strength = getStrength(form.password);

  return (
    <div style={styles.page}>
      <div style={styles.card}>

        {/* Logo */}
        <div style={styles.logoArea}>
          <div style={styles.logo}>RICH</div>
          <div style={styles.logoSub}>Premium E-Ticaret</div>
        </div>

        <h2 style={styles.title}>Hesap Oluştur</h2>
        <p style={styles.subtitle}>Aramıza katıl, alışverişin keyfini çıkar.</p>

        <form onSubmit={handleSubmit} noValidate style={styles.form}>

          {/* İsim & Soyisim */}
          <div style={styles.row}>
            <div style={styles.fieldHalf}>
              <label style={styles.label}>İsim</label>
              <input
                type="text" name="isim" placeholder="Adınız"
                value={form.isim} onChange={handleChange}
                style={{ ...styles.input, borderColor: errors.isim ? "#e57373" : "#1e2d4a" }}
              />
              {errors.isim && <span style={styles.error}>{errors.isim}</span>}
            </div>
            <div style={styles.fieldHalf}>
              <label style={styles.label}>Soyisim</label>
              <input
                type="text" name="soyisim" placeholder="Soyadınız"
                value={form.soyisim} onChange={handleChange}
                style={{ ...styles.input, borderColor: errors.soyisim ? "#e57373" : "#1e2d4a" }}
              />
              {errors.soyisim && <span style={styles.error}>{errors.soyisim}</span>}
            </div>
          </div>

          {/* Email */}
          <div style={styles.field}>
            <label style={styles.label}>Email Adresi</label>
            <input
              type="email" name="email" placeholder="ornek@email.com"
              value={form.email} onChange={handleChange}
              style={{ ...styles.input, borderColor: errors.email ? "#e57373" : "#1e2d4a" }}
            />
            {errors.email && <span style={styles.error}>{errors.email}</span>}
          </div>

          {/* Telefon */}
          <div style={styles.field}>
            <label style={styles.label}>Telefon</label>
            <input
              type="tel" name="phone" placeholder="05xx xxx xx xx"
              value={form.phone} onChange={handleChange}
              style={{ ...styles.input, borderColor: errors.phone ? "#e57373" : "#1e2d4a" }}
            />
            {errors.phone && <span style={styles.error}>{errors.phone}</span>}
          </div>

          {/* Parola */}
          <div style={styles.field}>
            <label style={styles.label}>Parola</label>
            <input
              type="password" name="password" placeholder="Min. 8 karakter, büyük harf ve rakam"
              value={form.password} onChange={handleChange}
              style={{ ...styles.input, borderColor: errors.password ? "#e57373" : "#1e2d4a" }}
            />
            {errors.password && <span style={styles.error}>{errors.password}</span>}

            {/* Güç göstergesi */}
            {form.password && (
              <div style={{ marginTop: "8px" }}>
                <div style={styles.strengthTrack}>
                  <div style={{
                    ...styles.strengthFill,
                    width: `${(strength / 5) * 100}%`,
                    background: strengthColor(strength),
                  }} />
                </div>
                <span style={{ ...styles.strengthLabel, color: strengthColor(strength) }}>
                  {strengthLabel(strength)}
                </span>
              </div>
            )}
          </div>

          {/* Submit hatası */}
          {errors.submit && (
            <div style={styles.errorBox}>{errors.submit}</div>
          )}

          {/* Kayıt Ol Butonu */}
          <button
            type="submit"
            disabled={!isFormValid || loading}
            style={{
              ...styles.button,
              opacity: !isFormValid || loading ? 0.5 : 1,
              cursor: !isFormValid || loading ? "not-allowed" : "pointer",
            }}
          >
            {loading ? "Kaydediliyor..." : "Kayıt Ol"}
          </button>
        </form>

        <div style={styles.divider} />
        <p style={styles.loginText}>
          Zaten hesabın var mı?{" "}
          <span onClick={() => setActiveTab("login")} style={styles.link}>
            Giriş Yap
          </span>
        </p>
      </div>
    </div>
  );
};

const styles = {
  page: {
    minHeight: "80vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "40px 20px",
    background: "#0a0f1e",
  },
  card: {
    background: "#0d1526",
    border: "1px solid #1e2d4a",
    borderRadius: "12px",
    padding: "48px 40px",
    width: "100%",
    maxWidth: "480px",
  },
  logoArea: { textAlign: "center", marginBottom: "32px" },
  logo: {
    fontFamily: "'Cormorant Garamond', Georgia, serif",
    fontSize: "28px",
    fontWeight: "400",
    letterSpacing: "10px",
    color: "#ffffff",
    textTransform: "uppercase",
  },
  logoSub: {
    fontFamily: "'Jost', sans-serif",
    fontSize: "10px",
    letterSpacing: "3px",
    color: "#c8a96e",
    textTransform: "uppercase",
    marginTop: "6px",
  },
  title: {
    fontFamily: "'Cormorant Garamond', Georgia, serif",
    fontSize: "22px",
    fontWeight: "400",
    color: "#f0f0f0",
    marginBottom: "8px",
    textAlign: "center",
  },
  subtitle: {
    fontFamily: "'Jost', sans-serif",
    fontSize: "12px",
    color: "#4a5568",
    letterSpacing: "0.5px",
    textAlign: "center",
    marginBottom: "32px",
  },
  form: { display: "flex", flexDirection: "column", gap: "20px" },
  row: { display: "flex", gap: "12px" },
  field: { display: "flex", flexDirection: "column", gap: "8px" },
  fieldHalf: { flex: 1, display: "flex", flexDirection: "column", gap: "8px" },
  label: {
    fontFamily: "'Jost', sans-serif",
    fontSize: "11px",
    letterSpacing: "1.5px",
    textTransform: "uppercase",
    color: "#a0aec0",
  },
  input: {
    background: "#111f3a",
    border: "1px solid #1e2d4a",
    borderRadius: "4px",
    padding: "12px 16px",
    color: "#f0f0f0",
    fontFamily: "'Jost', sans-serif",
    fontSize: "13px",
    outline: "none",
    width: "100%",
    transition: "border-color 0.2s",
  },
  error: {
    fontFamily: "'Jost', sans-serif",
    fontSize: "11px",
    color: "#e57373",
    letterSpacing: "0.3px",
  },
  strengthTrack: {
    height: "3px",
    background: "#1e2d4a",
    borderRadius: "2px",
    overflow: "hidden",
  },
  strengthFill: {
    height: "100%",
    borderRadius: "2px",
    transition: "width 0.3s, background 0.3s",
  },
  strengthLabel: {
    fontFamily: "'Jost', sans-serif",
    fontSize: "10px",
    letterSpacing: "1px",
    textTransform: "uppercase",
    marginTop: "4px",
    display: "block",
  },
  errorBox: {
    background: "rgba(229, 115, 115, 0.1)",
    border: "1px solid rgba(229, 115, 115, 0.3)",
    borderRadius: "4px",
    padding: "10px 14px",
    color: "#e57373",
    fontFamily: "'Jost', sans-serif",
    fontSize: "12px",
  },
  button: {
    background: "#ffffff",
    color: "#0a0f1e",
    border: "none",
    borderRadius: "4px",
    padding: "14px",
    fontFamily: "'Jost', sans-serif",
    fontSize: "11px",
    fontWeight: "500",
    letterSpacing: "3px",
    textTransform: "uppercase",
    transition: "all 0.2s",
    marginTop: "4px",
    width: "100%",
  },
  divider: { borderTop: "1px solid #1e2d4a", margin: "28px 0" },
  loginText: {
    textAlign: "center",
    fontFamily: "'Jost', sans-serif",
    fontSize: "13px",
    color: "#4a5568",
  },
  link: {
    color: "#c8a96e",
    cursor: "pointer",
    textDecoration: "underline",
    textUnderlineOffset: "3px",
  },
};

export default Register;
