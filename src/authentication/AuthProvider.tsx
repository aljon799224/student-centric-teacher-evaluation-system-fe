import { createContext, useState } from "react";

export const AuthContext = createContext<any | undefined>(undefined);

export const AuthProvider = ({ children }: any) => {
	const [user, setUser] = useState(null);

	const login = (userData: any) => {
		setUser(userData);
		localStorage.setItem("user", JSON.stringify(userData));
	};

	const logout = () => {
		setUser(null);
		localStorage.removeItem("user");
	};

	return (
		<AuthContext.Provider value={{ user, login, logout }}>
			{children}
		</AuthContext.Provider>
	);
};
