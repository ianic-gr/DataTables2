// src/i18n.js
import { createI18n } from "vue-i18n";
import { el as elMessages, en as enMessages, de as deMessages, pt as ptMessages } from "../lib/locale";

const messages = {
  el: {
    $datatables: {
      ...elMessages,
    },
  },
  en: {
    $datatables: {
      ...enMessages,
    },
  },
  de: {
    $datatables: {
      ...deMessages,
    },
  },
  pt: {
    $datatables: {
      ...ptMessages,
    },
  },
};

const i18n = createI18n({
  locale: "en",
  fallbackLocale: "en",
  legacy: false,
  messages,
});

export default i18n;
