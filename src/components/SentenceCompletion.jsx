import { useState, useEffect, useMemo } from "react";

const SentenceCompletion = ({
  number, // savol raqami (question_number)
  questionText,
  instruction,
  question,
  submitted = false,
  userAnswer = "",
  correctAnswer,
  onChange,
  onCorrectCountChange,
}) => {
  const [userValues, setUserValues] = useState({});

  // regex: [[ ]], [[1]], [[ 2 ]] kabi barcha variantlarni ushlaydi
  const blankRegex = /\[\[\s*(\d*)\s*\]\]/g;

  // blanksArray: savolda ketma-ket paydo bo'lgan blanklar uchun ORALIQ raqamlar
  // agar [[1]] berilgan bo'lsa -> "1", aks holda fallback sifatida (idx+1)
  const blanksArray = useMemo(() => {
    const arr = [];
    const matches = Array.from(questionText.matchAll(blankRegex));
    matches.forEach((match, idx) => {
      const explicit = match[1] && match[1].length ? match[1] : String(idx + 1);
      arr.push(explicit);
    });
    return arr;
  }, [questionText]);

  // handleChange: saqlash uchun ichki key `${number}_${blankIndex}` ishlatamiz
  const handleChange = (blankIndex, value) => {
    const key = `${number}_${blankIndex}`;
    setUserValues((prev) => ({ ...prev, [key]: value }));
    if (onChange) onChange(number, blankIndex, value);
  };

  // correctMap: har bir blank (blankIndex) uchun true/false hisoblab beradi
  const correctMap = useMemo(() => {
    const map = {};
    const correctAnswersArray = Array.isArray(correctAnswer)
      ? correctAnswer
      : [correctAnswer];

    const normalizedAnswers = correctAnswersArray.map((ans) =>
      (ans || "").toString().trim().toLowerCase()
    );

    blanksArray.forEach((blankIndex) => {
      const key = `${number}_${blankIndex}`;
      const userAnsNorm = (userValues[key] || "").toString().trim().toLowerCase();
      map[blankIndex] = normalizedAnswers.includes(userAnsNorm);
    });

    return map;
  }, [userValues, correctAnswer, blanksArray, number]);

  // onCorrectCountChange ga to'g'ri sonni yuboramiz (savolga tegishli)
  useEffect(() => {
    if (onCorrectCountChange) {
      const correctCount = Object.values(correctMap).filter(Boolean).length;
      onCorrectCountChange(correctCount, number);
    }
  }, [correctMap, number, onCorrectCountChange]);

  // render qilish uchun parts ga bo'lamiz
  const parts = questionText.split(/(\[\[\s*\d*\s*\]\])/g);
  let blankPos = 0;

  return (
    <div className="instruction">
      {instruction && (
        <p
          style={{
            color: "black",
            marginBottom: 20,
            fontSize: 20,
            fontWeight: "bold",
          }}
        >
          {instruction}
        </p>
      )}

      <div
        className="sentence-completion"
        style={{
          border: "1px solid #ccc",
          padding: 15,
          borderRadius: 8,
          backgroundColor: "#f9f9f9",
          lineHeight: 1.6,
        }}
      >
        <p style={{ margin: 0 }}>
          {parts.map((part, idx) => {
            if (part.match(blankRegex)) {
              // blanksArray orqali aniq blankIndex olamiz (matchAll bilan muvofiq)
              const blankIndex = blanksArray[blankPos] ?? String(blankPos + 1);
              blankPos += 1;

              const key = `${number}_${blankIndex}`;
              const isTrue = correctMap[blankIndex] === true;
              const hasValue = (userValues[key] || "").length > 0;

              return (
                <input
                  key={key}
                  type="text"
                  placeholder={`Q${number}`} // <- siz so'ragandek, placeholder savol raqamiga mos
                  className="border border-gray-300 p-1 mx-1 rounded"
                  value={userValues[key] || ""}
                  disabled={submitted}
                  autoComplete="off"
                  onChange={(e) => handleChange(blankIndex, e.target.value)}
                  style={{
                    borderColor:
                      submitted && hasValue ? (isTrue ? "green" : "red") : undefined,
                    backgroundColor: submitted && isTrue ? "#d4edda" : undefined,
                  }}
                />
              );
            }

            return <span key={`text-${idx}`}>{part}</span>;
          })}
        </p>
      </div>
    </div>
  );
};

export default SentenceCompletion;
