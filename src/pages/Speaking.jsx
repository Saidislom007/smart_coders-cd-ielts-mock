import { useEffect, useState } from "react";
import Part1 from "../components/Part1";
import Part2 from "../components/Part2";
import Part3 from "../components/Part3";
import { useRecorder } from "../common/Recorder";
import speakingData from "../data/speakingTest.json";
import "./speaking.css";

const SpeakingPage = () => {
  const [data, setData] = useState(null);
  const [part, setPart] = useState(1);
  const [questionIndex, setQuestionIndex] = useState(0);

  const {
    isRecording,
    prepTime,
    setPrepTime,
    startRecording,
    stopRecording,
    startPrepAndRecording,
  } = useRecorder({ part, questionIndex });

  useEffect(() => {
    // 🔹 JSON fayldan ma’lumot olish
    const test = speakingData[0];
    const parsed = {
      part1: test.part1_questions.flatMap((q) =>
        q.question_text
          .split("?")
          .map((q) => q.trim())
          .filter(Boolean)
          .map((q) => q + "?")
      ),
      part2: {
        topic: test.part2_cue_card[0]?.topic || "",
        points:
          test.part2_cue_card[0]?.description
            ?.split("\r\n")
            .filter(Boolean) || [],
      },
      part3: test.part3_questions.map((q) => ({
        title: q.title,
        questions: q.question_text
          .split("\r\n")
          .map((qq) => qq.trim())
          .filter(Boolean),
      })),
    };
    setData(parsed);
  }, []);

  // 🔹 Faqat prepTime sanash
  useEffect(() => {
    if (prepTime > 0) {
      const id = setTimeout(() => setPrepTime((p) => p - 1), 1000);
      return () => clearTimeout(id);
    }
    if (prepTime === 0 && !isRecording) {
      // prepTime tugasa recording qo'lda boshlanishi mumkin
      startRecording();
    }
  }, [prepTime]);

  const handleNextQuestion = () => {
    if (!data) return;

    if (part === 1) {
      if (questionIndex < data.part1.length - 1) {
        setQuestionIndex((i) => i + 1);
      } else {
        setQuestionIndex(0);
        setPart(2);
      }
    } else if (part === 2) {
      setQuestionIndex(0);
      setPart(3);
    } else if (part === 3) {
      if (questionIndex < data.part3.length - 1) {
        setQuestionIndex((i) => i + 1);
      } else {
        console.log("✅ Test tugadi");
      }
    }
  };

  if (!data) return <div>Yuklanmoqda...</div>;

  return (
    <div className="speaking-container">
      {part === 1 && (
        <Part1
          data={data.part1}
          onStart={startPrepAndRecording}
          onStop={stopRecording}
          onFinish={() => setPart(2)}
        />
      )}

      {part === 2 && (
        <Part2
          data={data.part2}
          questionIndex={questionIndex}
          onNext={() => setPart(3)}
          isRecording={isRecording}
          prepTime={prepTime}
          onStart={startPrepAndRecording}
          onStop={stopRecording}
        />
      )}

      {part === 3 && (
        <Part3
          data={data.part3[questionIndex]}
          questionIndex={questionIndex}
          onNext={handleNextQuestion}
          isRecording={isRecording}
          prepTime={prepTime}
          onStart={startPrepAndRecording}
          onStop={stopRecording}
        />
      )}
    </div>
  );
};

export default SpeakingPage;
