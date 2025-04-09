import request from "../../utils/request";
import { toast } from "react-toastify";
import { categoryActions } from "../Slices/category";

export function getCategories() {
	return async (dispatch) => {
		try {
			dispatch(categoryActions.setCategoryLoading(true));
			const { data } = await request.get("/categories", {
				headers: {
					Authorization: `Bearer ${localStorage.getItem("token")}`,
				},
			});
			if (data.status === "success") {
				dispatch(categoryActions.setCategory(data.data.categories));
				localStorage.setItem("category", JSON.stringify(data.data.categories));
			}
		} catch (error) {
			toast.error(error.response.data.message);
			console.log(error);
		}
	};
}
