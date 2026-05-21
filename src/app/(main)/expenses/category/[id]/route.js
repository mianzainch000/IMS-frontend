import axiosClient from "@/config/axiosClient";
import { apiConfig } from "@/config/apiConfig";

// UPDATE CATEGORY
export async function PUT(req, { params }) {
    try {
        const { id } = await params;
        const body = await req.json();
        const res = await axiosClient.put(`${apiConfig.updateExpenseCategory}/${id}`, body);
        return new Response(JSON.stringify(res.data), { status: res.status });
    } catch (error) {
        return new Response(
            JSON.stringify({ success: false, message: error.message }),
            { status: 500 }
        );
    }
}

// DELETE CATEGORY
export async function DELETE(req, { params }) {
    try {
        const { id } = await params;
        const res = await axiosClient.delete(`${apiConfig.deleteExpenseCategory}/${id}`);
        return new Response(JSON.stringify(res.data), { status: res.status });
    } catch (error) {
        return new Response(
            JSON.stringify({ success: false, message: error.message }),
            { status: 500 }
        );
    }
}