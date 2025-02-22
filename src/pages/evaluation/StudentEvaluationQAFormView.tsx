import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAutoHideToast } from "../../hooks/useAutoHideToast";
import axios from "axios";

interface QuestionState {
	evaluation_id: number;
}

interface QuestionResultState {
	evaluation_result_id: number;
}

export default function StudentEvaluationQAFormView() {
	const [questions, setQuestions] = useState<any[]>([]);
	const [errorMessage, setErrorMessage] = useState<string | null>(null);
	const [isToastVisible, setIsToastVisible] = useState(false);
	const [isSubmitted, setIsSubmitted] = useState(false);
	const [evaluationTitle, setEvaluationTitle] = useState(false);
	const [answers, setAnswers] = useState<
		Record<number, { rating: number; comment: string }>
	>({});
	const [evaluationResultId, setEvaluationResultId] = useState<number | null>(
		null
	);

	const location = useLocation();
	const navigate = useNavigate();
	const evaluationId = location.state?.evaluationId ?? 0;
	const teacherId = location.state?.teacherId ?? 0;

	const closeToast = () => setIsToastVisible(false);

	// Automatically hide toast after 3 seconds
	useAutoHideToast(isToastVisible, setIsToastVisible);

	// Check for authentication token (e.g., in localStorage or cookies)
	const token = localStorage.getItem("token");
	const userId = localStorage.getItem("user_id");

	const fetchEvaluationResults = async () => {
		try {
			// Check for authentication token (e.g., in localStorage or cookies)
			const token = localStorage.getItem("token");
			if (!token) {
				throw new Error("Not authenticated");
			}

			const response = await fetch(
				`http://localhost:8000/api/v1/${evaluationId}/${userId}/evaluation-result?page=1&size=50`,
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

			if (data.items && Array.isArray(data.items) && data.items.length > 0) {
				const firstItemId = data.items[0].id;

				setEvaluationResultId(firstItemId);
				setIsSubmitted(true);
			} else {
				setIsSubmitted(false);
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
				// setEvaluations([]);
			}
		}
	};

	console.log(teacherId);

	const fetchEvaluation = async () => {
		if (!token) {
			setErrorMessage("Not authenticated");
			setIsToastVisible(true);
			throw new Error("Not authenticated");
		}
		try {
			if (evaluationId) {
				const response = await fetch(
					`http://localhost:8000/api/v1/evaluation/${evaluationId}`,
					{
						headers: {
							Authorization: `Bearer ${token}`,
						},
					}
				);

				const data = await response.json();
				// setIsSubmitted(data.is_submitted ? true : false);

				setEvaluationTitle(data.title);
			}
		} catch (error) {
			setErrorMessage("Failed to fetch teacher.");
			console.error("Failed to fetch teacher:", error);
		}
	};

	const fetchQuestions = async () => {
		try {
			if (!token) {
				throw new Error("Not authenticated");
			}

			const response = await fetch(
				"http://localhost:8000/api/v1/question?page=1&size=50",
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
						(question: QuestionState) => question.evaluation_id === evaluationId
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

	const fetchQuestionResults = async () => {
		try {
			if (!token) {
				throw new Error("Not authenticated");
			}

			const response = await fetch(
				"http://localhost:8000/api/v1/question-result?page=1&size=50",
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
							question.evaluation_result_id === evaluationResultId
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
		if (isSubmitted) {
			fetchQuestionResults();
		} else {
			fetchQuestions();
		}
	}, [evaluationId, evaluationResultId]);

	useEffect(() => {
		fetchEvaluation();
	}, [evaluationId]);

	useEffect(() => {
		fetchEvaluationResults();
	}, []);

	const handleratingChange = (questionId: number, rating: number) => {
		setAnswers((prev) => ({
			...prev,
			[questionId]: {
				...prev[questionId],
				rating, // Update the rating for the specific question
			},
		}));
	};

	// Handle changes to the comment field
	const handleCommentChange = (questionId: number, comment: string) => {
		setAnswers((prev) => ({
			...prev,
			[questionId]: {
				...prev[questionId],
				comment, // Update the comment for the specific question
			},
		}));
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setErrorMessage(""); // Reset error message

		try {
			// Step 1: Create Evaluation Result
			const evaluationResultRes = await axios.post(
				`http://localhost:8000/api/v1/evaluation-result`,
				{
					title: evaluationTitle,
					teacher_id: teacherId,
					admin_id: userId,
					evaluation_id: evaluationId,
				},
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);

			const evalResultId = evaluationResultRes.data?.id;
			if (!evalResultId) {
				throw new Error("Evaluation result creation failed. No ID received.");
			}

			// Step 2: Submit Question Results
			const savePromises = questions.map((question) => {
				const answer = answers[question.id];

				return axios.post(
					`http://localhost:8000/api/v1/question-result`,
					{
						question_text: question.question_text,
						evaluation_result_id: evalResultId,
						student_id: userId,
						rating: Number(answer?.rating) || 0,
						comment: answer?.comment || "",
					},
					{
						headers: { Authorization: `Bearer ${token}` },
					}
				);
			});

			// Wait for all API calls to complete
			const results = await Promise.allSettled(savePromises);

			// Step 3: Validate Submission Status
			const allSuccessful = results.every(
				(res) => res.status === "fulfilled" && res.value.status === 200
			);

			if (allSuccessful) {
				navigate("/student/evaluations", {
					state: { message: "All answers submitted successfully!", teacherId },
				});
			} else {
				setErrorMessage("Some answers failed to submit. Please retry.");
			}
		} catch (error: any) {
			console.error("Submission error:", error.response?.data || error.message);
			setErrorMessage("An error occurred. Please try again.");
		}
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

			<div className="w-1/2 mx-auto">
				<div className="p-6 border border-gray-300 sm:rounded-md">
					<label htmlFor="rating" className="block mb-6">
						rating the Teacher (1: Poor → 5: Excellent)
					</label>
					<div>
						<form method="POST" onSubmit={handleSubmit}>
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
															disabled={isSubmitted}
															type="radio"
															name={`question-${question.id}`} // Unique name for each question
															value={value}
															className="text-indigo-600 border-gray-300 rounded-full shadow-sm 
                 focus:border-indigo-300 focus:ring focus:ring-offset-0 
                 focus:ring-indigo-200 focus:ring-opacity-50"
															checked={
																(answers[question.id]?.rating ??
																	question.rating) === value
															}
															onChange={() =>
																handleratingChange(question.id, value)
															} // Update state
															required
														/>
														<span className="ml-2">
															{value === 1 && "Poor"}
															{value === 2 && "Fair"}
															{value === 3 && "Good"}
															{value === 4 && "Very Good"}
															{value === 5 && "Excellent"}
														</span>
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
											disabled={isSubmitted}
											rows={4}
											className={`px-0 w-full text-sm ${
												isSubmitted ? "text-gray-400" : "text-gray-800"
											} border-0 focus:ring-0 focus:outline-none`}
											placeholder="Write a comment..."
											value={
												answers[question.id]?.comment || question.comment || ""
											} // Pre-fill the comment field if it exists
											onChange={(e) =>
												handleCommentChange(question.id, e.target.value)
											} // Update the comment
										></textarea>
									</div>
								</div>
							))}

							<div className="mb-6">
								<button
									disabled={isSubmitted}
									type="submit"
									className="
    h-10 px-5 rounded-lg transition-colors duration-150
    text-indigo-100 bg-indigo-700 
    hover:bg-indigo-800 focus:shadow-outline

    disabled:bg-gray-400 disabled:text-gray-200 
    disabled:cursor-not-allowed disabled:opacity-50
  "
								>
									Send Answers
								</button>
								{isSubmitted ? (
									<div
										className="flex items-center p-4 text-sm text-gray-800 rounded-lg bg-gray-5"
										role="alert"
									>
										<svg
											className="shrink-0 inline w-4 h-4 me-3"
											aria-hidden="true"
											xmlns="http://www.w3.org/2000/svg"
											fill="currentColor"
											viewBox="0 0 20 20"
										>
											<path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
										</svg>
										<span className="sr-only">Info</span>
										<div>
											<span className="font-medium">
												This evaluation has already been submitted!
											</span>{" "}
										</div>
									</div>
								) : (
									""
								)}
							</div>
						</form>
					</div>
				</div>
			</div>
		</div>
	);
}
