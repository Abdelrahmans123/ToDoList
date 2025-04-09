import React, { useState } from "react";
import { Form, Button, Container, Alert } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { useDispatch, useSelector } from "react-redux";
import { register } from "../../redux/API/auth";
import { useNavigate } from "react-router";
import Swal from "sweetalert2";
const Register = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const { registerMsg } = useSelector((state) => state.auth);
	const [formData, setFormData] = useState({
		username: "",
		email: "",
		password: "",
		password_confirmation: "",
	});

	const [error, setError] = useState("");

	const { username, email, password, password_confirmation } = formData;

	const onChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const onSubmit = (e) => {
		e.preventDefault();
		if (password !== password_confirmation) {
			setError("Passwords do not match");
		} else {
			setError("");
			console.log("Form submitted:", formData);
			// Here you would typically send the form data to your backend
			dispatch(
				register({ name: username, email, password, password_confirmation })
			);
			navigate("/login");
		}
	};
	if (registerMsg) {
		Swal.fire({
			title: "Success",
			text: registerMsg,
			icon: "success",
			confirmButtonText: "OK",
		}).then((isOk) => {
			if (isOk) {
				navigate("/login");
			}
		});
	}

	return (
		<Container
			className="mt-5"
			style={{ maxWidth: "500px", margin: "63px auto" }}
		>
			<h1 className="text-center">Register</h1>
			{error && <Alert variant="danger">{error}</Alert>}
			<Form onSubmit={onSubmit}>
				<Form.Group controlId="username" className="mb-3">
					<Form.Label>Username</Form.Label>
					<Form.Control
						type="text"
						name="username"
						value={username}
						onChange={onChange}
						placeholder="Enter username"
						required
					/>
				</Form.Group>

				<Form.Group controlId="email" className="mb-3">
					<Form.Label>Email</Form.Label>
					<Form.Control
						type="email"
						name="email"
						value={email}
						onChange={onChange}
						placeholder="Enter email"
						required
					/>
				</Form.Group>

				<Form.Group controlId="password" className="mb-3">
					<Form.Label>Password</Form.Label>
					<Form.Control
						type="password"
						name="password"
						value={password}
						onChange={onChange}
						placeholder="Enter password"
						required
					/>
				</Form.Group>

				<Form.Group controlId="confirmPassword" className="mb-3">
					<Form.Label>Confirm Password</Form.Label>
					<Form.Control
						type="password"
						name="password_confirmation" // ✅ fixed name
						value={password_confirmation}
						onChange={onChange}
						placeholder="Confirm password"
						required
					/>
				</Form.Group>

				<Button variant="primary" type="submit" className="w-100">
					Register
				</Button>
			</Form>
		</Container>
	);
};

export default Register;
