import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { formattedDate } from "../../utils/formatDate";
import { useAutoHideToast } from "../../hooks/useAutoHideToast";
import usePagination from "../../hooks/usePagination";
import ChartModal from "@/components/ChartModal";

export default function TeacherEvaluationDetailedListView() {
	const [evaluations, setEvaluations] = useState<any[]>([]);
	const [errorMessage, setErrorMessage] = useState<string | null>(null);
	const [isToastVisible, setIsToastVisible] = useState(false);
	const location = useLocation();

	const evaluationId = location.state?.evaluationId ?? 0;

	const navigate = useNavigate();

	const closeToast = () => setIsToastVisible(false);

	// Automatically hide toast after 3 seconds
	useAutoHideToast(isToastVisible, setIsToastVisible);

	const BASE_URL = import.meta.env.VITE_API_BASE_URL;

	// Check for authentication token (e.g., in localStorage or cookies)
	const token = localStorage.getItem("token");
	const userId = Number(localStorage.getItem("user_id"));

	const [averages, setAverages] = useState({
		average_1: 0,
		average_2: 0,
		average_3: 0,
		average_4: 0,
		average: 0,
	});

	const fetchEvaluations = async () => {
		try {
			if (!token) {
				throw new Error("Not authenticated");
			}

			const response = await fetch(
				`${BASE_URL}/evaluation-result/teacher/${userId}?page=1&size=50`,
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);

			if (response.status === 401) {
				throw new Error("Unauthorized access");
			}

			const data = await response.json();

			if (Array.isArray(data.items)) {
				const filteredEvaluations = data.items
					.filter(
						(evaluation: any) =>
							Number(evaluation.teacher_id) === Number(userId) &&
							evaluation.evaluation_id === evaluationId
					)
					.sort(
						(a: any, b: any) =>
							new Date(b.updated_at).getTime() -
							new Date(a.updated_at).getTime()
					);

				setEvaluations(filteredEvaluations);

				const count = filteredEvaluations.length || 1;

				const sumAvg1 = filteredEvaluations.reduce(
					(acc: any, cur: any) => acc + Number(cur.average_1),
					0
				);
				const sumAvg2 = filteredEvaluations.reduce(
					(acc: any, cur: any) => acc + Number(cur.average_2),
					0
				);
				const sumAvg3 = filteredEvaluations.reduce(
					(acc: any, cur: any) => acc + Number(cur.average_3),
					0
				);
				const sumAvg4 = filteredEvaluations.reduce(
					(acc: any, cur: any) => acc + Number(cur.average_4),
					0
				);
				const sumAvg = filteredEvaluations.reduce(
					(acc: any, cur: any) => acc + Number(cur.average),
					0
				);

				setAverages({
					average_1: sumAvg1 / count,
					average_2: sumAvg2 / count,
					average_3: sumAvg3 / count,
					average_4: sumAvg4 / count,
					average: sumAvg / count,
				});
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
	}, [userId]);

	const {
		currentPage,
		totalPages,
		paginatedData,
		goToNextPage,
		goToPreviousPage,
	} = usePagination(evaluations, 10, fetchEvaluations);
	console.log(evaluations);
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
							Average (Personal & Professional Characteristics)
						</th>
						<th className="p-4 text-left text-sm font-medium text-white">
							Average (Classroom Teaching)
						</th>
						<th className="p-4 text-left text-sm font-medium text-white">
							Average (Classroom Management and Control)
						</th>
						<th className="p-4 text-left text-sm font-medium text-white">
							Average (Lesson Plans)
						</th>
						<th className="p-4 text-left text-sm font-medium text-white">
							Average
						</th>
						<th className="p-4 text-left text-sm font-medium text-white">
							Comment
						</th>
						<th className="p-4 text-left text-sm font-medium text-white">
							Created At
						</th>
						<th className="p-4 text-left text-sm font-medium text-white">
							Updated At
						</th>
						{/* <th className="p-4 text-left text-sm font-medium text-white">
							Status
						</th> */}
						<th className="p-4 text-left text-sm font-medium text-white">
							Actions
						</th>
					</tr>
				</thead>

				<tbody className="whitespace-nowrap">
					{paginatedData.map((evaluation, index) => (
						<tr className="even:bg-blue-50" key={evaluation.id}>
							<td className="p-4 text-sm text-black">
								{index + 1}. {evaluation.title}
							</td>
							<td className="p-4 text-sm text-black">
								{evaluation.teacher_name}
							</td>
							<td className="p-4 text-sm text-black">{evaluation.average_1}</td>
							<td className="p-4 text-sm text-black">{evaluation.average_2}</td>
							<td className="p-4 text-sm text-black">{evaluation.average_3}</td>
							<td className="p-4 text-sm text-black">{evaluation.average_4}</td>
							<td className="p-4 text-sm text-black">{evaluation.average}</td>
							<div className="relative group">
								<td className="p-4 text-sm text-black truncate max-w-xs whitespace-nowrap overflow-hidden cursor-pointer">
									{evaluation.comment}
								</td>
								<div className="absolute z-10 hidden group-hover:block bg-black text-white text-xs rounded py-1 px-2 max-w-xs whitespace-normal break-words shadow-lg -top-8 left-0">
									{evaluation.comment}
								</div>
							</div>

							<td className="p-4 text-sm text-black">
								{formattedDate(evaluation.created_at)}
							</td>
							<td className="p-4 text-sm text-black">
								{formattedDate(evaluation.updated_at)}
							</td>
							{/* <td className="p-4 text-sm text-black">
								{evaluation.is_submitted ? (
									<span className="inline-flex items-center bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
										Submitted
									</span>
								) : (
									<span className="inline-flex items-center bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
										Pending
									</span>
								)}
							</td> */}
							<td className="p-4">
								<Link
									to={`/teacher/questions`}
									state={{
										evaluationId: evaluation.id,
										userId: userId,
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
					<tfoot>
						<tr className="bg-yellow-200 font-bold text-black">
							<td colSpan={3} className="p-4">
								<div>Total Averages:</div>
							</td>
							<td className="p-4">
								<div className="text-xs text-gray-700">
									Personal & Professional Characteristics
								</div>
								<div>{averages.average_1.toFixed(2)}</div>
							</td>
							<td className="p-4">
								<div className="text-xs text-gray-700">Classroom Teaching</div>
								<div>{averages.average_2.toFixed(2)}</div>
							</td>
							<td className="p-4">
								<div className="text-xs text-gray-700">
									Classroom Management & Control
								</div>
								<div>{averages.average_3.toFixed(2)}</div>
							</td>
							<td className="p-4">
								<div className="text-xs text-gray-700">Lesson Plans</div>
								<div>{averages.average_4.toFixed(2)}</div>
							</td>
							<td className="p-4">
								<div className="text-xs text-gray-700">Overall Average</div>
								<div>{averages.average.toFixed(2)}</div>
							</td>
							<td colSpan={4}></td>
						</tr>
						<tr>
							<td colSpan={12} className="text-center py-6">
								<ChartModal averages={averages} />
							</td>
						</tr>
					</tfoot>
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
