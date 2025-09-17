import { useEffect, useState, useRef } from "react";

const Part1 = ({ data, onStart, onStop, onFinish }) => {
  const [questionIndex, setQuestionIndex] = useState(0);
  const [prepTime, setPrepTime] = useState(0);
  const [timer, setTimer] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [started, setStarted] = useState(false);

  const prepRef = useRef(null);
  const timerRef = useRef(null);

  // 🔹 Har doim interval tozalash
  const clearAllIntervals = () => {
    clearInterval(prepRef.current);
    clearInterval(timerRef.current);
  };

  // 🔹 Savol o'zgarganda interval'larni tozalash
  useEffect(() => {
    clearAllIntervals();
  }, [questionIndex]);

  // 🔹 Prep time sanash
  useEffect(() => {
    if (prepTime > 0) {
      prepRef.current = setInterval(() => {
        setPrepTime((prev) => {
          if (prev === 1) {
            clearInterval(prepRef.current);
            setIsRecording(true);
            setTimer(30);
            onStart && onStart(data[questionIndex]);
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(prepRef.current);
  }, [prepTime, data, questionIndex, onStart]);

  // 🔹 Recording sanash
  useEffect(() => {
    if (isRecording && timer > 0) {
      timerRef.current = setInterval(() => {
        setTimer((prev) => {
          if (prev === 1) {
            clearInterval(timerRef.current);
            setIsRecording(false);

            setTimeout(() => {
              onStop && onStop(data[questionIndex]);

              if (questionIndex < data.length - 1) {
                setQuestionIndex((prevIdx) => prevIdx + 1);
                setPrepTime(5);
              } else {
                // ❗️ Oxirgi savol tugaganda hammasini tozalash
                clearAllIntervals();
                setPrepTime(0);
                setTimer(0);
                onFinish && onFinish();
              }
            }, 0);
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [isRecording, timer, data, questionIndex, onStop, onFinish]);

  // 🔹 Hand stop bosilganda
  const handleStop = () => {
    clearAllIntervals();
    setIsRecording(false);
    onStop && onStop(data[questionIndex]);

    if (questionIndex < data.length - 1) {
      setQuestionIndex((prevIdx) => prevIdx + 1);
      setPrepTime(5);
    } else {
      // ❗️ Part1 tugadi
      setPrepTime(0);
      setTimer(0);
      onFinish && onFinish();
    }
  };

  return (
    <div className="card max-w-2xl mx-auto bg-white shadow-lg rounded-2xl p-6 space-y-4">
      <h1 className="text-2xl font-bold text-gray-800 border-b pb-2">
        Speaking — Part 1
      </h1>

      <div className="question-box space-y-2">
        <h3 className="text-gray-500 text-sm font-medium">
          Question {questionIndex + 1} of {data.length}
        </h3>
        <h2 className="text-lg font-semibold text-blue-700">
          {data[questionIndex]}
        </h2>
      </div>

      {!started && (
        <button
          onClick={() => {
            setPrepTime(5);
            setStarted(true);
          }}
          className="start-btn bg-blue-600 text-white px-6 py-2 rounded-xl shadow hover:bg-blue-700 transition"
        >
          🎤 Start
        </button>
      )}

      {prepTime > 0 && (
        <div className="timer preparing text-orange-600 font-semibold text-lg">
          🕐 Preparing: {prepTime}s
        </div>
      )}

      {isRecording && timer > 0 && (
        <div className="timer recording text-green-600 font-semibold text-lg">
          🎙️ Recording: {timer}s
        </div>
      )}

      {isRecording && (
        <button
          onClick={handleStop}
          className="stop-btn bg-red-600 text-white px-6 py-2 rounded-xl shadow hover:bg-red-700 transition"
        >
          ⏹ Stop
        </button>
      )}
    </div>
  );
};

export default Part1;
