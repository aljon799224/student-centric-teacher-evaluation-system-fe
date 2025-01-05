export default function DashboardPage() {
	const name = localStorage.getItem("name");

	return (
		<div>
			<h1>Welcome {name}</h1>
		</div>
	);
}
