// components/ChartModal.tsx
import {
	Dialog,
	DialogTrigger,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogDescription,
} from "@/components/ui/dialog";
import {
	BarChart,
	Bar,
	XAxis,
	YAxis,
	Tooltip,
	ResponsiveContainer,
} from "recharts";

type Averages = {
	average_1: number;
	average_2: number;
	average_3: number;
	average_4: number;
	average: number;
};

type Props = {
	averages: Averages;
};

const ChartModal: React.FC<Props> = ({ averages }) => {
	const data = [
		{ name: "Personal & Professional", value: averages.average_1 },
		{ name: "Teaching", value: averages.average_2 },
		{ name: "Management & Control", value: averages.average_3 },
		{ name: "Lesson Plans", value: averages.average_4 },
		{ name: "Overall", value: averages.average },
	];

	return (
		<Dialog>
			<DialogTrigger className="mt-4 bg-blue-600 text-white text-lg font-semibold px-6 py-3 rounded-lg hover:bg-blue-700 transition">
				View Chart
			</DialogTrigger>
			<DialogContent className="max-w-4xl w-full p-6">
				<DialogHeader>
					<DialogTitle className="text-2xl font-bold">
						Category Averages
					</DialogTitle>
					<DialogDescription className="mb-4">
						A graphical breakdown of average scores
					</DialogDescription>
				</DialogHeader>
				<ResponsiveContainer width="100%" height={400}>
					<BarChart data={data}>
						<XAxis dataKey="name" />
						<YAxis domain={[0, 5]} />
						<Tooltip />
						<Bar dataKey="value" fill="#8884d8" />
					</BarChart>
				</ResponsiveContainer>
			</DialogContent>
		</Dialog>
	);
};

export default ChartModal;
