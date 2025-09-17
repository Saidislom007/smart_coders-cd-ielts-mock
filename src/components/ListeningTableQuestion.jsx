import React, { useState, useEffect } from "react";

// Util: matndagi [[number]] joylarini input'ga aylantiradi
const renderWithInputs = (text, answers, setAnswers) => {
  return text.replace(/\[\[(\d+)\]\]/g, (_, number) => {
    return `<input
      type="text"
      name="q${number}"
      value="${answers[number] || ''}"
      data-id="${number}"
      class="table-input"
      style="width: 80px; padding: 2px;"
    />`;
  });
};

const ListeningTableQuestion = ({ data, onSubmit }) => {
  const [answers, setAnswers] = useState({});

  // Inputga o‘zgartirishlar kiritish
  useEffect(() => {
    const handleInputChange = (e) => {
      const target = e.target;
      const id = target.getAttribute("data-id");
      const value = target.value;
      setAnswers((prev) => ({ ...prev, [id]: value }));
    };

    // Delegatsiya orqali barcha inputlarga listener biriktiramiz
    const container = document.getElementById("table-container");
    if (container) {
      container.addEventListener("input", handleInputChange);
    }

    return () => {
      if (container) {
        container.removeEventListener("input", handleInputChange);
      }
    };
  }, []);

  const handleSubmit = () => {
    console.log("Foydalanuvchi javoblari:", answers);
    if (onSubmit) onSubmit(answers);
  };

  return (
    <div>
      <h2>{data.title}</h2>
      <p>{data.instruction}</p>

      {/* Audio player */}
      {data.audio && (
        <audio controls style={{ marginBottom: "1rem" }}>
          <source src={data.audio} type="audio/mpeg" />
          Your browser does not support the audio element.
        </audio>
      )}

      {/* Jadval */}
      <div id="table-container">
        <table border="1" cellPadding="10" style={{ borderCollapse: "collapse", width: "100%" }}>
          <thead>
            <tr>
              {data.columns.map((col, i) => (
                <th key={i}>{col}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.rows.map((row, i) => (
              <tr key={i}>
                {row.map((cell, j) => (
                  <td
                    key={j}
                    dangerouslySetInnerHTML={{
                      __html: renderWithInputs(cell, answers, setAnswers),
                    }}
                  />
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Javoblarni yuborish tugmasi */}
      <div style={{ marginTop: "2rem", textAlign: "right" }}>
        <button onClick={handleSubmit} className="submit-button">
          Javoblarni yuborish
        </button>
      </div>
    </div>
  );
};

export default ListeningTableQuestion;
