import {
	createBrowserRouter,
	Navigate,
	RouterProvider,
} from "react-router-dom";
import Root from "./pages/Root";
import RegistrationPage from "./pages/RegistrationPage";
import LoginPage from "./pages/LoginPage";
import AdminPage from "./pages/AdminPage";
import ProtectedRoute from "./authentication/ProtectedRoute";
import TeacherPage from "./pages/TeacherPage";
import StudentPage from "./pages/StudentPage";
import NotFoundPage from "./pages/NotFoundPage";
import DashboardPage from "./pages/dashboard/DashboardPage";
import AdminTeacherListView from "./pages/teacher/AdminTeacherListView";
import AdminStudentListView from "./pages/student/AdminStudentListView";
import AdminEvaluationListView from "./pages/evaluation/AdminEvaluationListView";
import AdminQuestionListView from "./pages/question/AdminQuestionListView";

const router = createBrowserRouter([
	{
		path: "*",
		element: <NotFoundPage />, // Create a NotFoundPage component
	},
	{
		path: "/register",
		element: <RegistrationPage />,
	},
	{
		path: "/login",
		element: <LoginPage />,
	},
	{
		path: "/",
		element: <Root />,
		children: [
			{
				path: "admin",
				element: <ProtectedRoute element={<AdminPage />} />,
				children: [
					{
						index: true,
						element: <DashboardPage />,
					},
					{
						path: "teachers",
						element: <AdminTeacherListView />,
					},
					{
						path: "students",
						element: <AdminStudentListView />,
					},
					{
						path: "evaluations",
						element: <AdminEvaluationListView />,
					},
					{
						path: "questions",
						element: <AdminQuestionListView />,
					},
				],
			},
			{
				path: "teacher",
				element: <ProtectedRoute element={<TeacherPage />} />,
			},
			{
				path: "student",
				element: <ProtectedRoute element={<StudentPage />} />,
			},
			{
				index: true, // Default child route for the root "/"
				element: <Navigate to="/login" replace />, // Redirect to "/login"
			},
		],
	},
]);

function App() {
	return <RouterProvider router={router} />;
}

export default App;
