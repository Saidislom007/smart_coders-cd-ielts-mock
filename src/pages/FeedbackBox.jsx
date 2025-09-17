import React, { useEffect } from "react";
import "./FeedbackBox.css";

export default function FeedbackBox({ loading, feedback, darkMode }) {
  const getScoreClass = (score) => {
    if (score >= 7) return "score-badge score-green";
    if (score >= 5) return "score-badge score-yellow";
    return "score-badge score-red";
  };

  // ✅ Feedback kelganda natijani backendga yuborish
  useEffect(() => {
    if (!feedback) return;

    const userData = localStorage.getItem("user");
    if (!userData) {
      alert("Foydalanuvchi ma'lumoti topilmadi.");
      return;
    }

    const user = JSON.parse(userData);
    const userId = user.id;

    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/user/test-results/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user: userId,
        reading_correct_answers: 0,
        listening_correct_answers: 0,
        speaking_score: 0,
        writing_score: feedback.overall_score, // ✅ Writing score yuboriladi
      }),
    })
      .then((response) => {
        if (!response.ok) throw new Error("Xatolik yuz berdi.");
        return response.json();
      })
      .then((data) => {
        console.log("Writing natija yuborildi:", data);
        alert("Writing results sent successfully!");
      })
      .catch((error) => {
        console.error("Server xatosi:", error);
        alert("Writing natijani yuborishda xatolik yuz berdi.");
      });
  }, [feedback]);

  return (
    <div className={`feedback-container ${darkMode ? "dark" : ""}`}>
      <h2>📊 IELTS Writing Feedback</h2>

      {loading && (
        <div className="flex flex-col items-center justify-center mt-10">
          <div className="loader"></div>
          <p>⏳ Feedback yuklanmoqda, kuting...</p>
        </div>
      )}

      {feedback && (
        <div>
          {/* Task 1 */}
          <div className="feedback-card">
            <h3>📝 Task 1</h3>
            {["task_response", "coherence", "lexical", "grammar"].map((key) => (
              <div key={key} style={{ marginBottom: "1rem" }}>
                <p style={{ fontWeight: "600", marginBottom: "0.25rem" }}>
                  {key.replace("_", " ")}
                </p>
                <span className={getScoreClass(feedback.task1[key].score)}>
                  {feedback.task1[key].score}/9
                </span>
                <p style={{ marginTop: "0.5rem", fontSize: "0.9rem" }}>
                  {feedback.task1[key].comments.join(", ")}
                </p>
              </div>
            ))}
          </div>

          {/* Task 2 */}
          <div className="feedback-card">
            <h3>📝 Task 2</h3>
            {["task_response", "coherence", "lexical", "grammar"].map((key) => (
              <div key={key} style={{ marginBottom: "1rem" }}>
                <p style={{ fontWeight: "600", marginBottom: "0.25rem" }}>
                  {key.replace("_", " ")}
                </p>
                <span className={getScoreClass(feedback.task2[key].score)}>
                  {feedback.task2[key].score}/9
                </span>
                <p style={{ marginTop: "0.5rem", fontSize: "0.9rem" }}>
                  {feedback.task2[key].comments.join(", ")}
                </p>
              </div>
            ))}
          </div>

          {/* Overall Score */}
          <div className="feedback-card" style={{ textAlign: "center" }}>
            <h3>Overall Score</h3>
            <div className="progress">
              <div
                className="progress-fill"
                style={{
                  width: `${(feedback.overall_score / 9) * 100}%`,
                }}
              ></div>
            </div>
            <p style={{ fontSize: "1.5rem", fontWeight: "700" }}>
              {feedback.overall_score}/9
            </p>
          </div>

          {/* Improvements */}
          <div className="feedback-card">
            <h4>🚀 Improvements</h4>
            <ul className="improvement-list">
              {feedback.improvement_actions.map((a, i) => (
                <li key={i} className="improvement-item">
                  ✅ {a}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
