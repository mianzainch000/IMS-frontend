import axiosClient from "@/config/axiosClient";
import { apiConfig } from "@/config/apiConfig";

// GET ALL CATEGORIES
export async function GET() {
    try {
        const res = await axiosClient.get(apiConfig.getExpenseCategory);
        return new Response(JSON.stringify(res.data), { status: res.status });
    } catch (error) {
        return new Response(
            JSON.stringify({ success: false, message: error.message }),
            { status: 500 }
        );
    }
}

// ADD NEW CATEGORY
export async function POST(req) {
    try {
        const body = await req.json();
        const res = await axiosClient.post(apiConfig.addExpenseCategory, body);
        return new Response(JSON.stringify(res.data), { status: res.status });
    } catch (error) {
        return new Response(
            JSON.stringify({ success: false, message: error.message }),
            { status: 500 }
        );
    }
}