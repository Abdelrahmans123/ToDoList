import React, { useEffect, useState } from "react";
import {
	Button,
	Container,
	Form,
	Row,
	Col,
	Card,
	Spinner,
} from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router";
import { getTasks, updateTask } from "../../redux/API/task";
import { getCategories } from "../../redux/API/category";
import { toast } from "react-toastify";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "../CreateTask/createTask.css";

const EditTask = () => {
	const { id } = useParams();
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const [formErrors, setFormErrors] = useState({});

	const tasks = useSelector((state) => state.task.task);
	const validateForm = () => {
		const errors = {};

		if (!formData.title.trim()) {
			errors.title = "Title is required";
		}

		if (!formData.description.trim()) {
			errors.description = "Description is required";
		}

		if (!formData.category_id) {
			errors.category_id = "Category is required";
		}

		if (!formData.due_date) {
			errors.due_date = "Due date is required";
		}

		setFormErrors(errors);
		return Object.keys(errors).length === 0;
	};

	console.log("🚀 ~ EditTask ~ task:", tasks);
	const { category, loading: categoryLoading } = useSelector(
		(state) => state.category
	);

	const [formData, setFormData] = useState({
		title: "",
		description: "",
		category_id: null,
		user_id: JSON.parse(localStorage.getItem("user")).data.user.id,
		due_date: "",
	});
	console.log("🚀 ~ EditTask ~ formData:", formData);

	useEffect(() => {
		dispatch(getTasks());
		dispatch(getCategories());
	}, [dispatch]);

	useEffect(() => {
		const found = tasks?.find((t) => t.id === Number(id));

		console.log("🚀 ~ useEffect ~ found:", found);
		if (found) {
			setFormData({
				title: found.title || "",
				description: found.description || "",
				due_date: found.due_date || "",
				category_id: found.category?.id || null,
				user_id:
					found.user?.id ||
					JSON.parse(localStorage.getItem("user")).data.user.id,
			});
		}
	}, [tasks, id]);

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: name === "category_id" ? Number(value) : value,
		}));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!validateForm()) {
			toast.error("Please fix the form errors.");
			return;
		}
		await dispatch(updateTask(id, formData)); // or updateTask({ id, ...formData }) depending on your API
		navigate("/");
		toast.success("Task updated successfully!");
	};

	if (!formData || categoryLoading) {
		return (
			<Container
				className="d-flex justify-content-center align-items-center"
				style={{ height: "100vh" }}
			>
				<Spinner animation="border" />
			</Container>
		);
	}

	return (
		<Container className="py-5">
			<Row className="justify-content-center">
				<Col md={8}>
					<Card className="shadow p-4">
						<h2 className="text-center mb-4">✏️ Edit Task</h2>
						<Form onSubmit={handleSubmit}>
							<Form.Group className="mb-3">
								<Form.Label>Title</Form.Label>
								<Form.Control
									type="text"
									name="title"
									value={formData.title}
									onChange={handleChange}
									isInvalid={!!formErrors.title}
								/>
								<Form.Control.Feedback type="invalid">
									{formErrors.title}
								</Form.Control.Feedback>
							</Form.Group>

							<Form.Group className="mb-3">
								<Form.Label>Description</Form.Label>
								<Form.Control
									as="textarea"
									rows={3}
									name="description"
									value={formData.description}
									onChange={handleChange}
									isInvalid={!!formErrors.description}
								/>
								<Form.Control.Feedback type="invalid">
									{formErrors.description}
								</Form.Control.Feedback>
							</Form.Group>

							<Form.Group className="mb-3">
								<Form.Label>Category</Form.Label>
								<Form.Select
									name="category_id"
									value={formData.category_id}
									onChange={handleChange}
									isInvalid={!!formErrors.category_id}
								>
									<option value="">-- Select Category --</option>
									{category.map((cat) => (
										<option key={cat.id} value={cat.id}>
											{cat.name}
										</option>
									))}
								</Form.Select>
								<Form.Control.Feedback type="invalid">
									{formErrors.category_id}
								</Form.Control.Feedback>
							</Form.Group>

							<Form.Group className="mb-3">
								<Form.Label>Due Date</Form.Label>
								<div>
									<DatePicker
										selected={
											formData.due_date ? new Date(formData.due_date) : null
										}
										onChange={(date) =>
											setFormData((prev) => ({
												...prev,
												due_date: date.toISOString().split("T")[0], // store as YYYY-MM-DD
											}))
										}
										className={`form-control ${
											formErrors.due_date ? "is-invalid" : ""
										}`}
										minDate={new Date()}
										placeholderText="Select a due date"
										dateFormat="yyyy-MM-dd"
									/>
								</div>
								{formErrors.due_date && (
									<div className="invalid-feedback d-block">
										{formErrors.due_date}
									</div>
								)}
							</Form.Group>

							<div className="text-center">
								<Button type="submit" variant="success">
									Save Changes
								</Button>
							</div>
						</Form>
					</Card>
				</Col>
			</Row>
		</Container>
	);
};

export default EditTask;
