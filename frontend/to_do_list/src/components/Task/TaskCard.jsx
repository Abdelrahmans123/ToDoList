import React, { useCallback } from "react";
import { Badge, Button, Card, Col, Row } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router";
import { toast } from "react-toastify";
import {
	ArchiveIcon,
	Check,
	ClipboardPenLine,
	Clock,
	RefreshCw,
	Trash2,
	X,
} from "lucide-react";
import {
	archiveTask,
	deleteTask,
	getArchivedTasks,
	getTasks,
	restoreTask,
	updateTask,
} from "../../redux/API/task";

const STATUS_ICONS = {
	completed: <Check className="text-success" size={14} />,
	pending: <Clock className="text-danger me-1" size={14} />,
};
const STATUS_BUTTONS = {
	completed: <Check size={18} />,
	pending: <X />,
};
const CATEGORY_COLORS = {
	Urgent: "danger",
	default: "info",
};

const TaskCard = React.memo(({ task }) => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const isArchivedPage = window.location.pathname === "/archived-tasks";
	const categoryColor =
		CATEGORY_COLORS[task.category.name] || CATEGORY_COLORS.default;

	// Handlers
	const handleTaskAction = useCallback(
		async (action, successMessage) => {
			try {
				await dispatch(action(task.id));
				if (isArchivedPage) {
					await dispatch(getArchivedTasks());
					if (action === restoreTask) {
						navigate("/");
					}
				} else {
					await dispatch(getTasks());
				}
				if (successMessage) {
					toast.success(successMessage);
				}
			} catch (error) {
				toast.error("Operation failed" + error);
			}
		},
		[dispatch, task.id, isArchivedPage, navigate]
	);

	const handleToggleStatus = useCallback(async () => {
		const updatedTask = {
			id: task.id,
			title: task.title,
			description: task.description,
			status: task.status === "pending" ? "completed" : "pending",
			due_date: task.due_date,
			category_id: task.category.id,
			user_id: task.user.id,
		};
		await dispatch(updateTask(task.id, updatedTask));
		await dispatch(getTasks());
		toast.success("Task status updated successfully!");
	}, [dispatch, task]);

	// Render helpers
	const renderActionButtons = () => {
		if (isArchivedPage) {
			return (
				<Button
					variant="outline-info"
					size="sm"
					title="Restore Task"
					onClick={() =>
						handleTaskAction(restoreTask, "Task restored successfully!")
					}
				>
					<RefreshCw size={18} />
				</Button>
			);
		}

		return (
			<>
				<Button
					variant="outline-warning"
					size="sm"
					title="Archive Task"
					onClick={() =>
						handleTaskAction(archiveTask, "Task archived successfully!")
					}
				>
					<ArchiveIcon size={18} />
				</Button>
				<Button
					variant="outline-danger"
					size="sm"
					title="Delete Task"
					onClick={() =>
						handleTaskAction(deleteTask, "Task deleted successfully!")
					}
				>
					<Trash2 size={18} />
				</Button>
			</>
		);
	};

	const renderDueDate = () => {
		if (!task.due_date) return null;

		return (
			<Badge bg="secondary" className="m-2">
				{new Date(task.due_date).toLocaleDateString("en-GB", {
					day: "2-digit",
					month: "2-digit",
					year: "2-digit",
				})}
			</Badge>
		);
	};

	return (
		<Card
			className={`mb-3 shadow-sm ${
				task.status === "completed" ? "border-2 border-success bg-light" : ""
			}`}
		>
			<Card.Body>
				<Row className="align-items-center">
					<Col>
						<Card.Title className="mb-1">
							{STATUS_ICONS[task.status]}
							{task.title}{" "}
							<Badge bg={categoryColor} className="ms-2">
								{task.category.name}
							</Badge>
						</Card.Title>
						<Card.Text className="mb-0 text-secondary">
							{task.description}
						</Card.Text>
					</Col>
					<Col xs="auto" className="d-flex gap-2">
						<Button variant="outline-primary" size="sm" title="Edit Task">
							<Link
								to={`/edit-task/${task.id}`}
								className="text-decoration-none"
								style={{ color: "inherit" }}
							>
								<ClipboardPenLine size={18} />
							</Link>
						</Button>
						<Button
							variant={
								task.status === "completed"
									? "outline-secondary"
									: "outline-success"
							}
							size="sm"
							title={
								task.status === "completed"
									? "Mark as pending"
									: "Mark as completed"
							}
							onClick={handleToggleStatus}
						>
							{task.status === "completed"
								? STATUS_BUTTONS.pending
								: STATUS_BUTTONS.completed}
						</Button>
						{renderActionButtons()}
						{renderDueDate()}
					</Col>
				</Row>
			</Card.Body>
		</Card>
	);
});

export default TaskCard;
