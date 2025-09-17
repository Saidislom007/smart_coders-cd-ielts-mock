import { useEffect, useState } from "react";

const Part3 = ({ data, onNext, isRecording, onStart, onStop }) => {
  const [prepTime, setPrepTime] = useState(null); // Boshlashdan oldin null
  const [timer, setTimer] = useState(0);

  // ⏱️ Tayyorlanish bosqichi
  useEffect(() => {
    if (prepTime > 0) {
      const id = setTimeout(() => setPrepTime((p) => p - 1), 1000);
      return () => clearTimeout(id);
    }

    if (prepTime === 0 && !isRecording && timer === 0) {
      // 1 minut tugagach recordingni 2 minutga yoqamiz
      onStart(data.title);
      setTimer(120);
    }
  }, [prepTime, isRecording, timer, data, onStart]);

  // 🎙️ Recording bosqichi
  useEffect(() => {
    if (timer > 0 && isRecording) {
      const id = setTimeout(() => setTimer((t) => t - 1), 1000);
      return () => clearTimeout(id);
    }

    if (timer === 0 && isRecording) {
      // Avtomatik stop
      onStop(data.title);
      onNext();
    }
  }, [timer, isRecording, data, onStop, onNext]);

  return (
    <div className="card max-w-2xl mx-auto bg-white shadow-lg rounded-2xl p-6 space-y-4">
      <h1 className="text-2xl font-bold text-gray-800 border-b pb-2">
        Speaking — Part 3
      </h1>

      <h2 className="text-xl font-semibold text-blue-700">{data.title}</h2>

      <ul className="list-disc list-inside space-y-2 text-lg text-gray-700">
        {data.questions.map((q, i) => (
          <li key={i}>{q}</li>
        ))}
      </ul>

      {/* Start tugmasi */}
      {prepTime === null && timer === 0 && !isRecording && (
        <button
          onClick={() => setPrepTime(60)}
          className="start-btn bg-blue-600 text-white px-6 py-2 rounded-xl shadow hover:bg-blue-700 transition"
        >
          🎤 Start
        </button>
      )}

      {/* Tayyorlanish vaqtini ko‘rsatish */}
      {prepTime > 0 && (
        <div className="timer preparing text-orange-600 font-semibold text-lg">
          🕐 Preparing: {prepTime}s
        </div>
      )}

      {/* Recording vaqtini ko‘rsatish */}
      {isRecording && timer > 0 && (
        <div className="timer recording text-green-600 font-semibold text-lg">
          🎙️ Recording: {timer}s
        </div>
      )}

      {/* Qo‘lda stop tugmasi */}
      {isRecording && (
        <button
          onClick={() => {
            onStop(data.title);
            onNext();
          }}
          className="stop-btn bg-red-600 text-white px-6 py-2 rounded-xl shadow hover:bg-red-700 transition"
        >
          ⏹️ Stop
        </button>
      )}
    </div>
  );
};

export default Part3;
