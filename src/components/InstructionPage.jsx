import React, { useState, useRef } from "react";

const instructions = {
  listening: {
    title: "Listening Instructions",
    content: [
      "You will hear four recordings. Each recording will be played once only.",
      "Answer all the questions as you listen.",
      "Write your answers on the answer sheet provided.",
      "Focus on spelling and grammar for written answers."
    ],
    
  },
  reading: {
    title: "Reading Instructions",
    content: [
      "You have 60 minutes to read the passages and answer the questions.",
      "Do not spend too much time on one question.",
      "All answers must be written on the answer sheet.",
      "Check your answers for spelling and grammar."
    ]
  },
  writing: {
    title: "Writing Instructions",
    content: [
      "You have 60 minutes for two writing tasks.",
      "Task 1: Describe visual information in at least 150 words.",
      "Task 2: Write an essay of at least 250 words.",
      "Pay attention to task achievement, coherence, grammar, and vocabulary."
    ]
  },
  speaking: {
    title: "Speaking Instructions",
    content: [
      "The speaking test is recorded and lasts 11-14 minutes.",
      "Part 1: Introduction and interview (4-5 mins).",
      "Part 2: Long turn — speak on a topic for 1-2 minutes.",
      "Part 3: Discussion with examiner on related topics."
    ]
  }
};

const InstructionPage = ({ section }) => {
  const sectionInstructions = instructions[section];
  const [recording, setRecording] = useState(false);
  const [audioURL, setAudioURL] = useState(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  if (!sectionInstructions) return <p>Section not found.</p>;

  // 🎙️ Start recording
  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorderRef.current = new MediaRecorder(stream);

    mediaRecorderRef.current.ondataavailable = (event) => {
      if (event.data.size > 0) {
        audioChunksRef.current.push(event.data);
      }
    };

    mediaRecorderRef.current.onstop = () => {
      const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
      const url = URL.createObjectURL(audioBlob);
      setAudioURL(url);
      audioChunksRef.current = []; // clear buffer
    };

    mediaRecorderRef.current.start();
    setRecording(true);
  };

  // ⏹️ Stop recording
  const stopRecording = () => {
    mediaRecorderRef.current.stop();
    setRecording(false);
  };

  return (
    <div className="instruction-page">
      <h1 className="text-4xl">{sectionInstructions.title}</h1>
      <ul className="list-disc ml-6 mt-4">
        {sectionInstructions.content.map((item, index) => (
          <li className="list-none" key={index}>{item}</li>
        ))}
      </ul>

      {/* 🎧 Listening audio player */}
      

      {/* 🎙️ Speaking recorder */}
      {section === "speaking" && (
        <div className="mt-6">
          {!recording ? (
            <button
              onClick={startRecording}
              className="bg-green-500 text-white px-4 py-2 rounded h-12 w-1/9  "
            >
              🎙️ Start Recording
            </button>
          ) : (
            <button
              onClick={stopRecording}
              className="bg-red-500 text-white px-4 py-2 rounded"
            >
              ⏹️ Stop Recording
            </button>
          )}

          {audioURL && (
            <div className="mt-4">
              <p>Your recording:</p>
              <audio controls src={audioURL}></audio>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default InstructionPage;
