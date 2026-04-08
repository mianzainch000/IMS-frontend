import axiosClient from "@/config/axiosClient";
import { apiConfig } from "@/config/apiConfig";

export async function GET() {
    try {
        const res = await axiosClient.get(apiConfig.getReports);
        return new Response(JSON.stringify(res.data), { status: res.status });
    } catch (error) {
        return new Response(
            JSON.stringify({ success: false, message: error.message }),
            { status: 500 },
        );
    }
}