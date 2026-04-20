import axiosClient from "@/config/axiosClient";
import { apiConfig } from "@/config/apiConfig";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const sku = searchParams.get("sku");

    const res = await axiosClient.get(`${apiConfig.scanProduct}/${sku}`);
    return new Response(JSON.stringify(res.data), { status: 200 });
  } catch (error) {
    return new Response(
      JSON.stringify({
        success: false,
        message: error.response?.data?.message || "Product not found",
      }),
      { status: error.response?.status || 500 },
    );
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    const res = await axiosClient.post(apiConfig.checkout, body);
    return new Response(JSON.stringify(res.data), { status: 200 });
  } catch (error) {
    return new Response(
      JSON.stringify({
        success: false,
        message: error.response?.data?.message || "Checkout failed",
      }),
      { status: error.response?.status || 500 },
    );
  }
}
