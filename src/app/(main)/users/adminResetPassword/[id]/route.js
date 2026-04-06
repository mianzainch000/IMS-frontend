import axiosClient from "@/config/axiosClient";
import { apiConfig } from "@/config/apiConfig";

// ADMIN RESET USER PASSWORD
export async function PUT(req, { params }) {
    try {
        const { id } = await params;
        const body = await req.json(); // { newPassword: "..." }

        // Backend call: /adminResetPassword/:id
        const res = await axiosClient.put(`${apiConfig.adminResetPassword}/${id}`, body);

        return new Response(JSON.stringify(res.data), { status: res.status });
    } catch (error) {
        return new Response(
            JSON.stringify({ success: false, message: error.message }),
            { status: 500 }
        );
    }
}