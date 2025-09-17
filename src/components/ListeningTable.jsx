import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ListeningTable = ({ testId, sectionNumber }) => {
  const [data, setData] = useState(null);
  const [userAnswers, setUserAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    axios.get(`http://127.0.0.1:8000/api/listening-tests/${testId}/section/${sectionNumber}/`)
      .then(res => {
        setData(res.data);
      })
      .catch(err => console.error('API Error:', err));
  }, [testId, sectionNumber]);

  const handleChange = (e, number) => {
    setUserAnswers(prev => ({
      ...prev,
      [number]: e.target.value
    }));
  };

  const handleSubmit = () => {
    setSubmitted(true);
  };

  const renderCell = (text) => {
    const parts = [];
    const regex = /\[\[(\d+)]]/g;
    let lastIndex = 0;
    let match;

    while ((match = regex.exec(text)) !== null) {
      const number = match[1];
      parts.push(text.slice(lastIndex, match.index));
      parts.push(
        <input
          key={number}
          type="text"
          onChange={(e) => handleChange(e, number)}
          disabled={submitted}
          className="border rounded px-1 mx-1 w-20"
        />
      );
      lastIndex = regex.lastIndex;
    }

    parts.push(text.slice(lastIndex));
    return parts;
  };

  const checkAnswer = (number, correct) => {
    const user = (userAnswers[number] || '').trim().toLowerCase();
    const correctOptions = correct.replace(/"/g, '').split(',').map(opt => opt.trim().toLowerCase());
    return correctOptions.includes(user);
  };

  if (!data) return <p>Loading...</p>;

  const table = data.questions[0]?.table;

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-2">Section {data.section_number}</h2>
      {data.audio_file && (
        <audio controls src={data.audio_file} className="mb-3" />
      )}
      <p className="italic mb-4">{data.instruction}</p>

      <table className="table-auto border-collapse w-full mb-4 text-sm">
        <thead>
          <tr>
            {table.columns.map((col, i) => (
              <th key={i} className="border p-2 bg-gray-100 text-left">{col}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {table.rows.map((row, rowIndex) => (
            <tr key={row.id}>
              {row.row_data.map((cell, i) => (
                <td key={i} className="border p-2">{renderCell(cell)}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {!submitted ? (
        <button
          onClick={handleSubmit}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Submit
        </button>
      ) : (
        <div className="mt-4">
          <h3 className="font-semibold mb-2">Natijalar</h3>
          {table.answers.map(ans => (
            <p key={ans.id}>
              [[{ans.number}]]: Siz kiritgan — <strong>{userAnswers[ans.number] || '—'}</strong>,
              To‘g‘ri — <strong>{ans.correct_answer}</strong>
              {checkAnswer(ans.number, ans.correct_answer) ? (
                <span className="text-green-600 ml-2">✅</span>
              ) : (
                <span className="text-red-600 ml-2">❌</span>
              )}
            </p>
          ))}
        </div>
      )}
    </div>
  );
};

export default ListeningTable;
