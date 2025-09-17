import { useRef, useState } from "react";

const TELEGRAM_TOKEN = import.meta.env.VITE_TELEGRAM_BOT_TOKEN;
const CHAT_ID = import.meta.env.VITE_TELEGRAM_CHAT_ID;

export const useRecorder = ({ part}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [prepTime, setPrepTime] = useState(0);
  const [timer, setTimer] = useState(0);

  const recorderRef = useRef(null);
  const streamRef = useRef(null);

  const user = JSON.parse(localStorage.getItem("user")) || {
    id: "—",
    name: "Anon",
    last_name: "",
    middle_name: "",
    phone: "",
  };

  // ⏳ Tayyorlanish va recording vaqtlarini boshlash
  const startPrepAndRecording = () => {
    const prep = part === 2 || part === 3 ? 60 : 5;
    const speak = part === 2 || part === 3 ? 120 : 30;
    setPrepTime(prep);
    setTimer(speak);
  };

  // 🎙️ Audio yozishni boshlash
  const startRecording = async (topic = "") => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const chunks = [];

      recorder.ondataavailable = (e) => chunks.push(e.data);
      recorder.onstop = () => {
        const audioBlob = new Blob(chunks, { type: "audio/ogg" });
        sendToTelegram(audioBlob, topic);
      };

      recorder.start();
      recorderRef.current = recorder;
      streamRef.current = stream;
      setIsRecording(true);
    } catch (err) {
      console.error("🎙️ Mikrofon xatosi:", err);
      alert("🎙️ Mikrofonni ishlatishga ruxsat bering!");
    }
  };

  // ⏹️ Audio yozishni to‘xtatish
  const stopRecording = (topic = "") => {
    if (recorderRef.current && isRecording) {
      recorderRef.current.stop();
      streamRef.current?.getTracks().forEach((track) => track.stop());
      setIsRecording(false);
    }
  };

  // 📤 Telegram'ga audio yuborish
  const sendToTelegram = async (audioBlob, topic = "") => {
    const formData = new FormData();
    formData.append("chat_id", CHAT_ID);
    formData.append("voice", audioBlob, "answer.ogg");

    const caption = `🗣️ Speaking Part ${part}${topic ? ` — Topic: ${topic}` `-- Question ${question}`: ""}
👤 ${user.name} ${user.middle_name} ${user.last_name}
🆔 ID: ${user.id}
📞 Telefon: ${user.phone}
📅 Sana: ${new Date().toLocaleString()}`;

    formData.append("caption", caption);

    try {
      await fetch(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendVoice`, {
        method: "POST",
        body: formData,
      });
    } catch (err) {
      console.error("Telegramga yuborishda xatolik:", err);
      alert("⚠️ Telegramga yuborishda muammo yuz berdi.");
    }
  };

  return {
    isRecording,
    prepTime,
    timer,
    setPrepTime,
    setTimer,
    startPrepAndRecording,
    startRecording,
    stopRecording,
  };
};
