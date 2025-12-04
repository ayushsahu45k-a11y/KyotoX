
export async function sendMessageToGemini(message: string) {
  const API_URL = import.meta.env.VITE_API_URL; // 🔥 Correct variable name

  if (!API_URL) {
    console.error("❌ VITE_API_URL is missing in environment variables.");
    return "⚠️ Frontend misconfigured: Missing VITE_API_URL.";
  }

  try {
    const res = await fetch(`${API_URL}/api/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ message }),
    });

    // If backend is down or crashed
    if (!res.ok) {
      console.error("Backend responded with error:", res.status, res.statusText);
      return `⚠️ Backend error (${res.status}). Check server logs.`;
    }

    const data = await res.json();

    // Validate backend response shape
    if (!data || typeof data.reply !== "string") {
      console.error("Invalid backend response:", data);
      return "⚠️ Invalid response from backend. Check API.";
    }

    return data.reply;

  } catch (err) {
    console.error("Frontend fetch error:", err);
    return "⚠️ Cannot reach server. Check backend URL or backend logs.";
  }
}

export function initializeChat() {
  // Some apps initialize model here; yours doesn't need it
  return true;
}
