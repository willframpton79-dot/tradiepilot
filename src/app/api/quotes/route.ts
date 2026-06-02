import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Quote } from "@/models/Quote";

// GET /api/quotes — list all quotes
export async function GET() {
  try {
    await connectDB();
    const quotes = await Quote.find({}).sort({ daysSince: -1 }).lean();
    return NextResponse.json(quotes);
  } catch (error) {
    console.error("GET /api/quotes error:", error);
    return NextResponse.json({ error: "Failed to fetch quotes" }, { status: 500 });
  }
}

// PATCH /api/quotes — update quote status (for follow-up tracking)
export async function PATCH(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();
    const { quoteId, status, followups } = body;

    if (!quoteId) {
      return NextResponse.json({ error: "quoteId is required" }, { status: 400 });
    }

    const updateData: any = {};
    if (status) updateData.status = status;
    if (typeof followups === "number") updateData.followups = followups;

    const updated = await Quote.findOneAndUpdate(
      { quoteId },
      { $set: updateData },
      { new: true }
    ).lean();

    if (!updated) {
      return NextResponse.json({ error: "Quote not found" }, { status: 404 });
    }

    return NextResponse.json(updated);
  } catch (error) {
    console.error("PATCH /api/quotes error:", error);
    return NextResponse.json({ error: "Failed to update quote" }, { status: 500 });
  }
}
