import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from 'react-hot-toast';
import DashboardLayout from "./layouts/DashboardLayout";
import AdminLayout from "./layouts/AdminLayout";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Register from "./pages/Register";
import Lessons from "./pages/Lessons";
import MockTests from "./pages/MockTests";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import ManageLessons from "./pages/ManageLessons";
import CreateUnitTests from "./pages/CreateUnitTests";
import CreateMockTests from "./pages/CreateMockTests";
import AttemptTest from "./pages/AttemptTest";
import Topics from "./pages/Topics";
import LessonView from "./pages/LessonView";
import StudyMaterials from "./pages/StudyMaterials";
import SubjectMaterials from "./pages/SubjectMaterials";
import OnlineClassAdmin from "./pages/OnlineClassAdmin";
import OnlineClasses from "./pages/OnlineClasses";
import AdminStudents from "./pages/AdminStudents";

function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" reverseOrder={false} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="lessons" element={<Lessons />} />
          <Route path="lessons/:subject" element={<Topics />} />
          <Route path="lessons/:subject/:topic" element={<LessonView />} />
          <Route path="mock-tests" element={<MockTests />} />
          <Route
            path="attempt-test/:subject/:topic"
            element={<AttemptTest />}
          />
          <Route path="materials/:subject" element={<SubjectMaterials />} />
          <Route path="online-classes" element={<OnlineClasses />} />
        </Route>
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/admin-dashboard" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="manage-lessons" element={<ManageLessons />} />
          <Route path="create-unit-tests" element={<CreateUnitTests />} />
          <Route path="create-mock-tests" element={<CreateMockTests />} />
          <Route path="study-materials" element={<StudyMaterials />} />
          <Route path="online-classes" element={<OnlineClassAdmin />} />
          <Route path="students" element={<AdminStudents />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
