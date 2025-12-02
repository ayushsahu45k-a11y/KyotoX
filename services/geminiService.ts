export async function sendMessageToGemini(message: string) {
  const API_URL = import.meta.env.VITE_BACKEND_URL;

  try {
    const res = await fetch(`${API_URL}/api/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message }),
    });

    if (!res.ok) {
      throw new Error("Backend error: " + res.status);
    }

    const data = await res.json();
    return data.reply;

  } catch (err) {
    console.error("Frontend fetch error:", err);
    return "⚠️ Server not responding. Check backend logs.";
  }
}

export function initializeChat() {
  return true;
}
