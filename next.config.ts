import type { NextConfig } from "next";
import { networkInterfaces } from "node:os";

const allowedDevOrigins:string[]=[];
for(const entries of Object.values(networkInterfaces())){
  for(const entry of entries??[]){
    if(entry.family==="IPv4"&&!entry.internal)allowedDevOrigins.push(entry.address);
  }
}

const nextConfig: NextConfig = {
  allowedDevOrigins,
  distDir:process.env.NEXT_DIST_DIR||".next",
};

export default nextConfig;
