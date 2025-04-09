import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { taskActions } from "../../redux/Slices/task"; // Adjust the path
import { InputGroup, FormControl, Button } from "react-bootstrap";

const TaskSearch = () => {
	const dispatch = useDispatch();
	const [searchQuery, setSearchQuery] = useState("");

	const handleSearchChange = (e) => {
		setSearchQuery(e.target.value);
		// Dispatch action to filter tasks (you can optimize later by debouncing)
		dispatch(taskActions.searchTasks(e.target.value));
	};

	return (
		<InputGroup className="mb-3">
			<FormControl
				placeholder="Search tasks by title or description"
				value={searchQuery}
				onChange={handleSearchChange}
			/>
		</InputGroup>
	);
};

export default TaskSearch;
