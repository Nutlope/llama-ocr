import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["test/**/*.test.ts"],
    // 1 minute timeout
    testTimeout: 60 * 1000,
  },
});
