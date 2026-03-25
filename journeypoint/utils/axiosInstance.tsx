import axios from "axios";

export const getAxiosInstace = () =>
    axios.create({
        baseURL: `${process.env.NEXT_PUBLIC_API_BASE_URL}/api`,
        headers: {
            "Content-Type": "application/json",
        },
    });