import { useNavigate } from "react-router-dom";
import aclcLogo from "../assets/new-logo.jpg";

export default function Header() {
	const navigate = useNavigate();

	const handleLogout = () => {
		// Clear the token from localStorage
		localStorage.removeItem("token");

		// Redirect to the login page
		navigate("/login");
	};

	return (
		<div>
			<header className="flex shadow-md px-4 sm:px-7 bg-white min-h-[70px] tracking-wide z-[110] fixed top-0 w-full">
				<div className="flex flex-wrap items-center justify-between gap-4 w-full relative">
					<a href="/admin">
						<img src={aclcLogo} alt="logo" className="w-20 h-auto block p-2" />
					</a>

					<div
						id="collapseMenu"
						className="max-lg:hidden lg:!block max-lg:before:fixed max-lg:before:bg-black max-lg:before:opacity-50 max-lg:before:inset-0 max-lg:before:z-50"
					>
						<button
							id="toggleClose"
							className="lg:hidden fixed top-2 right-4 z-[100] rounded-full bg-white p-3"
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								className="w-3 fill-black"
								viewBox="0 0 320.591 320.591"
							>
								<path
									d="M30.391 318.583a30.37 30.37 0 0 1-21.56-7.288c-11.774-11.844-11.774-30.973 0-42.817L266.643 10.665c12.246-11.459 31.462-10.822 42.921 1.424 10.362 11.074 10.966 28.095 1.414 39.875L51.647 311.295a30.366 30.366 0 0 1-21.256 7.288z"
									data-original="#000000"
								></path>
								<path
									d="M287.9 318.583a30.37 30.37 0 0 1-21.257-8.806L8.83 51.963C-2.078 39.225-.595 20.055 12.143 9.146c11.369-9.736 28.136-9.736 39.504 0l259.331 257.813c12.243 11.462 12.876 30.679 1.414 42.922-.456.487-.927.958-1.414 1.414a30.368 30.368 0 0 1-23.078 7.288z"
									data-original="#000000"
								></path>
							</svg>
						</button>

						<div className="max-lg:fixed max-lg:bg-white max-lg:w-1/2 max-lg:min-w-[300px] max-lg:top-0 max-lg:left-0 max-lg:p-6 max-lg:h-full max-lg:shadow-md max-lg:overflow-auto z-50">
							<div className="flex items-center max-lg:flex-col-reverse max-lg:ml-auto gap-8">
								{/* <div className="flex w-full bg-gray-100 px-4 py-2.5 rounded outline-none border focus-within:border-blue-600 focus-within:bg-transparent transition-all">
            <input
              type="text"
              placeholder="Search something..."
              className="w-full text-sm bg-transparent rounded outline-none pr-2"
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 192.904 192.904"
              width="16px"
              className="cursor-pointer fill-gray-400"
            >
              <path d="m190.707 180.101-47.078-47.077c11.702-14.072 18.752-32.142 18.752-51.831C162.381 36.423 125.959 0 81.191 0 36.422 0 0 36.423 0 81.193c0 44.767 36.422 81.187 81.191 81.187 19.688 0 37.759-7.049 51.831-18.751l47.079 47.078a7.474 7.474 0 0 0 5.303 2.197 7.498 7.498 0 0 0 5.303-12.803zM15 81.193C15 44.694 44.693 15 81.191 15c36.497 0 66.189 29.694 66.189 66.193 0 36.496-29.692 66.187-66.189 66.187C44.693 147.38 15 117.689 15 81.193z"></path>
            </svg>
          </div> */}

								<div className="dropdown-menu relative flex shrink-0 group">
									<img
										src="https://readymadeui.com/team-1.webp"
										alt="profile-pic"
										className="w-9 h-9 max-lg:w-16 max-lg:h-16 rounded-full border-2 border-gray-300 cursor-pointer"
									/>

									<div className="dropdown-content hidden group-hover:block shadow-md p-2 bg-white rounded-md absolute top-9 right-0 w-56">
										<div className="w-full">
											{/* <a
                        href="javascript:void(0)"
                        className="text-sm text-gray-800 cursor-pointer flex items-center p-2 rounded-md hover:bg-gray-100 dropdown-item transition duration-300 ease-in-out"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-4 h-4 mr-3 fill-current"
                          viewBox="0 0 512 512"
                        >
                          <path
                            d="M437.02 74.98C388.668 26.63 324.379 0 256 0S123.332 26.629 74.98 74.98C26.63 123.332 0 187.621 0 256s26.629 132.668 74.98 181.02C123.332 485.37 187.621 512 256 512s132.668-26.629 181.02-74.98C485.37 388.668 512 324.379 512 256s-26.629-132.668-74.98-181.02zM111.105 429.297c8.454-72.735 70.989-128.89 144.895-128.89 38.96 0 75.598 15.179 103.156 42.734 23.281 23.285 37.965 53.687 41.742 86.152C361.641 462.172 311.094 482 256 482s-105.637-19.824-144.895-52.703zM256 269.507c-42.871 0-77.754-34.882-77.754-77.753C178.246 148.879 213.13 114 256 114s77.754 34.879 77.754 77.754c0 42.871-34.883 77.754-77.754 77.754zm170.719 134.427a175.9 175.9 0 0 0-46.352-82.004c-18.437-18.438-40.25-32.27-64.039-40.938 28.598-19.394 47.426-52.16 47.426-89.238C363.754 132.34 315.414 84 256 84s-107.754 48.34-107.754 107.754c0 37.098 18.844 69.875 47.465 89.266-21.887 7.976-42.14 20.308-59.566 36.542-25.235 23.5-42.758 53.465-50.883 86.348C50.852 364.242 30 312.512 30 256 30 131.383 131.383 30 256 30s226 101.383 226 226c0 56.523-20.86 108.266-55.281 147.934zm0 0"
                            data-original="#000000"
                          ></path>
                        </svg>
                        Account
                      </a> */}
											<hr className="my-2 -mx-2" />
											<a
												href="javascript:void(0)"
												className="text-sm text-gray-800 cursor-pointer flex items-center p-2 rounded-md hover:bg-gray-100 dropdown-item transition duration-300 ease-in-out"
												onClick={handleLogout}
											>
												<svg
													xmlns="http://www.w3.org/2000/svg"
													className="w-4 h-4 mr-3 fill-current"
													viewBox="0 0 6 6"
												>
													<path
														d="M3.172.53a.265.266 0 0 0-.262.268v2.127a.265.266 0 0 0 .53 0V.798A.265.266 0 0 0 3.172.53zm1.544.532a.265.266 0 0 0-.026 0 .265.266 0 0 0-.147.47c.459.391.749.973.749 1.626 0 1.18-.944 2.131-2.116 2.131A2.12 2.12 0 0 1 1.06 3.16c0-.65.286-1.228.74-1.62a.265.266 0 1 0-.344-.404A2.667 2.667 0 0 0 .53 3.158a2.66 2.66 0 0 0 2.647 2.663 2.657 2.657 0 0 0 2.645-2.663c0-.812-.363-1.542-.936-2.03a.265.266 0 0 0-.17-.066z"
														data-original="#000000"
													/>
												</svg>
												Logout
											</a>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
					<button id="toggleOpen" className="lg:hidden !ml-7 outline-none">
						<svg
							className="w-7 h-7"
							fill="#000"
							viewBox="0 0 20 20"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path
								fillRule="evenodd"
								d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
								clipRule="evenodd"
							></path>
						</svg>
					</button>
				</div>
			</header>
		</div>
	);
}
