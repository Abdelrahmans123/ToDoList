import React from "react";
import { Dropdown, Navbar, Container, Nav, Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router";
import { logout } from "../../redux/API/auth";
import "./Header.css";

const Header = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const { user } = useSelector((state) => state.auth);

	const handleLogout = () => {
		dispatch(logout());
		navigate("/login");
	};

	return (
		<Navbar
			expand="lg"
			bg="light"
			variant="light"
			sticky="top"
			className="shadow-sm py-3"
		>
			<Container>
				<Navbar.Brand as={Link} to="/" className="fw-bold text-primary">
					📋 ToDoList
				</Navbar.Brand>
				<Navbar.Toggle aria-controls="navbarScroll" />
				<Navbar.Collapse id="navbarScroll" className="justify-content-between">
					<Nav className="me-auto">
						{user && (
							<>
								<Nav.Link as={Link} to="/" className="mx-2">
									Home
								</Nav.Link>
								<Nav.Link as={Link} to="/archived-tasks" className="mx-2">
									Archived Tasks
								</Nav.Link>
							</>
						)}
					</Nav>

					{user ? (
						<Dropdown align="end">
							<Dropdown.Toggle
								variant="outline-primary"
								className="d-flex align-items-center"
							>
								👤 {user.data.user?.name}
							</Dropdown.Toggle>

							<Dropdown.Menu>
								<Dropdown.Item onClick={handleLogout}>🚪 Logout</Dropdown.Item>
							</Dropdown.Menu>
						</Dropdown>
					) : (
						<div className="d-flex">
							<Button
								variant="outline-primary"
								className="me-2"
								as={Link}
								to="/login"
							>
								Login
							</Button>
							<Button variant="primary" as={Link} to="/register">
								Register
							</Button>
						</div>
					)}
				</Navbar.Collapse>
			</Container>
		</Navbar>
	);
};

export default Header;
