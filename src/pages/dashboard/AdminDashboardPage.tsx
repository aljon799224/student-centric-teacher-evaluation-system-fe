import axios from "axios";
import { formatDistanceToNow, parseISO } from "date-fns";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminDashboardPostUpdateView from "./AdminDashboardPostUpdateView";
import AdminDashboardPostDeleteView from "./AdminDashboardPostDeleteView";

interface AnnouncementFormState {
	announcementText: string;
}

export default function AdminDashboardPage() {
	const name = localStorage.getItem("name");
	const token = localStorage.getItem("token");
	const userId = localStorage.getItem("user_id");
	const [announcements, setAnnouncements] = useState<any[]>([]);
	const [errorMessage, setErrorMessage] = useState<string | null>(null);
	const [isToastVisible, setIsToastVisible] = useState(false);
	const [isModalUpdateOpen, setIsModalUpdateOpen] = useState(false);
	const [isModalDeleteOpen, setIsModalDeleteOpen] = useState(false);
	const [formData, setFormData] = useState<AnnouncementFormState>({
		announcementText: "",
	});
	const [selectedAnnouncementId, setSelectedAnnouncementId] = useState<
		string | null
	>(null);
	const navigate = useNavigate();

	const toggleModalUpdate = () => {
		setIsModalUpdateOpen(!isModalUpdateOpen);
	};

	const toggleModalDelete = () => {
		setIsModalDeleteOpen(!isModalDeleteOpen);
	};

	const fetchAnnouncements = async () => {
		try {
			// Check for authentication token (e.g., in localStorage or cookies)

			if (!token) {
				navigate("/login");
				throw new Error("Not authenticated");
			}

			const response = await fetch(
				"http://0.0.0.0:8000/api/v1/announcement?page=1&size=50",
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
				// Sort by date (latest first)
				const sortedAnnouncements = data.items.sort(
					(a: any, b: any) =>
						new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
				);
				setAnnouncements(sortedAnnouncements);
			} else {
				setAnnouncements([]);
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
				setAnnouncements([]);
			}
		}
	};

	useEffect(() => {
		fetchAnnouncements();
	}, []);

	const updateAnnouncement = (updatedAnnouncement: any) => {
		setAnnouncements((prevAnnouncements) => {
			const updatedList = prevAnnouncements.map((announcement) =>
				announcement.id === updatedAnnouncement.id
					? updatedAnnouncement
					: announcement
			);

			// Sort the updated list so that the latest announcement appears first
			return updatedList.sort(
				(a, b) =>
					new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
			);
		});
	};

	const deleteAnnouncement = (deletedAnnouncement: any) => {
		setAnnouncements((prevAnnouncements) =>
			prevAnnouncements.filter(
				(announcement) => announcement.id !== deletedAnnouncement.id
			)
		);
	};

	const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
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
				announcement_text: formData.announcementText,
				admin_id: userId,
			};

			const response = await axios.post(
				"http://0.0.0.0:8000/api/v1/announcement",
				backendPayload,
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);

			const newAnnouncement = response.data;

			setAnnouncements((prev) => [newAnnouncement, ...prev]);

			setIsToastVisible(true);

			setFormData({ announcementText: "" });

			navigate("/admin", {
				state: {
					message: "Post has been created successfully!",
				},
			});
		} catch (error: any) {
			setErrorMessage(error.message);
			setIsToastVisible(true);
			console.error(error);
		}
	};

	return (
		<div>
			{isModalUpdateOpen && (
				<div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-10 modal-backdrop">
					<div className="bg-white p-6 rounded-lg shadow-lg">
						<AdminDashboardPostUpdateView
							toggleModalUpdate={toggleModalUpdate}
							updateAnnouncement={updateAnnouncement}
							announcementId={selectedAnnouncementId}
						/>
					</div>
				</div>
			)}

			{isModalDeleteOpen && (
				<div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-10 modal-backdrop">
					<div className="bg-white p-6 rounded-lg shadow-lg">
						<AdminDashboardPostDeleteView
							toggleModalDelete={toggleModalDelete}
							announcementId={selectedAnnouncementId}
							deleteAnnouncement={deleteAnnouncement}
						/>
					</div>
				</div>
			)}
			<div className="w-full h-screen p-4 flex flex-col">
				<div className="flex flex-col capitalize text-3xl">
					<span className="font-semibold">hello,</span>
					<span>{name}</span>
				</div>
				<hr className="h-px my-8 bg-gray-200 border-0"></hr>

				<form action="" onSubmit={handleSubmit}>
					<div className="py-2 px-4 mb-4 bg-white rounded-lg rounded-t-lg border border-gray-200">
						<div className="py-2 px-4 mb-4 bg-white rounded-lg rounded-t-lg border border-gray-200">
							<textarea
								rows={4}
								className="px-0 w-full text-sm text-gray-800 outline-none focus:outline-none focus:ring-0 focus:border-transparent"
								placeholder="What's on your mind?"
								onChange={handleChange}
								value={formData.announcementText}
								name="announcementText"
							></textarea>

							<button
								type="submit"
								className="py-3 px-4 text-sm tracking-wider font-semibold rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none"
							>
								Post
							</button>
						</div>
					</div>
				</form>
				<ul className="pt-1 pb-2 px-3 flex-1 overflow-y-auto">
					<div className="flex flex-col capitalize text-3xl mb-6">
						<span className="font-semibold">Announcements</span>
					</div>
					{announcements.map((announcement) => (
						<li className="mt-2" key={announcement.id}>
							<div className="p-5 flex flex-col justify-between bg-gray-100 rounded-lg">
								<div className="flex justify-between items-center">
									<span className="text-red-500 font-semibold">
										Post by: {announcement.role} {announcement.name}
									</span>
									<div className="flex">
										{/* Edit Button */}
										<button
											className="mr-2"
											title="Edit"
											onClick={() => {
												setSelectedAnnouncementId(announcement.id);
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

										{/* Delete Button */}
										<button
											title="Delete"
											onClick={() => {
												setSelectedAnnouncementId(announcement.id);
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
									</div>
								</div>

								<p className="text-sm font-medium leading-snug text-gray-600 my-3">
									{announcement.announcement_text}
								</p>

								<div className="flex justify-between">
									<p className="text-sm font-medium leading-snug text-gray-600">
										{formatDistanceToNow(
											new Date(announcement.updated_at + "Z"),
											{
												addSuffix: true,
											}
										)}
									</p>
								</div>
							</div>
						</li>
					))}
				</ul>
			</div>
		</div>
	);
}
