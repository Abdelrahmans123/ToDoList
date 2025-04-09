import request from "../../utils/request";
import { toast } from "react-toastify";
import { taskActions } from "../Slices/task";

export function getTasks(page = 1) {
	return async (dispatch) => {
		try {
			dispatch(taskActions.setTaskLoading(true)); // Start loading state

			const response = await request.get("/tasks?page=" + page, {
				headers: {
					Authorization: `Bearer ${localStorage.getItem("token")}`,
				},
			});
			const { tasks, meta } = response.data.data;

			if (response.data.status === "success") {
				// Fallback to empty array if no tasks
				dispatch(
					taskActions.setTasks({
						tasks,
						meta,
					})
				); // Set tasks in state
				dispatch(taskActions.setTaskLoading(false)); // Stop loading state

				// Optionally store in localStorage for offline use
				localStorage.setItem("task", JSON.stringify(tasks));
			} else if (response.data.status === "fail") {
				toast.error(response.data.message);
				dispatch(taskActions.setTaskLoading(false));
			} else {
				// Handle case where status is not "success"
				toast.warning("No tasks available.");
				dispatch(taskActions.setTask([])); // Clear tasks if none available
				dispatch(taskActions.setTaskLoading(false));
			}
		} catch (error) {
			dispatch(taskActions.setTaskLoading(false));
			if (error.response && error.response.data) {
				toast.error(error.response.data.message);
			} else {
				toast.error("An unexpected error occurred.");
			}
			console.error("Error fetching tasks:", error);
		}
	};
}

export function createTask(task) {
	console.log("🚀 ~ createTask ~ task:", task);
	return async (dispatch) => {
		try {
			dispatch(taskActions.setTaskLoading(true));

			const { data } = await request.post("/tasks", task, {
				headers: {
					Authorization: `Bearer ${localStorage.getItem("token")}`,
				},
			});
			if (data.status === "success") {
				dispatch(taskActions.createTask({ task: data.data.task }));
				dispatch(taskActions.setTaskLoading(false));
				toast.success(data.message);
			} else if (data.status === "fail") {
				toast.error(data.message);
				dispatch(taskActions.setTaskLoading(false));
			}
		} catch (error) {
			dispatch(taskActions.setTaskLoading(false));
			if (error.response && error.response.data) {
				toast.error(error.response.data.message);
			} else {
				toast.error("An unexpected error occurred.");
			}
			console.error("Error fetching tasks:", error);
		}
	};
}
export function updateTask(id, task) {
	return async (dispatch) => {
		try {
			dispatch(taskActions.setTaskLoading(true));
			const { data } = await request.put(`/tasks/${id}`, task, {
				headers: {
					Authorization: `Bearer ${localStorage.getItem("token")}`,
				},
			});
			if (data.status === "success") {
				dispatch(taskActions.updateTask({ task: data.data.task }));
				dispatch(taskActions.setTaskLoading(false));
				toast.success(data.message);
			} else if (data.status === "fail") {
				toast.error(data.message);
				dispatch(taskActions.setTaskLoading(false));
			}
		} catch (error) {
			dispatch(taskActions.setTaskLoading(false));
			if (error.response && error.response.data) {
				toast.error(error.response.data.message);
			} else {
				toast.error("An unexpected error occurred.");
			}
			console.error("Error fetching tasks:", error);
		}
	};
}
export function archiveTask(id) {
	return async (dispatch) => {
		try {
			dispatch(taskActions.setTaskLoading(true));

			const { data } = await request.delete(`/tasks/${id}/archive`, {
				headers: {
					Authorization: `Bearer ${localStorage.getItem("token")}`,
				},
			});
			if (data.status === "success") {
				dispatch(taskActions.archiveTask(data.data.task));
				dispatch(taskActions.setTaskLoading(false));
				toast.success(data.message);
			} else if (data.status === "fail") {
				toast.error(data.message);
				dispatch(taskActions.setTaskLoading(false));
			}
		} catch (error) {
			dispatch(taskActions.setTaskLoading(false));
			if (error.response && error.response.data) {
				toast.error(error.response.data.message);
			} else {
				toast.error("An unexpected error occurred.");
			}
			console.error("Error fetching tasks:", error);
		}
	};
}
// actions/taskActions.js
export function getArchivedTasks() {
	return async (dispatch) => {
		try {
			dispatch(taskActions.setTaskLoading(true)); // consistent with previous naming

			const { data } = await request.get("/tasks/trashed", {
				headers: {
					Authorization: `Bearer ${localStorage.getItem("token")}`,
				},
			});

			if (data.status === "success") {
				const archivedTasks = data.data.trashed_tasks || [];
				console.log("🚀 ~ return ~ archivedTasks:", archivedTasks);

				dispatch(
					taskActions.setTasks({
						tasks: archivedTasks,
						meta: {
							current_page: 1,
							last_page: 1,
							per_page: archivedTasks.length,
							total: archivedTasks.length,
						},
					})
				);
				dispatch(taskActions.setTaskLoading(false));
			} else if (data.status === "fail") {
				toast.error(data.message);
				dispatch(taskActions.setTaskLoading(false));
			} else {
				toast.warning("No archived tasks available.");
				dispatch(
					taskActions.setTasks({
						tasks: [],
						meta: { current_page: 1, last_page: 1, per_page: 0, total: 0 },
					})
				);
				dispatch(taskActions.setTaskLoading(false));
			}
		} catch (error) {
			dispatch(taskActions.setTaskLoading(false));
			if (error.response && error.response.data) {
				toast.error(error.response.data.message);
			} else {
				toast.error("An unexpected error occurred.");
			}
			console.error("Error fetching tasks:", error);
		}
	};
}

export function restoreTask(id) {
	return async (dispatch) => {
		try {
			dispatch(taskActions.setTaskLoading(true));

			const { data } = await request.get(`/tasks/${id}/restore`, {
				headers: {
					Authorization: `Bearer ${localStorage.getItem("token")}`,
				},
			});
			if (data.status === "success") {
				dispatch(taskActions.setRestoreMsg(data.message));
				dispatch(getTasks());
				dispatch(taskActions.setTaskLoading(false));
				toast.success(data.message);
			} else if (data.status === "fail") {
				toast.error(data.message);
				dispatch(taskActions.setTaskLoading(false));
			}
		} catch (error) {
			dispatch(taskActions.setTaskLoading(false));
			if (error.response && error.response.data) {
				toast.error(error.response.data.message);
			} else {
				toast.error("An unexpected error occurred.");
			}
			console.error("Error fetching tasks:", error);
		}
	};
}
export function deleteTask(id) {
	return async (dispatch) => {
		try {
			dispatch(taskActions.setTaskLoading(true));

			const { data } = await request.delete(`/tasks/${id}`, {
				headers: {
					Authorization: `Bearer ${localStorage.getItem("token")}`,
				},
			});
			if (data.status === "success") {
				dispatch(taskActions.deleteTask(data.data.message));
				dispatch(taskActions.setTaskLoading(false));
				toast.success(data.message);
			} else if (data.status === "fail") {
				toast.error(data.message);
				dispatch(taskActions.setTaskLoading(false));
			}
		} catch (error) {
			dispatch(taskActions.setTaskLoading(false));
			if (error.response && error.response.data) {
				toast.error(error.response.data.message);
			} else {
				toast.error("An unexpected error occurred.");
			}
			console.error("Error fetching tasks:", error);
		}
	};
}
