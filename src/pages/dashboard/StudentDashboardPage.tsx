export default function StudentDashboardPage() {
	const name = localStorage.getItem("name");

	return (
		<div>
			<div className="w-full h-screen p-4 flex flex-col">
				<div className="flex flex-col capitalize text-3xl">
					<span className="font-semibold">hello,</span>
					<span>{name}</span>
				</div>
				<hr className="h-px my-8 bg-gray-200 border-0"></hr>

				<ul className="pt-1 pb-2 px-3 flex-1 overflow-y-auto">
					<div className="flex flex-col capitalize text-3xl mb-6">
						<span className="font-semibold">Announcements</span>
					</div>
					<li className="mt-2">
						<a
							className="p-5 flex flex-col justify-between
								bg-gray-100 rounded-lg"
							href="#"
						>
							<div className="flex">
								<span>
									<span
										className="text-red-500
												font-semibold"
									>
										{name}
									</span>
								</span>
							</div>

							<p
								className="text-sm font-medium leading-snug
									text-gray-600 my-3"
							>
								Lorem ipsum, dolor sit amet consectetur adipisicing elit.
								Explicabo assumenda porro sapiente, cum nobis tempore delectus
								consectetur ullam reprehenderit quis ducimus, iusto dolor nam
								corporis id perspiciatis consequuntur saepe excepturi.
							</p>

							<div className="flex justify-between">
								<p
									className="text-sm font-medium leading-snug
										text-gray-600"
								>
									14 hours ago
								</p>
							</div>
						</a>
					</li>
					<li className="mt-2">
						<a
							className="p-5 flex flex-col justify-between
								bg-gray-100 rounded-lg"
							href="#"
						>
							<div className="flex">
								<span>
									<span
										className="text-red-500
												font-semibold"
									>
										{name}
									</span>
								</span>
							</div>

							<p
								className="text-sm font-medium leading-snug
									text-gray-600 my-3"
							>
								Lorem ipsum, dolor sit amet consectetur adipisicing elit.
								Explicabo assumenda porro sapiente, cum nobis tempore delectus
								consectetur ullam reprehenderit quis ducimus, iusto dolor nam
								corporis id perspiciatis consequuntur saepe excepturi.
							</p>

							<div className="flex justify-between">
								<p
									className="text-sm font-medium leading-snug
										text-gray-600"
								>
									14 hours ago
								</p>
							</div>
						</a>
					</li>
					<li className="mt-2">
						<a
							className="p-5 flex flex-col justify-between
								bg-gray-100 rounded-lg"
							href="#"
						>
							<div className="flex">
								<span>
									<span
										className="text-red-500
												font-semibold"
									>
										{name}
									</span>
								</span>
							</div>

							<p
								className="text-sm font-medium leading-snug
									text-gray-600 my-3"
							>
								Lorem ipsum, dolor sit amet consectetur adipisicing elit.
								Explicabo assumenda porro sapiente, cum nobis tempore delectus
								consectetur ullam reprehenderit quis ducimus, iusto dolor nam
								corporis id perspiciatis consequuntur saepe excepturi.
							</p>

							<div className="flex justify-between">
								<p
									className="text-sm font-medium leading-snug
										text-gray-600"
								>
									14 hours ago
								</p>
							</div>
						</a>
					</li>
					<li className="mt-2">
						<a
							className="p-5 flex flex-col justify-between
								bg-gray-100 rounded-lg"
							href="#"
						>
							<div className="flex">
								<span>
									<span
										className="text-red-500
												font-semibold"
									>
										{name}
									</span>
								</span>
							</div>

							<p
								className="text-sm font-medium leading-snug
									text-gray-600 my-3"
							>
								Lorem ipsum, dolor sit amet consectetur adipisicing elit.
								Explicabo assumenda porro sapiente, cum nobis tempore delectus
								consectetur ullam reprehenderit quis ducimus, iusto dolor nam
								corporis id perspiciatis consequuntur saepe excepturi.
							</p>

							<div className="flex justify-between">
								<p
									className="text-sm font-medium leading-snug
										text-gray-600"
								>
									14 hours ago
								</p>
							</div>
						</a>
					</li>
					<li className="mt-2">
						<a
							className="p-5 flex flex-col justify-between
								bg-gray-100 rounded-lg"
							href="#"
						>
							<div className="flex">
								<span>
									<span
										className="text-red-500
												font-semibold"
									>
										{name}
									</span>
								</span>
							</div>

							<p
								className="text-sm font-medium leading-snug
									text-gray-600 my-3"
							>
								Lorem ipsum, dolor sit amet consectetur adipisicing elit.
								Explicabo assumenda porro sapiente, cum nobis tempore delectus
								consectetur ullam reprehenderit quis ducimus, iusto dolor nam
								corporis id perspiciatis consequuntur saepe excepturi.
							</p>

							<div className="flex justify-between">
								<p
									className="text-sm font-medium leading-snug
										text-gray-600"
								>
									14 hours ago
								</p>
							</div>
						</a>
					</li>
					<li className="mt-2">
						<a
							className="p-5 flex flex-col justify-between
								bg-gray-100 rounded-lg"
							href="#"
						>
							<div className="flex">
								<span>
									<span
										className="text-red-500
												font-semibold"
									>
										{name}
									</span>
								</span>
							</div>

							<p
								className="text-sm font-medium leading-snug
									text-gray-600 my-3"
							>
								Lorem ipsum, dolor sit amet consectetur adipisicing elit.
								Explicabo assumenda porro sapiente, cum nobis tempore delectus
								consectetur ullam reprehenderit quis ducimus, iusto dolor nam
								corporis id perspiciatis consequuntur saepe excepturi.
							</p>

							<div className="flex justify-between">
								<p
									className="text-sm font-medium leading-snug
										text-gray-600"
								>
									14 hours ago
								</p>
							</div>
						</a>
					</li>
					<li className="mt-2">
						<a
							className="p-5 flex flex-col justify-between
								bg-gray-100 rounded-lg"
							href="#"
						>
							<div className="flex">
								<span>
									<span
										className="text-red-500
												font-semibold"
									>
										{name}
									</span>
								</span>
							</div>

							<p
								className="text-sm font-medium leading-snug
									text-gray-600 my-3"
							>
								Lorem ipsum, dolor sit amet consectetur adipisicing elit.
								Explicabo assumenda porro sapiente, cum nobis tempore delectus
								consectetur ullam reprehenderit quis ducimus, iusto dolor nam
								corporis id perspiciatis consequuntur saepe excepturi.
							</p>

							<div className="flex justify-between">
								<p
									className="text-sm font-medium leading-snug
										text-gray-600"
								>
									14 hours ago
								</p>
							</div>
						</a>
					</li>
					<li className="mt-2">
						<a
							className="p-5 flex flex-col justify-between
								bg-gray-100 rounded-lg"
							href="#"
						>
							<div className="flex">
								<span>
									<span
										className="text-red-500
												font-semibold"
									>
										{name}
									</span>
								</span>
							</div>

							<p
								className="text-sm font-medium leading-snug
									text-gray-600 my-3"
							>
								Lorem ipsum, dolor sit amet consectetur adipisicing elit.
								Explicabo assumenda porro sapiente, cum nobis tempore delectus
								consectetur ullam reprehenderit quis ducimus, iusto dolor nam
								corporis id perspiciatis consequuntur saepe excepturi.
							</p>

							<div className="flex justify-between">
								<p
									className="text-sm font-medium leading-snug
										text-gray-600"
								>
									14 hours ago
								</p>
							</div>
						</a>
					</li>
					<li className="mt-2">
						<a
							className="p-5 flex flex-col justify-between
								bg-gray-100 rounded-lg"
							href="#"
						>
							<div className="flex">
								<span>
									<span
										className="text-red-500
												font-semibold"
									>
										{name}
									</span>
								</span>
							</div>

							<p
								className="text-sm font-medium leading-snug
									text-gray-600 my-3"
							>
								Lorem ipsum, dolor sit amet consectetur adipisicing elit.
								Explicabo assumenda porro sapiente, cum nobis tempore delectus
								consectetur ullam reprehenderit quis ducimus, iusto dolor nam
								corporis id perspiciatis consequuntur saepe excepturi.
							</p>

							<div className="flex justify-between">
								<p
									className="text-sm font-medium leading-snug
										text-gray-600"
								>
									14 hours ago
								</p>
							</div>
						</a>
					</li>
				</ul>
			</div>
		</div>
	);
}
