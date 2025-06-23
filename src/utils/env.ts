const { NEXT_PUBLIC_API_URL } = process.env;

if (!NEXT_PUBLIC_API_URL) {
  throw new Error("NEXT_PUBLIC_API_URL is not set");
}

export const env = {
  apiUrl: NEXT_PUBLIC_API_URL,
};