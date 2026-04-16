import axiosClient from "@/config/axiosClient";
import { apiConfig } from "@/config/apiConfig";

export async function GET() {
  try {
    const res = await axiosClient.get(apiConfig.getProduct);
    return new Response(JSON.stringify(res.data), { status: res.status });
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, message: error.message }),
      { status: 500 },
    );
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    const res = await axiosClient.post(apiConfig.addProduct, body);
    return new Response(JSON.stringify(res.data), { status: res.status });
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, message: error.message }),
      { status: 500 },
    );
  }
}
