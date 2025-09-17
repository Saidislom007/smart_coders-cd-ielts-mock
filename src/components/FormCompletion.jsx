import React from "react";

const FormCompletion = ({
  form,
  userAnswers,
  onChange,
  submitted,
  instruction
}) => {
  // [[ ]] joylarini input bilan almashtirish
  const renderWithInputs = (text) => {
    return text.split(/(\[\[\d+\]\])/g).map((part, idx) => {
      const match = part.match(/\[\[(\d+)\]\]/);
      if (match) {
        const qNum = parseInt(match[1], 10);
        return (
          <input
            key={idx}
            type="text"
            placeholder={`Q${qNum}`}
            style={{
              border: "1px solid #999",
              padding: "4px 6px",
              margin: "0 4px",
              borderRadius: "4px",
              width: "120px"
            }}
            value={userAnswers[qNum] || ""}
            disabled={submitted}
            onChange={(e) => onChange(qNum, e.target.value)}
          />
        );
      }
      return <span key={idx}>{part}</span>;
    });
  };

  return (
    <div
      style={{
        border: "1px solid #ccc",
        padding: "16px",
        borderRadius: "8px",
        backgroundColor: "#f9f9f9",
        marginBottom: "16px"
      }}
    >
      {instruction && (
        <p style={{ fontWeight: "bold", marginBottom: "10px" }}>{instruction}</p>
      )}

      <form>
        {form?.map((field, index) => (
          <div
            key={index}
            style={{
              display: "flex",
              marginBottom: "10px"
            }}
          >
            <label style={{ width: "150px", fontWeight: "500" }}>
              {field.label}:
            </label>
            <div>{renderWithInputs(field.value)}</div>
          </div>
        ))}
      </form>
    </div>
  );
};

export default FormCompletion;
