import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAutoHideToast } from "../hooks/useAutoHideToast";
import api from "../axios";

interface ForgotPasswordFormState {
	newPassword: string;
}

export default function ForgotPasswordMainPage() {
	const [formData, setFormData] = useState<ForgotPasswordFormState>({
		newPassword: "",
	});
	const [errorMessage, setErrorMessage] = useState<string | null>(null);
	const [successMessage, setSuccessMessage] = useState<string | null>(null);

	const [isToastVisible, setIsToastVisible] = useState(false);

	const navigate = useNavigate();
	const location = useLocation();

	const token = localStorage.getItem("token");

	// Automatically hide toast after 3 seconds
	useAutoHideToast(isToastVisible, setIsToastVisible);

	const closeToast = () => setIsToastVisible(false);

	useEffect(() => {
		if (location.state?.message) {
			setSuccessMessage(location.state.message);
			setIsToastVisible(true);
			navigate(location.pathname, { replace: true, state: { message: null } });
		}
	}, [location.state, navigate]);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setFormData({
			...formData,
			[e.target.name]: e.target.value,
		});
	};

	const handleResetPassword = async (e: React.FormEvent) => {
		e.preventDefault();

		const userId = localStorage.getItem("user_id");

		try {
			if (!token) {
				setErrorMessage("Not authenticated. Please login again");
				setIsToastVisible(true);
				throw new Error("Not authenticated");
			}

			const payload = {
				token: token,
				new_password: formData.newPassword,
			};
			await api.post("/reset-password", payload, {
				headers: {
					Accept: "application/json",
					"Content-Type": "application/json",
				},
			});

			const backendPayload = {
				temp_pwd: false,
			};

			await api.put(`/user/${userId}`, backendPayload, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});

			navigate("/login", { state: { message: "Update Password Successful!" } });
		} catch (error: any) {
			setSuccessMessage("");
			setErrorMessage(error.message);
			setIsToastVisible(true);
		}
	};

	return (
		<div className="flex flex-col justify-center font-[sans-serif] sm:h-screen p-4">
			{/* toast */}

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

			{isToastVisible && successMessage && (
				<div
					id="toast-danger"
					className="flex items-center w-full max-w-xs p-4 mb-4 text-gray-500 bg-white rounded-lg shadow mx-auto"
					role="alert"
				>
					<div className="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 text-green-500 bg-green-100 rounded-lg dark:bg-green-800 dark:text-green-200">
						<svg
							className="w-5 h-5"
							aria-hidden="true"
							xmlns="http://www.w3.org/2000/svg"
							fill="currentColor"
							viewBox="0 0 20 20"
						>
							<path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z" />
						</svg>
						<span className="sr-only">Check icon</span>
					</div>
					<div className="ms-3 text-sm font-normal">{successMessage}</div>
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

			{/* end toast */}

			<div className="max-w-md w-full mx-auto border border-gray-300 rounded-2xl p-8">
				<div className="text-center mb-12">
					<h1>Change Password</h1>
				</div>
				<form onSubmit={handleResetPassword}>
					<div className="space-y-6">
						<div>
							<label
								className="text-gray-800 text-sm mb-2 block"
								htmlFor="password"
							>
								New Password
							</label>
							<input
								name="newPassword"
								type="password"
								className="text-gray-800 bg-white border border-gray-300 w-full text-sm px-4 py-3 rounded-md outline-blue-500"
								placeholder="Enter new password"
								onChange={handleChange}
								value={formData.newPassword}
							/>
						</div>
					</div>

					<div className="!mt-12">
						<button
							type="submit"
							className="w-full py-3 px-4 text-sm tracking-wider font-semibold rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none"
						>
							Change Password
						</button>
					</div>
					<p className="text-gray-800 text-sm mt-6 text-center">
						If you encounter a problem, please login again.{" "}
						<a
							href="/login"
							className="text-blue-600 font-semibold hover:underline ml-1"
						>
							Login here
						</a>
					</p>
				</form>
			</div>
		</div>
	);
}
