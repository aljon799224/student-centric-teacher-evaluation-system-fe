import axios from "axios";
import { useState } from "react";
import { useAutoHideToast } from "../../hooks/useAutoHideToast";
import { useNavigate } from "react-router-dom";

export default function AdminQuestionDeleteView({
	toggleModalDelete,
	questionId,
	deleteQuestion,
}: any) {
	const [errorMessage, setErrorMessage] = useState<string | null>(null);
	const [isToastVisible, setIsToastVisible] = useState(false);
	const navigate = useNavigate();

	// Automatically hide toast after 3 seconds
	useAutoHideToast(isToastVisible, setIsToastVisible);

	const closeToast = () => setIsToastVisible(false);

	const handleSubmit = async (e: React.ChangeEvent<HTMLFormElement>) => {
		e.preventDefault();
		try {
			const token = localStorage.getItem("token");
			if (!token) {
				setErrorMessage("Not authenticated");
				throw new Error("Not authenticated");
			}

			// Send a DELETE request to the API using axios
			const response = await axios.delete(
				`http://0.0.0.0:8000/api/v1/question/${questionId}`,
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);

			deleteQuestion(response.data);

			if (response.status === 200) {
				// If the deletion is successful, update the state to remove the question

				toggleModalDelete();
				setIsToastVisible(true);
				navigate("/admin/questions", {
					state: { message: "Question deleted successfully" },
				});
			} else {
				setErrorMessage("Failed to delete quuestion");
				setIsToastVisible(true);
				throw new Error("Failed to delete quuestion");
			}
		} catch (error: any) {
			setIsToastVisible(true);
			setErrorMessage(error.message);
			if (error.response?.status === 401) {
				setErrorMessage("Unauthorized access");
				setIsToastVisible(true);
				navigate("/login");
			} else {
				setErrorMessage("An error occurred");
				setIsToastVisible(true);
			}
		}
	};

	return (
		<div className="fixed inset-0 p-4 flex flex-wrap justify-center items-center w-full h-full z-[1000] before:fixed before:inset-0 before:w-full before:h-full before:bg-[rgba(0,0,0,0.5)] overflow-auto font-[sans-serif]">
			<form onSubmit={handleSubmit}>
				<div className="w-full max-w-md bg-white shadow-lg rounded-lg p-6 relative">
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
					<svg
						xmlns="http://www.w3.org/2000/svg"
						className="w-3 cursor-pointer shrink-0 fill-gray-400 hover:fill-red-500 float-right"
						viewBox="0 0 320.591 320.591"
						onClick={toggleModalDelete}
					>
						<path
							d="M30.391 318.583a30.37 30.37 0 0 1-21.56-7.288c-11.774-11.844-11.774-30.973 0-42.817L266.643 10.665c12.246-11.459 31.462-10.822 42.921 1.424 10.362 11.074 10.966 28.095 1.414 39.875L51.647 311.295a30.366 30.366 0 0 1-21.256 7.288z"
							data-original="#000000"
						></path>
						<path
							d="M287.9 318.583a30.37 30.37 0 0 1-21.257-8.806L8.83 51.963C-2.078 39.225-.595 20.055 12.143 9.146c11.369-9.736 28.136-9.736 39.504 0l259.331 257.813c12.243 11.462 12.876 30.679 1.414 42.922-.456.487-.927.958-1.414 1.414a30.368 30.368 0 0 1-23.078 7.288z"
							data-original="#000000"
						></path>
					</svg>

					<div className="my-8 text-center">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							className="w-14 fill-red-500 inline"
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
						<h4 className="text-gray-800 text-lg font-semibold mt-4">
							Are you sure you want to delete it?
						</h4>
					</div>

					<div className="flex flex-col space-y-2">
						<button
							type="submit"
							className="px-4 py-2 rounded-lg text-white text-sm tracking-wide bg-red-500 hover:bg-red-600 active:bg-red-500"
						>
							Delete
						</button>
						<button
							type="button"
							className="px-4 py-2 rounded-lg text-gray-800 text-sm tracking-wide bg-gray-200 hover:bg-gray-300 active:bg-gray-200"
							onClick={toggleModalDelete}
						>
							Cancel
						</button>
					</div>
				</div>
			</form>
		</div>
	);
}
