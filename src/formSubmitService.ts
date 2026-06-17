export async function submitToFormSubmit(endpoint: string, state: any, files: any) {
  try {
    const formData = new FormData();

    Object.entries(state).forEach(([key, value]) => {
      formData.append(
        key,
        typeof value === "object" ? JSON.stringify(value) : String(value)
      );
    });

    Object.entries(files).forEach(([key, value]) => {
      if (value instanceof File) {
        formData.append(key, value);
      }
    });

    const response = await fetch(endpoint, {
      method: "POST",
      body: formData,
    });

    return {
      success: response.ok,
      message: response.ok ? "Submitted successfully" : "Submission failed",
    };
  } catch {
    return {
      success: false,
      message: "Network error",
    };
  }
}
