import React, { useState } from "react";
import { useAutoHideToast } from "../hooks/useAutoHideToast";
import { useNavigate } from "react-router-dom";
import api from "../axios";

export default function SendOtp() {
	const [email, setEmail] = useState("");
	const [successMessage, setSuccessMessage] = useState("");
	const [errorMessage, setErrorMessage] = useState("");
	const [isToastVisible, setIsToastVisible] = useState(false);

	const navigate = useNavigate();

	useAutoHideToast(isToastVisible, setIsToastVisible);

	const handleSendOTP = async (e: React.FormEvent) => {
		e.preventDefault();
		try {
			const response = await api.post("/send-otp", {
				email,
			});
			setSuccessMessage(response.data.message || "OTP sent to your email.");
			navigate("/reset-password-main", {
				state: { email: email, message: "OTP sent to your email" },
			});
			setErrorMessage("");
		} catch (error: any) {
			setSuccessMessage("");
			setErrorMessage(error.response.data.message || "Failed to send OTP.");
		} finally {
			setIsToastVisible(true);
		}
	};

	return (
		<div className="flex flex-col justify-center font-[sans-serif] min-h-screen p-4">
			{isToastVisible && (errorMessage || successMessage) && (
				<div
					className={`flex items-center w-full max-w-xs p-4 mb-4 rounded-lg shadow mx-auto ${
						errorMessage ? "bg-white text-red-500" : "bg-white text-green-500"
					}`}
					role="alert"
				>
					<div className="ms-3 text-sm font-normal">
						{errorMessage || successMessage}
					</div>
				</div>
			)}

			<div className="max-w-md w-full mx-auto border border-gray-300 rounded-2xl p-8">
				<h2 className="text-xl font-semibold mb-4 text-center">
					Send OTP to Email
				</h2>
				<form onSubmit={handleSendOTP} className="space-y-6">
					<div>
						<label className="text-sm text-gray-700">Email</label>
						<input
							type="email"
							className="w-full mt-1 border border-gray-300 p-2 rounded-md text-sm"
							placeholder="Enter your email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							required
						/>
					</div>
					<button
						type="submit"
						className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md text-sm font-semibold"
					>
						Send OTP
					</button>
				</form>
			</div>
		</div>
	);
}
