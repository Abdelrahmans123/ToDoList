import request from "../../utils/request";
import { authActions } from "../Slices/auth";
import { toast } from "react-toastify";

export function login(user) {
	return async (dispatch) => {
		try {
			const { data } = await request.post("/auth/login", user);
			if (data.status === "success") {
				dispatch(authActions.setCredentials({ user: data }));
				localStorage.setItem("user", JSON.stringify(data));
				const token = data.data.token; // Assuming the server sends { token: "your_token" }
				console.log("🚀 ~ return ~ token:", token);
				// Store token in localStorage or sessionStorage

				localStorage.setItem("token", token);
			}
		} catch (error) {
			toast.error(error.response.data.message);
			console.log(error);
		}
	};
}
export function logout() {
	return async (dispatch) => {
		dispatch(authActions.logout());
		localStorage.removeItem("user");
		localStorage.removeItem("token");
		window.location.href = "/login";
	};
}
export function register(user) {
	return async (dispatch) => {
		try {
			const { data } = await request.post("/auth/register", user);
			if (data.status === "success") {
				dispatch(authActions.setRegisterMsg(data.message));
			}
		} catch (error) {
			toast.error(error.response.data.message);
			console.log(error);
		}
	};
}
