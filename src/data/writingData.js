// src/data/writingData.js


export const writingTest = {
  task1: {
    prompt:
      "The graph below shows the number of overseas students enrolled in universities in three different countries between 2000 and 2020. Summarize the information by selecting and reporting the main features, and make comparisons where relevant.",
    wordLimit: 150,
  },
  task2: {
    prompt:
      "Some people believe that professional workers such as doctors and teachers should be paid more than sports and entertainment personalities. To what extent do you agree or disagree?",
    wordLimit: 250,
  },
};

// Example structure for storing user response:
export const writingSubmissions = [];
// Example of a submission
// {
//   userId: "123abc",
//   task1: {
//     response: "In the graph, the number of overseas students...",
//     wordCount: 162,
//     feedback: "Good overall structure. Try to use more varied vocabulary."
//   },
//   task2: {
//     response: "While some believe sports stars deserve high salaries...",
//     wordCount: 268,
//     feedback: "Strong argument. Add more supporting examples."
//   },
//   submittedAt: "2025-07-27T17:15:00Z"
// }
