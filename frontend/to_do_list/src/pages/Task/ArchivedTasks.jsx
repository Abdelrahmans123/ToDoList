// components/ArchivedTasks/ArchivedTasks.jsx
import React, { useEffect } from "react";
import { Container, Row, Col, Card, Button, Spinner } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { getArchivedTasks } from "../../redux/API/task"; 
import TaskCard from "../../components/Task/TaskCard"; 

const ArchivedTasks = () => {
	const dispatch = useDispatch();
	const { loading } = useSelector((state) => state.task);
	const task = useSelector((state) => state.task.task || []);

	useEffect(() => {
		dispatch(getArchivedTasks()); // Fetch archived tasks when the component mounts
	}, [dispatch]);

	if (loading) {
		return (
			<Container
				className="d-flex justify-content-center align-items-center"
				style={{ height: "90vh" }}
			>
				<Spinner animation="border" variant="primary" />
			</Container>
		);
	}

	return (
		<Container className="py-5">
			<Row className="justify-content-center">
				<Col md={8}>
					<h1 className="text-center mb-4">🗂️ Archived Tasks</h1>
					{task.length === 0 ? (
						<p className="text-center text-muted">No archived tasks found.</p>
					) : (
						task.map((task) => <TaskCard task={task} key={task.id} />) // Reuse TaskCard component
					)}
				</Col>
			</Row>
		</Container>
	);
};

export default ArchivedTasks;
