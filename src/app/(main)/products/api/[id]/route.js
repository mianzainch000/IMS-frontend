import axiosClient from "@/config/axiosClient";
import { apiConfig } from "@/config/apiConfig";

export async function DELETE(req, { params }) {
  try {
    const { id } = await params;
    const res = await axiosClient.delete(`${apiConfig.deleteProduct}/${id}`);
    return new Response(JSON.stringify(res.data), { status: res.status });
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, message: error.message }),
      { status: 500 },
    );
  }
}

export async function PUT(req, { params }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const res = await axiosClient.put(`${apiConfig.updateProduct}/${id}`, body);
    return new Response(JSON.stringify(res.data), { status: res.status });
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, message: error.message }),
      { status: 500 },
    );
  }
}
