import React, { useState } from "react";

const MultipleChoice = ({ question, onCorrectCountChange }) => {
  const qNum = question.question_number;
  const [userValue, setUserValue] = useState("");
  const [isCorrect, setIsCorrect] = useState(null);

  const handleSelect = (value) => {
    setUserValue(value);

    const correct =
      value.trim().toLowerCase() ===
      question.correct_answer.trim().toLowerCase();

    setIsCorrect(correct);

    const score = correct ? 1 : 0;

    // 🔹 Faqat user tanlov qilganda parentga yuborish
    if (onCorrectCountChange) {
      onCorrectCountChange(score, qNum);
    }
  };

  return (
    <div>
            {question.instruction && <p          style={{
            color: "black",
            marginBottom: 20,
            fontSize: 20,
            fontWeight: "bold",
          }}>{question.instruction}</p>}
      <p>
        <strong>Q{qNum}.</strong> {question.question_text}
      </p>
        {question.options?.map((opt, idx) => (
          <label 
            key={idx} 
            style={{ 
              display: "block", 
              marginBottom: "8px", // har bir variant orasida bo‘sh joy
              cursor: "pointer" 
            }}
          >
            <input
              type="radio"
              name={`q-${qNum}`}
              value={opt}
              checked={userValue === opt}
              onChange={() => handleSelect(opt)}
              style={{ marginRight: "8px" }} // radio va matn orasida joy
            />
            {opt}
          </label>
        ))}


      {/* {isCorrect !== null && (
        <p style={{ color: isCorrect ? "green" : "red", fontWeight: "bold" }}>
          {isCorrect
            ? "To‘g‘ri!"
            : `Noto‘g‘ri. To‘g‘ri javob: ${question.correct_answer}`}
        </p>
      )} */}
    </div>
  );
};

export default MultipleChoice;
