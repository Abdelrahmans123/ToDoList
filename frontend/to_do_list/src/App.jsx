import Header from "./components/Header/Header";
import { BrowserRouter, Routes, Route, Navigate } from "react-router";
import Home from "./pages/Home/Home";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";

import "bootstrap/dist/css/bootstrap.min.css";

import { toast, ToastContainer } from "react-toastify";

import { useSelector } from "react-redux";
import { useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import CreateTask from "./pages/CreateTask/CreateTask";
import EditTask from "./pages/Task/EditTask";
import ArchivedTasks from "./pages/Task/ArchivedTasks";

function App() {
	const { user } = useSelector((state) => state.auth);

	useEffect(() => {
		const token = localStorage.getItem("token");
		if (token) {
			const decodedToken = jwtDecode(token);
			const currentTime = Date.now() / 1000; // in seconds

			if (decodedToken.exp < currentTime) {
				localStorage.removeItem("user");
				localStorage.removeItem("token");

				window.location.href = "/login"; // Redirect after manual logout
				toast.error("Your session has expired. Please log in again.");
			}
		}
	}, []);
	return (
		<BrowserRouter>
			<ToastContainer theme="colored" position="top-center" />
			<Header />
			<Routes>
				<Route path="/" element={user ? <Home /> : <Navigate to="/login" />} />
				<Route
					path="/login"
					element={!user ? <Login /> : <Navigate to="/" />}
				/>
				<Route path="/create-task" element={<CreateTask />} />

				<Route
					path="/register"
					element={!user ? <Register /> : <Navigate to="/" />}
				/>
				<Route path="/edit-task/:id" element={<EditTask />} />
				<Route path="/archived-tasks" element={<ArchivedTasks />} />
				{/* <Route path="*" element={<NotFound />} /> */}
			</Routes>
		</BrowserRouter>
	);
}

export default App;
