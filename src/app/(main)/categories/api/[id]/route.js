import axiosClient from "@/config/axiosClient";
import { apiConfig } from "@/config/apiConfig";

export async function DELETE(req, { params }) {
  try {
    const { id } = await params;

    if (!id || id === "undefined") {
      return new Response(
        JSON.stringify({ success: false, message: "ID is missing" }),
        { status: 400 },
      );
    }

    const res = await axiosClient.delete(`${apiConfig.deleteCategory}/${id}`);
    return new Response(JSON.stringify(res.data), { status: res.status });
  } catch (error) {
    return new Response(
      JSON.stringify({
        success: false,
        message: error.response?.data?.message || error.message,
      }),
      { status: error.response?.status || 500 },
    );
  }
}

export async function PUT(req, { params }) {
  try {
    const { id } = await params;
    const body = await req.json();

    if (!id || id === "undefined") {
      return new Response(
        JSON.stringify({ success: false, message: "ID is missing" }),
        { status: 400 },
      );
    }

    const res = await axiosClient.put(
      `${apiConfig.updateCategory}/${id}`,
      body,
    );
    return new Response(JSON.stringify(res.data), { status: res.status });
  } catch (error) {
    return new Response(
      JSON.stringify({
        success: false,
        message: error.response?.data?.message || error.message,
      }),
      { status: error.response?.status || 500 },
    );
  }
}
