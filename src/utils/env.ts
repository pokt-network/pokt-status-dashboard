const { NEXT_PUBLIC_POCKET_API_URL } = process.env;

export const env = {
  apiUrl: NEXT_PUBLIC_POCKET_API_URL || process.env.pocketApiUrl || "",
};

if (!env.apiUrl) {
  throw new Error("NEXT_PUBLIC_POCKET_API_URL is not set");
}