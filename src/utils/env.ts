export const env = {
  apiUrl: process.env.NEXT_PUBLIC_POCKET_API_URL || "",
};

if (!env.apiUrl) {
  throw new Error("NEXT_PUBLIC_POCKET_API_URL is not set");
}
