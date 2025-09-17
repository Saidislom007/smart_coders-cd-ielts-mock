import React, { useEffect, useState } from "react";
import axios from "axios";
import "../pages/ReadingTestMock.css";
import QuestionRenderer from "./QuestionRenderer";

const Passage1 = ({ fontSize, onResultChange }) => {
  const [passage, setPassage] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [correctCounts, setCorrectCounts] = useState({});

  const handleCorrectCountChange = (score, qNum) => {
    setCorrectCounts((prev) => ({
      ...prev,
      [qNum]: score,
    }));
  };

  const totalCorrect = Object.values(correctCounts).reduce((a, b) => a + b, 0);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}/api/mocks/reading/2/passage/1/`)
      .then((res) => {
        setPassage(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Xatolik yuz berdi:", err);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (onResultChange) {
      onResultChange(totalCorrect);
    }
  }, [totalCorrect, onResultChange]);

  const handleSubmit = () => {
    setSubmitted(true);
    axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/reading-results`, {
      passageId: passage.id,
      correctCount: totalCorrect,
    });
  };

  if (loading || !passage) return <div className="flex justify-center items-center h-32"></div>;

  return (
    <div className="reading-test-container">
      <div className="reading-test-wrapper">
        <div className="header">
          <div className="header-content">
            <h1 className="header-title">{passage.title}</h1>
            <div className="header-info">Passage 1</div>
          </div>
        </div>

        <div className="main-content">
          <div className="passage-section">
            <div className="passage-header">
              <div className="passage-badge">Passage 1</div>
              <p className="passage-instruction">{passage.instruction}</p>
            </div>
            <div className="passage-text" style={{ whiteSpace: "pre-line", fontSize: `${fontSize}px` }}>
              {passage.text}
            </div>
          </div>

          <div className="questions-section">
            <div className="questions-header">
              <div className="questions-badge">Questions</div>
            </div>

            <div className="questions-list">
              {passage.questions.map((q) => (
                <QuestionRenderer
                  key={q.question_number}
                  question={q}
                  submitted={submitted}
                  onCorrectCountChange={handleCorrectCountChange}
                />
              ))}
            </div>

            
            
          </div>
        </div>
      </div>
    </div>
  );
};

export default Passage1;
