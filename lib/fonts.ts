import { Dancing_Script ,Exo_2, Noto_Sans,Nunito_Sans,Work_Sans,Oswald, Montserrat,Domine } from "@next/font/google";

export const pageTitleFont = Exo_2({
  weight: ["700"],
  subsets: ["latin"],
  variable: '--font-title',
});

export const greetingsFont = Domine({
  weight: ["700"],
  subsets: ["latin"],
  variable: '--font-title',
});

export const headerFont = Montserrat({
  weight: ["500", "600", "700"],
  subsets: ["latin"],
  variable: '--font-header',
});
export const subheaderFont = Montserrat({
  weight: ["500", "600", "700"],
  subsets: ["latin"],
  variable: '--font-sub-header',
});

export const bodyFont = Montserrat({
  weight: ["200","300"],
  subsets: ["latin"],
  variable: '--font-body',
});