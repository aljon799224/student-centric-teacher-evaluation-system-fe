import { useState } from "react";
import aclcLogo from "../assets/aclc.svg";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAutoHideToast } from "../hooks/useAutoHideToast";

interface SignUpFormState {
  username: string;
  email: string;
  firstName: string;
  middleName: string;
  lastName: string;
  password: string;
  confirmPassword: string;
}

export default function RegistrationPage() {
  const [formData, setFormData] = useState<SignUpFormState>({
    username: "",
    email: "",
    firstName: "",
    middleName: "",
    lastName: "",
    password: "",
    confirmPassword: "",
  });

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isToastVisible, setIsToastVisible] = useState(false);
  const navigate = useNavigate();

  // Automatically hide toast after 3 seconds
  useAutoHideToast(isToastVisible, setIsToastVisible);

  const closeToast = () => setIsToastVisible(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setErrorMessage("Password do not match.");
      setIsToastVisible(true);
      return;
    }

    try {
      const backendPayload = {
        username: formData.username,
        email: formData.email,
        first_name: formData.firstName,
        middle_name: formData.middleName,
        last_name: formData.lastName,
        password: formData.password,
      };

      const response = await axios.post(
        "http://0.0.0.0:8000/api/v1/user",
        backendPayload
      );

      navigate("/login", { state: { message: "Registration Successful!" } });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex flex-col justify-center font-[sans-serif] sm:h-screen p-4">
      {/* toast */}

      {isToastVisible && (
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

      {/* end toast */}
      <div className="max-w-md w-full mx-auto border border-gray-300 rounded-2xl p-8">
        <div className="text-center mb-12">
          <a href="javascript:void(0)">
            <img src={aclcLogo} alt="logo" className="w-40 inline-block" />
          </a>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            <div>
              <label
                htmlFor="username"
                className="text-gray-800 text-sm mb-2 block"
              >
                Username
              </label>
              <input
                name="username"
                type="text"
                className="text-gray-800 bg-white border border-gray-300 w-full text-sm px-4 py-3 rounded-md outline-blue-500"
                placeholder="Enter username"
                onChange={handleChange}
                value={formData.username}
                required
                maxLength={20}
              />
            </div>
            <div>
              <label
                className="text-gray-800 text-sm mb-2 block"
                htmlFor="email"
              >
                Email Address
              </label>
              <input
                name="email"
                type="text"
                className="text-gray-800 bg-white border border-gray-300 w-full text-sm px-4 py-3 rounded-md outline-blue-500"
                placeholder="Enter email"
                onChange={handleChange}
                value={formData.email}
                required
                maxLength={40}
              />
            </div>
            <div>
              <label
                className="text-gray-800 text-sm mb-2 block"
                htmlFor="firstName"
              >
                First Name
              </label>
              <input
                name="firstName"
                type="text"
                className="text-gray-800 bg-white border border-gray-300 w-full text-sm px-4 py-3 rounded-md outline-blue-500"
                placeholder="Enter first name"
                onChange={handleChange}
                value={formData.firstName}
              />
            </div>
            <div>
              <label
                className="text-gray-800 text-sm mb-2 block"
                htmlFor="middleName"
              >
                Middle Name
              </label>
              <input
                name="middleName"
                type="text"
                className="text-gray-800 bg-white border border-gray-300 w-full text-sm px-4 py-3 rounded-md outline-blue-500"
                placeholder="Enter middle name"
                onChange={handleChange}
                value={formData.middleName}
              />
            </div>
            <div>
              <label
                className="text-gray-800 text-sm mb-2 block"
                htmlFor="lastName"
              >
                Last Name
              </label>
              <input
                name="lastName"
                type="text"
                className="text-gray-800 bg-white border border-gray-300 w-full text-sm px-4 py-3 rounded-md outline-blue-500"
                placeholder="Enter last name"
                onChange={handleChange}
                value={formData.lastName}
              />
            </div>

            <div>
              <label
                className="text-gray-800 text-sm mb-2 block"
                htmlFor="password"
              >
                Password
              </label>
              <input
                name="password"
                type="password"
                className="text-gray-800 bg-white border border-gray-300 w-full text-sm px-4 py-3 rounded-md outline-blue-500"
                placeholder="Enter password"
                onChange={handleChange}
                value={formData.password}
                required
                maxLength={20}
              />
            </div>
            <div>
              <label
                className="text-gray-800 text-sm mb-2 block"
                htmlFor="confirmPassword"
              >
                Confirm Password
              </label>
              <input
                name="confirmPassword"
                type="password"
                className="text-gray-800 bg-white border border-gray-300 w-full text-sm px-4 py-3 rounded-md outline-blue-500"
                placeholder="Enter confirm password"
                onChange={handleChange}
                value={formData.confirmPassword}
                required
                maxLength={20}
              />
            </div>
          </div>

          <div className="!mt-12">
            <button
              type="submit"
              className="w-full py-3 px-4 text-sm tracking-wider font-semibold rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none"
            >
              Create an account
            </button>
          </div>
          <p className="text-gray-800 text-sm mt-6 text-center">
            Already have an account?{" "}
            <a
              href="/login"
              className="text-blue-600 font-semibold hover:underline ml-1"
            >
              Login here
            </a>
          </p>
        </form>
      </div>
    </div>
  );
}
