export type Lang = "sl" | "en";

export const translations = {
  sl: {
    nav: {
      home: "DOMOV",
      shop: "TRGOVINA",
      blog: "BLOG",
      about: "O NAS",
      contact: "KONTAKT",
    },
    announcements: [
      "🚚  Brezplačna dostava za naročila nad 200 €",
      "🔬  Čistost >99 % — HPLC in MS verificirano",
      "📦  Diskretna in varna dostava po vsej EU",
    ],
    cart: {
      title: "Košarica",
      empty: "Vaša košarica je prazna.",
      continueShopping: "Nadaljuj z nakupom",
      viewCart: "Odpri košarico",
      subtotal: "Vmesni seštevek",
      shipping: "Dostava",
      freeShipping: "Brezplačno",
      freeShippingNote: "Brezplačna dostava nad 200 €",
      total: "Skupaj",
      whatsapp: "Naroči via WhatsApp",
    },
    footer: {
      quickLinks: "Hitre povezave",
      payments: "Sprejemamo plačila",
      disclaimer:
        "Vsi izdelki so namenjeni izključno za raziskovalne, laboratorijske ali analitske namene in niso namenjeni za človeško porabo.",
      legal:
        "SloPeps je dobavitelj kemikalij, ne lekarna ali licencirani proizvajalec zdravil. Naši izdelki niso bili ocenjeni s strani regulatornih organov in niso namenjeni za diagnozo, zdravljenje ali preprečevanje bolezni.",
      fine: "Zaužitje s strani ljudi/živali prepovedano. Samo za laboratorijsko/in-vitro eksperimentalno uporabo.",
      copyright: `© ${new Date().getFullYear()} SloPeps. Vse pravice pridržane.`,
    },
    links: [
      { label: "Peptidi", href: "/shop" },
      { label: "O nas", href: "/about" },
      { label: "Blog", href: "/blog" },
      { label: "Dostava, vračila in povračila", href: "/dostava" },
      { label: "Zasebnost", href: "/zasebnost" },
      { label: "Pogoji poslovanja", href: "/pogoji" },
      { label: "Kontakt", href: "/contact" },
    ],
  },
  en: {
    nav: {
      home: "HOME",
      shop: "SHOP",
      blog: "BLOG",
      about: "ABOUT",
      contact: "CONTACT",
    },
    announcements: [
      "🚚  Free shipping on orders over €200",
      "🔬  Purity >99% — HPLC and MS verified",
      "📦  Discreet and safe delivery across the EU",
    ],
    cart: {
      title: "Cart",
      empty: "Your cart is empty.",
      continueShopping: "Continue shopping",
      viewCart: "View cart",
      subtotal: "Subtotal",
      shipping: "Shipping",
      freeShipping: "Free",
      freeShippingNote: "Free shipping over €200",
      total: "Total",
      whatsapp: "Order via WhatsApp",
    },
    footer: {
      quickLinks: "Quick links",
      payments: "We accept",
      disclaimer:
        "All products are intended solely for research, laboratory or analytical purposes and are not intended for human consumption.",
      legal:
        "SloPeps is a chemical supplier, not a pharmacy or licensed drug manufacturer. Our products have not been evaluated by regulatory authorities and are not intended to diagnose, treat or prevent any disease.",
      fine: "Human/animal consumption is prohibited. For laboratory/in-vitro experimental use only.",
      copyright: `© ${new Date().getFullYear()} SloPeps. All rights reserved.`,
    },
    links: [
      { label: "Peptides", href: "/shop" },
      { label: "About us", href: "/about" },
      { label: "Blog", href: "/blog" },
      { label: "Shipping, returns & refunds", href: "/dostava" },
      { label: "Privacy", href: "/zasebnost" },
      { label: "Terms of business", href: "/pogoji" },
      { label: "Contact", href: "/contact" },
    ],
  },
} as const;

export type Translations = typeof translations.sl;
