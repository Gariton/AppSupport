import { cookies } from "next/headers";

export type Locale = "ja" | "en";

export const LOCALE_COOKIE = "gar_lang";
export const LOCALES: Locale[] = ["ja", "en"];

export async function getLocale(): Promise<Locale> {
  const store = await cookies();
  return store.get(LOCALE_COOKIE)?.value === "en" ? "en" : "ja";
}

export type Capability = { n: string; title: string; body: string };
export type ComingSoonItem = { name: string; body: string; status: string };

export type Dictionary = {
  // header / nav
  navProducts: string;
  navAbout: string;
  navStudio: string;
  navContact: string;
  navAdmin: string;
  // home hero
  heroEyebrow: string;
  heroTitle1: string;
  heroTitle2: string;
  heroLead: string;
  heroPrimary: string;
  heroSecondary: string;
  // home capabilities
  caps: Capability[];
  // home featured
  featuredEyebrow: string;
  featuredCategory: string;
  featuredTagline: string;
  featuredLead: string;
  featuredCta: string;
  // home products preview
  productsEyebrow: string;
  productsTitle: string;
  viewAll: string;
  liveItems: string;
  // home studio
  studioEyebrow: string;
  studioTitle: string;
  studioBody: string;
  contactLabel: string;
  contactCta: string;
  baseLabel: string;
  baseValue: string;
  // products page
  prodPageEyebrow: string;
  prodPageTitle: string;
  prodPageLead: string;
  liveLabel: string;
  viewDetail: string;
  comingSoon: ComingSoonItem[];
  // app detail
  backToProducts: string;
  appSubtitle: string;
  screensLabel: string;
  aboutLabel: string;
  infoLabel: string;
  readMore: string;
  readClose: string;
  appFeatures: Capability[];
  infoCategory: string;
  infoPrice: string;
  infoLanguages: string;
  infoOS: string;
  infoDeveloper: string;
  infoPolicy: string;
  categoryFinance: string;
  priceIAP: string;
  priceFree: string;
  notSet: string;
  notRegistered: string;
  privacyPolicy: string;
};

const ja: Dictionary = {
  navProducts: "プロダクト",
  navAbout: "Gariton Labについて",
  navStudio: "スタジオ",
  navContact: "お問い合わせ",
  navAdmin: "管理画面",

  heroEyebrow: "GARITON LAB — SOFTWARE STUDIO",
  heroTitle1: "日々の不便を、",
  heroTitle2: "小さなプロダクトで。",
  heroLead:
    "Gariton Labは、日常の小さな不便を解決するスマホアプリとWebアプリを、企画から開発・運営まで一貫して手がける個人スタジオです。",
  heroPrimary: "プロダクトを見る",
  heroSecondary: "お問い合わせ",

  caps: [
    { n: "01", title: "課題を見つける", body: "日々の中にある、まだうまく解かれていない小さな不便を見つけます。" },
    { n: "02", title: "体験を設計する", body: "迷わず使えて、暮らしに静かになじむ操作体験を考えます。" },
    { n: "03", title: "自ら開発する", body: "スマホアプリとWebアプリを、企画から実装まで一貫してつくります。" },
    { n: "04", title: "育てつづける", body: "公開して終わりにせず、利用者の声をもとに継続して改善します。" }
  ],

  featuredEyebrow: "FEATURED PRODUCT",
  featuredCategory: "ファイナンス · iOS / Android",
  featuredTagline: "給与明細を、撮るだけ。",
  featuredLead:
    "AIが支給額・控除・手取りを読み取り、毎月の収入を自動で記録。推移をグラフで見える化し、年収の見通しまでひと目で。家計簿が続かなかった人のための、いちばん静かな収入管理。",
  featuredCta: "サラレコを見る",

  productsEyebrow: "PRODUCTS",
  productsTitle: "つくっているもの。",
  viewAll: "すべて見る",
  liveItems: "公開中のプロダクト",

  studioEyebrow: "STUDIO",
  studioTitle: "小さく、確かに、長く使えるものを。",
  studioBody:
    "流行りの機能を足すより、ひとつの操作をなめらかにすること。Gariton Labは、必要なものだけを丁寧に設計し、長く付き合える自社プロダクトを育てています。",
  contactLabel: "お問い合わせ",
  contactCta: "お問い合わせフォーム",
  baseLabel: "拠点",
  baseValue: "Japan",

  prodPageEyebrow: "PRODUCTS — 2026",
  prodPageTitle: "Gariton Lab のプロダクト。",
  prodPageLead: "いま使えるアプリと、これからのもの。すべて自社で企画・設計・開発しています。",
  liveLabel: "公開中",
  viewDetail: "詳細を見る",
  comingSoon: [
    { name: "（開発中のプロジェクト）", body: "次のプロダクトを準備しています。", status: "準備中" },
    { name: "小さなツール", body: "毎日の小さな面倒をなくすユーティリティを試作中です。", status: "準備中" },
    { name: "Webアプリ", body: "ブラウザから使える小さなサービスを検討しています。", status: "準備中" }
  ],

  backToProducts: "プロダクト一覧へ",
  appSubtitle: "給与明細を撮るだけ。AIが収入を自動で記録",
  screensLabel: "SCREENS",
  aboutLabel: "ABOUT",
  infoLabel: "INFORMATION",
  readMore: "続きを読む",
  readClose: "閉じる",
  appFeatures: [
    { n: "01", title: "撮るだけ入力", body: "明細を撮影するだけ。AIが項目を読み取り、自動で記録します。" },
    { n: "02", title: "手取りの推移", body: "毎月の手取りをグラフで可視化。増減がひと目でわかります。" },
    { n: "03", title: "控除の内訳", body: "保険・年金・税金を自動分類。何にいくら引かれたかが明確に。" },
    { n: "04", title: "年収の見通し", body: "ボーナスを含めた年収を推定。将来の計画が立てやすく。" }
  ],
  infoCategory: "カテゴリ",
  infoPrice: "価格",
  infoLanguages: "対応言語",
  infoOS: "対応OS",
  infoDeveloper: "デベロッパ",
  infoPolicy: "ポリシー",
  categoryFinance: "ファイナンス",
  priceIAP: "無料（App内課金あり）",
  priceFree: "無料",
  notSet: "未設定",
  notRegistered: "未登録",
  privacyPolicy: "プライバシーポリシー"
};

