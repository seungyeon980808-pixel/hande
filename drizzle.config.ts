import { defineConfig } from "drizzle-kit";
export default defineConfig({schema:"./src/db/schema.ts",out:"./drizzle",dialect:"postgresql",dbCredentials:{url:process.env.DATABASE_URL||"postgresql://school:school@localhost:5432/school_work"}});
