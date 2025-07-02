const { NEXT_PUBLIC_API_URL } = process.env;


// TODO: Fix env handling. Gets in server side, but not in client side.
export const env = {
  apiUrl: NEXT_PUBLIC_API_URL || "",
};

if (!env.apiUrl) {
  throw new Error("NEXT_PUBLIC_API_URL is not set");
}