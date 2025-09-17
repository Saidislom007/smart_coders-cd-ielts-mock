// MatchingTwoAnswers.jsx
import React from 'react';
import './MatchingTwoAnswers.css';

const MatchingTwoAnswers = ({ instruction, options, questionNumbers, userAnswers, onChange, submitted }) => {
  // Checkbox boshqaruvi
  const handleCheckboxChange = (questionNumber, option) => {
    const currentAnswers = Array.isArray(userAnswers[questionNumber])
      ? userAnswers[questionNumber]
      : [];

    let newAnswers;
    if (currentAnswers.includes(option)) {
      // Agar tanlangan bo‘lsa, olib tashlaymiz
      newAnswers = currentAnswers.filter(a => a !== option);
    } else {
      // Faqat 2 ta javob tanlash
      if (currentAnswers.length < 2) {
        newAnswers = [...currentAnswers, option];
      } else {
        return; // 3-chi variant tanlanmasin
      }
    }
    onChange(questionNumber, null, newAnswers);
  };

  return (
    <div className="matching-two-answers">
      {instruction && <p className="instruction">{instruction}</p>}

      <div className="question-block">
        {questionNumbers.map((num) => (
          <div key={num} className="question-item">
            <p className="question-title"><strong>{num}.</strong></p>
            <div className="options-list">
              {options.map((opt, idx) => {
                const letter = String.fromCharCode(65 + idx); // A, B, C...
                return (
                  <label key={letter} className="option-item">
                    <input
                      type="checkbox"
                      value={letter}
                      checked={Array.isArray(userAnswers[num]) && userAnswers[num].includes(letter)}
                      onChange={() => handleCheckboxChange(num, letter)}
                      disabled={submitted}
                    />
                    <span className="option-letter">{letter}.</span> {opt}
                  </label>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MatchingTwoAnswers;
