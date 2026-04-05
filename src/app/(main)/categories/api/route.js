import axiosClient from "@/config/axiosClient";
import { apiConfig } from "@/config/apiConfig";

// GET ALL CATEGORIES
export async function GET() {
    try {
        const res = await axiosClient.get(apiConfig.getCategory);
        return new Response(JSON.stringify(res.data), { status: res.status });
    } catch (error) {
        return new Response(
            JSON.stringify({
                success: false,
                message: error.response?.data?.message || error.message
            }),
            { status: error.response?.status || 500 }
        );
    }
}

// ADD NEW CATEGORY
export async function POST(req) {
    try {
        const body = await req.json();
        const res = await axiosClient.post(apiConfig.addCategory, body);
        return new Response(JSON.stringify(res.data), { status: res.status });
    } catch (error) {
        return new Response(
            JSON.stringify({
                success: false,
                message: error.response?.data?.message || error.message
            }),
            { status: error.response?.status || 500 }
        );
    }
}