import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
webpack: (config: { externals: string[]; }) => {
    config.externals.push("bcrypt");
    return config;
  },
};

///** @type {import('next').NextConfig} */
//const nextConfig = {
  //webpack: (config: { externals: string[]; }) => {
    //config.externals.push("bcrypt");
    //return config;
  //},
//};

export default nextConfig;
