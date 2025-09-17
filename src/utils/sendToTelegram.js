import axios from "axios";

const BOT_TOKEN = "7334947032:AAE7XNJ_UjENOKZksTvOEg_N4fNnmpIIEjg";
const CHAT_ID = "-1002566851369"; // Telegram guruh ID

export async function sendVoiceToTelegram(blob, username = "Anonymous") {
  const formData = new FormData();
  formData.append("chat_id", CHAT_ID);
  formData.append("caption", `🗣 Speaking response from ${username}`);
  formData.append("voice", blob, "recording.ogg");

  try {
    const res = await axios.post(
      `https://api.telegram.org/bot${BOT_TOKEN}/sendVoice`,
      formData
    );
    return res.data;
  } catch (error) {
    console.error("Telegramga yuborishda xatolik:", error);
    throw error;
  }
}