const en: Dictionary = {
  navProducts: "Products",
  navAbout: "About",
  navStudio: "Studio",
  navContact: "Contact",
  navAdmin: "Admin",

  heroEyebrow: "GARITON LAB — SOFTWARE STUDIO",
  heroTitle1: "Software, and",
  heroTitle2: "the calm beyond it.",
  heroLead:
    "From concept to design, engineering and distribution. Gariton Lab is a small studio crafting software and mobile apps that make everyday life a little lighter.",
  heroPrimary: "View products",
  heroSecondary: "Get in touch",

  caps: [
    { n: "01", title: "Concept", body: "From finding the real problem to defining the value worth building." },
    { n: "02", title: "UI / UX", body: "Flows that never make you think, and a quiet, pleasant feel." },
    { n: "03", title: "Mobile", body: "Native-quality iOS / Android that simply, reliably works." },
    { n: "04", title: "Distribution", body: "From store submission to growth and continuous improvement." }
  ],

  featuredEyebrow: "FEATURED PRODUCT",
  featuredCategory: "Finance · iOS / Android",
  featuredTagline: "Just snap your payslip.",
  featuredLead:
    "AI reads your gross pay, deductions and take-home, recording income automatically each month. See trends at a glance and project your yearly income — the quietest way to track what you earn.",
  featuredCta: "View Sararecord",

  productsEyebrow: "PRODUCTS",
  productsTitle: "What we build.",
  viewAll: "View all",
  liveItems: "live products",

  studioEyebrow: "STUDIO",
  studioTitle: "Small, certain, built to last.",
  studioBody:
    "Rather than piling on trends, we smooth a single gesture. Gariton Lab carefully designs and grows its own software products, made to stay useful for years.",
  contactLabel: "Contact",
  contactCta: "Contact form",
  baseLabel: "Based in",
  baseValue: "Japan",

  prodPageEyebrow: "PRODUCTS — 2026",
  prodPageTitle: "Products by Gariton Lab.",
  prodPageLead:
    "Apps you can use today, and the ones still taking shape. All conceived, designed and built in-house.",
  liveLabel: "LIVE",
  viewDetail: "View detail",
  comingSoon: [
    { name: "(In development)", body: "Our next product is in the works.", status: "SOON" },
    { name: "Small utility", body: "Prototyping a tool that removes everyday friction.", status: "SOON" },
    { name: "Web app", body: "Exploring a small service that works right in the browser.", status: "SOON" }
  ],

  backToProducts: "Back to products",
  appSubtitle: "Snap your payslip. AI records your income.",
  screensLabel: "SCREENS",
  aboutLabel: "ABOUT",
  infoLabel: "INFORMATION",
  readMore: "Read more",
  readClose: "Close",
  appFeatures: [
    { n: "01", title: "Snap to log", body: "Just photograph a payslip. AI reads each line and records it for you." },
    { n: "02", title: "Take-home trends", body: "Your net pay visualised month by month, at a glance." },
    { n: "03", title: "Deduction breakdown", body: "Insurance, pension and tax sorted automatically — see exactly where it went." },
    { n: "04", title: "Yearly forecast", body: "Projects your annual income with bonuses, so planning is easy." }
  ],
  infoCategory: "Category",
  infoPrice: "Price",
  infoLanguages: "Languages",
  infoOS: "OS",
  infoDeveloper: "Developer",
  infoPolicy: "Policy",
  categoryFinance: "Finance",
  priceIAP: "Free (In-App Purchases)",
  priceFree: "Free",
  notSet: "—",
  notRegistered: "None",
  privacyPolicy: "Privacy Policy"
};

const dictionaries: Record<Locale, Dictionary> = { ja, en };

export function getDict(locale: Locale): Dictionary {
  return dictionaries[locale];
}
