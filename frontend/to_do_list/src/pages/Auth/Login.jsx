import React, { useState } from "react";
import { Form, Button, Alert, Card } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link } from "react-router";
import { useDispatch } from "react-redux";
import { login } from "../../redux/API/auth";
import { toast } from "react-toastify";

const Login = () => {
	const dispatch = useDispatch();
	const [formData, setFormData] = useState({
		email: "",
		password: "",
	});
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false); // Added loading state

	const { email, password } = formData;

	// Regular expression for validating email
	const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;

	const onChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const onSubmit = async (e) => {
		e.preventDefault();

		// Reset errors before validation
		setError("");

		// Validation checks
		if (!email || !password) {
			setError("Please fill in all fields.");
			return;
		}

		if (!emailRegex.test(email)) {
			setError("Please enter a valid email address.");
			return;
		}

		if (password.length < 6) {
			setError("Password must be at least 6 characters.");
			return;
		}

		setLoading(true);

		try {
			await dispatch(login(formData));
			toast.success("Login successful!"); // Show success message
			// Dispatch login action
			// Handle successful login (redirect is typically handled by auth context or higher component)
		} catch (err) {
			setError(err.message || "Login failed. Please try again.");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div
			className="d-flex justify-content-center align-items-center"
			style={{ minHeight: "100vh", backgroundColor: "#f8f9fa" }} // Added background color
		>
			<Card
				className="w-100 shadow p-4 border-0" // Removed border
				style={{
					maxWidth: "500px",
					borderRadius: "16px",
					background: "linear-gradient(to bottom, #ffffff, #f8f9fa)", // Subtle gradient
				}}
			>
				<div className="text-center mb-4">
					<h2 className="mb-3" style={{ color: "#2c3e50", fontWeight: "600" }}>
						Welcome Back
					</h2>
					<p className="text-muted">Please enter your credentials to login</p>
				</div>

				{error && (
					<Alert variant="danger" className="text-center">
						{error}
					</Alert>
				)}

				<Form onSubmit={onSubmit}>
					<Form.Group controlId="email" className="mb-3">
						<Form.Label>Email</Form.Label>
						<Form.Control
							type="email"
							name="email"
							value={email}
							onChange={onChange}
							placeholder="Enter your email"
							autoComplete="username"
							className="py-2" // Added padding
						/>
					</Form.Group>

					<Form.Group controlId="password" className="mb-4">
						<Form.Label>Password</Form.Label>
						<Form.Control
							type="password"
							name="password"
							value={password}
							onChange={onChange}
							placeholder="Enter your password"
							autoComplete="current-password"
							className="py-2" // Added padding
						/>
					</Form.Group>

					<Button
						variant="primary"
						type="submit"
						className="w-100 mb-3 py-2"
						disabled={loading}
						style={{
							backgroundColor: "#3498db",
							borderColor: "#3498db",
							fontWeight: "600",
							letterSpacing: "0.5px",
						}}
					>
						{loading ? "Logging in..." : "Log In"}
					</Button>

					<div className="d-flex justify-content-between align-items-center mt-3">
						<span className="text-muted">
							Don't have an account?{" "}
							<Link
								to="/register"
								className="text-decoration-none"
								style={{ color: "#3498db", fontWeight: "500" }}
							>
								Sign up
							</Link>
						</span>
					</div>
				</Form>
			</Card>
		</div>
	);
};

export default Login;
