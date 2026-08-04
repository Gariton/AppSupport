export type AppRecord = {
  id: string;
  name: string;
  slug: string;
  platform: "ios";
  appStoreUrl: string;
  supportEmail: string;
  description: string;
  hasInAppPurchases: boolean;
  supportedLanguages: string[];
  iconImageUrl: string;
  screenshots: string[];
  createdAt: string;
  updatedAt: string;
};

export type PolicyRecord = {
  id: string;
  appId: string;
  locale: string;
  fileName: string;
  title: string;
  updatedAt: string;
};

export type ContactRecord = {
  id: string;
  appId: string | null;
  category: "app-support" | "bug-report" | "general";
  name: string;
  email: string;
  message: string;
  emailStatus: "pending" | "sent" | "failed" | "not-configured";
  createdAt: string;
};

export type Database = {
  apps: AppRecord[];
  policies: PolicyRecord[];
  contacts: ContactRecord[];
};
