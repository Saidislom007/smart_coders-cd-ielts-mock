
import React, { useState, useCallback } from "react";
import Section1 from '../components/Section1';
import Section2 from '../components/Section2';
import Section3 from '../components/Section3';
import Section4 from '../components/Section4';
import ReadingTimer from "../components/ReadingTimer";
import InstructionPage from '../components/InstructionPage';
const Listening = () => {
  const [results, setResults] = useState({
    section1: 0,
    section2: 0,
    section3: 0,
    section4: 0,
  });

  const [fontSize, setFontSize] = useState(16);
  const [testFinished, setTestFinished] = useState(false);
  const [testStarted, setTestStarted] = useState(false);
  const [timerKey, setTimerKey] = useState(0);

  // 🔹 Font zoom funksiyalari
  const increaseFont = () => setFontSize(prev => Math.min(prev + 2, 48));
  const decreaseFont = () => setFontSize(prev => Math.max(prev - 2, 10));

  // 🔹 Vaqt tugaganda
  const handleTimeUp = useCallback(() => {
    alert("Time is up! Submitting your test automatically...");
    handleFinalSubmit();
  }, []);

  // 🔹 Har bir section natijasini olish
  const handleSectionResult = (sectionKey, correctCount) => {
    setResults(prev => ({
      ...prev,
      [sectionKey]: correctCount,
    }));
  };

  // 🔹 Yakuniy submit
  const handleFinalSubmit = () => {
    if (testFinished) return;
    setTestFinished(true);

    const total = Object.values(results).reduce((a, b) => a + b, 0);

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
        listening_correct_answers: total,
        speaking_score: 0,
        writing_score: 0,
      }),
    })
      .then(response => {
        if (!response.ok) throw new Error("Xatolik yuz berdi.");
        return response.json();
      })
      .then(data => {
        console.log("Natija yuborildi:", data);
        alert("Test results sent successfully!");
      })
      .catch(error => {
        console.error("Server xatosi:", error);
        alert("Natijalarni yuborishda xatolik yuz berdi.");
      });
  };

  // 🔹 Testni boshlash
  const startTest = () => {
    setTestStarted(true);
    setTestFinished(false);
    setTimerKey((prev) => prev + 1); // ✅ unique key to reset timer
  };

  // 🔹 Umumiy ball
  const totalScore = Object.values(results).reduce((a, b) => a + b, 0);

  return (
    <div className="reading-main">
      {/* Yuqori panel */}
      <div style={{
        position: "fixed",
        top: "20px",
        right: "20px",
        zIndex: 9999,
        display: "flex",
        gap: "10px",
        alignItems: "center",
      }}>
        {testStarted && !testFinished && (
          <ReadingTimer
            key={timerKey}
            onTimeUp={handleTimeUp}
            isRunning={testStarted && !testFinished}
          />
        )}

        <div style={{
          background: "#f0f0f0",
          padding: "8px 16px",
          borderRadius: "6px",
          fontSize: "20px",
          fontWeight: "bold",
          boxShadow: "0 0 6px rgba(0,0,0,0.1)",
          display: "flex",
          gap: "10px",
        }}>
          <button onClick={decreaseFont}>-</button>
          <button onClick={increaseFont}>+</button>
        </div>
      </div>

      {!testStarted ? (
        <div style={{ textAlign: "center", marginTop: "3rem" }}>
          <InstructionPage section={"listening"} />
          <button className="nav-button" onClick={startTest}>Start Test</button>
        </div>
      ) : (
        <>
          <div className="section1">
            <Section1
              fontSize={fontSize}
              onResultChange={(count) => handleSectionResult("section1", count)}
            />
          </div>

          <div className="section2">
            <Section2
              fontSize={fontSize}
              onResultChange={(count) => handleSectionResult("section2", count)}
            />
          </div>

          <div className="section3">
            <Section3
              fontSize={fontSize}
              onResultChange={(count) => handleSectionResult("section3", count)}
            />
          </div>

          <div className="section4">
            <Section4
              fontSize={fontSize}
              onSubmit={(count) => handleSectionResult("section4", count)}
            />
          </div>

          <div style={{ textAlign: "center", marginTop: "3rem" }}>
            {/* <h2>Umumiy ball: {totalScore}</h2> */}
            <button
              className="nav-button"
              onClick={handleFinalSubmit}
              disabled={testFinished}
            >
              Complete
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Listening;
