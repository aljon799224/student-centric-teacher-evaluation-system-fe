import { useEffect, useState } from "react";
import AdminTeacherCreateView from "./AdminTeacherCreateView";
import { useNavigate } from "react-router-dom";
import { formattedDate } from "../../utils/formatDate";
import { useAutoHideToast } from "../../hooks/useAutoHideToast";
import AdminTeacherUpdateView from "./AdminTeacherUpdateView";
import AdminTeacherDeleteView from "./AdminTeacherDeleteView";

export default function AdminTeacherListView() {
	const [isModalCreateOpen, setIsModalCreateOpen] = useState(false);
	const [isModalUpdateOpen, setIsModalUpdateOpen] = useState(false);
	const [isModalDeleteOpen, setIsModalDeleteOpen] = useState(false);
	const [users, setUsers] = useState<any[]>([]);
	const [errorMessage, setErrorMessage] = useState<string | null>(null);
	const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
	const [isToastVisible, setIsToastVisible] = useState(false);
	const navigate = useNavigate();

	const closeToast = () => setIsToastVisible(false);

	// Automatically hide toast after 3 seconds
	useAutoHideToast(isToastVisible, setIsToastVisible);

	const token = localStorage.getItem("token");

	const toggleModalCreate = () => {
		setIsModalCreateOpen(!isModalCreateOpen);
	};

	const toggleModalUpdate = () => {
		setIsModalUpdateOpen(!isModalUpdateOpen);
	};

	const toggleModalDelete = () => {
		setIsModalDeleteOpen(!isModalDeleteOpen);
	};

	const fetchUsers = async () => {
		try {
			// Check for authentication token (e.g., in localStorage or cookies)

			if (!token) {
				navigate("/login");
				throw new Error("Not authenticated");
			}

			const response = await fetch(
				"http://localhost:8000/api/v1/user?page=1&size=50",
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
				setUsers(data.items);
			} else {
				setUsers([]);
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
				setUsers([]);
			}
		}
	};

	useEffect(() => {
		fetchUsers();
	}, []);

	const addUser = (newUser: any) => {
		setUsers((prevUsers) => [...prevUsers, newUser]);
	};

	const updateUser = (updatedUser: any) => {
		setUsers((prevUsers) =>
			prevUsers.map((user) => (user.id === updatedUser.id ? updatedUser : user))
		);
	};

	const deleteUser = (deletedUser: any) => {
		setUsers((prevUsers) =>
			prevUsers.filter((user) => user.id !== deletedUser.id)
		);
	};

	const filteredTeachers = users
		.filter(
			(user) =>
				user.role === "teacher" &&
				user.admin_id === +(localStorage.getItem("user_id") || "0")
		)
		.sort(
			(a, b) =>
				new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
		);

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

			<button
				className="bg-blue-500 hover:bg-blue-600 text-white mb-3 py-2 px-4 rounded-lg inline-flex items-center"
				onClick={toggleModalCreate}
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					strokeWidth="1.5"
					stroke="currentColor"
					className="size-6"
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						d="M12 4.5v15m7.5-7.5h-15"
					/>
				</svg>

				<span>Add Teacher</span>
			</button>

			{isModalCreateOpen && (
				<div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-10 modal-backdrop">
					<div className="bg-white p-6 rounded-lg shadow-lg">
						<AdminTeacherCreateView
							toggleModalCreate={toggleModalCreate}
							addUser={addUser}
						/>
					</div>
				</div>
			)}

			{isModalUpdateOpen && (
				<div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-10 modal-backdrop">
					<div className="bg-white p-6 rounded-lg shadow-lg">
						<AdminTeacherUpdateView
							toggleModalUpdate={toggleModalUpdate}
							updateUser={updateUser}
							teacherId={selectedUserId}
						/>
					</div>
				</div>
			)}

			{isModalDeleteOpen && (
				<div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-10 modal-backdrop">
					<div className="bg-white p-6 rounded-lg shadow-lg">
						<AdminTeacherDeleteView
							toggleModalDelete={toggleModalDelete}
							teacherId={selectedUserId}
							deleteUser={deleteUser}
						/>
					</div>
				</div>
			)}

			<table className="min-w-full bg-white">
				<thead className="bg-red-800 whitespace-nowrap">
					<tr>
						<th className="p-4 text-left text-sm font-medium text-white">
							Name
						</th>
						<th className="p-4 text-left text-sm font-medium text-white">
							Email
						</th>
						<th className="p-4 text-left text-sm font-medium text-white">
							Username
						</th>
						<th className="p-4 text-left text-sm font-medium text-white">
							Role
						</th>
						<th className="p-4 text-left text-sm font-medium text-white">
							Created At
						</th>
						<th className="p-4 text-left text-sm font-medium text-white">
							Updated At
						</th>
						<th className="p-4 text-left text-sm font-medium text-white">
							Actions
						</th>
					</tr>
				</thead>

				<tbody className="whitespace-nowrap">
					{filteredTeachers.map((user) => (
						<tr className="even:bg-blue-50" key={user.username}>
							<td className="p-4 text-sm text-black">
								{user.first_name +
									" " +
									user.middle_name +
									" " +
									user.last_name}
							</td>
							<td className="p-4 text-sm text-black">{user.email}</td>
							<td className="p-4 text-sm text-black">{user.username}</td>
							<td className="p-4 text-sm text-black">{user.role}</td>
							<td className="p-4 text-sm text-black">
								{formattedDate(user.created_at)}
							</td>
							<td className="p-4 text-sm text-black">
								{formattedDate(user.updated_at)}
							</td>
							<td className="p-4">
								<button
									className="mr-4"
									title="Edit "
									onClick={() => {
										setSelectedUserId(user.id);
										toggleModalUpdate();
									}}
								>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										className="w-5 fill-blue-500 hover:fill-blue-700"
										viewBox="0 0 348.882 348.882"
									>
										<path
											d="m333.988 11.758-.42-.383A43.363 43.363 0 0 0 304.258 0a43.579 43.579 0 0 0-32.104 14.153L116.803 184.231a14.993 14.993 0 0 0-3.154 5.37l-18.267 54.762c-2.112 6.331-1.052 13.333 2.835 18.729 3.918 5.438 10.23 8.685 16.886 8.685h.001c2.879 0 5.693-.592 8.362-1.76l52.89-23.138a14.985 14.985 0 0 0 5.063-3.626L336.771 73.176c16.166-17.697 14.919-45.247-2.783-61.418zM130.381 234.247l10.719-32.134.904-.99 20.316 18.556-.904.99-31.035 13.578zm184.24-181.304L182.553 197.53l-20.316-18.556L294.305 34.386c2.583-2.828 6.118-4.386 9.954-4.386 3.365 0 6.588 1.252 9.082 3.53l.419.383c5.484 5.009 5.87 13.546.861 19.03z"
											data-original="#000000"
										/>
										<path
											d="M303.85 138.388c-8.284 0-15 6.716-15 15v127.347c0 21.034-17.113 38.147-38.147 38.147H68.904c-21.035 0-38.147-17.113-38.147-38.147V100.413c0-21.034 17.113-38.147 38.147-38.147h131.587c8.284 0 15-6.716 15-15s-6.716-15-15-15H68.904C31.327 32.266.757 62.837.757 100.413v180.321c0 37.576 30.571 68.147 68.147 68.147h181.798c37.576 0 68.147-30.571 68.147-68.147V153.388c.001-8.284-6.715-15-14.999-15z"
											data-original="#000000"
										/>
									</svg>
								</button>
								<button
									className="mr-4"
									title="Delete"
									onClick={() => {
										setSelectedUserId(user.id);
										toggleModalDelete();
									}}
								>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										className="w-5 fill-red-500 hover:fill-red-700"
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
								</button>
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
}
