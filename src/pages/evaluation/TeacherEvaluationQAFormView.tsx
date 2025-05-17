import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAutoHideToast } from "../../hooks/useAutoHideToast";

interface QuestionResultState {
	evaluation_result_id: number;
}

export default function TeacherEvaluationQAFormView() {
	const [questions, setQuestions] = useState<any[]>([]);
	const [errorMessage, setErrorMessage] = useState<string | null>(null);
	const [isToastVisible, setIsToastVisible] = useState(false);

	const location = useLocation();
	const navigate = useNavigate();
	const evaluationId = location.state?.evaluationId ?? 0;

	const closeToast = () => setIsToastVisible(false);

	// Automatically hide toast after 3 seconds
	useAutoHideToast(isToastVisible, setIsToastVisible);

	// Check for authentication token (e.g., in localStorage or cookies)
	const token = localStorage.getItem("token");

	const BASE_URL = import.meta.env.VITE_API_BASE_URL;

	const fetchQuestionResults = async () => {
		try {
			if (!token) {
				throw new Error("Not authenticated");
			}

			const response = await fetch(
				`${BASE_URL}/question-result?page=1&size=50`,
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
				const filteredQuestions = data.items
					.filter(
						(question: QuestionResultState) =>
							question.evaluation_result_id === evaluationId
					)
					.sort(
						(a: any, b: any) =>
							new Date(b.updated_at).getTime() -
							new Date(a.updated_at).getTime()
					);

				setQuestions(filteredQuestions);
			} else {
				setQuestions([]);
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
				setQuestions([]);
			}
		}
	};
	useEffect(() => {
		fetchQuestionResults();
	}, [evaluationId]);

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
			<div className="w-1/2 mx-auto">
				<div className="p-6 border border-gray-300 sm:rounded-md">
					<label htmlFor="rating" className="block mb-6">
						Rate the Teacher (1: Poor → 5: Excellent)
					</label>
					<div>
						<form method="POST">
							{questions.map((question, index) => (
								<div key={question.id}>
									<label className="block mb-2">
										<span className="text-gray-700">
											{index + 1}. {question.question_text}
										</span>
									</label>
									<div className="mb-6">
										<div className="mt-2">
											<div>
												{[1, 2, 3, 4, 5].map((value) => (
													<label
														key={`${question.id}-${value}`}
														className="inline-flex items-center mr-4"
													>
														<input
															disabled={true}
															type="radio"
															name={`question-${question.id}`} // Unique name for each question
															value={value}
															className="text-indigo-600 border-gray-300 rounded-full shadow-sm 
                 focus:border-indigo-300 focus:ring focus:ring-offset-0 
                 focus:ring-indigo-200 focus:ring-opacity-50"
															checked={question.rating === value}
															required
														/>
													</label>
												))}
											</div>
										</div>
									</div>

									<label htmlFor={`${question.id}`}>
										Additional Comments for the Teacher
									</label>
									<div className="py-2 px-4 mb-4 bg-white rounded-lg rounded-t-lg border border-gray-200">
										<textarea
											id={`comment-${question.id}`}
											disabled={true}
											rows={4}
											className="px-0 w-full text-sm text-gray-400"
											value={question.comment}
										></textarea>
									</div>
								</div>
							))}
						</form>
					</div>
				</div>
			</div>
		</div>
	);
}
