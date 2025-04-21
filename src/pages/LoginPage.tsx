import React, { useEffect, useState } from "react";
import aclcLogo from "../assets/aclc.svg";
import { useLocation, useNavigate } from "react-router-dom";
import { useAutoHideToast } from "../hooks/useAutoHideToast";
import api from "../axios";

interface LoginFormState {
	username: string;
	password: string;
}

export default function LoginPage() {
	const [formData, setFormData] = useState<LoginFormState>({
		username: "",
		password: "",
	});
	const [errorMessage, setErrorMessage] = useState<string | null>(null);
	const [successMessage, setSuccessMessage] = useState<string | null>(null);

	const [isToastVisible, setIsToastVisible] = useState(false);

	const [attemptCount, setAttemptCount] = useState(0);
	const [isLocked, setIsLocked] = useState(false);
	const [lockoutTimer, setLockoutTimer] = useState(30);

	const navigate = useNavigate();
	const location = useLocation();

	// Automatically hide toast after 3 seconds
	useAutoHideToast(isToastVisible, setIsToastVisible);

	useEffect(() => {
		if (location.state?.message) {
			setSuccessMessage(location.state.message);
			setIsToastVisible(true);
			navigate(location.pathname, { replace: true, state: { message: null } });
		}
	}, [location.state, navigate]);

	const closeToast = () => setIsToastVisible(false);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setFormData({
			...formData,
			[e.target.name]: e.target.value,
		});
	};

	const handleLogin = async (e: React.FormEvent) => {
		e.preventDefault();

		if (isLocked) {
			setErrorMessage(`Too many attempts. Please wait ${lockoutTimer}s.`);
			setIsToastVisible(true);
			return;
		}

		try {
			const response = await api.post("/auth/login/token", formData, {
				headers: {
					"Content-Type": "application/x-www-form-urlencoded",
				},
			});

			// ✅ Reset attempt count on successful login
			setAttemptCount(0);

			const token = response.data.access_token;

			// same navigation logic here...
			if (response.data.temp_pwd) {
				navigate("/reset-password", {
					state: { message: "Please reset your password!" },
				});
				localStorage.setItem("token", token);
				localStorage.setItem("user_id", response.data.user_id);
				localStorage.setItem("temp_pwd", response.data.temp_pwd);
				return;
			}

			localStorage.setItem("token", token);
			localStorage.setItem("name", response.data.name);
			localStorage.setItem("user_id", response.data.user_id);
			localStorage.setItem("temp_pwd", response.data.temp_pwd);
			localStorage.setItem("role", response.data.role);

			if (response.data.role === "admin") {
				navigate("/admin", { state: { message: "Login Successful!" } });
			} else if (response.data.role === "teacher") {
				navigate("/teacher", { state: { message: "Login Successful!" } });
			} else {
				navigate("/student", { state: { message: "Login Successful!" } });
			}
		} catch (error) {
			const newAttemptCount = attemptCount + 1;
			setAttemptCount(newAttemptCount);
			setSuccessMessage("");
			setErrorMessage("Invalid username or password.");
			setIsToastVisible(true);

			// 🚨 Lock after 3 attempts
			if (newAttemptCount >= 3) {
				setIsLocked(true);
				setErrorMessage("Too many failed attempts. Please wait 30 seconds.");
				setIsToastVisible(true);

				let countdown = 30;
				setLockoutTimer(countdown);

				const interval = setInterval(() => {
					countdown -= 1;
					setLockoutTimer(countdown);

					if (countdown <= 0) {
						clearInterval(interval);
						setIsLocked(false);
						setAttemptCount(0);
					}
				}, 1000);
			}
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
					<a href="javascript:void(0)">
						<img src={aclcLogo} alt="logo" className="w-40 inline-block" />
					</a>
				</div>
				<form onSubmit={handleLogin}>
					<div className="space-y-6">
						<div>
							<label
								className="text-gray-800 text-sm mb-2 block"
								htmlFor="username"
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
							/>
						</div>
						<div>
							<label
								className="text-gray-800 text-sm mb-2 block"
								htmlFor="password"
							>
								Password
							</label>
							<input
								name="password"
								type="password"
								className="text-gray-800 bg-white border border-gray-300 w-full text-sm px-4 py-3 rounded-md outline-blue-500"
								placeholder="Enter password"
								onChange={handleChange}
								value={formData.password}
							/>
						</div>
					</div>

					<div className="!mt-12">
						<button
							type="submit"
							disabled={isLocked}
							className={`w-full py-3 px-4 text-sm tracking-wider font-semibold rounded-md text-white ${
								isLocked
									? "bg-gray-400 cursor-not-allowed"
									: "bg-red-600 hover:bg-red-700"
							}`}
						>
							{isLocked ? `Wait ${lockoutTimer}s` : "Log In"}
						</button>
					</div>
					<p className="text-gray-800 text-sm mt-6 text-center">
						or{" "}
						<a
							href="/register"
							className="text-blue-600 font-semibold hover:underline ml-1"
						>
							Create new account
						</a>
					</p>
					<p className="text-gray-800 text-sm mt-6 text-center">
						<a
							href="/send-otp"
							className="text-blue-600 font-semibold hover:underline ml-1"
						>
							Forgot Password
						</a>
					</p>
				</form>
			</div>
		</div>
	);
}
