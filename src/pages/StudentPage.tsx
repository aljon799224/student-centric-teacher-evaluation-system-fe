import { Outlet, useLocation, useNavigate } from "react-router-dom";

import { useEffect, useState } from "react";
import { useAutoHideToast } from "../hooks/useAutoHideToast";
export default function StudentPage() {
	const [successMessage, setSuccessMessage] = useState<string | null>(null);
	const [isToastVisible, setIsToastVisible] = useState(false);

	const navigate = useNavigate();
	const location = useLocation();

	// Automatically hide toast after 3 seconds
	useAutoHideToast(isToastVisible, setIsToastVisible);

	const closeToast = () => setIsToastVisible(false);

	const role = localStorage.getItem("role");

	useEffect(() => {
		if (role !== "student") {
			navigate("/not-authorize");
		}
	});

	useEffect(() => {
		if (location.state?.message) {
			setSuccessMessage(location.state.message);
			setIsToastVisible(true);
			navigate(location.pathname, { replace: true, state: { message: null } });
		}
	}, [location.state, navigate]);

	const handleLogout = () => {
		// Clear the token from localStorage
		localStorage.removeItem("token");
		localStorage.removeItem("name");
		localStorage.removeItem("user_id");

		// Redirect to the login page
		navigate("/login");
	};

	return (
		<div className="relative font-[sans-serif] pt-[70px] h-screen">
			{isToastVisible && (
				<div
					id="toast-success"
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

			<div>
				<div className="flex items-start">
					<nav id="sidebar" className="lg:min-w-[250px] w-max max-lg:min-w-8">
						<div
							id="sidebar-collapse-menu"
							style={{ height: "calc(100vh - 72px)" }}
							className="bg-white shadow-lg h-screen fixed py-6 px-4 top-[70px] left-0 overflow-auto z-[99] lg:min-w-[250px] lg:w-max max-lg:w-0 max-lg:invisible transition-all duration-500"
						>
							<ul className="space-y-2">
								<li>
									<a
										href="/student"
										className={`text-sm flex items-center rounded-md px-4 py-2 transition-all ${
											location.pathname === "/student"
												? "bg-red-800 text-white"
												: "text-gray-800 hover:bg-gray-100"
										}`}
									>
										<svg
											xmlns="http://www.w3.org/2000/svg"
											fill="currentColor"
											className="w-[18px] h-[18px] mr-3"
											viewBox="0 0 24 24"
										>
											<path
												d="M19.56 23.253H4.44a4.051 4.051 0 0 1-4.05-4.05v-9.115c0-1.317.648-2.56 1.728-3.315l7.56-5.292a4.062 4.062 0 0 1 4.644 0l7.56 5.292a4.056 4.056 0 0 1 1.728 3.315v9.115a4.051 4.051 0 0 1-4.05 4.05zM12 2.366a2.45 2.45 0 0 0-1.393.443l-7.56 5.292a2.433 2.433 0 0 0-1.037 1.987v9.115c0 1.34 1.09 2.43 2.43 2.43h15.12c1.34 0 2.43-1.09 2.43-2.43v-9.115c0-.788-.389-1.533-1.037-1.987l-7.56-5.292A2.438 2.438 0 0 0 12 2.377z"
												data-original="#000000"
											></path>
											<path
												d="M16.32 23.253H7.68a.816.816 0 0 1-.81-.81v-5.4c0-2.83 2.3-5.13 5.13-5.13s5.13 2.3 5.13 5.13v5.4c0 .443-.367.81-.81.81zm-7.83-1.62h7.02v-4.59c0-1.933-1.577-3.51-3.51-3.51s-3.51 1.577-3.51 3.51z"
												data-original="#000000"
											></path>
										</svg>
										<span>Dashboard</span>
									</a>
								</li>
							</ul>

							<div className="mt-6">
								<h6 className="text-red-600 text-sm font-bold px-4">
									Assessments
								</h6>
								<ul className="mt-3 space-y-2">
									<li>
										<a
											href="/student/evaluations"
											className={`text-sm flex items-center rounded-md px-4 py-2 transition-all ${
												location.pathname === "/student/evaluations"
													? "bg-red-800 text-white"
													: "text-gray-800 hover:bg-gray-100"
											}`}
										>
											<svg
												xmlns="http://www.w3.org/2000/svg"
												fill="none"
												viewBox="0 0 24 24"
												strokeWidth="1.5"
												stroke="currentColor"
												className="w-[18px] h-[18px] mr-3"
											>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													d="M15.666 3.888A2.25 2.25 0 0 0 13.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 0 1-.75.75H9a.75.75 0 0 1-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 0 1-2.25 2.25H6.75A2.25 2.25 0 0 1 4.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 0 1 1.927-.184"
												/>
											</svg>

											<span>Evaluations</span>
										</a>
									</li>
								</ul>
							</div>

							<div className="mt-6">
								<h6 className="text-red-600 text-sm font-bold px-4">
									General Settings
								</h6>
								<ul className="mt-3 space-y-2">
									<li>
										<a
											href="/student/reset-password"
											className={`text-sm flex items-center rounded-md px-4 py-2 transition-all ${
												location.pathname === "/student/reset-password"
													? "bg-red-800 text-white"
													: "text-gray-800 hover:bg-gray-100"
											}`}
										>
											<svg
												xmlns="http://www.w3.org/2000/svg"
												fill="none"
												viewBox="0 0 24 24"
												strokeWidth={1.5}
												stroke="currentColor"
												className="w-[18px] h-[18px] mr-3"
											>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z"
												/>
											</svg>

											<span>Change Password</span>
										</a>
									</li>
								</ul>
							</div>

							<div className="mt-6">
								<h6 className="text-red-600 text-sm font-bold px-4">Actions</h6>
								<ul className="mt-3 space-y-2">
									<li>
										<a
											href="/student/profile"
											className={`text-sm flex items-center rounded-md px-4 py-2 transition-all ${
												location.pathname === "/student/profile"
													? "bg-red-800 text-white"
													: "text-gray-800 hover:bg-gray-100"
											}`}
										>
											<svg
												xmlns="http://www.w3.org/2000/svg"
												fill="currentColor"
												className="w-[18px] h-[18px] mr-3"
												viewBox="0 0 512 512"
											>
												<path
													d="M437.02 74.98C388.668 26.63 324.379 0 256 0S123.332 26.629 74.98 74.98C26.63 123.332 0 187.621 0 256s26.629 132.668 74.98 181.02C123.332 485.37 187.621 512 256 512s132.668-26.629 181.02-74.98C485.37 388.668 512 324.379 512 256s-26.629-132.668-74.98-181.02zM111.105 429.297c8.454-72.735 70.989-128.89 144.895-128.89 38.96 0 75.598 15.179 103.156 42.734 23.281 23.285 37.965 53.687 41.742 86.152C361.641 462.172 311.094 482 256 482s-105.637-19.824-144.895-52.703zM256 269.507c-42.871 0-77.754-34.882-77.754-77.753C178.246 148.879 213.13 114 256 114s77.754 34.879 77.754 77.754c0 42.871-34.883 77.754-77.754 77.754zm170.719 134.427a175.9 175.9 0 0 0-46.352-82.004c-18.437-18.438-40.25-32.27-64.039-40.938 28.598-19.394 47.426-52.16 47.426-89.238C363.754 132.34 315.414 84 256 84s-107.754 48.34-107.754 107.754c0 37.098 18.844 69.875 47.465 89.266-21.887 7.976-42.14 20.308-59.566 36.542-25.235 23.5-42.758 53.465-50.883 86.348C50.852 364.242 30 312.512 30 256 30 131.383 131.383 30 256 30s226 101.383 226 226c0 56.523-20.86 108.266-55.281 147.934zm0 0"
													data-original="#000000"
												/>
											</svg>
											<span>Profile</span>
										</a>
									</li>
									<li>
										<a
											href="javascript:void(0)"
											className="text-gray-800 text-sm flex items-center hover:bg-gray-100 rounded-md px-4 py-2 transition-all"
											onClick={handleLogout}
										>
											<svg
												xmlns="http://www.w3.org/2000/svg"
												fill="currentColor"
												className="w-[18px] h-[18px] mr-3"
												viewBox="0 0 6.35 6.35"
											>
												<path
													d="M3.172.53a.265.266 0 0 0-.262.268v2.127a.265.266 0 0 0 .53 0V.798A.265.266 0 0 0 3.172.53zm1.544.532a.265.266 0 0 0-.026 0 .265.266 0 0 0-.147.47c.459.391.749.973.749 1.626 0 1.18-.944 2.131-2.116 2.131A2.12 2.12 0 0 1 1.06 3.16c0-.65.286-1.228.74-1.62a.265.266 0 1 0-.344-.404A2.667 2.667 0 0 0 .53 3.158a2.66 2.66 0 0 0 2.647 2.663 2.657 2.657 0 0 0 2.645-2.663c0-.812-.363-1.542-.936-2.03a.265.266 0 0 0-.17-.066z"
													data-original="#000000"
												/>
											</svg>
											<span>Logout</span>
										</a>
									</li>
								</ul>
							</div>
						</div>
					</nav>

					<button
						id="toggle-sidebar"
						className="lg:hidden w-8 h-8 z-[100] fixed top-[74px] left-[10px] cursor-pointer bg-[#007bff] flex items-center justify-center rounded-full outline-none transition-all duration-500"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="#fff"
							className="w-3 h-3"
							viewBox="0 0 55.752 55.752"
						>
							<path
								d="M43.006 23.916a5.36 5.36 0 0 0-.912-.727L20.485 1.581a5.4 5.4 0 0 0-7.637 7.638l18.611 18.609-18.705 18.707a5.398 5.398 0 1 0 7.634 7.635l21.706-21.703a5.35 5.35 0 0 0 .912-.727 5.373 5.373 0 0 0 1.574-3.912 5.363 5.363 0 0 0-1.574-3.912z"
								data-original="#000000"
							/>
						</svg>
					</button>
					<section className="main-content w-full overflow-auto p-6">
						<Outlet />
					</section>
				</div>
				s
			</div>
		</div>
	);
}
