import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { taskActions } from "../../redux/Slices/task"; // Adjust path as needed
import { Dropdown, ButtonGroup } from "react-bootstrap";

const TaskSorting = () => {
	const dispatch = useDispatch();
	const [sortBy, setSortBy] = useState("title");

	const [direction, setDirection] = useState("asc");

	const handleSort = (field) => {
		const newDirection =
			sortBy === field && direction === "asc" ? "desc" : "asc";
		setSortBy(field);
		setDirection(newDirection);

		// Dispatch the action with the selected sort field and direction
		dispatch(taskActions.sortTasks({ field, direction: newDirection }));
	};

	return (
		<Dropdown as={ButtonGroup}>
			<Dropdown.Toggle variant="success" id="dropdown-sort">
				Sort By: {sortBy} ({direction})
			</Dropdown.Toggle>

			<Dropdown.Menu>
				<Dropdown.Item onClick={() => handleSort("title")}>Title</Dropdown.Item>
				<Dropdown.Item onClick={() => handleSort("date")}>Date</Dropdown.Item>
				<Dropdown.Item onClick={() => handleSort("done")}>Status</Dropdown.Item>
			</Dropdown.Menu>
		</Dropdown>
	);
};

export default TaskSorting;
