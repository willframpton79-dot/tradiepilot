import { ArrowUpRight, ArrowDownRight, LucideIcon } from 'lucide-react';

interface StatCardProps {
  label: string;
  value: string | number;
  trend?: string;
  trendType?: 'positive' | 'negative' | 'neutral';
  icon?: LucideIcon;
}

export default function StatCard({ label, value, trend, trendType, icon: Icon }: StatCardProps) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
      <div className="flex justify-between items-start mb-4">
        <p className="text-sm font-medium text-slate-400 uppercase tracking-wider">{label}</p>
        {Icon && (
          <div className="p-2 rounded-lg bg-slate-50">
            <Icon className="w-5 h-5 text-slate-400" />
          </div>
        )}
      </div>
      
      <div className="flex items-end gap-3">
        <h3 className="text-3xl font-bold text-slate-900 tracking-tight">{value}</h3>
        {trend && (
          <div className={`flex items-center gap-0.5 text-sm font-semibold mb-1 ${
            trendType === 'positive' ? 'text-green-600' : 
            trendType === 'negative' ? 'text-red-600' : 
            'text-slate-500'
          }`}>
            {trendType === 'positive' ? <ArrowUpRight className="w-4 h-4" /> : 
             trendType === 'negative' ? <ArrowDownRight className="w-4 h-4" /> : null}
            {trend}
          </div>
        )}
      </div>
    </div>
  );
}
