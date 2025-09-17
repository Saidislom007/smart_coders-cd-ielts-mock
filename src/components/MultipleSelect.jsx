import React, { useState } from "react";

const MultipleSelect = ({ question, onCorrectCountChange }) => {
  // ✅ correct_answer massiv sifatida normalize qilish
  const correctAnswers = (question.correct_answer || []).map((ans) =>
    ans.trim().toLowerCase()
  );

  const maxSelect = correctAnswers.length; // nechta tanlash mumkin
  const [selected, setSelected] = useState([]);

  const handleToggle = (opt) => {
    let updated = [...selected];

    if (updated.includes(opt)) {
      // agar oldin tanlangan bo‘lsa -> olib tashlash
      updated = updated.filter((o) => o !== opt);
    } else {
      if (updated.length < maxSelect) {
        updated.push(opt);
      }
    }

    setSelected(updated);

    if (onCorrectCountChange) {
      let score = 0;
      // ✅ foydalanuvchi tanlaganlarni index bo‘yicha tekshiramiz
      updated.forEach((ans, idx) => {
        if (
          correctAnswers[idx] &&
          ans.trim().toLowerCase() === correctAnswers[idx]
        ) {
          score++;
        }
      });

      onCorrectCountChange(score, question.question_number);
    }
  };

  return (
    <div className="mb-6 p-3">
      {question.instruction && (
        <p
          style={{
            color: "black",
            marginBottom: 20,
            fontSize: 20,
            fontWeight: "bold",
          }}
        >
          {question.instruction}
        </p>
      )}

      {question.options.map((opt, i) => {
        const isSelected = selected.includes(opt);

        // Rang chiqarish
        let bg = "";
        if (isSelected) {
          const index = selected.indexOf(opt); // user tanlagan index
          if (
            correctAnswers[index] &&
            correctAnswers[index] === opt.trim().toLowerCase()
          ) {
            bg = "#ffff"; // ✅ to‘g‘ri – yashil fon
          } else {
            bg = "#ffff"; // ❌ noto‘g‘ri – qizil fon
          }
        }

        return (
          <label
            key={i}
            className="block mb-2 cursor-pointer rounded-lg px-2 py-1"
            style={{ backgroundColor: bg }}
          >
            <input
              type="checkbox"
              value={opt}
              checked={isSelected}
              disabled={selected.length === maxSelect && !isSelected}
              onChange={() => handleToggle(opt)}
              className="mr-2"
            />
            {opt}
          </label>
        );
      })}
    </div>
  );
};

export default MultipleSelect;
