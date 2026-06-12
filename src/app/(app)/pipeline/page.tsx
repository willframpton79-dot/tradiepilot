"use client";

import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { 
  Calendar, 
  AlertTriangle, 
  ChevronLeft, 
  ChevronRight,
  Info,
  Clock,
  DollarSign,
  TrendingUp,
  LayoutGrid,
  Users
} from "lucide-react";
import { sampleData } from "@/lib/sampleData";

// --- Date Helpers ---
const addDays = (date: Date, days: number) => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

const getWeekNumber = (date: Date) => {
  const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
  const pastDaysOfYear = (date.getTime() - firstDayOfYear.getTime()) / 86400000;
  return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
};

const formatDate = (date: Date) => {
  return date.toLocaleDateString('en-AU', { day: 'numeric', month: 'short' });
};

// --- Pipeline Component ---
export default function PipelinePage() {
  // We'll base the timeline on a fixed start date for the demo (June 1, 2026)
  // or use the earliest start date from our sample jobs.
  const timelineStart = new Date('2026-06-01');
  const weeks = Array.from({ length: 12 }, (_, i) => addDays(timelineStart, i * 7));
  const timelineEnd = addDays(timelineStart, 12 * 7);

  const jobs = useMemo(() => {
    return sampleData.jobs.map(job => {
      // Map job status to color
      let color = "bg-green-500";
      let border = "border-green-600";
      let text = "text-green-700";
      let bgLight = "bg-green-50";

      if (job.margin < 15 || job.status === 'critical') {
        color = "bg-red-500";
        border = "border-red-600";
        text = "text-white";
        bgLight = "bg-red-500"; // Changed to solid for better white text contrast
      } else if (job.margin <= 30 || job.status === 'at-risk') {
        color = "bg-amber-500";
        border = "border-amber-600";
        text = "text-white";
        bgLight = "bg-amber-500"; // Changed to solid
      } else {
        color = "bg-green-500";
        border = "border-green-600";
        text = "text-white";
        bgLight = "bg-green-500"; // Changed to solid
      }

      // Parse dates (in a real app, these would be valid Date objects or ISO strings)
      // For the demo, we'll assign some dummy range if dates aren't in the mock yet,
      // but sampleData actually has dueDate. We'll simulate startDates relative to it.
      const end = new Date(job.dueDate);
      const start = addDays(end, -45); // Assume 45 day duration for demo

      return {
        ...job,
        start,
        end,
        color,
        border,
        text,
        bgLight
      };
    });
  }, []);

  // Calculate overlaps per week
  const weeklyStats = useMemo(() => {
    return weeks.map(weekStart => {
      const weekEnd = addDays(weekStart, 7);
      const activeInWeek = jobs.filter(job => {
        return job.start < weekEnd && job.end > weekStart;
      });

      return {
        date: weekStart,
        count: activeInWeek.length,
        totalValue: activeInWeek.reduce((sum, j) => sum + j.budget, 0),
        isAtRisk: activeInWeek.length > 4
      };
    });
  }, [jobs, weeks]);

  // Positioning logic for "stacked" Gantt bars
  // This is a simple greedy algorithm to find the first available "row"
  const positionedJobs = useMemo(() => {
    const rows: { end: Date }[][] = [];
    
    return jobs.sort((a, b) => a.start.getTime() - b.start.getTime()).map(job => {
      let rowIndex = rows.findIndex(row => {
        // Find a row where the last job ends before this one starts
        const lastJobInRow = row[row.length - 1];
        return lastJobInRow.end < job.start;
      });

      if (rowIndex === -1) {
        rows.push([{ end: job.end }]);
        rowIndex = rows.length - 1;
      } else {
        rows[rowIndex].push({ end: job.end });
      }

      // Calculate percentage positions for CSS
      const totalDuration = timelineEnd.getTime() - timelineStart.getTime();
      const left = ((job.start.getTime() - timelineStart.getTime()) / totalDuration) * 100;
      const width = ((job.end.getTime() - job.start.getTime()) / totalDuration) * 100;

      return {
        ...job,
        row: rowIndex,
        left: Math.max(0, left),
        width: Math.min(100 - left, width)
      };
    });
  }, [jobs, timelineStart, timelineEnd]);

  const maxRow = Math.max(...positionedJobs.map(j => j.row), 0);

  const dynamicInsight = useMemo(() => {
    const criticalJob = jobs.find(j => j.status === 'critical' || j.margin < 15);
    if (criticalJob) {
      return `${criticalJob.name} is over budget and due ${formatDate(criticalJob.end)}. Consider raising a variation or flagging with the client this week.`;
    }
    return "Your 12-week outlook shows heavy concentration in mid-July. Consider bringing forward material orders to secure trades early.";
  }, [jobs]);

  return (
    <div className="p-4 lg:p-8 max-w-[1600px] mx-auto">
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Pipeline & Capacity</h1>
        <p className="text-slate-500 mt-1">Visualise your workload and spot capacity risks before they hit.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Timeline View */}
        <div className="lg:col-span-9 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500" />
                <span className="text-xs font-medium text-slate-600">High Margin ({'>'}30%)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-amber-500" />
                <span className="text-xs font-medium text-slate-600">Healthy (15-30%)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <span className="text-xs font-medium text-slate-600">At Risk ({'<'}15%)</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 transition-colors">
                <ChevronLeft className="w-5 h-5" />
              </button>
              <span className="text-sm font-semibold text-slate-700 px-2">June — August 2026</span>
              <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 transition-colors">
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <div className="min-w-[1000px] relative">
              {/* Timeline Header */}
              <div className="flex border-b border-slate-100 bg-white sticky top-0 z-10">
                {weeks.map((week, i) => (
                  <div key={i} className="flex-1 min-w-[83.33px] py-3 px-2 border-r border-slate-50 text-center">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Week {getWeekNumber(week)}</p>
                    <p className="text-xs font-semibold text-slate-600 mt-0.5">{formatDate(week)}</p>
                  </div>
                ))}
              </div>

              {/* Grid Lines */}
              <div className="absolute inset-0 flex pointer-events-none pt-[52px]">
                {weeks.map((_, i) => (
                  <div key={i} className="flex-1 border-r border-slate-50" />
                ))}
              </div>

              {/* Job Bars Container */}
              <div className="relative p-6" style={{ height: `${(maxRow + 1) * 80 + 40}px`, minHeight: '200px' }}>
                {positionedJobs.map((job) => (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    key={job.id}
                    className={`absolute rounded-xl border-l-4 shadow-sm p-3 overflow-hidden cursor-pointer group transition-all hover:shadow-md hover:scale-[1.01] ${job.bgLight} ${job.border}`}
                    style={{
                      left: `${job.left}%`,
                      width: `${job.width}%`,
                      top: `${job.row * 80 + 24}px`,
                      height: "70px",
                    }}
                  >
                    <div className="flex flex-col h-full justify-between">
                      <div>
                        <p className="text-xs font-bold truncate text-white">{job.name}</p>
                        <p className="text-[10px] text-white/80 font-medium truncate">{job.client}</p>
                      </div>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-[10px] font-bold text-white/90">${job.budget.toLocaleString()}</span>
                        <div className="flex items-center gap-1">
                          <TrendingUp className="w-3 h-3 text-white/90" />
                          <span className="text-[10px] font-bold text-white">{job.margin}%</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Progress indicator at bottom of bar */}
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-slate-200/30">
                      <div 
                        className={`h-full ${job.color} opacity-40`} 
                        style={{ width: `${job.progress}%` }} 
                      />
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar: Capacity Summary */}
        <div className="lg:col-span-3 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <div className="flex items-center gap-2 mb-6">
              <Users className="w-5 h-5 text-indigo-600" />
              <h2 className="font-bold text-slate-900">Capacity Summary</h2>
            </div>

            <div className="space-y-4">
              {weeklyStats.map((stat, i) => (
                <div key={i} className={`p-3 rounded-xl border transition-all ${stat.isAtRisk ? "bg-red-50 border-red-100" : "bg-slate-50 border-slate-100"}`}>
                  <div className="flex items-center justify-between mb-1.5">
                    <p className="text-xs font-bold text-slate-600">{formatDate(stat.date)} — Week {getWeekNumber(stat.date)}</p>
                    {stat.isAtRisk && (
                      <span className="flex items-center gap-1 text-[10px] font-bold text-red-600 bg-red-100 px-2 py-0.5 rounded-full">
                        <AlertTriangle className="w-3 h-3" /> RISK
                      </span>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Active Jobs</p>
                      <p className={`text-sm font-bold ${stat.isAtRisk ? "text-red-700" : "text-slate-700"}`}>{stat.count} Projects</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Work in Progress</p>
                      <p className="text-sm font-bold text-slate-700">${(stat.totalValue / 1000).toFixed(0)}k</p>
                    </div>
                  </div>
                  {stat.isAtRisk && (
                    <div className="mt-2 flex items-start gap-2 bg-white/50 p-2 rounded-lg border border-red-200">
                      <Info className="w-3.5 h-3.5 text-red-500 shrink-0 mt-0.5" />
                      <p className="text-[10px] text-red-700 leading-tight">High overlap detected. Review staffing or adjust timelines to avoid slippage.</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="bg-indigo-600 rounded-2xl p-6 text-white shadow-lg shadow-indigo-200">
            <h3 className="font-bold mb-2 flex items-center gap-2 text-sm">
              <Clock className="w-4 h-4" /> Pipeline Insight
            </h3>
            <p className="text-xs text-indigo-100 leading-relaxed">
              {dynamicInsight}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
