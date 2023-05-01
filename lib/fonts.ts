import { Dancing_Script ,Exo_2, Noto_Sans,Nunito_Sans,Work_Sans,Oswald } from "@next/font/google";

export const titleFont = Dancing_Script({
  weight: ["700"],
  subsets: ["latin"],
  variable: '--font-title',

});
export const headerFont = Oswald({
  weight: ["500", "600", "700"],
  subsets: ["latin"],
  variable: '--font-header',
});
export const subheaderFont = Work_Sans({
  weight: ["500", "600", "700"],
  subsets: ["latin"],
  variable: '--font-sub-header',
});

export const bodyFont = Nunito_Sans({
  weight: ["200","300"],
  subsets: ["latin"],
  variable: '--font-body',
});