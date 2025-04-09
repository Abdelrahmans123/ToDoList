import React, { lazy, Suspense, useEffect, useMemo, useCallback } from "react";
import { Button, Container, Row, Col, Spinner } from "react-bootstrap";
import { CirclePlus } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router";
import { getTasks } from "../../redux/API/task";

// Lazy-loaded components
const TaskCard = lazy(() => import("../../components/Task/TaskCard"));
const TaskSearch = lazy(() => import("../../components/Task/TaskSearch"));
const TaskSorting = lazy(() => import("../../components/Task/TaskSort"));
const TaskFilter = lazy(() => import("../../components/Task/TaskFilter"));

// Constants and reusable components
const centeredStyle = {
	textAlign: "center",
	display: "flex",
	justifyContent: "center",
	alignItems: "center",
	height: "90vh",
};

const SuspenseFallback = () => (
	<div className="text-center my-3">
		<Spinner animation="border" size="sm" />
	</div>
);

const MemoizedTaskCard = React.memo(TaskCard);

const Home = () => {
	const dispatch = useDispatch();

	// Selectors
	const {
		meta = { current_page: 1, last_page: 1 },
		loading: taskLoading,
		filterStatus = "all",
	} = useSelector((state) => state.task || {});

	const task = useSelector((state) => state.task.task || []);
	const filteredTasks = useSelector((state) => state.task.filteredTasks || []);

	// Effects
	useEffect(() => {
		dispatch(getTasks());
	}, [dispatch]);

	// Memoized values
	const tasksToDisplay = useMemo(() => {
		return filterStatus === "all" && filteredTasks.length === 0
			? task
			: filteredTasks;
	}, [filterStatus, task, filteredTasks]);
	console.log("🚀 ~ tasksToDisplay ~ tasksToDisplay:", filteredTasks);

	// Handlers
	const handlePageChange = useCallback(
		(page) => {
			if (meta.current_page !== page) {
				dispatch(getTasks(page));
			}
		},
		[dispatch, meta.current_page]
	);

	// Render helpers
	const renderPagination = () => {
		if (tasksToDisplay.length === 0) return null;

		return (
			<div className="d-flex justify-content-center mt-4">
				{Array.from({ length: meta.last_page }, (_, index) => (
					<Button
						key={index + 1}
						variant={
							meta.current_page === index + 1 ? "primary" : "outline-primary"
						}
						className="mx-1"
						onClick={() => handlePageChange(index + 1)}
					>
						{index + 1}
					</Button>
				))}
			</div>
		);
	};

	const renderTaskList = () => {
		if (
			tasksToDisplay.length === 0 ||
			filteredTasks.length === 0 ||
			task.message
		) {
			return (
				<p className="text-center text-muted">
					No tasks yet. Start by adding one!
				</p>
			);
		}

		return tasksToDisplay.map((taskItem) => (
			<Suspense key={`suspense-${taskItem.id}`} fallback={<SuspenseFallback />}>
				<MemoizedTaskCard task={taskItem} />
			</Suspense>
		));
	};

	if (taskLoading) {
		return (
			<Container style={centeredStyle}>
				<Spinner animation="border" variant="primary" />
			</Container>
		);
	}

	return (
		<Container className="py-5">
			<Row className="justify-content-center">
				<Col md={8}>
					<h1 className="text-center mb-4">📝 To-Do List</h1>

					{/* Search component */}
					<Suspense fallback={<SuspenseFallback />}>
						<TaskSearch />
					</Suspense>

					{/* Button to add new task */}
					<Button variant="primary" className="m-2" as={Link} to="/create-task">
						<CirclePlus size={24} className="me-2" />
						Add Task
					</Button>

					{/* Sorting component */}
					<Suspense fallback={<SuspenseFallback />}>
						<TaskSorting />
					</Suspense>

					{/* Filter component */}
					<Suspense fallback={<SuspenseFallback />}>
						<TaskFilter />
					</Suspense>

					{/* Task list */}
					{renderTaskList()}

					{/* Pagination */}
					{renderPagination()}
				</Col>
			</Row>
		</Container>
	);
};

export default Home;
