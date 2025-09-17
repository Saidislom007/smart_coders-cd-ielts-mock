import React, { useState, useEffect } from "react";
import "./writing.css";
import InstructionPage from "../components/InstructionPage";
import ReadingTimer from "../components/ReadingTimer";
import writingData from "../data/writingTest.json";
import FeedbackBox from "./FeedbackBox";

// Telegram ma'lumotlari env dan
const TELEGRAM_TOKEN = import.meta.env.VITE_TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = import.meta.env.VITE_TELEGRAM_CHAT_ID;

// AI kalitini bevosita kod ichida ishlatamiz (envsiz)
const OPENROUTER_KEY = "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";

export default function Writing() {
  const [step, setStep] = useState(1);
  const [task1, setTask1] = useState("");
  const [task2, setTask2] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const [userInfo, setUserInfo] = useState({ name: "", last_name: "", middle_name: "", phone: "" });
  const [writingTest, setWritingTest] = useState(null);
  const [fontSize, setFontSize] = useState(16);
  const [testFinished, setTestFinished] = useState(false);
  const [testStarted, setTestStarted] = useState(false);
  const [timerKey, setTimerKey] = useState(0);

  const [feedback, setFeedback] = useState(null);
  const [loadingFeedback, setLoadingFeedback] = useState(false);

  const increaseFont = () => setFontSize((prev) => Math.min(prev + 2, 48));
  const decreaseFont = () => setFontSize((prev) => Math.max(prev - 2, 10));

  useEffect(() => {
    setWritingTest(writingData[0]);
    const saved = JSON.parse(localStorage.getItem("writing_essay"));
    const user = JSON.parse(localStorage.getItem("user"));
    if (saved) {
      setTask1(saved.task1 || "");
      setTask2(saved.task2 || "");
      setStep(saved.step || 1);
      setTestStarted(saved.testStarted || false);
    }
    if (user) setUserInfo(user);
  }, []);

  const wordCount = (text) => text.trim().split(/\s+/).filter(Boolean).length;

  const startTest = () => {
    setTestStarted(true);
    setTestFinished(false);
    setTimerKey(prev => prev + 1);
    localStorage.setItem("writing_essay", JSON.stringify({
      task1, task2, step, testStarted: true
    }));
  };

  const handleSave = () => {
    const submission = {
      task1,
      task2,
      wordCount1: wordCount(task1),
      wordCount2: wordCount(task2),
      submittedAt: new Date().toISOString(),
      userInfo,
      step,
      testStarted
    };
    localStorage.setItem("writing_essay", JSON.stringify(submission));
    const all = JSON.parse(localStorage.getItem("writing_essay_submissions")) || [];
    all.push(submission);
    localStorage.setItem("writing_essay_submissions", JSON.stringify(all));
  };

  const sendToTelegram = async (taskText, taskNum) => {
    const message = `
✍️ *IELTS Writing Task ${taskNum}*

👤 *Foydalanuvchi:* ${userInfo.name} ${userInfo.middle_name} ${userInfo.last_name}
📞 *Telefon:* ${userInfo.phone}
📅 *Sana:* ${new Date().toLocaleString()}

📝 *Yozuv:*
${taskText}
    `;
    try {
      await fetch(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: TELEGRAM_CHAT_ID,
          text: message,
          parse_mode: "Markdown",
        }),
      });
    } catch (err) {
      console.error("Telegramga yuborishda xatolik:", err);
    }
  };

  // ✅ OpenRouter orqali IELTS feedback olish
  const getFeedback = async (task1Text, task2Text) => {
    setLoadingFeedback(true);
    setFeedback(null);

    const prompt = `
You are an IELTS examiner.
Evaluate the following IELTS Writing Task 1 and Task 2 responses together.
Give band scores (0-9) for Task Response, Coherence, Lexical Resource, and Grammar.
Also calculate the Overall Band Score.

Return ONLY valid JSON in this schema:
{
 "task1": {
   "task_response": { "score": number, "comments": [string] },
   "coherence": { "score": number, "comments": [string] },
   "lexical": { "score": number, "comments": [string] },
   "grammar": { "score": number, "comments": [string] }
 },
 "task2": {
   "task_response": { "score": number, "comments": [string] },
   "coherence": { "score": number, "comments": [string] },
   "lexical": { "score": number, "comments": [string] },
   "grammar": { "score": number, "comments": [string] }
 },
 "overall_score": number,
 "improvement_actions": [string],
 "rewritten_paragraph": string
}

Task 1:
${task1Text}

Task 2:
${task2Text}
`;

    try {
      const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${OPENROUTER_KEY}`,
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [{ role: "user", content: prompt }],
          temperature: 0.0,
        }),
      });

      if (!res.ok) {
        throw new Error(`API error: ${res.status} ${res.statusText}`);
      }

      const data = await res.json();

      // ✅ Xavfsiz tekshiruv
      if (!data.choices || !data.choices[0]?.message?.content) {
        throw new Error("AI javob noto‘g‘ri formatda keldi");
      }

      let raw = data.choices[0].message.content.trim();

      // JSON qirqib olish
      const firstBrace = raw.indexOf("{");
      const lastBrace = raw.lastIndexOf("}");
      if (firstBrace !== -1 && lastBrace !== -1) {
        raw = raw.slice(firstBrace, lastBrace + 1);
      }

      let parsed;
      try {
        parsed = JSON.parse(raw);
      } catch (e) {
        console.error("JSON parse xatolik:", e, "AI javobi:", raw);
        throw new Error("JSONni parse qilib bo‘lmadi");
      }

      setFeedback(parsed);
    } catch (err) {
      console.error("Feedback olishda xatolik:", err);
      alert("Feedback olishda xatolik: " + err.message);
    } finally {
      setLoadingFeedback(false);
    }
  };

  const handleTimeUp = () => {
    alert("Time is up! Saving your progress...");
    handleSave();
    setTestFinished(true);
  };

  const renderTask = (taskNum) => {
    if (!writingTest) return <p>⏳ Savollar yuklanmoqda...</p>;

    const taskData = taskNum === 1 ? writingTest.task1[0] : writingTest.task2[0];
    const prompt = taskData?.question_text || "";
    const image = taskData?.image || "";
    const value = taskNum === 1 ? task1 : task2;
    const setValue = taskNum === 1 ? setTask1 : setTask2;

    return (
      <div className={`writing-container ${darkMode ? "dark" : ""}`}>
        {testStarted && !testFinished && (
          <div style={{ position: "fixed", top: 20, right: 20, zIndex: 9999, display: "flex", gap: 10 }}>
            <ReadingTimer key={timerKey} onTimeUp={handleTimeUp} isRunning={testStarted && !testFinished} />
            <div style={{ background: "#f0f0f0", padding: "8px 16px", borderRadius: "6px", display: "flex", gap: 10 }}>
              <button onClick={decreaseFont}>-</button>
              <button onClick={increaseFont}>+</button>
            </div>
          </div>
        )}

        {!testStarted ? (
          <div style={{ textAlign: "center", marginTop: "3rem" }}>
            <InstructionPage section={"writing"} />
            <button className="nav-button" onClick={startTest}>Start Test</button>
          </div>
        ) : (
          <>
            <div className="topbar">
              <h1>📝 IELTS Writing Task {taskNum}</h1>
            </div>

            <div className="content">
              <div className="prompt">
                {prompt}
                {taskNum === 1 && image && <img src={image} alt="Task 1" className="task-image" />}
              </div>

              <div className="answer-section">
                <textarea
                  className="writing-area"
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  placeholder="Write here..."
                  style={{ fontSize: `${fontSize}px` }}
                />
                <div className="meta">
                  Word Count: <strong>{wordCount(value)}</strong>
                </div>

                <div className="btns">
                  {taskNum === 2 && (
                    <button className="back-btn" onClick={() => setStep(1)}>⬅️ Previous</button>
                  )}
                  <button
                    className="main-btn"
                    onClick={async () => {
                      handleSave();
                      await sendToTelegram(value, taskNum);
                      if (taskNum === 1) {
                        setStep(2);
                      } else {
                        // ✅ End of test
                        setTestFinished(true);
                        setLoadingFeedback(true);
                        await getFeedback(task1, task2);
                      }
                    }}
                  >
                    {taskNum === 1 ? "Next ➡️" : "✅ Complete"}
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    );
  };

  // ✅ Oxirida Feedback chiqadi
  if (testFinished) {
    return (
      <FeedbackBox
        loading={loadingFeedback}
        feedback={feedback}
        darkMode={darkMode}
      />
    )
  }

  return step === 1 ? renderTask(1) : renderTask(2);
}
