'use client';

import { useParams } from "next/navigation";
import { 
  ArrowLeft, 
  TrendingUp, 
  DollarSign, 
  Clock, 
  Calendar,
  User,
  MapPin,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import ProfitGauge from "@/components/dashboard/ProfitGauge";

const fadeUp = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

export default function JobDetailPage() {
  const params = useParams();
  
  // Mock data for the specific job
  const job = {
    id: params.id,
    name: "Woollahra Bathroom Renovation",
    client: "Sarah Johnson",
    address: "123 Ocean St, Woollahra NSW",
    status: "In Progress",
    startDate: "2026-05-10",
    estimatedEnd: "2026-06-25",
    contractValue: 24500,
    costsToDate: 14200,
    margin: 0.42,
    tasks: [
      { id: 1, name: "Demolition", status: "Completed", date: "2026-05-12" },
      { id: 2, name: "Plumbing Rough-in", status: "Completed", date: "2026-05-18" },
      { id: 3, name: "Waterproofing", status: "In Progress", date: "2026-06-05" },
      { id: 4, name: "Tiling", status: "Scheduled", date: "2026-06-12" },
    ]
  };

  return (
    <div className="p-6 lg:p-10 max-w-6xl mx-auto">
      <motion.div
        initial="hidden"
        animate="visible"
        className="space-y-10"
      >
        {/* Header */}
        <div>
          <Link href="/dashboard" className="inline-flex items-center gap-2 text-sm font-bold text-indigo-600 hover:text-indigo-700 transition-colors mb-4">
            <ArrowLeft className="w-4 h-4" /> Back to Dashboard
          </Link>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 tracking-tight">{job.name}</h1>
              <div className="flex items-center gap-4 mt-2 text-slate-500 font-medium">
                <div className="flex items-center gap-1.5">
                  <User className="w-4 h-4" /> {job.client}
                </div>
                <div className="flex items-center gap-1.5 text-sm">
                  <MapPin className="w-4 h-4" /> {job.address}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-green-50 text-green-700 border border-green-100 rounded-full text-xs font-bold uppercase tracking-wider">
                {job.status}
              </span>
              <button className="bg-indigo-600 text-white font-bold px-4 py-2 rounded-lg hover:bg-indigo-700 transition-all text-sm">
                Edit Job
              </button>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div variants={fadeUp} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col items-center justify-center text-center">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-6">Current Margin</h3>
            <ProfitGauge margin={job.margin} />
          </motion.div>

          <motion.div variants={fadeUp} className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Contract Value</p>
              <p className="text-2xl font-bold text-slate-900 financial-figure">${job.contractValue.toLocaleString()}</p>
              <div className="mt-4 pt-4 border-t border-slate-50">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Costs to Date</p>
                <p className="text-xl font-bold text-slate-700 financial-figure">${job.costsToDate.toLocaleString()}</p>
              </div>
            </div>
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Timeline</p>
              <div className="flex items-center gap-3 mt-3">
                <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-indigo-600" />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-800">Started May 10</p>
                  <p className="text-xs text-slate-500 font-medium">Est. finish Jun 25</p>
                </div>
              </div>
              <div className="mt-6">
                <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider mb-2 text-slate-400">
                  <span>Progress</span>
                  <span>65%</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-indigo-500 rounded-full" style={{ width: '65%' }} />
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Task List */}
        <motion.div variants={fadeUp} className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100">
            <h3 className="text-lg font-bold text-slate-900">Project Timeline</h3>
          </div>
          <div className="divide-y divide-slate-50">
            {job.tasks.map((task) => (
              <div key={task.id} className="p-6 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  {task.status === 'Completed' ? (
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                  ) : task.status === 'In Progress' ? (
                    <Clock className="w-5 h-5 text-amber-500" />
                  ) : (
                    <div className="w-5 h-5 border-2 border-slate-200 rounded-full" />
                  )}
                  <div>
                    <p className={`text-sm font-bold ${task.status === 'Completed' ? 'text-slate-500 line-through' : 'text-slate-800'}`}>
                      {task.name}
                    </p>
                    <p className="text-xs text-slate-400 font-medium">{task.date}</p>
                  </div>
                </div>
                <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                  task.status === 'Completed' ? 'bg-green-50 text-green-700' :
                  task.status === 'In Progress' ? 'bg-amber-50 text-amber-700' :
                  'bg-slate-50 text-slate-500'
                }`}>
                  {task.status}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
