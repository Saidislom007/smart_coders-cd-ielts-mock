import React, { useState } from "react";

const MapLabelling = ({
  imageSrc,
  questionText,
  options = [],
  questionNumber,
  instruction,
  question,
  onCorrectCountChange, // 🔹 Parentga natijani qaytarish
}) => {
  const qNum = questionNumber;
  const [userValue, setUserValue] = useState("");
  const [isCorrect, setIsCorrect] = useState(null);

  const correctAnswer = question.correct_answer?.toString().trim().toLowerCase();

  const handleSelect = (value) => {
    setUserValue(value);

    const correct = value.trim().toLowerCase() === correctAnswer;
    setIsCorrect(correct);

    // 🔹 Parentga faqat 1 yoki 0 qaytaramiz
    if (onCorrectCountChange) {
      onCorrectCountChange(correct ? 1 : 0, qNum);
    }
  };

  return (
    <div style={{ paddingTop: "20px" }}>
      {instruction && <p          style={{
            color: "black",
            marginBottom: 20,
            fontSize: 20,
            fontWeight: "bold",
          }}>{instruction}</p>}

      {imageSrc && (
        <img
          src={imageSrc}
          alt="Map"
          style={{
            maxWidth: "500px",
            height: "auto",
            borderRadius: "4px",
            border: "1px solid #ddd",
            marginBottom: "20px",
          }}
        />
      )}

      <div
        style={{
          display: "flex",
          alignItems: "center",
          marginBottom: "12px",
          gap: "6px",
        }}
      >
        {questionText && (
          <label
            htmlFor={`q${qNum}`}
            style={{ fontWeight: "600", flexShrink: 0 }}
          >
            {qNum}: {questionText}
          </label>
        )}

        {options.length > 0 && (
          <select
            id={`q${qNum}`}
            className="border border-gray-300 p-1 mx-1 rounded h-10"
            value={userValue}
            onChange={(e) => handleSelect(e.target.value)}
           
          >
            <option value="">Q {qNum}</option>
            {options.map((opt, idx) => (
              <option key={idx} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        )}
      </div>
    </div>
  );
};

export default MapLabelling;
