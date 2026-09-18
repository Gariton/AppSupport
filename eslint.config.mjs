import { globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";

const config = [globalIgnores(["cloudflare-env.d.ts", "dist/**", ".vinext/**", ".wrangler/**"]), ...nextVitals];

export default config;
