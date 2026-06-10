import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styles from "./PreviewPublish.module.scss";
import { getTestById, publishTest } from "../../services/testService";
import { fetchBulkQuestions } from "../../services/questionService";

const PreviewPublish = () => {
  const { testId } = useParams();
  const navigate = useNavigate();

  const [test, setTest] = useState<any>(null);
  const [questions, setQuestions] = useState<any[]>([]);
  const [publishTab, setPublishTab] = useState<"now" | "schedule">("schedule");
  const [liveUntil, setLiveUntil] = useState<string>("custom");

  // Read metadata from local storage as dynamic context fallbacks
  const subjectName = localStorage.getItem("subjectName") || "N/A";
  const topicName = localStorage.getItem("topicName") || "N/A";
  const subTopicName = localStorage.getItem("subTopicName") || "N/A";
  const testType = localStorage.getItem("testType") || "chapterwise";

  const loadPreview = async () => {
    try {
      const testResponse = await getTestById(testId!);
      setTest(testResponse);

      const questionIds = JSON.parse(
        localStorage.getItem("questionIds") || "[]"
      );

      if (questionIds.length) {
        const response = await fetchBulkQuestions(questionIds);
        setQuestions(response.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    loadPreview();
  }, []);

  const handlePublish = async () => {
    try {
      await publishTest(testId!);
      alert("Test Published Successfully");
      navigate("/dashboard");
    } catch (error) {
      console.log(error);
      alert("Publish Failed");
    }
  };

  if (!test) {
    return (
      <div className={styles.loaderContainer}>
        <div className={styles.loader}></div>
        <p>Loading Preview...</p>
      </div>
    );
  }

  const formatTestType = (type: string) => {
    if (type === "chapterwise") return "Chapter Wise";
    if (type === "pyq") return "PYQ";
    if (type === "mock") return "Mock Test";
    return type.toUpperCase();
  };

  const capitalize = (str: string) => {
    if (!str) return "Easy";
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  return (
    <div className={styles.pageLayout}>
      {/* Left Sidebar tracking questions progress panel */}
      <aside className={styles.sidebar}>
        <div className={styles.sidebarTitleGroup}>
          <span className={styles.subText}>Question creation</span>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2">
            <path d="M11 19l-7-7 7-7M19 19l-7-7 7-7" />
          </svg>
        </div>
        
        <div className={styles.totalIndicator}>
          Total Questions . <span>{test.total_questions || questions.length}</span>
        </div>

        <div className={styles.questionListItemsStack}>
          {Array.from({ length: test.total_questions || 6 }).map((_, idx) => (
            <div key={idx} className={styles.sidebarQuestionBadge}>
              <span className={styles.checkIcon}>✓</span>
              <span className={styles.badgeText}>Question {idx === 0 || idx === 3 || idx === 4 ? "x" : idx + 1}</span>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5">
                <path d="M9 5l7 7-7 7" />
              </svg>
            </div>
          ))}
        </div>
      </aside>

      {/* Right Side Main Form Area Content workspace */}
      <main className={styles.mainContent}>
        <span className={styles.viewBreadcrumb}>Test creation</span>

        <section className={styles.testCreatedBannerBlock}>
          <div className={styles.headerTitleRow}>
            <h3>Test created</h3>
            <div className={styles.successPill}>
              <span className={styles.circleCheck}>✓</span> All {test.total_questions || questions.length} Questions done
            </div>
          </div>

          {/* Dynamic Card Meta Component Panel Area context */}
          <div className={styles.metaPreviewCard}>
            <div className={styles.cardTopRow}>
              <span className={styles.badgeLabel}>{formatTestType(testType)}</span>
              <button 
                type="button" 
                className={styles.editActionTrigger}
                onClick={() => navigate(`/add-questions/${testId}`)}
              >
                🖊
              </button>
            </div>

            <div className={styles.titleInfoRow}>
              <span className={styles.bookIcon}>📘</span>
              <h2 className={styles.testTitleText}>{test.name}</h2>
              <span className={styles.difficultyTag}>{capitalize(test.difficulty)}</span>
            </div>

            <div className={styles.gridSpecificationsLayout}>
              <div className={styles.specItem}>
                <span className={styles.label}>Subject</span>
                <span className={styles.divider}>:</span>
                <span className={styles.valueText}>{subjectName}</span>
              </div>
              
              <div className={styles.specItem}>
                <span className={styles.label}>Topic</span>
                <span className={styles.divider}>:</span>
                <div className={styles.pillTokensRow}>
                  <span className={styles.yellowToken}>{topicName}</span>
                  {topicName === "Grammar" && <span className={styles.yellowToken}>Writing</span>}
                </div>
              </div>

              <div className={styles.specItem}>
                <span className={styles.label}>Sub Topic</span>
                <span className={styles.divider}>:</span>
                <div className={styles.pillTokensRow}>
                  <span className={styles.orangeToken}>{subTopicName}</span>
                </div>
              </div>

              {/* Stats Block aligned right dynamically */}
              <div className={styles.rightStatsInlineRow}>
                <span className={styles.statNode}>⏱ {test.total_time} Min</span>
                <span className={styles.statNode}>❓ {test.total_questions} Qs</span>
                <span className={styles.statNode}>💯 {test.total_marks} Marks</span>
              </div>
            </div>
          </div>

          {/* Action Trigger Tab Control Segmented Row Bar layout switches */}
          <div className={styles.segmentedTabStripRow}>
            <button
              type="button"
              className={publishTab === "now" ? styles.activeSegmentBtn : styles.inactiveSegmentBtn}
              onClick={() => setPublishTab("now")}
            >
              Publish Now
            </button>
            <button
              type="button"
              className={publishTab === "schedule" ? styles.activeSegmentBtn : styles.inactiveSegmentBtn}
              onClick={() => setPublishTab("schedule")}
            >
              Schedule Publish
            </button>
          </div>

          {/* Conditional Layout Context Form Parameters Fields */}
          {publishTab === "schedule" && (
            <div className={styles.schedulingFormsWrapper}>
              <h4 className={styles.blockFieldTitle}>Select Date and Time</h4>
              <div className={styles.inputSplitRow}>
                <div className={styles.inputIconGroupField}>
                  <input type="text" placeholder="Select Date" defaultValue="2026-06-15" />
                  <span className={styles.fieldIcon}>📅</span>
                </div>
                <div className={styles.inputIconGroupField}>
                  <select defaultValue="10:00 AM">
                    <option value="10:00 AM">10:00 AM</option>
                    <option value="12:00 PM">12:00 PM</option>
                    <option value="04:00 PM">04:00 PM</option>
                  </select>
                </div>
              </div>

              <h4 className={styles.blockFieldTitle}>Live Until</h4>
              <p className={styles.fieldExplanationText}>
                Choose how long this test should remain available on the platform.
              </p>

              {/* Radio Grid Layout Configuration Parameters Frame */}
              <div className={styles.radioGridOptionBlocks}>
                {[
                  { id: "always", label: "Always Available" },
                  { id: "3weeks", label: "3 Weeks" },
                  { id: "1week", label: "1 Week" },
                  { id: "1month", label: "1 Month" },
                  { id: "2weeks", label: "2 Weeks" },
                  { id: "custom", label: "Custom Duration" },
                ].map((radio) => (
                  <label key={radio.id} className={styles.customRadioLabelRow}>
                    <input
                      type="radio"
                      name="liveUntil"
                      checked={liveUntil === radio.id}
                      onChange={() => setLiveUntil(radio.id)}
                    />
                    <span className={styles.radioCustomCircle}></span>
                    <span className={styles.textLabel}>{radio.label}</span>
                  </label>
                ))}
              </div>

              {liveUntil === "custom" && (
                <div className={styles.inputSplitRow} style={{ marginTop: "16px" }}>
                  <div className={styles.inputIconGroupField}>
                    <input type="text" placeholder="Select End Date" defaultValue="2026-07-15" />
                    <span className={styles.fieldIcon}>📅</span>
                  </div>
                  <div className={styles.inputIconGroupField}>
                    <select defaultValue="select">
                      <option value="select">Select End Time</option>
                      <option value="11:59 PM">11:59 PM</option>
                    </select>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Action Trigger Buttons Toolbar footer layout bar elements */}
          <div className={styles.formActionFooterStrip}>
            <button 
              type="button" 
              className={styles.cancelBtn} 
              onClick={() => navigate("/dashboard")}
            >
              Cancel
            </button>
            <button 
              type="button" 
              className={styles.confirmBtn} 
              onClick={handlePublish}
            >
              Confirm
            </button>
          </div>
        </section>
      </main>
    </div>
  );
};

export default PreviewPublish;