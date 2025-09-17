import React, { useState, useEffect } from "react";

const TrueFalseNotGiven = ({
  question,
  userAnswer = "",
  submitted = false,
  onChange,
  onCorrectCountChange,
}) => {
  const qNum = question.question_number;
  const [selectedValue, setSelectedValue] = useState(userAnswer);

  // Tanlangan javob to‘g‘riligini tekshirish
  const isCorrect =
    selectedValue?.trim().toLowerCase() ===
    question.correct_answer?.trim().toLowerCase();

  // Parentga correct count jo‘natish
  useEffect(() => {
    if (onCorrectCountChange) {
      onCorrectCountChange(isCorrect ? 1 : 0, qNum);
    }
  }, [isCorrect, onCorrectCountChange, qNum]);

  const handleSelect = (value) => {
    setSelectedValue(value);
    if (onChange) {
      onChange(qNum, null, value);
    }
  };

  return (
    <div
      style={{
        border: "1px solid #ccc",
        padding: "15px",
        borderRadius: "8px",
        backgroundColor: "#f9f9f9",
        marginBottom: "15px",
      }}
    >
      <p>
        <strong>Q{qNum}.</strong> {question.question_text}
      </p>

      {question.options?.map((opt, idx) => (
        <label key={idx} style={{ display: "block", marginBottom: "8px" }}>
          <input
            type="radio"
            name={`q-${qNum}`}
            value={opt}
            checked={selectedValue === opt}
            disabled={submitted}
            onChange={() => handleSelect(opt)}
          />{" "}
          {opt}
        </label>
      ))}

      {/* {submitted && (
        <p
          style={{
            color: isCorrect ? "green" : "red",
            fontWeight: "bold",
            marginTop: "10px",
          }}
        >
          {isCorrect
            ? "✅ To‘g‘ri!"
            : `❌ Noto‘g‘ri. To‘g‘ri javob: ${question.correct_answer}`}
        </p>
      )} */}
    </div>
  );
};

export default TrueFalseNotGiven;
