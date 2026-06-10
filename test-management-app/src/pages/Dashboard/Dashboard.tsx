import { useEffect, useState } from "react";
import styles from "./Dashboard.module.scss";
import { useNavigate } from "react-router-dom";


import { getAllTests } from "../../services/testService";
import type { Test } from "../../types/test";

const Dashboard = () => {
  const [tests, setTests] = useState<Test[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchTests = async () => {
  try {
    const response = await getAllTests();
    setTests(response);
  } catch (error) {
  } finally {
    setLoading(false);
  }
};



  useEffect(() => {
    fetchTests();
  }, []);

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

  return (
    <div className={styles.dashboard}>
      <div className={styles.header}>
      </div>

      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Subject</th>
            <th>Status</th>
            <th>Created Date</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {tests.map((test) => (
            <tr key={test.id}>
              <td>{test.name}</td>
              <td>{test.subject}</td>
              <td>{test.status}</td>

              <td>
                {new Date(
                  test.created_at
                ).toLocaleDateString()}
              </td>

              <td>
                <button onClick={() =>
                  navigate(
                    `/edit-test/${test.id}`
                  )
                }>Edit</button>
                <button>View</button>
                <button>Delete</button>
              </td>

              
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Dashboard;