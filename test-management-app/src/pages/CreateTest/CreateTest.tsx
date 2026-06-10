import { useEffect, useState } from "react";
import { useNavigate,useParams } from "react-router-dom";

import styles from "./Create.module.scss";

import {
  getSubjects,
  getTopicsBySubject,
  getSubTopics,
} from "../../services/masterService";

import {
  createTest,
  getTestById,
  updateTest,
} from "../../services/testService";




interface Subject {
  id: string;
  name: string;
}

interface Topic {
  id: string;
  name: string;
}

interface SubTopic {
  id: string;
  name: string;
}

const CreateTest = () => {
  const navigate = useNavigate();

  const { testId } = useParams();

  const isEditMode = !!testId;

  const [loading, setLoading] =
  useState(true);

  const [subjects, setSubjects] = useState<
    Subject[]
  >([]);

  const [topics, setTopics] = useState<
    Topic[]
  >([]);

  const [subTopics, setSubTopics] =
    useState<SubTopic[]>([]);

  const [formData, setFormData] =
    useState({
      name: "",
      subject: "",
      type: "chapterwise",

      topics: [] as string[],
      sub_topics: [] as string[],

      difficulty: "easy",

      total_time: 60,

      correct_marks: 4,
      wrong_marks: -1,
      unattempt_marks: 0,

      total_questions: 0,
      total_marks: 0,
      status: "draft",
    });

useEffect(() => {
  const init = async () => {
    try {
      const subjectsData =
        await getSubjects();

      setSubjects(subjectsData);

      if (isEditMode) {
        await loadTest(
          subjectsData
        );
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  init();
}, []);

  // const loadSubjects = async () => {
  //   try {
  //     const data = await getSubjects();

  //     setSubjects(data);
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };

const loadTest = async (subjectsData: Subject[]) => {
  try {
    const test = await getTestById(testId!);

    console.log("FULL TEST:", test);
    console.log("TOPICS:", test.topics);

    const selectedSubject = subjectsData.find(
      (item) => item.name === test.subject
    );

    if (!selectedSubject) return;

    const topicsData = await getTopicsBySubject(selectedSubject.id);
    setTopics(topicsData);

    // Convert topic names -> topic ids
    const selectedTopicIds = topicsData
      .filter((topic: Topic) => test.topics?.includes(topic.name))
      .map((topic: Topic) => topic.id);

    let subTopicsData = [];
    let selectedSubTopicIds: string[] = []; // 👈 Declare an array to hold the matched IDs

    if (selectedTopicIds.length > 0) {
      subTopicsData = await getSubTopics(selectedTopicIds);
      setSubTopics(subTopicsData);

      // 💡 FIX IS HERE: Convert sub_topic names into sub_topic UUIDs
      selectedSubTopicIds = subTopicsData
        .filter((sub: SubTopic) => test.sub_topics?.includes(sub.name))
        .map((sub: SubTopic) => sub.id);
    }

    setFormData({
      name: test.name,
      subject: selectedSubject.id,
      type: test.type,
      topics: selectedTopicIds,
      
      // 💡 ASSIGN THE PARSED UUIDs INSTEAD OF RAW STRING NAMES
      sub_topics: selectedSubTopicIds.length > 0 ? selectedSubTopicIds : (test.sub_topics || []),

      difficulty: test.difficulty,
      total_time: test.total_time,
      correct_marks: test.correct_marks,
      wrong_marks: test.wrong_marks,
      unattempt_marks: test.unattempt_marks,
      total_questions: test.total_questions,
      total_marks: test.total_marks,
      status: test.status || "draft",
    });
  } catch (error) {
    console.log(error);
  }
};

  const handleSubjectChange = async (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const subjectId = e.target.value;

    setFormData({
      ...formData,
      subject: subjectId,
      topics: [],
      sub_topics: [],
    });

    try {
      const data =
        await getTopicsBySubject(
          subjectId
        );

      setTopics(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleTopicChange = async (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const topicIds = Array.from(
      e.target.selectedOptions,
      (option) => option.value
    );

    setFormData({
      ...formData,
      topics: topicIds,
    });

    try {
      const data =
        await getSubTopics(
          topicIds
        );

      setSubTopics(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmit = async () => {
  try {
    const payload = {
      ...formData,
      status:
        formData.status ||
        "draft",
    };
    const currentSubjectObj = subjects.find((s) => s.id === formData.subject);
    const currentTopicObj = topics.find((t) => t.id === formData.topics[0]);
    const currentSubTopicObj = subTopics.find((st) => st.id === formData.sub_topics[0]);

    const subjectName = currentSubjectObj ? currentSubjectObj.name : "N/A";
    const topicName = currentTopicObj ? currentTopicObj.name : "N/A";
    const subTopicName = currentSubTopicObj ? currentSubTopicObj.name : "N/A";
    if (isEditMode) {
      await updateTest(
        testId!,
        payload
      );

      alert(
        "Test Updated Successfully"
      );

      navigate(
        "/dashboard"
      );
    } else {
      const response =
        await createTest(
          payload
        );

      const newTestId =
        response.data.id;

    ;
      localStorage.setItem("subjectId", formData.subject);
      localStorage.setItem("subjectName", subjectName);
      localStorage.setItem("topicName", topicName);
      localStorage.setItem("subTopicName", subTopicName);
      localStorage.setItem("totalTime", String(formData.total_time));
      localStorage.setItem("totalQuestions", String(formData.total_questions));
      localStorage.setItem("totalMarks", String(formData.total_marks));
      localStorage.setItem("testName", formData.name);
      localStorage.setItem("testType", formData.type);
      navigate(
        `/add-questions/${newTestId}`
      );
    }
  } catch (error) {
    console.error(error);

    alert(
      isEditMode
        ? "Failed to update test"
        : "Failed to create test"
    );
  }
};

if (loading) {
  return (
    <div
      className={styles.loaderContainer}
    >
      <div
        className={styles.loader}
      ></div>

      <p>Loading...</p>
    </div>
  );
}

const difficultyLevels = [
    { value: "easy", label: "Easy" },
    { value: "medium", label: "Medium" },
    { value: "hard", label: "Difficult" }, // matching the label from image
  ];

return (
  <div className={styles.container}>
    {/* Breadcrumb */}
    <p className={styles.breadcrumb}>
      Test Creation / {isEditMode ? "Edit Test" : "Create Test"} / Chapter Wise
    </p>

    {/* Tabs */}
    <div className={styles.tabs}>
      <button
        type="button"
        className={formData.type === "chapterwise" ? styles.activeTab : ""}
        onClick={() => setFormData({ ...formData, type: "chapterwise" })}
      >
        Chapterwise
      </button>
      <button
        type="button"
        className={formData.type === "pyq" ? styles.activeTab : ""}
        onClick={() => setFormData({ ...formData, type: "pyq" })}
      >
        PYQ
      </button>
      <button
        type="button"
        className={formData.type === "mock" ? styles.activeTab : ""}
        onClick={() => setFormData({ ...formData, type: "mock" })}
      >
        Mock Test
      </button>
    </div>

    {/* FORM */}
    <div className={styles.form}>
      {/* Subject */}
      <div className={styles.field}>
        <label>Subject</label>
        <select value={formData.subject} onChange={handleSubjectChange}>
          <option value="">Choose from Drop-down</option>
          {subjects.map((subject) => (
            <option key={subject.id} value={subject.id}>
              {subject.name}
            </option>
          ))}
        </select>
      </div>

      {/* Test Name */}
      <div className={styles.field}>
        <label>Name of Test</label>
        <input
          value={formData.name}
          placeholder="Enter name of Test"
          onChange={(e) =>
            setFormData({ ...formData, name: e.target.value })
          }
        />
      </div>

      {/* Topic - Modified to Standard Single Dropdown */}
      <div className={styles.field}>
        <label>Topic</label>
        <select 
          value={formData.topics[0] || ""} 
          onChange={(e) => {
            const value = e.target.value;
            handleTopicChange({
              target: { selectedOptions: [{ value }] }
            } as any);
          }}
        >
          <option value="">Choose from Drop-down</option>
          {topics.map((topic) => (
            <option key={topic.id} value={topic.id}>
              {topic.name}
            </option>
          ))}
        </select>
      </div>

      {/* Sub Topic - Modified to Standard Single Dropdown */}
      <div className={styles.field}>
        <label>Sub Topic</label>
        <select
          value={formData.sub_topics[0] || ""}
          onChange={(e) => setFormData({ ...formData, sub_topics: [e.target.value] })}
        >
          <option value="">Choose from Drop-down</option>
          {subTopics.map((sub) => (
            <option key={sub.id} value={sub.id}>
              {sub.name}
            </option>
          ))}
        </select>
      </div>

      {/* Duration */}
      <div className={styles.field}>
        <label>Duration (Minutes)</label>
        <input
          type="number"
          value={formData.total_time}
          placeholder="Enter the time"
          onChange={(e) =>
            setFormData({
              ...formData,
              total_time: Number(e.target.value),
            })
          }
        />
      </div>

      {/* Difficulty */}
      <div className={styles.field}>
        <label>Test Difficulty Level</label>
        <div className={styles.difficultyGroup}>
          {difficultyLevels.map((level) => (
            <label key={level.value} className={styles.radioLabel}>
              <input
                type="radio"
                name="difficulty"
                value={level.value}
                checked={formData.difficulty === level.value}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    difficulty: e.target.value,
                  })
                }
              />
              <span>{level.label}</span>
            </label>
          ))}
        </div>
      </div>
    </div>

    {/* MARKING SCHEME */}
    <div className={styles.markingSection}>
      <h4 className={styles.markingTitle}>Marking Scheme:</h4>

      <div className={styles.marks}>
        <div className={styles.markingField}>
          <label>Wrong Answer</label>
          <input
            type="number"
            placeholder="-1"
            value={formData.wrong_marks}
            onChange={(e) =>
              setFormData({
                ...formData,
                wrong_marks: Number(e.target.value),
              })
            }
          />
        </div>

        <div className={styles.markingField}>
          <label>Unattempted</label>
          <input
            type="number"
            placeholder="0"
            value={formData.unattempt_marks}
            onChange={(e) =>
              setFormData({
                ...formData,
                unattempt_marks: Number(e.target.value),
              })
            }
          />
        </div>

        <div className={styles.markingField}>
          <label>Correct Answer</label>
          <input
            type="number"
            placeholder="+5"
            value={formData.correct_marks}
            onChange={(e) =>
              setFormData({
                ...formData,
                correct_marks: Number(e.target.value),
              })
            }
          />
        </div>

        <div className={styles.markingField}>
          <label>No of Questions</label>
          <input
            type="number"
            placeholder="Ex:250 Marks"
            value={formData.total_questions || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                total_questions: Number(e.target.value),
              })
            }
          />
        </div>

        <div className={styles.markingField}>
          <label>Total Marks</label>
          <input
            type="number"
            placeholder="Ex:250 Marks"
            value={formData.total_marks || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                total_marks: Number(e.target.value),
              })
            }
          />
        </div>
      </div>
    </div>

    {/* ACTIONS */}
    <div className={styles.actions}>
      <button type="button" className={styles.cancel}>Cancel</button>
      <button type="button" className={styles.next} onClick={handleSubmit}>
        {isEditMode ? "Save Changes" : "Next"}
      </button>
    </div>
  </div>
);
};

export default CreateTest;