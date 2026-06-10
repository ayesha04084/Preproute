import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import styles from "./AddQuestions.module.scss";

import { createQuestions } from "../../services/questionService";

const AddQuestions = () => {
  const { testId } = useParams();
  const navigate = useNavigate();

  const [questions, setQuestions] = useState<any[]>([]);

  // --- READ DYNAMIC METADATA FROM LOCAL STORAGE ---
  const subjectId = localStorage.getItem("subjectId");
  const subjectName = localStorage.getItem("subjectName") || "N/A";
  const topicName = localStorage.getItem("topicName") || "N/A";
  const subTopicName = localStorage.getItem("subTopicName") || "N/A";
  const totalTime = localStorage.getItem("totalTime") || "0";
  const totalQuestionsMax = localStorage.getItem("totalQuestions") || "0";
  const totalMarks = localStorage.getItem("totalMarks") || "0";
  const testType = localStorage.getItem("testType") || "chapterwise";
  const testName = localStorage.getItem("testName") || "Untitled Test";

  // Helper function to turn type codes into clean presentation labels
  const formatTestType = (type: string) => {
    if (type === "chapterwise") return "Chapter Wise";
    if (type === "pyq") return "PYQ";
    if (type === "mock") return "Mock Test";
    return type.toUpperCase();
  };

  const [form, setForm] = useState({
    question: "",

    option1: "",
    option2: "",
    option3: "",
    option4: "",

    correct_option: "option1",

    explanation: "",

    difficulty: "easy",
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const addQuestion = () => {
    if (
      !form.question ||
      !form.option1 ||
      !form.option2 ||
      !form.option3 ||
      !form.option4
    ) {
      alert("Please fill all fields");
      return;
    }

    setQuestions([
      ...questions,
      {
        ...form,
      },
    ]);

    setForm({
      question: "",
      option1: "",
      option2: "",
      option3: "",
      option4: "",
      correct_option: "option1",
      explanation: "",
      difficulty: "easy",
    });
  };

  const saveQuestions = async () => {
    try {
      let finalQuestions = [...questions];

      // If current form has data and hasn't been added yet
      if (form.question.trim()) {
        finalQuestions.push({
          ...form,
        });
      }

      const payload = finalQuestions.map((question) => ({
        type: "mcq",
        question: question.question,
        option1: question.option1,
        option2: question.option2,
        option3: question.option3,
        option4: question.option4,
        correct_option: question.correct_option,
        explanation: question.explanation,
        difficulty: question.difficulty,
        test_id: testId,
        subject: subjectId,
      }));

      console.log("Payload:", payload);

      const response = await createQuestions(payload);

      const questionIds = response.data.map(
        (question: any) => question.id
      );

      localStorage.setItem(
        "questionIds",
        JSON.stringify(questionIds)
      );

      navigate(`/preview/${testId}`);
    } catch (error) {
      console.log(error);
      alert("Failed to save questions");
    }
  };

  // Optional Cleanup utility when leaving creation wizards context loop
  const clearTestData = () => {
    localStorage.removeItem("subjectName");
    localStorage.removeItem("topicName");
    localStorage.removeItem("subTopicName");
    localStorage.removeItem("totalTime");
    localStorage.removeItem("totalQuestions");
    localStorage.removeItem("totalMarks");
    localStorage.removeItem("testType");
    localStorage.removeItem("testName");
  };

  return (
    <div className={styles.page}>
      {/* Sidebar Left Side Panel */}
      <aside className={styles.sidebar}>
        <div className={styles.totalQuestions}>
          Total Questions: <span>{String(questions.length).padStart(2, '0')}</span>
        </div>

        <div className={styles.questionList}>
          {questions.map((_, index) => (
            <div key={index} className={styles.questionItem}>
              Question {index + 1}
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 18l6-6-6-6" />
              </svg>
            </div>
          ))}
          {/* Active Form Question State */}
          <div className={`${styles.questionItem} ${styles.activeQuestion}`}>
            Question {questions.length + 1}
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </div>
        </div>
      </aside>

      {/* Main Design Content Container */}
      <main className={styles.content}>
        {/* Top Section Breadcrumb Header */}
        <div className={styles.topHeader}>
          <p className={styles.breadcrumb}>
            Test Creation / Create Test / {formatTestType(testType)}
          </p>
          <button type="button" className={styles.publishBtn}>Publish</button>
        </div>

        {/* Test Meta Context Header Summary Bar - NOW DYNAMIC */}
        <div className={styles.testMetaHeader}>
          <div className={styles.metaRowOne}>
            <div className={styles.badge}>{formatTestType(testType)}</div>
            <button type="button" className={styles.editMetaBtn} onClick={() => navigate(-1)}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7M18.5 2.5a2.121 2.121 0 113 3L12 15l-4 1 1-4 9.5-9.5z" />
              </svg>
            </button>
          </div>

          <div className={styles.metaTitleBlock}>
            <span className={styles.chapterIcon}>📘</span>
            <span className={styles.chapterTitle}>{testName}</span>
            <span className={styles.liveIndicator}>Live</span>
          </div>

          <div className={styles.metaGridDetails}>
            <div className={styles.metaDataItem}>Subject: <span className={styles.boldValue}>{subjectName}</span></div>
            <div className={styles.metaDataItem}>Topic: <span className={styles.tagValue}>{topicName}</span></div>
            <div className={styles.metaDataItem}>Sub Topic: <span className={styles.tagValue}>{subTopicName}</span></div>
          </div>

          <div className={styles.metaStatsRight}>
            <span>⏱ {totalTime} Min</span>
            <span>❓ {totalQuestionsMax} Qs</span>
            <span>💯 {totalMarks} Marks</span>
          </div>
        </div>

        {/* Workspace Core Question Form Fields */}
        <div className={styles.card}>
          <div className={styles.cardHeaderRow}>
            <h2 className={styles.questionIndexLabel}>Question {questions.length + 1}: MCQ</h2>
            <div className={styles.dropdownActionGroup}>
              <select className={styles.typeSelector} defaultValue="mcq">
                <option value="mcq">MCQ</option>
              </select>
              <button type="button" className={styles.csvBtn}>📥 CSV</button>
            </div>
          </div>

          <button type="button" className={styles.deleteBtn}>
            🗑 Delete Activity
          </button>

          {/* Custom Text Editor Formatting Toolbar Strip */}
          <div className={styles.editorToolbar}>
            <button type="button">⚡️</button>
            <button type="button">B</button>
            <button type="button">I</button>
            <button type="button">U</button>
            <button type="button">🔗</button>
            <button type="button">📊</button>
            <button type="button">📐</button>
            <button type="button">🖼</button>
          </div>

          {/* Text Input Block */}
          <textarea
            name="question"
            className={styles.questionInputBox}
            placeholder="Type here..."
            value={form.question}
            onChange={handleChange}
          />

          <p className={styles.sectionSubHeading}>Type the options below</p>

          {/* Custom Selection Options Container Grid Rows */}
          <div className={styles.optionsWrapperStack}>
            {[
              { key: "option1", placeholder: "Type Option here..." },
              { key: "option2", placeholder: "Type Option here..." },
              { key: "option3", placeholder: "Type Option here..." },
              { key: "option4", placeholder: "Type Option here..." },
            ].map((opt) => (
              <div key={opt.key} className={styles.optionInputFieldRow}>
                <label className={styles.radioOptionSelectionCircle}>
                  <input
                    type="radio"
                    name="correct_option"
                    value={opt.key}
                    checked={form.correct_option === opt.key}
                    onChange={handleChange}
                  />
                  <span className={styles.customRadioCircle}></span>
                </label>
                <input
                  type="text"
                  name={opt.key}
                  placeholder={opt.placeholder}
                  value={(form as any)[opt.key]}
                  onChange={handleChange}
                  className={styles.optionInputTextElement}
                />
                <button type="button" className={styles.removeOptionBtn}>🗑</button>
              </div>
            ))}
          </div>

          {/* Explanation Block Section Container Area */}
          <div className={styles.explanationSectionBlock}>
            <p className={styles.sectionSubHeading}>Add Solution</p>
            <textarea
              name="explanation"
              className={styles.explanationTextarea}
              placeholder="Type here..."
              value={form.explanation}
              onChange={handleChange}
            />
          </div>

          {/* Bottom Nested Form Metadata Grid Selector Elements Row */}
          <div className={styles.questionSettingsSection}>
            <h3 className={styles.settingsSectionTitle}>Question settings</h3>
            
            <div className={styles.settingsGridRow}>
              <div className={styles.settingField}>
                <label>Level of Difficulty</label>
                <select name="difficulty" value={form.difficulty} onChange={handleChange}>
                  <option value="easy">Select from Drop-down</option>
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Difficult</option>
                </select>
              </div>

              <div className={styles.settingField}>
                <label>Topic</label>
                <select defaultValue="">
                  <option value="">{topicName}</option>
                </select>
              </div>

              <div className={styles.settingField}>
                <label>Sub-topic</label>
                <select defaultValue="">
                  <option value="">{subTopicName}</option>
                </select>
              </div>
            </div>
          </div>

          {/* Action Controls Footer Triggers */}
          <div className={styles.actionsFooterStrip}>
            <button type="button" className={styles.exitBtn} onClick={() => navigate("/dashboard")}>
              Exit Test Creation
            </button>
            <div className={styles.rightActionControls}>
              <button type="button" className={styles.addAnotherBtn} onClick={addQuestion}>
                Add Another Question
              </button>
              <button type="button" className={styles.saveBtn} onClick={saveQuestions}>
                Next
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AddQuestions;