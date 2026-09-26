import "dotenv/config";

import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",

  migrations: {
    path: "prisma/migrations",
  },

  datasource: {
    // Migrations precisam de uma conexão direta/session pooler; a função
    // serverless continua usando DATABASE_URL (transaction pooler) em runtime.
    url: process.env["DIRECT_URL"] ?? process.env["DATABASE_URL"],
  },
});
