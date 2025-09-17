import React, { useState } from "react";
import "./MatchingHeadings.css"
const MatchingHeadings = ({ question, onCorrectCountChange }) => {
  const qNum = question.question_number;
  const [userValue, setUserValue] = useState("");
  const [isCorrect, setIsCorrect] = useState(null);

  // API'dan kelgan to‘g‘ri javob
  const correctAnswer = question.correct_answer?.trim().toLowerCase();

  const handleSelect = (value) => {
    setUserValue(value);

    const correct = value.trim().toLowerCase() === correctAnswer;
    setIsCorrect(correct);

    const score = correct ? 1 : 0;

    if (onCorrectCountChange) {
      onCorrectCountChange(score, qNum);
    }
  };

  // question_text ichidagi [[ ]] joyiga select qo‘yish
  const renderedQuestionText = question.question_text.split(/\[\[.*?\]\]/).reduce((acc, part, index, arr) => {
    acc.push(<span key={`text-${index}`}>{part}</span>);
    if (index < arr.length - 1) {
      acc.push(
        <select
          key="select"
          value={userValue}
          onChange={(e) => handleSelect(e.target.value)}
          style={{
            border: "1px solid #ccc",
            padding: "5px",
            borderRadius: "4px",
            minWidth: "150px",
          }}
        >
          <option value="">Choose</option>
          {question.options?.map((opt, idx) => (
            <option key={idx} value={opt}>
              {opt.split(".")[0].trim()}
            </option>
          ))}
        </select>
      );
    }
    return acc;
  }, []);

  return (

    <div className="">
      <strong style={{
          margin:"auto"
        }}
        >{question.instruction}</strong>
      {(qNum === 11 || qNum === 33 || qNum === 21) && question.options?.length > 0 && (
        <div className="matching-options-box">

          <ul>
            {question.options.map((opt, idx) => (
              <li key={idx}>{opt}</li>
            ))}
          </ul>
        </div>
      )}
      <p>
        
      </p>
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
          <strong>Q{qNum}.</strong> {renderedQuestionText}
        </p>


      </div>
    </div>
  );
};

export default MatchingHeadings;
