import axiosClient from "@/config/axiosClient";
import { apiConfig } from "@/config/apiConfig";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);

    const filter = searchParams.get("filter") || "all";
    const year = searchParams.get("year");
    const month = searchParams.get("month");

    let backendUrl = `${apiConfig.getReports}?filter=${filter}`;

    if (year) backendUrl += `&year=${year}`;
    if (month) backendUrl += `&month=${month}`;

    const res = await axiosClient.get(backendUrl);

    return new Response(JSON.stringify(res.data), {
      status: res.status,
    });
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
