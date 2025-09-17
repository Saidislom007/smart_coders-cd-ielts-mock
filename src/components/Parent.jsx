import React, { useState } from "react";
import MultipleChoice from "./MultipleChoice";

const Parent = () => {
  const [totalCorrect, setTotalCorrect] = useState(0);

  const questions = [
    {
      question_number: 1,
      question_text: "React nima?",
      options: ["Framework", "Library", "Database"],
      correct_answer: "Library",
    },
    {
      question_number: 2,
      question_text: "JavaScript’da const nima qiladi?",
      options: [
        "O'zgaruvchini o'zgartirilmas qiladi",
        "Funksiya yaratadi",
        "Class yaratadi",
      ],
      correct_answer: "O'zgaruvchini o'zgartirilmas qiladi",
    },
  ];

  const handleAnswer = (score) => {
    setTotalCorrect((prev) => prev + score);
  };

  return (
    <div>
      <h2>Test Savollari</h2>
      {questions.map((q, idx) => (
        <MultipleChoice
          key={idx}
          question={q}
          onAnswer={handleAnswer}
        />
      ))}

      <h3>To‘g‘ri javoblar soni: {totalCorrect}</h3>
    </div>
  );
};

export default Parent;
