import axiosClient from "@/config/axiosClient";
import { apiConfig } from "@/config/apiConfig";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const filter = searchParams.get("filter") || "all";
  const year = searchParams.get("year");
  const month = searchParams.get("month");

  const search = searchParams.get("q") || searchParams.get("search");

  let backendUrl = `${apiConfig.getReports}?filter=${filter}`;
  if (year) backendUrl += `&year=${year}`;
  if (month) backendUrl += `&month=${month}`;
  if (search) backendUrl += `&search=${encodeURIComponent(search)}`;

  const res = await axiosClient.get(backendUrl);
  return new Response(JSON.stringify(res.data), { status: 200 });
}

export async function POST(request) {
  try {
    const body = await request.json();

    const res = await axiosClient.post(apiConfig.returnSale, body);

    return new Response(JSON.stringify(res.data), { status: 201 });
  } catch (error) {
    return new Response(
      JSON.stringify({
        success: false,
        message: error.response?.data?.message || "Return failed",
      }),
      { status: error.response?.status || 500 },
    );
  }
}
