import { warmup } from "@/ai";

export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    try {
      await warmup();
      console.log("[ai] model loaded on startup");
    } catch (err) {
      console.error("[ai] model warmup failed:", err);
    }
  }
}
