import { useEffect, useState } from "react";
import { useAutoHideToast } from "../../hooks/useAutoHideToast";
import { useNavigate } from "react-router-dom";
import api from "../../axios";

interface UpdateTeacherFormState {
	username: string;
	email: string;
	firstName: string;
	middleName: string;
	lastName: string;
}

export default function AdminTeacherUpdateView({
	toggleModalUpdate,
	updateUser,
	teacherId,
}: any) {
	const [errorMessage, setErrorMessage] = useState<string | null>(null);
	const [isToastVisible, setIsToastVisible] = useState(false);
	const navigate = useNavigate();

	const [formData, setFormData] = useState<UpdateTeacherFormState>({
		username: "",
		email: "",
		firstName: "",
		middleName: "",
		lastName: "",
	});

	const [isLoading, setIsLoading] = useState(true);

	const token = localStorage.getItem("token");

	// Automatically hide toast after 3 seconds
	useAutoHideToast(isToastVisible, setIsToastVisible);

	const closeToast = () => setIsToastVisible(false);

	useEffect(() => {
		const fetchUserDetails = async () => {
			try {
				if (!token) {
					setErrorMessage("Not authenticated");
					setIsToastVisible(true);
					throw new Error("Not authenticated");
				}

				const response = await api.get(`/user/${teacherId}`, {
					headers: { Authorization: `Bearer ${token}` },
				});

				const { username, email, first_name, middle_name, last_name } =
					response.data;
				setFormData({
					username,
					email,
					firstName: first_name,
					middleName: middle_name,
					lastName: last_name,
				});
			} catch (error: any) {
				setErrorMessage(error.message);
				setIsToastVisible(true);
			} finally {
				setIsLoading(false);
			}
		};

		fetchUserDetails();
	}, [teacherId]);

	if (isLoading)
		return (
			<div>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					className="w-10 animate-[spin_0.8s_linear_infinite] fill-blue-600 block mx-auto"
					viewBox="0 0 24 24"
				>
					<path
						d="M12 22c5.421 0 10-4.579 10-10h-2c0 4.337-3.663 8-8 8s-8-3.663-8-8c0-4.336 3.663-8 8-8V2C6.579 2 2 6.58 2 12c0 5.421 4.579 10 10 10z"
						data-original="#000000"
					/>
				</svg>
			</div>
		);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setFormData((prevData) => ({
			...prevData,
			[name]: value,
		}));
	};

	const handleSubmit = async (e: React.ChangeEvent<HTMLFormElement>) => {
		e.preventDefault();

		// Check for authentication token (e.g., in localStorage or cookies)

		if (!token) {
			setErrorMessage("Not authenticated");
			setIsToastVisible(true);
			throw new Error("Not authenticated");
		}

		try {
			const backendPayload = {
				username: formData.username,
				email: formData.email,
				first_name: formData.firstName,
				middle_name: formData.middleName,
				last_name: formData.lastName,
			};

			const response = await api.put(`/user/${teacherId}`, backendPayload, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});

			updateUser(response.data);

			toggleModalUpdate();
			navigate("/admin/teachers", {
				state: { message: "Teacher has been updated successfully!" },
			});
		} catch (error: any) {
			// Display error feedback
			setErrorMessage(
				"The username and password must be unique. Please ensure they are not already in use or verify your internet connection and try again."
			);
			setIsToastVisible(true);

			console.error("Error updating user:", error);
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
							Update Teacher
						</h3>
						<button
							type="button"
							className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center"
							data-modal-toggle="defaultModal"
							onClick={toggleModalUpdate}
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
									Username
								</label>
								<input
									name="username"
									type="text"
									className="text-gray-800 bg-white border border-gray-300 w-full text-sm px-4 py-3 rounded-md outline-blue-500"
									placeholder="Enter username"
									onChange={handleChange}
									value={formData.username}
									maxLength={20}
								/>
							</div>
							<div>
								<label className="block mb-2 text-sm font-medium text-gray-900">
									Email
								</label>
								<input
									name="email"
									type="text"
									className="text-gray-800 bg-white border border-gray-300 w-full text-sm px-4 py-3 rounded-md outline-blue-500"
									placeholder="Enter email"
									onChange={handleChange}
									value={formData.email}
									maxLength={40}
								/>
							</div>
							<div>
								<label className="block mb-2 text-sm font-medium text-gray-900">
									First Name
								</label>
								<input
									name="firstName"
									type="text"
									className="text-gray-800 bg-white border border-gray-300 w-full text-sm px-4 py-3 rounded-md outline-blue-500"
									placeholder="Enter first name"
									onChange={handleChange}
									value={formData.firstName}
								/>
							</div>
							<div>
								<label className="block mb-2 text-sm font-medium text-gray-900">
									Middle Name
								</label>
								<input
									name="middleName"
									type="text"
									className="text-gray-800 bg-white border border-gray-300 w-full text-sm px-4 py-3 rounded-md outline-blue-500"
									placeholder="Enter middle name"
									onChange={handleChange}
									value={formData.middleName}
								/>
							</div>
							<div>
								<label className="block mb-2 text-sm font-medium text-gray-900">
									Last Name
								</label>
								<input
									name="lastName"
									type="text"
									className="text-gray-800 bg-white border border-gray-300 w-full text-sm px-4 py-3 rounded-md outline-blue-500"
									placeholder="Enter last name"
									onChange={handleChange}
									value={formData.lastName}
								/>
							</div>
						</div>

						<button
							type="submit"
							className="w-full py-3 px-4 text-sm tracking-wider font-semibold rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none"
						>
							Update
						</button>
					</form>
				</div>
			</div>
		</div>
	);
}
