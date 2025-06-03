import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { formattedDate } from "../../utils/formatDate";
import { useAutoHideToast } from "../../hooks/useAutoHideToast";
import AdminEvaluationCreateView from "./AdminEvaluationCreateView";
import AdminEvaluationUpdateView from "./AdminEvaluationUpdateView";
import AdminEvaluationDeleteView from "./AdminEvaluationDeleteView";
import usePagination from "../../hooks/usePagination";
import api from "../../axios";
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function AdminEvaluationListView() {
	const [isModalCreateOpen, setIsModalCreateOpen] = useState(false);
	const [isModalUpdateOpen, setIsModalUpdateOpen] = useState(false);
	const [isModalDeleteOpen, setIsModalDeleteOpen] = useState(false);
	const [evaluations, setEvaluations] = useState<any[]>([]);
	const [errorMessage, setErrorMessage] = useState<string | null>(null);
	const [selectedEvaluationId, setSelectedEvaluationId] = useState<
		string | null
	>(null);
	const [isToastVisible, setIsToastVisible] = useState(false);
	const [enabledStates, setEnabledStates] = useState<Record<number, boolean>>(
		{}
	);
	const navigate = useNavigate();

	const token = localStorage.getItem("token");

	const toggleEnabled = async (id: any) => {
		const currentStatus = enabledStates[id];
		const newStatus = !currentStatus; // toggled value

		// Optimistically update UI
		setEnabledStates((prev) => ({
			...prev,
			[id]: newStatus,
		}));

		try {
			// Since `enabled` means "is_enabled", backend expects is_disabled:
			// If enabled=true => is_disabled=false, if enabled=false => is_disabled=true
			await api.put(
				`/evaluation/${id}`,
				{ is_disabled: !newStatus }, // <-- use !newStatus here
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);
		} catch (error: any) {
			console.error("Toggle failed", error);

			// Revert UI if error
			setEnabledStates((prev) => ({
				...prev,
				[id]: currentStatus,
			}));

			setErrorMessage(error.message);
			setIsToastVisible(true);
		}
	};

	const closeToast = () => setIsToastVisible(false);

	// Automatically hide toast after 3 seconds
	useAutoHideToast(isToastVisible, setIsToastVisible);

	const toggleModalCreate = () => {
		setIsModalCreateOpen(!isModalCreateOpen);
	};

	const toggleModalUpdate = () => {
		setIsModalUpdateOpen(!isModalUpdateOpen);
	};

	const toggleModalDelete = () => {
		setIsModalDeleteOpen(!isModalDeleteOpen);
	};

	const fetchEvaluations = async () => {
		try {
			// Check for authentication token (e.g., in localStorage or cookies)

			if (!token) {
				throw new Error("Not authenticated");
			}

			const response = await fetch(`${BASE_URL}/evaluation?page=1&size=50`, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});

			if (response.status === 401) {
				throw new Error("Unauthorized access");
			}

			const data = await response.json();

			if (Array.isArray(data.items)) {
				setEvaluations(data.items);
				const enabledMap: Record<number, boolean> = {};
				data.items.forEach((evaluation: any) => {
					enabledMap[evaluation.id] = !evaluation.is_disabled;
				});
				setEnabledStates(enabledMap);
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
	}, []);

	const addEvaluation = (newEvaluation: any) => {
		setEvaluations((prevEvaluations) => [...prevEvaluations, newEvaluation]);
	};

	const updateEvaluation = (updatedEvaluation: any) => {
		setEvaluations((prevEvaluations) =>
			prevEvaluations.map((evaluation) =>
				evaluation.id === updatedEvaluation.id ? updatedEvaluation : evaluation
			)
		);
	};

	const deleteEvaluation = (deletedEvaluation: any) => {
		setEvaluations((prevEvaluations) =>
			prevEvaluations.filter(
				(evaluation) => evaluation.id !== deletedEvaluation.id
			)
		);
	};

	const filteredEvaluations = evaluations
		.filter(
			(evaluation) =>
				evaluation.admin_id === +(localStorage.getItem("user_id") || "0")
		)
		.sort(
			(a, b) =>
				new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
		);

	const {
		currentPage,
		totalPages,
		paginatedData,
		goToNextPage,
		goToPreviousPage,
	} = usePagination(filteredEvaluations, 10, fetchEvaluations);

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

			<button
				className="bg-blue-500 hover:bg-blue-600 text-white mb-3 py-2 px-4 rounded-lg inline-flex items-center"
				onClick={toggleModalCreate}
			>
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
						d="M12 4.5v15m7.5-7.5h-15"
					/>
				</svg>

				<span>Add Evaluation</span>
			</button>

			{isModalCreateOpen && (
				<div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-10 modal-backdrop">
					<div className="bg-white p-6 rounded-lg shadow-lg">
						<AdminEvaluationCreateView
							toggleModalCreate={toggleModalCreate}
							addEvaluation={addEvaluation}
						/>
					</div>
				</div>
			)}

			{isModalUpdateOpen && (
				<div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-10 modal-backdrop">
					<div className="bg-white p-6 rounded-lg shadow-lg">
						<AdminEvaluationUpdateView
							toggleModalUpdate={toggleModalUpdate}
							updateEvaluation={updateEvaluation}
							evaluationId={selectedEvaluationId}
						/>
					</div>
				</div>
			)}

			{isModalDeleteOpen && (
				<div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-10 modal-backdrop">
					<div className="bg-white p-6 rounded-lg shadow-lg">
						<AdminEvaluationDeleteView
							toggleModalDelete={toggleModalDelete}
							evaluationId={selectedEvaluationId}
							deleteEvaluation={deleteEvaluation}
						/>
					</div>
				</div>
			)}

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
							Actions
						</th>
					</tr>
				</thead>

				<tbody className="whitespace-nowrap">
					{paginatedData.map((evaluation) => {
						const enabled =
							enabledStates[evaluation.id] ?? !evaluation.is_disabled;

						return (
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
								<td className="p-4">
									{/* Your buttons and toggle here */}
									<button
										className="mr-4"
										title="Edit"
										onClick={() => {
											setSelectedEvaluationId(evaluation.id);
											toggleModalUpdate();
										}}
									>
										{/* SVG Edit icon */}
									</button>
									<button
										className="mr-4"
										title="Delete"
										onClick={() => {
											setSelectedEvaluationId(evaluation.id);
											toggleModalDelete();
										}}
									>
										<svg
											xmlns="http://www.w3.org/2000/svg"
											className="w-5 fill-red-500 hover:fill-red-700"
											viewBox="0 0 24 24"
										>
											<path
												d="M19 7a1 1 0 0 0-1 1v11.191A1.92 1.92 0 0 1 15.99 21H8.01A1.92 1.92 0 0 1 6 19.191V8a1 1 0 0 0-2 0v11.191A3.918 3.918 0 0 0 8.01 23h7.98A3.918 3.918 0 0 0 20 19.191V8a1 1 0 0 0-1-1Zm1-3h-4V2a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v2H4a1 1 0 0 0 0 2h16a1 1 0 0 0 0-2ZM10 4V3h4v1Z"
												data-original="#000000"
											/>
											<path
												d="M11 17v-7a1 1 0 0 0-2 0v7a1 1 0 0 0 2 0Zm4 0v-7a1 1 0 0 0-2 0v7a1 1 0 0 0 2 0Z"
												data-original="#000000"
											/>
										</svg>
									</button>
									<button
										type="button"
										role="switch"
										aria-checked={enabled}
										onClick={() => toggleEnabled(evaluation.id)}
										className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 focus:outline-none ${
											enabled ? "bg-gray-300" : "bg-blue-600"
										}`}
										title={enabled ? "Disabled" : "Enabled"}
									>
										<span
											className={`inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition-transform duration-300 ${
												enabled ? "translate-x-1" : "translate-x-6"
											}`}
										/>
									</button>
								</td>
							</tr>
						);
					})}
				</tbody>
			</table>
			<div className="flex items-center justify-center space-x-2 mt-4">
				<button
					className="px-3 py-1 border rounded-lg bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
					onClick={goToPreviousPage}
					disabled={currentPage === 1}
				>
					Prev
				</button>

				<span className="px-4 py-1 border rounded-lg bg-blue-100">
					Page {currentPage} of {totalPages}
				</span>

				<button
					className="px-3 py-1 border rounded-lg bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
					onClick={goToNextPage}
					disabled={currentPage === totalPages}
				>
					Next
				</button>
			</div>
		</div>
	);
}
