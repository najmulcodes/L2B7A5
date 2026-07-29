function required(name: string, value: string | undefined): string {
  if (!value) {
    throw new Error(
      `Missing required environment variable: ${name}. Check your .env.local (see .env.example).`,
    );
  }
  return value;
}

export const env = {
  API_URL: required("NEXT_PUBLIC_API_URL", process.env.NEXT_PUBLIC_API_URL).replace(/\/+$/, ""),
};
