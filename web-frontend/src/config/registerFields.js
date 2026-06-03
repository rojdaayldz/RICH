export const registerFields = [
  { name: "isim", label: "İsim", type: "text", required: true },
  { name: "soyisim", label: "Soyisim", type: "text", required: true },
  { name: "email", label: "Email Adresi", type: "email", required: true },
  { name: "phone", label: "Telefon", type: "tel", required: false },
  { name: "password", label: "Parola", type: "password", required: true },
];

export const validatePhone = (value) => {
  if (!value) return "";
  return /^\+?[0-9\s()-]{10,20}$/.test(value)
    ? ""
    : "Geçerli bir telefon numarası girin.";
};
