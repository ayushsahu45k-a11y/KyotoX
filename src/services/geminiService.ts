export async function sendMessageToGemini(message: string) {
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:10000";

  if (!API_URL) {
    console.error("❌ VITE_API_URL is missing in environment variables.");
    return "⚠️ Frontend misconfigured: Missing VITE_API_URL.";
  }

  try {
    const res = await fetch(`${API_URL}/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ message }),
    });

    if (!res.ok) {
      const errorText = await res.text().catch(() => "Unknown error");
      console.error("Backend error:", res.status, errorText);
      return `⚠️ Backend error (${res.status}). Check backend logs.`;
    }

    const data = await res.json().catch(() => null);

    if (!data || typeof data.reply !== "string") {
      console.error("Invalid backend response:", data);
      return "⚠️ Invalid response from backend. Check API.";
    }

    return data.reply;

  } catch (err) {
    console.error("Frontend fetch error:", err);
    return "⚠️ Cannot reach backend. Check API_URL or backend logs.";
  }
}

export function initializeChat() {
  return true;
}
