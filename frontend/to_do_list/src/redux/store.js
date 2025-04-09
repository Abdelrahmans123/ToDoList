import { configureStore } from "@reduxjs/toolkit";
import { authReducer } from "./Slices/auth";
import { taskReducer } from "./Slices/task";
import { categoryReducer } from "./Slices/category";
const store = configureStore({
	reducer: {
		auth: authReducer,
		task: taskReducer,
		category: categoryReducer,
	},
});
export default store;
