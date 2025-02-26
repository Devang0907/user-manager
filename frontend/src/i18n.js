import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import trans_en from "./locales/en/translation.json";
import trans_hi from "./locales/hi/translation.json";
import trans_gu from "./locales/gu/translation.json";

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: trans_en },
      hi: { translation: trans_hi },
      gu: { translation: trans_gu }
    },
    fallbackLng: "en",
    interpolation: { escapeValue: false },
  });

export default i18n;
