import { Font } from "@react-pdf/renderer";
import path from "path";

let registered = false;

// Base14 PDF fonts don't reliably cover Slovenian diacritics (š č ž), so we
// embed Noto Sans (OFL-licensed) instead. This is separate from — and
// unrelated to — the QR-payload transliteration in lib/upn-qr.ts: this file
// controls the *visible* PDF text, which should keep full diacritics.
export function registerFonts() {
  if (registered) return;
  registered = true;

  Font.register({
    family: "NotoSans",
    fonts: [
      { src: path.join(process.cwd(), "public/fonts/NotoSans-Regular.ttf"), fontWeight: "normal" },
      { src: path.join(process.cwd(), "public/fonts/NotoSans-Bold.ttf"), fontWeight: "bold" },
    ],
  });

  // react-pdf hyphenates long words by default using an English dictionary,
  // which mangles Slovenian text — disable it.
  Font.registerHyphenationCallback((word) => [word]);
}
