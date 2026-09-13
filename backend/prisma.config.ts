import { definePrismaConfig } from "prisma/config";

export default definePrismaConfig({
  skills: {
    agents: ["claude", "cursor", "agents", "devin"],
  },
});

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}