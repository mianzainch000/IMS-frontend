import axiosClient from "@/config/axiosClient";
import { apiConfig } from "@/config/apiConfig";

// GET ALL USERS (Only Admin should hit this)
export async function GET() {
    try {
        const res = await axiosClient.get(apiConfig.allUsers);
        return new Response(JSON.stringify(res.data), { status: res.status });
    } catch (error) {
        return new Response(
            JSON.stringify({ success: false, message: error.message }),
            { status: 500 }
        );
    }
}