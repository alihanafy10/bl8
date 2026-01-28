// Egyptian Governorates with major regions/cities
const egyptianGovernorates = [
  {
    id: 1,
    name_en: "Cairo",
    name_ar: "القاهرة",
    regions: ["Heliopolis", "Nasr City", "Maadi", "Zamalek", "Downtown", "New Cairo", "Helwan", "Mokattam", "Shubra"]
  },
  {
    id: 2,
    name_en: "Giza",
    name_ar: "الجيزة",
    regions: ["6th of October City", "Sheikh Zayed", "Dokki", "Mohandessin", "Agouza", "Haram", "Faisal", "Imbaba"]
  },
  {
    id: 3,
    name_en: "Alexandria",
    name_ar: "الإسكندرية",
    regions: ["Montaza", "Borg El Arab", "Miami", "Stanley", "Sidi Gaber", "Smouha", "Agami", "El Alamein"]
  },
  {
    id: 4,
    name_en: "Dakahlia",
    name_ar: "الدقهلية",
    regions: ["Mansoura", "Talkha", "Mit Ghamr", "Belqas", "Dikirnis", "Aga", "Manzala"]
  },
  {
    id: 5,
    name_en: "Red Sea",
    name_ar: "البحر الأحمر",
    regions: ["Hurghada", "Safaga", "El Gouna", "Marsa Alam", "Ras Ghareb", "Shalateen"]
  },
  {
    id: 6,
    name_en: "Beheira",
    name_ar: "البحيرة",
    regions: ["Damanhour", "Kafr el-Dawwar", "Rashid", "Edku", "Abu Hummus", "Kom Hamada"]
  },
  {
    id: 7,
    name_en: "Fayoum",
    name_ar: "الفيوم",
    regions: ["Fayoum City", "Ibsheway", "Itsa", "Tamiya", "Sinnuris", "Yusuf El Sediaq"]
  },
  {
    id: 8,
    name_en: "Gharbia",
    name_ar: "الغربية",
    regions: ["Tanta", "El Mahalla El Kubra", "Kafr El Zayat", "Zefta", "Samanoud", "Basyoun"]
  },
  {
    id: 9,
    name_en: "Ismailia",
    name_ar: "الإسماعيلية",
    regions: ["Ismailia City", "Fayed", "Qantara", "Abu Swir", "Kasaseen", "Tel El Kebir"]
  },
  {
    id: 10,
    name_en: "Menofia",
    name_ar: "المنوفية",
    regions: ["Shibin El Kom", "Menouf", "Ashmoun", "Quesna", "Berket El Saba", "Tala", "El Bagour"]
  },
  {
    id: 11,
    name_en: "Minya",
    name_ar: "المنيا",
    regions: ["Minya City", "Mallawi", "Samalut", "Matay", "Bani Mazar", "Maghagha", "Deir Mawas"]
  },
  {
    id: 12,
    name_en: "Qalyubia",
    name_ar: "القليوبية",
    regions: ["Banha", "Qalyub", "Shubra El Kheima", "El Khanka", "Qaha", "Kafr Shukr", "Toukh"]
  },
  {
    id: 13,
    name_en: "New Valley",
    name_ar: "الوادي الجديد",
    regions: ["Kharga", "Dakhla", "Farafra", "Baris", "Balat"]
  },
  {
    id: 14,
    name_en: "Suez",
    name_ar: "السويس",
    regions: ["Suez City", "Ataka", "Ain Sokhna", "Faisal", "Ganayen"]
  },
  {
    id: 15,
    name_en: "Aswan",
    name_ar: "أسوان",
    regions: ["Aswan City", "Kom Ombo", "Daraw", "Edfu", "Nasr El Nuba", "Abu Simbel"]
  },
  {
    id: 16,
    name_en: "Assiut",
    name_ar: "أسيوط",
    regions: ["Assiut City", "Abnub", "Manfalut", "Dayrut", "Qusiya", "Abnoub", "Sahel Selim"]
  },
  {
    id: 17,
    name_en: "Beni Suef",
    name_ar: "بني سويف",
    regions: ["Beni Suef City", "Nasser", "New Beni Suef", "Beba", "Fashn", "Somosta", "Ehnasia"]
  },
  {
    id: 18,
    name_en: "Port Said",
    name_ar: "بورسعيد",
    regions: ["Port Said City", "Port Fouad", "El Arab", "El Manakh", "El Sharq", "El Zohour"]
  },
  {
    id: 19,
    name_en: "Damietta",
    name_ar: "دمياط",
    regions: ["Damietta City", "New Damietta", "Ras El Bar", "Faraskur", "Zarqa", "Kafr Saad"]
  },
  {
    id: 20,
    name_en: "Sharqia",
    name_ar: "الشرقية",
    regions: ["Zagazig", "10th of Ramadan", "Bilbeis", "El Husainiya", "Abu Kabir", "Faqous", "Minya El Qamh"]
  },
  {
    id: 21,
    name_en: "South Sinai",
    name_ar: "جنوب سيناء",
    regions: ["Sharm El Sheikh", "Dahab", "Nuweiba", "Taba", "Saint Catherine", "Ras Sidr"]
  },
  {
    id: 22,
    name_en: "Kafr El Sheikh",
    name_ar: "كفر الشيخ",
    regions: ["Kafr El Sheikh City", "Desouk", "Fuwwah", "Metoubes", "Sidi Salem", "Biyala", "Baltim"]
  },
  {
    id: 23,
    name_en: "Matrouh",
    name_ar: "مطروح",
    regions: ["Marsa Matrouh", "El Alamein", "Sidi Abdel Rahman", "Siwa", "El Hamam", "El Negila"]
  },
  {
    id: 24,
    name_en: "Luxor",
    name_ar: "الأقصر",
    regions: ["Luxor City", "Karnak", "Armant", "Esna", "New Luxor", "El Tod"]
  },
  {
    id: 25,
    name_en: "Qena",
    name_ar: "قنا",
    regions: ["Qena City", "Nag Hammadi", "Qus", "Dishna", "Abu Tesht", "Farshut", "Naqada"]
  },
  {
    id: 26,
    name_en: "North Sinai",
    name_ar: "شمال سيناء",
    regions: ["Arish", "Sheikh Zuweid", "Rafah", "Bir al-Abed", "Hasana", "Nakhl"]
  },
  {
    id: 27,
    name_en: "Sohag",
    name_ar: "سوهاج",
    regions: ["Sohag City", "Akhmim", "Girga", "Dar El Salam", "Balyana", "El Maragha", "Tahta"]
  }
];

module.exports = egyptianGovernorates;
