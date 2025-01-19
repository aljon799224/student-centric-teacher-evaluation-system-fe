import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAutoHideToast } from "../../hooks/useAutoHideToast";

interface CreateQuestionFormState {
	questionText: string;
}

export default function AdminQuestionCreateView({
	toggleModalCreate,
	addQuestion,
	evaluationTitle,
	evaluationId,
}: any) {
	const [errorMessage, setErrorMessage] = useState<string | null>(null);
	const [isToastVisible, setIsToastVisible] = useState(false);

	const navigate = useNavigate();

	// Automatically hide toast after 3 seconds
	useAutoHideToast(isToastVisible, setIsToastVisible);

	const closeToast = () => setIsToastVisible(false);

	const [formData, setFormData] = useState<CreateQuestionFormState>({
		questionText: "",
	});

	const token = localStorage.getItem("token");

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
				question_text: formData.questionText,
				evaluation_id: evaluationId,
				evaluation_title: evaluationTitle,
			};

			const response = await axios.post(
				"http://0.0.0.0:8000/api/v1/question",
				backendPayload,
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);

			addQuestion(response.data);

			toggleModalCreate();

			navigate("/admin/questions", {
				state: {
					message: "Question has been created successfully!",
					// evaluationId: evaluationId,
					// evaluationTitle: evaluationTitle,
				},
			});
		} catch (error: any) {
			setErrorMessage(error.message);
			setIsToastVisible(true);
			console.error(error);
		}
	};

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
							Add Question
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
									Question
								</label>
								<input
									name="questionText"
									type="text"
									className="text-gray-800 bg-white border border-gray-300 w-full text-sm px-4 py-3 rounded-md outline-blue-500"
									placeholder="Enter question"
									onChange={handleChange}
									value={formData.questionText}
									required
									maxLength={200}
								/>
							</div>

							{/* <div>
								<label
									htmlFor="name"
									className="block mb-2 text-sm font-medium text-gray-900"
								>
									Rating
								</label>
								<select
									name="rating"
									className="text-gray-800 bg-white border border-gray-300 w-full text-sm px-4 py-3 rounded-md outline-blue-500"
									onChange={handleChange}
									value={formData.rating || 1}
									required
								>
									{[1, 2, 3, 4, 5].map((rate: any) => (
										<option key={rate} value={rate}>
											{rate}
										</option>
									))}
								</select>
							</div> */}

							{/* <div>
								<label
									htmlFor="name"
									className="block mb-2 text-sm font-medium text-gray-900"
								>
									Comment
								</label>
								<input
									name="comment"
									type="text"
									className="text-gray-800 bg-white border border-gray-300 w-full text-sm px-4 py-3 rounded-md outline-blue-500"
									placeholder="Enter comment"
									onChange={handleChange}
									value={formData.comment}
								/>
							</div> */}
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
