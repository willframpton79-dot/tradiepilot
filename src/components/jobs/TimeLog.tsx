"use client";
import { motion } from "framer-motion";
import { Clock, User, Plus, Calendar } from "lucide-react";

interface TimeLogProps {
  entries: any[];
}

export default function TimeLog({ entries }: TimeLogProps) {
  const totalHours = entries.reduce((sum, e) => sum + e.hours, 0);
  const totalCost = entries.reduce((sum, e) => sum + e.cost, 0);

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold text-slate-800">Crew Time Logs</h2>
        <button className="btn-primary text-xs flex items-center gap-2">
           <Plus className="w-3.5 h-3.5" /> Log Time
        </button>
      </div>

      <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100 mb-6">
         <div className="flex items-center gap-3">
            <div className="p-2 bg-white rounded-lg border border-slate-100 shadow-sm">
               <Clock className="w-4 h-4 text-emerald-500" />
            </div>
            <div>
               <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Total Labour</p>
               <p className="text-lg font-bold text-slate-800">${totalCost.toLocaleString()}</p>
            </div>
         </div>
         <div className="text-right">
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Total Hours</p>
            <p className="text-lg font-bold text-slate-800">{totalHours.toFixed(1)}h</p>
         </div>
      </div>

      <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 scrollbar-thin">
        {entries.map((entry, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="group p-4 rounded-lg border border-slate-100 bg-white hover:border-emerald-500/20 hover:shadow-sm transition-all"
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-slate-50 rounded-lg group-hover:bg-emerald-50 transition-colors">
                  <User className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-500" />
                </div>
                <p className="text-sm font-bold text-slate-800 group-hover:text-emerald-500 transition-colors">{entry.staff}</p>
              </div>
              <p className="text-sm font-bold text-slate-800">${entry.cost.toLocaleString()}</p>
            </div>
            
            <p className="text-xs text-slate-600 mb-3">{entry.description}</p>
            
            <div className="flex items-center justify-between pt-2 border-t border-slate-50">
               <div className="flex items-center gap-2 text-[10px] text-slate-400 font-bold">
                  <Calendar className="w-3 h-3" />
                  {entry.date}
               </div>
               <div className="text-[10px] text-slate-500 font-bold bg-slate-50 px-2 py-0.5 rounded">
                  {entry.hours}h @ ${entry.rate}/hr
               </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
