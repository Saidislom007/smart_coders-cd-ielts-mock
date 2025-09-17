import React from 'react';
import SentenceCompletion from './SentenceCompletion';
import TableCompletion from './TableCompletion';
import FormCompletion from './FormCompletion';
import MultipleChoice from './MultipleChoice';
import MapLabelling from './MapLabelling';
import MatchingHeadings from './MatchingHeadings';
import TrueFalseNotGiven from './TrueFalseNotGiven';
import MultipleSelect from './MultipleSelect';


const componentMap = {
  sentence_completion: SentenceCompletion,
  table_completion: TableCompletion,
  form_completion: FormCompletion,
  multiple_choice: MultipleChoice,
  map_labelling: MapLabelling,
  matching_headings: MatchingHeadings,
  true_false_not_given: TrueFalseNotGiven,
  two_multiple_choice: MultipleSelect
};

const QuestionRenderer = ({
  question,
  userAnswers,
  submitted,
  onChange,
  onCorrectCountChange,
}) => {
  const Component = componentMap[question.question_type];
  if (!Component) return null;

  const commonProps = {
    question,
    submitted,
    onChange,
    onCorrectCountChange,
    userAnswers
  };

  switch (question.question_type) {
    case 'sentence_completion':
      return (
        <Component
          {...commonProps}
          number={question.question_number}
          questionText={question.question_text}
          instruction={question.instruction || ''}
          userAnswer={userAnswers?.[question.question_number] || ''}
          correctAnswer={question.correct_answer}
        />
      );
    case 'two_multiple_choice':
      return (
        <Component
          {...commonProps}
        />
      );

    case 'table_completion':
      return (
        <Component
          {...commonProps}
          table={question.table}
          instruction={question.instruction || ''}
          number={question.question_number}
          question={question}
        />
      );



    case 'form_completion':
      return (
        <Component
          {...commonProps}
          form={question.form}
          instruction={question.instruction || ''}
          correctAnswers={question.form?.answers?.map((a) => a.correct_answer) || []}
        />
      );

    case 'multiple_choice':
      return <Component {...commonProps} />;

    case 'map_labelling':
      return (
        <Component
          {...commonProps}
          imageSrc={question.imageSrc || question.map_image || ''}
          questionText={question.question_text || ''}
          instruction={question.instruction || ''}
          options={Array.isArray(question.options) ? question.options : []}
          questionNumber={String(question.question_number)}
          correctAnswers={question.map?.answers?.map((a) => a.correct_answer) || []}
        />
      );

    case 'matching_headings':
      return (
        <Component
          {...commonProps}
          correctAnswers={question.correctAnswers || {}}
        />
      );

    case 'true_false_not_given':
      return (
        <Component
          {...commonProps}
          correctAnswer={question.correct_answer}
          userAnswer={userAnswers?.[question.question_number] || ''}
        />
      );

    default:
      return null;
  }
};

export default QuestionRenderer;
