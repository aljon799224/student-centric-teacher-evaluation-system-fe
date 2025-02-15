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
import AdminTeacherListView from "./pages/teacher/AdminTeacherListView";
import AdminStudentListView from "./pages/student/AdminStudentListView";
import AdminEvaluationListView from "./pages/evaluation/AdminEvaluationListView";
import AdminQuestionListView from "./pages/question/AdminQuestionListView";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ForgotPasswordMainPage from "./pages/ForgotPasswordMainPage";
import NotAuthorizePage from "./pages/NotAuthorizePage";
import AdminDashboardPage from "./pages/dashboard/AdminDashboardPage";
import StudentDashboardPage from "./pages/dashboard/StudentDashboardPage";
import StudentEvaluationListView from "./pages/evaluation/StudentEvaluationListView";
import StudentEvaluationQAFormView from "./pages/evaluation/StudentEvaluationQAFormView";
import AdminProfilePage from "./pages/AdminProfilePage";

const router = createBrowserRouter([
	{
		path: "*",
		element: <NotFoundPage />, // Create a NotFoundPage component
	},
	{
		path: "/not-authorize",
		element: <NotAuthorizePage />, // Create a NotFoundPage component
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
		path: "/reset-password",
		element: <ForgotPasswordMainPage />,
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
						element: <AdminDashboardPage />,
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
					{
						path: "reset-password",
						element: <ForgotPasswordPage />,
					},
					{
						path: "profile",
						element: <AdminProfilePage />,
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
				children: [
					{
						index: true,
						element: <StudentDashboardPage />,
					},
					{
						path: "evaluations",
						element: <StudentEvaluationListView />,
					},
					{
						path: "questions",
						element: <StudentEvaluationQAFormView />,
					},
					{
						path: "reset-password",
						element: <ForgotPasswordPage />,
					},
				],
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
