import React, { useState } from 'react';
import "./highlight.css"; // Tailwind CSS dan foydalanilayotgan bo‘lsa, bu fayl kerakli bo‘lishi mumkin

const TextHighlighter = ({ text }) => {
  const [selectedText, setSelectedText] = useState('');
  const [highlightedTexts, setHighlightedTexts] = useState(new Set());
  const [showButtons, setShowButtons] = useState(false);
  const [buttonPosition, setButtonPosition] = useState({ x: 0, y: 0 });

  const handleTextSelection = () => {
    setTimeout(() => {
      const selection = window.getSelection();
      const selected = selection.toString().trim();

      if (selected && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        const rect = range.getBoundingClientRect();

        if (rect.width > 0 || rect.height > 0) {
          setSelectedText(selected);
          setButtonPosition({
            x: rect.left + rect.width / 2,
            y: rect.top + window.scrollY - 40,
          });
          setShowButtons(true);
        }
      } else {
        setShowButtons(false);
      }
    }, 10);
  };

  const highlightText = () => {
    if (selectedText) {
      setHighlightedTexts((prev) => new Set([...prev, selectedText]));
      setShowButtons(false);
      window.getSelection().removeAllRanges();
    }
  };

  const unhighlightText = () => {
    if (selectedText) {
      setHighlightedTexts((prev) => {
        const newSet = new Set(prev);
        newSet.delete(selectedText);
        return newSet;
      });
      setShowButtons(false);
      window.getSelection().removeAllRanges();
    }
  };

  const renderTextWithHighlight = (text) => {
    let result = text;

    highlightedTexts.forEach((highlightedText) => {
      const escaped = highlightedText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(`(${escaped})`, 'gi');
      result = result.replace(regex, '<mark class="bg-yellow-300">$1</mark>');
    });

    return result;
  };

  return (
    <div className="relative">
      <p
        className="text-base leading-relaxed text-gray-800 select-text"
        onMouseUp={handleTextSelection}
        onMouseDown={() => setShowButtons(false)}
        onTouchEnd={handleTextSelection}
        onKeyUp={handleTextSelection}
        dangerouslySetInnerHTML={{ __html: renderTextWithHighlight(text) }}
        style={{ userSelect: 'text', WebkitUserSelect: 'text' }}
      />

      {showButtons && (
        <div
          className="absolute z-10 flex gap-2"
          style={{
            left: `${buttonPosition.x}px`,
            top: `${buttonPosition.y}px`,
            transform: 'translateX(-50%)',
          }}
        >
          <button
            onClick={highlightText}
            className="px-2 py-1 bg-yellow-400 text-gray-900 rounded hover:bg-yellow-500 text-sm"
          >
            Highlight
          </button>
          <button
            onClick={unhighlightText}
            className="px-2 py-1 bg-gray-500 text-white rounded hover:bg-gray-600 text-sm"
          >
            Unhighlight
          </button>
        </div>
      )}
    </div>
  );
};

export default TextHighlighter;
