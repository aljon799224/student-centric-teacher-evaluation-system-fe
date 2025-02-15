import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface UserFormState {
	username: string;
	email: string;
	firstName: string;
	middleName: string;
	lastName: string;
	role: string;
}

export default function AdminProfilePage() {
	const [errorMessage, setErrorMessage] = useState<string | null>(null);
	const [isToastVisible, setIsToastVisible] = useState(false);
	const [isLoading, setIsLoading] = useState(true);

	const userId = localStorage.getItem("user_id");
	const token = localStorage.getItem("token");

	const navigate = useNavigate();

	const [formData, setFormData] = useState<UserFormState>({
		username: "",
		email: "",
		firstName: "",
		middleName: "",
		lastName: "",
		role: "",
	});

	const closeToast = () => setIsToastVisible(false);

	useEffect(() => {
		const fetchUserDetails = async () => {
			try {
				if (!token) {
					setErrorMessage("Not authenticated");
					setIsToastVisible(true);
					throw new Error("Not authenticated");
				}

				const response = await axios.get(
					`http://0.0.0.0:8000/api/v1/user/${userId}`,
					{
						headers: { Authorization: `Bearer ${token}` },
					}
				);

				const { username, email, first_name, middle_name, last_name, role } =
					response.data;
				setFormData({
					username,
					email,
					firstName: first_name,
					middleName: middle_name,
					lastName: last_name,
					role: role,
				});
			} catch (error: any) {
				console.error(error.message);
				setErrorMessage(
					"The username and password must be unique. Please ensure they are not already in use or verify your internet connection and try again."
				);
				setIsToastVisible(true);
			} finally {
				setIsLoading(false);
			}
		};

		fetchUserDetails();
	}, [userId]);

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

			await axios.put(
				`http://0.0.0.0:8000/api/v1/user/${userId}`,
				backendPayload,
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);

			navigate("/admin/profile", {
				state: { message: "Admin profile has been updated successfully!" },
			});
		} catch (error: any) {
			const errorMsg =
				error.response?.data?.message ||
				error.message ||
				"An error occurred. Please try again.";

			// Display error feedback
			setErrorMessage(errorMsg);
			setIsToastVisible(true);

			console.error("Error updating user:", error);
		}
	};

	return (
		<div>
			<section className="py-10 my-auto">
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
				<div className="lg:w-[80%] md:w-[90%] w-[96%] mx-auto flex gap-4">
					<div className="lg:w-[88%] sm:w-[88%] w-full mx-auto shadow-2xl p-4 rounded-xl h-fit self-center">
						<div className="">
							<h1 className="lg:text-3xl md:text-2xl text-xl font-extrabold mb-2">
								Profile
							</h1>
							<form onSubmit={handleSubmit}>
								<div className="w-full rounded-sm bg-[#BF1E2E] bg-cover bg-center bg-no-repeat items-center">
									<div className="mx-auto flex justify-center w-[141px] h-[141px] bg-blue-300/20 rounded-full bg-[url(https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg)] bg-cover bg-center bg-no-repeat">
										<div className="bg-white/90 rounded-full w-6 h-6 text-center ml-28 mt-4">
											<input
												type="file"
												name="profile"
												id="upload_profile"
												hidden
												// required
											/>

											<label htmlFor="upload_profile">
												<svg
													data-slot="icon"
													className="w-6 h-5 text-blue-700"
													fill="none"
													strokeWidth="1.5"
													stroke="currentColor"
													viewBox="0 0 24 24"
													xmlns="http://www.w3.org/2000/svg"
													aria-hidden="true"
												>
													<path
														strokeLinecap="round"
														strokeLinejoin="round"
														d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z"
													></path>
													<path
														strokeLinecap="round"
														strokeLinejoin="round"
														d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z"
													></path>
												</svg>
											</label>
										</div>
									</div>
									<div className="flex justify-end">
										<input
											type="file"
											name="profile"
											id="upload_cover"
											hidden
											// required
										/>
									</div>
								</div>

								<div className="grid gap-4 mb-4 sm:grid-cols-2 mt-3">
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
											required
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
											required
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
									<div>
										<label className="block mb-2 text-sm font-medium text-gray-900">
											Role
										</label>
										<input
											type="text"
											name="role"
											className="bg-gray-200 border border-gray-300 text-gray-500 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 disabled:bg-gray-200 disabled:border-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed"
											placeholder="Role"
											value={formData.role}
											disabled
											onChange={handleChange}
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
			</section>
		</div>
	);
}
