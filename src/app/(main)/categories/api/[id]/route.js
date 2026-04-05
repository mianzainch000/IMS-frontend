import axiosClient from "@/config/axiosClient";
import { apiConfig } from "@/config/apiConfig";

// DELETE CATEGORY
export async function DELETE(req, { params }) {
    try {
        // Next.js 15+ mein params ko await karna parhta hai
        const { id } = await params;

        if (!id || id === "undefined") {
            return new Response(JSON.stringify({ success: false, message: "ID is missing" }), { status: 400 });
        }

        // Backend endpoint: /deleteCategory/:id
        const res = await axiosClient.delete(`${apiConfig.deleteCategory}/${id}`);
        return new Response(JSON.stringify(res.data), { status: res.status });
    } catch (error) {
        return new Response(
            JSON.stringify({ success: false, message: error.response?.data?.message || error.message }),
            { status: error.response?.status || 500 }
        );
    }
}

// UPDATE CATEGORY
export async function PUT(req, { params }) {
    try {
        const { id } = await params;
        const body = await req.json();

        if (!id || id === "undefined") {
            return new Response(JSON.stringify({ success: false, message: "ID is missing" }), { status: 400 });
        }

        // Backend endpoint: /updateCategory/:id
        const res = await axiosClient.put(`${apiConfig.updateCategory}/${id}`, body);
        return new Response(JSON.stringify(res.data), { status: res.status });
    } catch (error) {
        return new Response(
            JSON.stringify({ success: false, message: error.response?.data?.message || error.message }),
            { status: error.response?.status || 500 }
        );
    }
}