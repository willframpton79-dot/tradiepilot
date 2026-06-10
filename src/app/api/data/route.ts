import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Job } from "@/models/Job";
import { Quote } from "@/models/Quote";
import { Invoice } from "@/models/Invoice";
import { Insight } from "@/models/Insight";
import { requireAuth } from "@/lib/session";

export async function GET(request: Request) {
  try {
    const auth = await requireAuth(); if (auth instanceof NextResponse) return auth; const userEmail = typeof auth === 'string' ? auth : auth?.email;
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type") || "all";

    await connectDB();

    if (type === "jobs") {
      const jobs = await Job.find({ userEmail }).lean();
      return NextResponse.json(jobs);
    }

    if (type === "quotes") {
      const quotes = await Quote.find({ userEmail }).lean();
      return NextResponse.json(quotes);
    }

    if (type === "invoices") {
      const invoices = await Invoice.find({ userEmail }).lean();
      return NextResponse.json(invoices);
    }

    if (type === "insights" || type === "alerts" || type === "dashboard") {
      const insight = await Insight.findOne({ userEmail }).lean();
      
      if (type === "alerts") {
        return NextResponse.json(insight?.profit_alerts || {});
      }
      
      if (type === "insights") {
        return NextResponse.json(insight || {});
      }

      if (type === "dashboard") {
        const [jobs, quotes, invoices] = await Promise.all([
          Job.find({ userEmail }).lean(),
          Quote.find({ userEmail }).lean(),
          Invoice.find({ userEmail }).lean(),
        ]);

        return NextResponse.json({
          jobs,
          quotes,
          invoices,
          dashboard_summary: insight?.dashboard_summary || {},
          profit_alerts: insight?.profit_alerts || {},
          quote_hot_leads: insight?.quote_hot_leads || {},
          customer_ltv: insight?.customer_ltv || {},
          suburb_hotspots: insight?.suburb_hotspots || {},
          marketing_tips: insight?.marketing_tips || {},
          growth_forecast: insight?.growth_forecast || {},
        });
      }
    }

    const [jobs, quotes, invoices, insight] = await Promise.all([
      Job.find({ userEmail }).lean(),
      Quote.find({ userEmail }).lean(),
      Invoice.find({ userEmail }).lean(),
      Insight.findOne({ userEmail }).lean(),
    ]);

    return NextResponse.json({ jobs, quotes, invoices, ...insight });
  } catch (error: any) {
    if (error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("GET /api/data error:", error);
    return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 });
  }
}
