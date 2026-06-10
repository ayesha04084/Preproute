import {
  BrowserRouter,
  Routes,
  Route,
  Navigate
} from "react-router-dom";

import Login from "./pages/Login/login";

import Dashboard from "./pages/Dashboard/Dashboard";

import CreateTest from "./pages/CreateTest/CreateTest";

import AddQuestions from "./pages/AddQuestions/AddQuestions";

import PreviewPublish from "./pages/PreviewPublish/PreviewPublish";

import ProtectedRoute from "./routes/ProtectedRoute";

import Layout from "./components/Layout/Layout";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/dashboard"
          element={
           
              <Layout>
                <Dashboard />
              </Layout>
           
          }
        />

        <Route
          path="/create-test"
          element={
            <ProtectedRoute>
              <Layout>
                <CreateTest />
              </Layout>
            </ProtectedRoute>
          }
        />

       <Route
        path="/add-questions/:testId"
        element={
          <ProtectedRoute>
            <AddQuestions />
          </ProtectedRoute>
        }
      />

        <Route
          path="/preview/:testId"
          element={
            <ProtectedRoute>
              <PreviewPublish />
            </ProtectedRoute>
          }
        />

        <Route
          path="/edit-test/:testId"
          element={
            <ProtectedRoute>
              <CreateTest />
            </ProtectedRoute>
          }
        />
      </Routes>

     
    </BrowserRouter>
  );
}

export default App;