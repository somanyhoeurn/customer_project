import { auth } from "@/app/lib/auth";

/**
 * Returns headers with Authorization token for secure requests
 */
export async function headerToken(): Promise<HeadersInit> {
  const session = await auth();

  if (!session?.accessToken) {
    throw new Error("No access token found in session.");
  }

  return {
    Authorization: `Bearer ${session.accessToken}`,
    Accept: "*/*",
    "Content-Type": "application/json",
  };
}