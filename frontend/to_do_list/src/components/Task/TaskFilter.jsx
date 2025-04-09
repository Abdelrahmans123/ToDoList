import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { taskActions } from "../../redux/Slices/task"; // Adjust the path
import { ButtonGroup, Button } from "react-bootstrap";

const TaskFilter = () => {
	const dispatch = useDispatch();
	const [filter, setFilter] = useState("all"); // Default filter is 'all'

	const handleFilterChange = (status) => {
		setFilter(status);
		dispatch(taskActions.filterTasks(status)); // Dispatch filter action
	};

	return (
		<ButtonGroup className="mx-3">
			<Button
				variant={filter === "all" ? "primary" : "outline-primary"}
				onClick={() => handleFilterChange("all")}
			>
				All
			</Button>
			<Button
				variant={filter === "pending" ? "primary" : "outline-primary"}
				onClick={() => handleFilterChange("pending")}
			>
				Pending
			</Button>
			<Button
				variant={filter === "completed" ? "primary" : "outline-primary"}
				onClick={() => handleFilterChange("completed")}
			>
				Completed
			</Button>
		</ButtonGroup>
	);
};

export default TaskFilter;
