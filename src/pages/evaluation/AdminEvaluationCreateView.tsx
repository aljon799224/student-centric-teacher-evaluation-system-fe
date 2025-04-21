import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAutoHideToast } from "../../hooks/useAutoHideToast";
import api from "../../axios";
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

interface CreateEvaluationFormState {
	title: string;
	teacherId: number;
}

interface UserFormState {
	username: string;
	email: string;
	firstName: string;
	middleName: string;
	lastName: string;
	role: string;
	admin_id: number;
}

export default function AdminEvaluationCreateView({
	toggleModalCreate,
	addEvaluation,
}: any) {
	const [errorMessage, setErrorMessage] = useState<string | null>(null);
	const [isToastVisible, setIsToastVisible] = useState(false);
	const [users, setUsers] = useState<any[]>([]);

	const navigate = useNavigate();

	// Automatically hide toast after 3 seconds
	useAutoHideToast(isToastVisible, setIsToastVisible);

	const closeToast = () => setIsToastVisible(false);

	const [formData, setFormData] = useState<CreateEvaluationFormState>({
		title: "",
		teacherId: 0,
	});

	const token = localStorage.getItem("token");

	useEffect(() => {
		async function fetchTeachers() {
			if (!token) {
				setErrorMessage("Not authenticated");
				setIsToastVisible(true);
				throw new Error("Not authenticated");
			}
			try {
				const response = await fetch(`${BASE_URL}/user?page=1&size=50`, {
					headers: {
						Authorization: `Bearer ${token}`,
					},
				});
				const data = await response.json();

				const filteredTeachers = data.items
					.filter(
						(user: UserFormState) =>
							user.role === "teacher" &&
							user.admin_id === +(localStorage.getItem("user_id") || "0")
					)
					.sort(
						(a: any, b: any) =>
							new Date(b.updated_at).getTime() -
							new Date(a.updated_at).getTime()
					);

				// Set default teacherId if teachers are available
				if (filteredTeachers.length > 0) {
					setFormData((prevData) => ({
						...prevData,
						teacherId: prevData.teacherId || filteredTeachers[0].id, // Preserve existing value or set default
					}));
				}

				setUsers(filteredTeachers);
			} catch (error) {
				setErrorMessage("Failed to fetch teachers.");
				console.error("Failed to fetch teachers:", error);
			}
		}
		fetchTeachers();
	}, []);

	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
	) => {
		const { name, value } = e.target;
		setFormData((prevData) => ({
			...prevData,
			[name]: value,
		}));
	};

	const handleSubmit = async (e: React.ChangeEvent<HTMLFormElement>) => {
		e.preventDefault();

		try {
			if (!token) {
				setErrorMessage("Not authenticated");
				setIsToastVisible(true);
				throw new Error("Not authenticated");
			}
			const backendPayload = {
				title: formData.title,
				teacher_id: formData.teacherId,
				admin_id: localStorage.getItem("user_id"),
			};

			const response = await api.post("/evaluation", backendPayload, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});

			addEvaluation(response.data);

			toggleModalCreate();
			navigate("/admin/evaluations", {
				state: { message: "Evaluation has been created successfully!" },
			});
		} catch (error: any) {
			setErrorMessage(error.message);
			setIsToastVisible(true);
			console.error(error);
		}
	};

	// const filteredTeachers = users
	// 	.filter(
	// 		(user) =>
	// 			user.role === "teacher" &&
	// 			user.admin_id === +(localStorage.getItem("user_id") || "0")
	// 	)
	// 	.sort(
	// 		(a, b) =>
	// 			new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
	// 	);

	return (
		<div
			id="defaultModal"
			tabIndex={-1}
			aria-hidden="true"
			className="fixed inset-0 flex items-start justify-center min-h-screen mt-40"
		>
			<div className="relative p-4 w-full max-w-2xl h-full md:h-auto">
				{isToastVisible && errorMessage && (
					<div
						id="toast-danger"
						className="flex items-center w-full max-w-xs p-4 mb-4 text-gray-500 bg-white rounded-lg shadow mx-auto"
						role="alert"
					>
						<div className="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 text-red-500 bg-red-100 rounded-lg">
							<svg
								className="w-5 h-5"
								aria-hidden="true"
								xmlns="http://www.w3.org/2000/svg"
								fill="currentColor"
								viewBox="0 0 20 20"
							>
								<path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 11.793a1 1 0 1 1-1.414 1.414L10 11.414l-2.293 2.293a1 1 0 0 1-1.414-1.414L8.586 10 6.293 7.707a1 1 0 0 1 1.414-1.414L10 8.586l2.293-2.293a1 1 0 0 1 1.414 1.414L11.414 10l2.293 2.293Z" />
							</svg>
							<span className="sr-only">Error icon</span>
						</div>
						<div className="ms-3 text-sm font-normal">{errorMessage}</div>
						<button
							type="button"
							className="ms-auto -mx-1.5 -my-1.5 bg-white text-gray-400 hover:text-gray-900 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 hover:bg-gray-100 inline-flex items-center justify-center h-8 w-8 text-gray-500"
							data-dismiss-target="#toast-danger"
							aria-label="Close"
							onClick={closeToast}
						>
							<span className="sr-only">Close</span>
							<svg
								className="w-3 h-3"
								aria-hidden="true"
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 14 14"
							>
								<path
									stroke="currentColor"
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth="2"
									d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
								/>
							</svg>
						</button>
					</div>
				)}
				<div className="relative p-4 bg-white rounded-lg shadow sm:p-5 border-2">
					<div className="flex justify-between items-center pb-4 mb-4 rounded-t border-b sm:mb-5">
						<h3 className="text-lg font-semibold text-gray-900">
							Add Evaluation
						</h3>
						<button
							type="button"
							className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center"
							data-modal-toggle="defaultModal"
							onClick={toggleModalCreate}
						>
							<svg
								aria-hidden="true"
								className="w-5 h-5"
								fill="currentColor"
								viewBox="0 0 20 20"
								xmlns="http://www.w3.org/2000/svg"
							>
								<path
									fillRule="evenodd"
									d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
									clipRule="evenodd"
								></path>
							</svg>
							<span className="sr-only">Close modal</span>
						</button>
					</div>

					<form onSubmit={handleSubmit}>
						<div className="grid gap-4 mb-4 sm:grid-cols-2">
							<div>
								<label
									htmlFor="name"
									className="block mb-2 text-sm font-medium text-gray-900"
								>
									Title
								</label>
								<input
									name="title"
									type="text"
									className="text-gray-800 bg-white border border-gray-300 w-full text-sm px-4 py-3 rounded-md outline-blue-500"
									placeholder="Enter title"
									onChange={handleChange}
									value={formData.title}
									required
									maxLength={200}
								/>
							</div>
							<div>
								{/* <label className="block mb-2 text-sm font-medium text-gray-900">
									Teacher
								</label>
								<input
									name="teacher_id"
									type="text"
									className="text-gray-800 bg-white border border-gray-300 w-full text-sm px-4 py-3 rounded-md outline-blue-500"
									placeholder=""
									onChange={handleChange}
									value={formData.teacher_id}
									required
								/> */}
								<label
									htmlFor="name"
									className="block mb-2 text-sm font-medium text-gray-900"
								>
									Teacher
								</label>
								<select
									name="teacherId"
									className="text-gray-800 bg-white border border-gray-300 w-full text-sm px-4 py-3 rounded-md outline-blue-500"
									onChange={handleChange}
									value={formData.teacherId || (users[0]?.id ?? "")}
									required
								>
									{users.map((teacher: any) => (
										<option key={teacher.id} value={teacher.id}>
											{teacher.first_name +
												" " +
												teacher.middle_name +
												" " +
												teacher.last_name}
										</option>
									))}
								</select>
							</div>
						</div>

						<button
							type="submit"
							className="w-full py-3 px-4 text-sm tracking-wider font-semibold rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none"
						>
							Create
						</button>
					</form>
				</div>
			</div>
		</div>
	);
}
