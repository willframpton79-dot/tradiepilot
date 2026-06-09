"use client";
import { motion } from "framer-motion";
import { Receipt, Store, Calendar, Plus } from "lucide-react";

interface ReceiptLogProps {
  receipts: any[];
}

export default function ReceiptLog({ receipts }: ReceiptLogProps) {
  const total = receipts.reduce((sum, r) => sum + r.cost, 0);

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold text-slate-800">Materials & Receipts</h2>
        <button className="btn-primary text-xs flex items-center gap-2">
           <Plus className="w-3.5 h-3.5" /> Log Receipt
        </button>
      </div>

      <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100 mb-6">
         <div className="flex items-center gap-3">
            <div className="p-2 bg-white rounded-lg border border-slate-100 shadow-sm">
               <Receipt className="w-4 h-4 text-indigo" />
            </div>
            <div>
               <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Total Spent</p>
               <p className="text-lg font-bold text-slate-800">${total.toLocaleString()}</p>
            </div>
         </div>
         <div className="text-right">
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Items</p>
            <p className="text-lg font-bold text-slate-800">{receipts.length}</p>
         </div>
      </div>

      <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 scrollbar-thin">
        {receipts.map((receipt, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="group p-3 rounded-lg border border-slate-100 bg-white hover:border-indigo/20 hover:shadow-sm transition-all"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-1.5 bg-slate-50 rounded-lg group-hover:bg-indigo-50 transition-colors">
                  <Store className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo" />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-800 group-hover:text-indigo transition-colors">{receipt.item}</p>
                  <div className="flex items-center gap-3 mt-1">
                     <span className="text-[10px] text-slate-500 font-medium">{receipt.supplier}</span>
                     <span className="text-[10px] text-slate-300">•</span>
                     <span className="text-[10px] text-slate-500 font-medium">{receipt.date}</span>
                  </div>
                </div>
              </div>
              <p className="text-sm font-bold text-slate-800">${receipt.cost.toLocaleString()}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
