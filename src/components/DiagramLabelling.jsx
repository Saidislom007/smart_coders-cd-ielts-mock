import React from 'react';

const DiagramLabelling = ({ imageSrc, labels, userAnswers, onChange, submitted }) => {
  return (
    <div className="diagram-labelling">
      {imageSrc && (
        <img src={imageSrc} alt="Diagram" className="mb-4 max-w-full" />
      )}
      <ul className="space-y-2">
        {labels.map((label) => (
          <li key={label.number} className="flex items-center gap-2">
            <span className="font-medium">{label.text}</span>
            <input
              type="text"
              placeholder={`Q${label.number}`}
              className="border border-gray-300 p-1 rounded w-24"
              value={userAnswers[label.number] || ''}
              disabled={submitted}
              onChange={(e) => onChange(e, label.number)}
            />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DiagramLabelling;
