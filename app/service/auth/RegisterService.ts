import { API_URL } from "@/app/constants";

export interface RegisterData {
  username: string;
  password: string;
  roles: string[];
}

export interface RegisterSuccessData {
  id: number;
  roles: string[];
  username: string;
}

/** Field-level validation errors from API, e.g. { username: "username is required" } */
export interface RegisterValidationErrors {
  [field: string]: string;
}

export interface RegisterResponse {
  data?: RegisterSuccessData | RegisterValidationErrors | null;
  status?: {
    code: string;
    message: string;
  };
}

export const registerService = async (
  data: RegisterData
): Promise<RegisterResponse & { success: boolean; error?: string }> => {
  try {
    const res = await fetch(`${API_URL}/auth/register`, {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        accept: "*/*",
        "Content-Type": "application/json",
      },
    });

    const contentType = res.headers.get("content-type");
    let responseData: RegisterResponse;

    if (contentType?.includes("application/json")) {
      responseData = await res.json();
    } else {
      const text = await res.text();
      return {
        success: false,
        error: res.ok
          ? "Invalid response from server"
          : `Request failed (${res.status}): ${text.slice(0, 100)}`,
      };
    }

    const success =
      res.ok && responseData.status?.message === "REGISTER_SUCCESS";
    return { ...responseData, success };
  } catch (e) {
    const message = e instanceof Error ? e.message : "Network error";
    return {
      success: false,
      error: message.includes("fetch")
        ? "Cannot reach server. Is the API running at http://localhost:8080?"
        : "Something went wrong. Please try again.",
    };
  }
};

/** Check if API returned field-level validation errors */
export const isValidationError = (
  data: RegisterResponse["data"]
): data is RegisterValidationErrors =>
  !!data &&
  typeof data === "object" &&
  !("id" in data) &&
  Object.values(data).some((v) => typeof v === "string");
