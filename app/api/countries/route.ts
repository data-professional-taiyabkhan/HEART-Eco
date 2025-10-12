import { NextResponse } from "next/server";
import { parseExcelData } from "@/lib/parseExcel";

export async function GET() {
  try {
    const countries = parseExcelData();
    return NextResponse.json(countries);
  } catch (error) {
    console.error("Error fetching countries:", error);
    return NextResponse.json(
      { error: "Failed to load country data" },
      { status: 500 }
    );
  }
}

