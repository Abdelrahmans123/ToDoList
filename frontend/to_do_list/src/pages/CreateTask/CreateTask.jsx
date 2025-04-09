import React, { useEffect, useState } from "react";
import {
	Button,
	Card,
	Container,
	Form,
	Row,
	Col,
	Spinner,
	Alert,
} from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { createTask, getTasks } from "../../redux/API/task";
import { getCategories } from "../../redux/API/category";
import { useNavigate } from "react-router";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./createTask.css";
const CreateTask = () => {
	const navigate = useNavigate();
	const dispatch = useDispatch();

	// Get categories from Redux
	const { category, loading: catLoading } = useSelector(
		(state) => state.category
	);

	// Set up local state for the task; make sure user_id is pre-populated
	const [task, setTask] = useState({
		title: "",
		description: "",
		category_id: "",
		user_id: JSON.parse(localStorage.getItem("user")).data.user.id,
		due_date: "",
	});

	// This state is used for form validation feedback.
	const [validated, setValidated] = useState(false);
	// Used for custom error messages (e.g. due date not in the future)
	const [errorMsg, setErrorMsg] = useState("");
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		dispatch(getCategories());
	}, [dispatch]);

	// Handle changes for all form inputs.
	const handleChange = (e) => {
		const { name, value } = e.target;
		setTask((prev) => ({
			...prev,
			[name]: name === "category_id" ? Number(value) : value,
		}));
	};

	// Form submission with built-in and custom validation.
	const handleSubmit = async (e) => {
		const form = e.currentTarget;
		e.preventDefault();
		e.stopPropagation();

		setValidated(true);
		setErrorMsg("");

		if (form.checkValidity() === false) return;

		const selectedDate = new Date(task.due_date);
		const today = new Date();
		today.setHours(0, 0, 0, 0);

		if (selectedDate <= today) {
			setErrorMsg("Due date must be in the future.");
			return;
		}

		try {
			setLoading(true); // Start loading
			await dispatch(createTask(task));
			await dispatch(getTasks());
			navigate("/");
		} catch (err) {
			setErrorMsg(
				err?.message || "Failed to create task. Please try again later."
			);
		} finally {
			setLoading(false); // Stop loading in all cases
		}
	};

	// Show a spinner if categories are still loading.
	if (catLoading) {
		return (
			<Container
				className="d-flex justify-content-center align-items-center"
				style={{ height: "100vh" }}
			>
				<Spinner animation="border" variant="primary" />
			</Container>
		);
	}

	return (
		<Container className="py-5">
			<Row className="justify-content-center">
				<Col md={8}>
					<Card className="shadow p-4">
						<h2 className="text-center mb-4">➕ Create Task</h2>
						{/* Show custom error if present */}
						{errorMsg && <Alert variant="danger">{errorMsg}</Alert>}
						<Form noValidate validated={validated} onSubmit={handleSubmit}>
							<Form.Group className="mb-3" controlId="title">
								<Form.Label>Title</Form.Label>
								<Form.Control
									type="text"
									placeholder="Enter task title"
									name="title"
									value={task.title}
									onChange={handleChange}
									required
								/>
								<Form.Control.Feedback type="invalid">
									Please provide a task title.
								</Form.Control.Feedback>
							</Form.Group>

							<Form.Group className="mb-3" controlId="description">
								<Form.Label>Description</Form.Label>
								<Form.Control
									as="textarea"
									rows={3}
									placeholder="Enter task description"
									name="description"
									value={task.description}
									onChange={handleChange}
									required
								/>
								<Form.Control.Feedback type="invalid">
									Please provide a task description.
								</Form.Control.Feedback>
							</Form.Group>

							<Form.Group className="mb-3" controlId="category">
								<Form.Label>Category</Form.Label>
								<Form.Select
									name="category_id"
									value={task.category_id}
									onChange={handleChange}
									required
								>
									<option value="">Select a category</option>
									{category.map((cat) => (
										<option key={cat.id} value={cat.id}>
											{cat.name}
										</option>
									))}
								</Form.Select>
								<Form.Control.Feedback type="invalid">
									Please select a category.
								</Form.Control.Feedback>
							</Form.Group>

							<Form.Group className="mb-3" controlId="due_date">
								<Form.Label>Due Date</Form.Label>
								<div>
									<DatePicker
										selected={task.due_date ? new Date(task.due_date) : null}
										onChange={(date) =>
											setTask((prev) => ({
												...prev,
												due_date: date.toISOString().split("T")[0],
											}))
										}
										className={`form-control ${
											validated && !task.due_date ? "is-invalid" : ""
										}`}
										minDate={new Date()}
										placeholderText="Select a due date"
										dateFormat="yyyy-MM-dd"
									/>
								</div>
								{validated && !task.due_date && (
									<div className="invalid-feedback d-block">
										Please provide a valid due date.
									</div>
								)}
							</Form.Group>

							<div className="text-center">
								<Button type="submit" variant="primary" disabled={loading}>
									{loading ? "Creating..." : "Create Task"}
								</Button>
							</div>
						</Form>
					</Card>
				</Col>
			</Row>
		</Container>
	);
};

export default CreateTask;
