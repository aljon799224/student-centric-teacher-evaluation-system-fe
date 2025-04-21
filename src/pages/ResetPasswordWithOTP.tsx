import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAutoHideToast } from "../hooks/useAutoHideToast";
import api from "../axios";

interface ResetFormData {
	email: string;
	otp: string;
	newPassword: string;
}

export default function ResetPasswordWithOTP() {
	const [formData, setFormData] = useState<ResetFormData>({
		email: "",
		otp: "",
		newPassword: "",
	});

	const [errorMessage, setErrorMessage] = useState<string | null>(null);
	const [successMessage, setSuccessMessage] = useState<string | null>(null);
	const [isToastVisible, setIsToastVisible] = useState(false);

	const navigate = useNavigate();
	useAutoHideToast(isToastVisible, setIsToastVisible);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setFormData({
			...formData,
			[e.target.name]: e.target.value,
		});
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		try {
			const response = await api.post("/reset-password-otp", {
				email: formData.email,
				otp: formData.otp,
				new_password: formData.newPassword,
			});

			setSuccessMessage(response.data.message || "Password reset successful!");
			setIsToastVisible(true);
			setErrorMessage(null);
			navigate("/login", {
				state: { message: "Password updated successfully!" },
			});
		} catch (error: any) {
			setSuccessMessage("");
			setErrorMessage(error.response.data.message || "Something went wrong");
			setIsToastVisible(true);
		}
	};

	return (
		<div className="flex flex-col justify-center font-[sans-serif] sm:h-screen p-4">
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
				<div className="text-center mb-6">
					<h1 className="text-xl font-semibold">Reset Password</h1>
				</div>
				<form onSubmit={handleSubmit} className="space-y-6">
					<div>
						<label className="text-sm text-gray-700">Email</label>
						<input
							type="email"
							name="email"
							className="w-full mt-1 border border-gray-300 p-2 rounded-md text-sm"
							placeholder="Enter your email"
							value={formData.email}
							onChange={handleChange}
							required
						/>
					</div>
					<div>
						<label className="text-sm text-gray-700">OTP</label>
						<input
							type="text"
							name="otp"
							className="w-full mt-1 border border-gray-300 p-2 rounded-md text-sm"
							placeholder="Enter OTP"
							value={formData.otp}
							onChange={handleChange}
							required
						/>
					</div>
					<div>
						<label className="text-sm text-gray-700">New Password</label>
						<input
							type="password"
							name="newPassword"
							className="w-full mt-1 border border-gray-300 p-2 rounded-md text-sm"
							placeholder="Enter new password"
							value={formData.newPassword}
							onChange={handleChange}
							required
						/>
					</div>
					<button
						type="submit"
						className="w-full bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-md text-sm font-semibold"
					>
						Reset Password
					</button>
				</form>
			</div>
		</div>
	);
}
