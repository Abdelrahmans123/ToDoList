import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
	name: "auth",
	initialState: {
		user: localStorage.getItem("user")
			? JSON.parse(localStorage.getItem("user"))
			: null,
		registerMsg: null,
	},
	reducers: {
		setCredentials: (state, action) => {
			const { user } = action.payload;
			state.user = user;
		},
		logout: (state) => {
			state.user = null;
		},
		setRegisterMsg: (state, action) => {
			state.registerMsg = action.payload;
		},
		setName: (state, action) => {
			state.user.data.user.name = action.payload;
		},
	},
});
const authReducer = authSlice.reducer;
const authActions = authSlice.actions;
export { authReducer, authActions };
