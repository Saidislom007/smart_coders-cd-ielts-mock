import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import "./Section4.css";
import QuestionRenderer from "./QuestionRenderer";
import CustomAudioPlayer from "./CustomAudioPlayer";

let globalAudioRefs = [];

const Section4 = ({ onSubmit, sectionIndex = 3 }) => {
  const [data, setData] = useState(null);
  const [userAnswers, setUserAnswers] = useState({});
  const [correctCount, setCorrectCount] = useState(0);
  const [individualCorrectCounts, setIndividualCorrectCounts] = useState({});

  const testId = 2;
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
      .get(`${import.meta.env.VITE_BACKEND_URL}/api/mocks/listening/1/section/4/`)
      .then((res) => setData(res.data))
      .catch((err) => console.error("Error fetching section 4:", err));
  }, [testId]);

  // 🔹 Universal javoblarni yangilash
  const handleInputChange = (questionNumber, blankNumber, value) => {
    if (blankNumber == null) {
      setUserAnswers((prev) => ({
        ...prev,
        [questionNumber]: value,
      }));
    } else {
      setUserAnswers((prev) => ({
        ...prev,
        [questionNumber]: {
          ...(prev[questionNumber] || {}),
          [blankNumber]: value,
        },
      }));
    }
  };

  // 🔹 Har bir savolning correctCount qiymatini olish (real vaqt)
  const handleCorrectCountChange = (questionNumber, count) => {
    setIndividualCorrectCounts((prev) => {
      const updated = { ...prev, [questionNumber]: count };
      const total = Object.values(updated).reduce((a, b) => a + b, 0);
      setCorrectCount(total);
      return updated;
    });
  };

  // 🔹 correctCount o‘zgarganda Listening page ga uzatish
  useEffect(() => {
    if (onSubmit) {
      onSubmit(correctCount);
    }
  }, [correctCount, onSubmit]);

  if (!data) {
    return (
      <div className="flex justify-center items-center h-32">
        
      </div>
    );
  }

  return (
    <div className="section-container">
      <h2 className="section-title">Section 4</h2>

      {data.audio_file && (
        <div className="audio-player">
          <CustomAudioPlayer src={data.audio_file} />
        </div>
      )}

      {data.instruction && (
        <p className="instruction-text">{data.instruction}</p>
      )}

      {data.questions.map((q) => (
        <QuestionRenderer
          key={q.id}
          question={q}
          userAnswers={userAnswers}
          submitted={false} // ✅ Har doim real vaqt
          onChange={handleInputChange}
          onCorrectCountChange={(count) =>
            handleCorrectCountChange(q.question_number, count)
          }
        />
      ))}


    </div>
  );
};

export default Section4;
