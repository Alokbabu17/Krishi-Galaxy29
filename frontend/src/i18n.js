// frontend/src/i18n.js
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
  en: {
    translation: {
      "home.title": "Krishi Galaxy",
      "home.subtitle": "Smart Kisan Portal",
      "nav.home": "Home",
      "nav.market": "Market Rate",
      "nav.drone": "Drone",
      "nav.pest": "Pest Detection",
      "nav.training": "Training",
      "nav.subsidy": "Subsidy",
      "nav.lexa": "Krishi-Lexa",
      "nav.language": "Language",
      "buttons.market": "Check crops market rate",
      "buttons.drone": "Apply for Drone Sprinkling pesticide",
      "buttons.pest": "Check for pest in Field",
      "buttons.training": "Apply for Agro Training Session",
      "buttons.lexa": "Ask your AI Voice Assistant",
      "buttons.more": "Explore more features",
      "weather.title": "Weather",
      "weather.rain": "Rain expected",
      "weather.no_rain": "No rain expected"
    }
  },
  hi: {
    translation: {
      "home.title": "कृषि Galaxy",
      "home.subtitle": "स्मार्ट किसान पोर्टल",
      "nav.home": "होम",
      "nav.market": "बाज़ार भाव",
      "nav.drone": "ड्रोन",
      "nav.pest": "पेस्ट जांच",
      "nav.training": "प्रशिक्षण",
      "nav.subsidy": "सब्सिडी",
      "nav.lexa": "कृषी-लेक्सा",
      "nav.language": "भाषा",
      "buttons.market": "फसलों का बाजार भाव देखें",
      "buttons.drone": "ड्रोन छिड़काव के लिए आवेदन करें",
      "buttons.pest": "खेतों में पेस्ट की जांच करें",
      "buttons.training": "कृषि प्रशिक्षण सत्र के लिए आवेदन करें",
      "buttons.lexa": "अपना AI वॉइस असिस्टेंट पूछें",
      "buttons.more": "अन्य सुविधाएँ देखें",
      "weather.title": "मौसम",
      "weather.rain": "बारिश होने की संभावना है",
      "weather.no_rain": "बारिश नहीं होगी"
    }
  },

  /* Placeholder entries for other languages — currently copy English.
     Replace the strings below with real translations when available. */
  mr: { translation: {} },
  pa: { translation: {} },
  bn: { translation: {} },
  gu: { translation: {} },
  ta: { translation: {} },
  te: { translation: {} },
  kn: { translation: {} },
  ml: { translation: {} },
  or: { translation: {} },
  as: { translation: {} },
  ur: { translation: {} },
  sd: { translation: {} }
};

// For the placeholder languages: copy en->translation automatically (so keys exist)
const fillPlaceholders = () => {
  const en = resources.en.translation;
  ["mr","pa","bn","gu","ta","te","kn","ml","or","as","ur","sd"].forEach(code => {
    if (!resources[code] || !resources[code].translation || Object.keys(resources[code].translation).length===0) {
      resources[code] = { translation: { ...en } };
    }
  });
};
fillPlaceholders();

i18n.use(initReactI18next).init({
  resources,
  lng: localStorage.getItem("app_lang") || "hi", // default Hindi (as your base)
  fallbackLng: "en",
  interpolation: { escapeValue: false }
});

export default i18n;
