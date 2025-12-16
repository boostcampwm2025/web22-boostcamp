import { config } from "@repo/eslint-config/react-internal";

export default [
  ...config,
  {
    ignores: ["dist/**", "node_modules/**"],
  },
];
