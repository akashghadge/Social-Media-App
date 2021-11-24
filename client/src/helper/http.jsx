import { AddComment } from "@material-ui/icons";
import axios from "axios";

export default {
    baseURL: "/",
    async getAllUsers() {
        const { data } = await axios.get(this.baseURL + "api/user/all-users-homepage");
        return data;
    },
    async getAllPosts() {
        const { data } = await axios.get(this.baseURL + "api/post/all");
        return data;
    },
    async AddLike(body) {
        return axios.post(this.baseURL + "api/post/like/add", body)
    },
    async RemoveLike(body) {
        return axios.post(this.baseURL + "api/post/like/remove", body);
    },
    async getComments(body) {
        const { data } = await axios.post(this.baseURL + "api/post/comment", body);
        return data.comments;
    },
    async AddComment(body) {
        return axios.post(this.baseURL + "api/post/comment/add", body);
    },
    async RemoveComment(body) {
        return axios.post(this.baseURL + "api/post/comment/remove", body);
    }
}