import { useEffect, useState } from "react";
import BarChart from "../charts/BarChart";
import PieChart from "../charts/PieChart";
import { useNavigate } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";

export default function TeacherDashboardPage() {
	const [announcements, setAnnouncements] = useState<any[]>([]);

	const navigate = useNavigate();

	const name = localStorage.getItem("name");
	const token = localStorage.getItem("token");

	const [errorMessage, setErrorMessage] = useState<string | null>(null);
	const [isToastVisible, setIsToastVisible] = useState(false);

	const fetchAnnouncements = async () => {
		try {
			// Check for authentication token (e.g., in localStorage or cookies)

			if (!token) {
				navigate("/login");
				throw new Error("Not authenticated");
			}

			const response = await fetch(
				"http://localhost:8000/api/v1/announcement?page=1&size=50",
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

	return (
		<div className="grid grid-rows-3 grid-flow-col gap-4 text-white text-sm text-center font-bold leading-6 ">
			<div className="p-4 rounded-lg shadow-lg grid row-span-3 col-span-4">
				<div className="w-full h-screen p-4 flex flex-col">
					<div className="flex flex-col capitalize text-3xl">
						<span className="font-semibold text-black">hello,</span>
						<span className="text-black">{name}</span>
					</div>
					<hr className="h-px my-8 bg-gray-200 border-0"></hr>

					<ul className="pt-1 pb-2 px-3 flex-1 overflow-y-auto">
						<div className="flex flex-col capitalize text-3xl mb-6">
							<span className="font-semibold text-black">Announcements</span>
						</div>
						{announcements.map((announcement) => (
							<li className="mt-2" key={announcement.id}>
								<div className="p-5 flex flex-col justify-between bg-gray-100 rounded-lg">
									<div className="flex justify-between items-center">
										<span className="text-red-500 font-semibold">
											Post by: {announcement.role} {announcement.name}
										</span>
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
			<div className="p-4 rounded-lg grid place-content-center ">
				<BarChart />
			</div>
			<div className="p-4 rounded-lg shadow-lg grid place-content-center row-span-2">
				<PieChart />
			</div>
		</div>
	);
}
