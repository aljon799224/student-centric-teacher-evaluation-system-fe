import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { formattedDate } from "../../utils/formatDate";
import { useAutoHideToast } from "../../hooks/useAutoHideToast";

interface UserFormState {
	username: string;
	email: string;
	firstName: string;
	middleName: string;
	lastName: string;
	role: string;
	admin_id: number;
}

export default function TeacherEvaluationListView() {
	const [evaluations, setEvaluations] = useState<any[]>([]);
	const [errorMessage, setErrorMessage] = useState<string | null>(null);
	const [isToastVisible, setIsToastVisible] = useState(false);
	const [users, setUsers] = useState<any[]>([]);
	const [teacherId, setTeacherId] = useState<number | null>(null);
	const [teacherName, setTeacherName] = useState<string | null>(
		"Select a teacher"
	);

	const navigate = useNavigate();
	const location = useLocation();

	const closeToast = () => setIsToastVisible(false);

	// Automatically hide toast after 3 seconds
	useAutoHideToast(isToastVisible, setIsToastVisible);

	const teacherIdFromState = location.state?.teacherId ?? 0;

	// Check for authentication token (e.g., in localStorage or cookies)
	const token = localStorage.getItem("token");

	const fetchTeacher = async () => {
		if (!token) {
			setErrorMessage("Not authenticated");
			setIsToastVisible(true);
			throw new Error("Not authenticated");
		}
		try {
			if (teacherIdFromState) {
				const response = await fetch(
					`http://0.0.0.0:8000/api/v1/user/${teacherIdFromState}`,
					{
						headers: {
							Authorization: `Bearer ${token}`,
						},
					}
				);

				const data = await response.json();
				setTeacherName(
					`${data.first_name} ${data.middle_name} ${data.last_name}`
				);
			}
		} catch (error) {
			setErrorMessage("Failed to fetch teacher.");
			console.error("Failed to fetch teacher:", error);
		}
	};

	const fetchTeachers = async () => {
		if (!token) {
			setErrorMessage("Not authenticated");
			setIsToastVisible(true);
			throw new Error("Not authenticated");
		}
		try {
			const response = await fetch(
				"http://0.0.0.0:8000/api/v1/user?page=1&size=50",
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);

			const data = await response.json();

			const filteredTeachers = data.items
				.filter((user: UserFormState) => user.role === "teacher")
				.sort(
					(a: any, b: any) =>
						new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
				);

			setUsers(filteredTeachers);
		} catch (error) {
			setErrorMessage("Failed to fetch teachers.");
			console.error("Failed to fetch teachers:", error);
		}
	};

	const fetchEvaluations = async () => {
		try {
			if (!token) {
				throw new Error("Not authenticated");
			}

			// http://localhost:8000/api/v1/3/evaluations?page=1&size=50

			const evalUrl =
				teacherId || teacherIdFromState
					? `http://localhost:8000/api/v1/${
							teacherId || teacherIdFromState
					  }/evaluations?page=1&size=50`
					: `http://localhost:8000/api/v1/evaluation?page=1&size=50`;

			const response = await fetch(evalUrl, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});

			if (response.status === 401) {
				throw new Error("Unauthorized access");
			}

			const data = await response.json();

			if (Array.isArray(data.items)) {
				const filteredEvaluations = data.items.sort(
					(a: any, b: any) =>
						new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
				);

				setEvaluations(filteredEvaluations);
			} else {
				setEvaluations([]);
			}
		} catch (error: any) {
			setErrorMessage(error.message);
			setIsToastVisible(true);
			if (
				error.message === "Not authenticated" ||
				error.message === "Unauthorized access"
			) {
				// Redirect to login page if not authenticated
				navigate("/login");
			} else {
				setEvaluations([]);
			}
		}
	};

	useEffect(() => {
		fetchEvaluations();
	}, [teacherId]);

	useEffect(() => {
		fetchTeachers();
	}, [teacherId]);

	useEffect(() => {
		fetchTeacher();
	}, [teacherIdFromState]);

	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
	) => {
		const { value } = e.target;
		setTeacherId(Number(value));
	};

	return (
		<div className="overflow-x-auto">
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

			<div
				id="dropdownInformation"
				className="mb-3 divide-black-100 rounded-lg w-44"
			>
				<label
					htmlFor="name"
					className="block mb-2 text-sm font-medium text-gray-900"
				>
					Choose teacher to Evaluate
				</label>
				<select
					name="teacherId"
					className="text-gray-800 bg-white border border-gray-300 w-full text-sm px-4 py-3 rounded-md outline-blue-500"
					onChange={handleChange}
					value={teacherId || ""}
					required
				>
					<option value="" disabled>
						{teacherName}
					</option>
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

			<table className="min-w-full bg-white">
				<thead className="bg-red-800 whitespace-nowrap">
					<tr>
						<th className="p-4 text-left text-sm font-medium text-white">
							Title
						</th>
						<th className="p-4 text-left text-sm font-medium text-white">
							Teacher
						</th>
						<th className="p-4 text-left text-sm font-medium text-white">
							Created At
						</th>
						<th className="p-4 text-left text-sm font-medium text-white">
							Updated At
						</th>
						<th className="p-4 text-left text-sm font-medium text-white">
							Status
						</th>
						<th className="p-4 text-left text-sm font-medium text-white">
							Actions
						</th>
					</tr>
				</thead>

				<tbody className="whitespace-nowrap">
					{evaluations.map((evaluation) => (
						<tr className="even:bg-blue-50" key={evaluation.id}>
							<td className="p-4 text-sm text-black">{evaluation.title}</td>
							<td className="p-4 text-sm text-black">
								{evaluation.teacher_name}
							</td>
							<td className="p-4 text-sm text-black">
								{formattedDate(evaluation.created_at)}
							</td>
							<td className="p-4 text-sm text-black">
								{formattedDate(evaluation.updated_at)}
							</td>
							<td className="p-4 text-sm text-black">
								{evaluation.is_submitted ? (
									<span className="inline-flex items-center bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
										Submitted
									</span>
								) : (
									<span className="inline-flex items-center bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
										Pending
									</span>
								)}
							</td>
							<td className="p-4">
								<Link
									to={`/teacher/questions`}
									state={{
										evaluationId: evaluation.id,
										teacherId: teacherId,
									}}
								>
									<button className="mr-4" title="click ">
										<svg
											xmlns="http://www.w3.org/2000/svg"
											fill="none"
											viewBox="0 0 24 24"
											strokeWidth="1.5"
											stroke="currentColor"
											className="size-6"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												d="M15.042 21.672 13.684 16.6m0 0-2.51 2.225.569-9.47 5.227 7.917-3.286-.672Zm-7.518-.267A8.25 8.25 0 1 1 20.25 10.5M8.288 14.212A5.25 5.25 0 1 1 17.25 10.5"
											/>
										</svg>
									</button>
								</Link>
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
}
