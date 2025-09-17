import React, { useState, useEffect, useMemo } from "react";

const TableCompletion = ({
  table,
  number,
  instruction,
  question,          // <— BUTUN savol obyektini bering
  submitted = false,
  userAnswers = {},
  onChange,
  onCorrectCountChange,
}) => {
  // Q num fallback
  const qNum = number ?? question?.question_number ?? "table";

  // Local inputlar
  const [userValues, setUserValues] = useState(userAnswers[qNum] || {});

  // Agar parentdan userAnswers yangilansa, sync qilamiz
  useEffect(() => {
    if (userAnswers[qNum]) setUserValues(userAnswers[qNum]);
  }, [userAnswers, qNum]);

  // ✅ To‘g‘ri javoblar manbaini moslashuvchan o‘qiymiz
  const answers = useMemo(() => {
    const raw =
      question?.answers ??
      table?.answers ??
      question?.table?.answers ??
      [];
    const normalized = raw.map((ans) => ({
      number: String(ans.number),
      variants: (Array.isArray(ans.correct_answer)
        ? ans.correct_answer
        : [ans.correct_answer]
      )
        .filter((v) => v != null && String(v).trim() !== "")
        .map((v) => String(v).trim().toLowerCase()),
    }));
    
    return normalized;
  }, [question, table]);

  // Tezkor lookup uchun map
  const answersMap = useMemo(() => {
    const m = {};
    for (const a of answers) m[a.number] = a.variants;
    return m;
  }, [answers]);

  // ✅ Real vaqtda to‘g‘ri/noto‘g‘ri holatlari
  const correctMap = useMemo(() => {
    const m = {};
    for (const a of answers) {
      const user = (userValues[a.number] ?? "")
        .toString()
        .trim()
        .toLowerCase();
      m[a.number] = user !== "" && a.variants.includes(user);
    }
    
    return m;
  }, [answers, userValues]);

  // 📤 Parentga nechta to‘g‘ri javob borligini yuboramiz
  useEffect(() => {
    if (onCorrectCountChange) {
      const cnt = Object.values(correctMap).filter(Boolean).length;
      
      onCorrectCountChange(cnt, qNum);
    }
  }, [correctMap, onCorrectCountChange, qNum]);

  // Input change
  const handleChange = (blankNum, value) => {
    setUserValues((prev) => {
      const next = { ...prev, [String(blankNum)]: value };
      
      return next;
    });
    if (onChange) onChange(qNum, String(blankNum), value);
  };

  // ✅ Hujayradagi [[num]] larnı inputga aylantirish
  const renderCell = (cellText = "") => {
    const regex = /\[\[(\d+)]]/g;
    const out = [];
    let last = 0;
    let match;
    while ((match = regex.exec(cellText)) !== null) {
      out.push(cellText.slice(last, match.index));
      const blank = String(match[1]);
      const isCorrect = !!correctMap[blank];
      const hasValue = (userValues[blank] ?? "").toString().length > 0;

      out.push(
        <input
          key={`blank-${blank}`}
          type="text"
          placeholder={`Q${blank}`}
          className="border border-gray-300 p-1 mx-1 h-8 rounded "
          value={userValues[blank] || ""}
          disabled={submitted}
          autoComplete="off"
          onChange={(e) => handleChange(blank, e.target.value)}
          style={{
            borderColor:
              submitted && hasValue ? (isCorrect ? "green" : "red") : undefined,
            backgroundColor: submitted && isCorrect ? "#d4edda" : undefined,
          }}
        />
      );

      last = regex.lastIndex;
    }
    out.push(cellText.slice(last));
    return out;
  };

  return (
    <div className="table-completion">
      {instruction ? (
        <p
          style={{
            color: "black",
            marginBottom: 20,
            fontSize: 18,
            fontWeight: "bold",
          }}
        >
          {instruction}
        </p>
      ) : null}

      <table
        style={{
          borderCollapse: "collapse",
          width: "100%",
          border: "1px solid #ccc",
        }}
      >
        <thead>
          <tr>
            {(table?.columns ?? []).map((col, i) => (
              <th
                key={i}
                style={{
                  border: "1px solid #ccc",
                  padding: "8px",
                  backgroundColor: "#f2f2f2",
                  textAlign: "left",
                }}
              >
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {(table?.rows ?? []).map((row) => (
            <tr key={row.id ?? row.order}>
              {(row.row_data ?? []).map((cell, idx) => (
                <td
                  key={idx}
                  style={{
                    border: "1px solid #ccc",
                    padding: "8px",
                    verticalAlign: "middle",
                  }}
                >
                  {renderCell(String(cell))}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TableCompletion;
