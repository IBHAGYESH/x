const config = {
  apiUrl: process.env.NEXT_PUBLIC_API_URL,
  featureToggle: process.env.NEXT_PUBLIC_ENABLE_FEATURE_X === "true",
  // Add more as needed
};

export default config;
