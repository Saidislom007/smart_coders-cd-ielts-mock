import { useEffect } from "react";

const Part2 = ({ data, onNext, isRecording, prepTime, timer, onStart, onStop }) => {
  // ⏱️ PrepTime tugagach recording start
  useEffect(() => {
    if (prepTime === 0 && !isRecording && timer > 0) {
      onStart(data.topic);
    }
  }, [prepTime, isRecording, timer, data, onStart]);

  // ⏹️ Timer tugagach recording stop va keyingi part
  useEffect(() => {
    if (timer === 0 && isRecording) {
      onStop(data.topic);
      onNext();
    }
  }, [timer, isRecording, data, onStop, onNext]);

  return (
    <div className="card max-w-2xl mx-auto bg-white shadow-lg rounded-2xl p-6 space-y-4">
      <h1 className="text-2xl font-bold text-gray-800 border-b pb-2">
        Speaking — Part 2
      </h1>

      <h2 className="text-xl font-semibold text-blue-700">{data.topic}</h2>

      <ul className="list-disc list-inside space-y-2 text-lg text-gray-700">
        {data.points.map((point, i) => (
          <li key={i}>{point}</li>
        ))}
      </ul>

      {/* Tayyorlanish vaqti */}
      {prepTime > 0 && (
        <div className="timer preparing text-orange-600 font-semibold text-lg">
          🕐 Preparing: {prepTime}s
        </div>
      )}

      {/* Recording */}
      {isRecording && timer > 0 && (
        <div className="timer recording text-green-600 font-semibold text-lg">
          🎙️ Recording: {timer}s
        </div>
      )}

      {/* Qo‘l bilan start */}
      {!isRecording && prepTime === 0 && timer === 0 && (
        <button
          onClick={() => onStart(data.topic)}
          className="start-btn bg-blue-600 text-white px-6 py-2 rounded-xl shadow hover:bg-blue-700 transition"
        >
          🎤 Start
        </button>
      )}

      {/* Qo‘l bilan stop */}
      {isRecording && (
        <button
          onClick={() => {
            onStop(data.topic);
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

export default Part2;
