import { createSlice } from "@reduxjs/toolkit";

const taskSlice = createSlice({
	name: "task",
	initialState: {
		task: [],
		loading: false,
		restoreMsg: "",
		deleteMsg: "",
		archivedMsg: "",
		filteredTasks: [],
		filterStatus: "all",
		meta: {
			current_page: 1,
			last_page: 1,
			per_page: 5,
			total: 0,
		},
	},
	reducers: {
		setTasks: (state, action) => {
			state.task = action.payload.tasks;
			state.filteredTasks = action.payload.tasks; // initial filtered is all
			state.meta = action.payload.meta;
			state.loading = false;
		},
		createTask: (state, action) => {
			const { task } = action.payload;
			state.task = task;
		},
		updateTask: (state, action) => {
			const updatedTask = action.payload.task;
			state.task = state.task.map((t) =>
				t.id === updatedTask.id ? updatedTask : t
			);
		},
		searchTasks: (state, action) => {
			const searchQuery = action.payload.toLowerCase();

			// Always filter based on search query first
			const searchedTasks = state.task.filter(
				(task) =>
					task.title.toLowerCase().includes(searchQuery) ||
					task.description.toLowerCase().includes(searchQuery)
			);

			// Then apply the status filter if it's not "all"
			if (state.filterStatus === "all") {
				state.filteredTasks = searchedTasks;
			} else {
				state.filteredTasks = searchedTasks.filter(
					(task) => task.status === state.filterStatus
				);
			}
		},
		archiveTask: (state, action) => {
			state.archivedMsg = action.payload;
		},
		setTaskLoading: (state, action) => {
			state.loading = action.payload;
		},
		setRestoreMsg: (state, action) => {
			state.restoreMsg = action.payload;
		},
		deleteTask: (state, action) => {
			state.deleteMsg = action.payload;
		},
		sortTasks: (state, action) => {
			const { field, direction } = action.payload;
			if (state.filteredTasks.length > 0) {
				state.filteredTasks = [...state.filteredTasks].sort((a, b) => {
					let result = 0;

					// Sorting by title (string comparison)
					if (field === "title") {
						result = a.title.localeCompare(b.title);
					}
					// Sorting by date (timestamp comparison)
					else if (field === "date") {
						result = new Date(a.created_at) - new Date(b.created_at);
					}
					// Sorting by status (pending/completed)
					else if (field === "done") {
						if (a.status === "completed" && b.status !== "completed") {
							result = 1;
						} else if (a.status !== "completed" && b.status === "completed") {
							result = -1;
						}
					}

					// Reverse the result based on the direction (asc/desc)
					return direction === "desc" ? -result : result;
				});
			}
			const sortedTasks = [...state.task].sort((a, b) => {
				let result = 0;

				// Sorting by title (string comparison)
				if (field === "title") {
					result = a.title.localeCompare(b.title);
				}
				// Sorting by date (timestamp comparison)
				else if (field === "date") {
					result = new Date(a.created_at) - new Date(b.created_at);
				}
				// Sorting by status (pending/completed)
				else if (field === "done") {
					if (a.status === "completed" && b.status !== "completed") {
						result = 1;
					} else if (a.status !== "completed" && b.status === "completed") {
						result = -1;
					}
				}

				// Reverse the result based on the direction (asc/desc)
				return direction === "desc" ? -result : result;
			});

			state.task = sortedTasks;
		},

		filterTasks: (state, action) => {
			const filterStatus = action.payload;
			state.filterStatus = filterStatus;

			if (filterStatus === "all") {
				state.filteredTasks = state.task; // Show all tasks when filter is "all"
			} else {
				state.filteredTasks = state.task.filter(
					(task) => task.status === filterStatus
				); // Filter tasks based on the selected status
			}
		},
	},
});
const taskReducer = taskSlice.reducer;
const taskActions = taskSlice.actions;
export { taskReducer, taskActions };
