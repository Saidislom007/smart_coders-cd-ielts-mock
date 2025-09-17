import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import "./Section2.css";
import QuestionRenderer from "./QuestionRenderer";
import CustomAudioPlayer from "./CustomAudioPlayer";

// Global audio refs har bir section uchun
let globalAudioRefs = [];

const Section2 = ({ fontSize = 16, onResultChange, sectionIndex = 1 }) => {
  const [data, setData] = useState(null);
  const [userAnswers, setUserAnswers] = useState({});
  const [correctCount, setCorrectCount] = useState(0);
  const [individualCorrectCounts, setIndividualCorrectCounts] = useState({});

  const testId = 2; // test identifikatori
  const audioRef = useRef(null);

  // 🔹 Audio ref’larni boshqarish
  useEffect(() => {
    globalAudioRefs[sectionIndex] = audioRef;
    return () => {
      globalAudioRefs[sectionIndex] = null;
    };
  }, [sectionIndex]);

  // 🔹 Ma’lumotlarni olish
  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}/api/mocks/listening/1/section/2/`)
      .then((res) => setData(res.data))
      .catch((err) => console.error("Error fetching Section 2:", err));
  }, []);

  // 🔹 Input qiymatini yangilash
  const handleInputChange = (questionNumber, blankNumber, value) => {
    setUserAnswers((prev) => {
      if (blankNumber == null) {
        return { ...prev, [questionNumber]: value };
      }
      return {
        ...prev,
        [questionNumber]: {
          ...(prev[questionNumber] || {}),
          [blankNumber]: value,
        },
      };
    });
  };

  // 🔹 Har bir savoldan kelgan correctCount’ni yig‘ish
  const handleCorrectCountChange = (questionNumber, count) => {
    setIndividualCorrectCounts((prev) => {
      const updated = { ...prev, [questionNumber]: count };
      const total = Object.values(updated).reduce((a, b) => a + b, 0);
      setCorrectCount(total);
      return updated;
    });
  };

  // 🔹 Umumiy ballni Listening page’ga uzatish
  useEffect(() => {
    if (typeof onResultChange === "function") {
      onResultChange(correctCount);
    }
  }, [correctCount, onResultChange]);

  if (!data) {
    return (
      <div className="flex justify-center items-center h-32">
              </div>
    );
  }

  return (
    <div className="section-container" style={{ fontSize: `${fontSize}px` }}>
      <h2 className="section-title">Section 2</h2>

      {data.audio_file && (
        <div className="audio-player">
          <CustomAudioPlayer src={data.audio_file} ref={audioRef} />
        </div>
      )}

      {data.instruction && <p className="instruction-text">{data.instruction}</p>}

      {data.questions.map((q) => (
        <QuestionRenderer
          key={q.id}
          question={q}
          userAnswers={userAnswers}
          onChange={handleInputChange}
          onCorrectCountChange={(count) => handleCorrectCountChange(q.question_number, count)}
        />
      ))}

      <div className="score-container">
        
      </div>
    </div>
  );
};

export default Section2;
