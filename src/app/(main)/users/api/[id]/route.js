import axiosClient from "@/config/axiosClient";
import { apiConfig } from "@/config/apiConfig";

// UPDATE USER ROLE
export async function PUT(req, { params }) {
    try {
        const { id } = await params;
        const body = await req.json(); // { role: "Editor" }
        const res = await axiosClient.put(`${apiConfig.updateRole}/${id}`, body);
        return new Response(JSON.stringify(res.data), { status: res.status });
    } catch (error) {
        return new Response(
            JSON.stringify({ success: false, message: error.message }),
            { status: 500 }
        );
    }
}