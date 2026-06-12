'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { 
  ChevronLeft, 
  Save, 
  Briefcase, 
  User, 
  DollarSign, 
  MapPin, 
  Calendar, 
  Target,
  Hammer,
  Loader2
} from "lucide-react";
import { motion } from "framer-motion";
import Link from 'next/link';
import { toast } from 'react-hot-toast';

export default function EditJobPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: '',
    client: {
      name: '',
      phone: '',
      email: '',
      address: '',
    },
    quotedTotal: '',
    tradeType: '',
    suburb: '',
    startDate: '',
    targetMarginPct: '30',
  });

  useEffect(() => {
    async function fetchJob() {
      try {
        const response = await fetch(`/api/jobs/${id}`);
        if (!response.ok) throw new Error('Failed to fetch job');
        const data = await response.json();
        
        setFormData({
          title: data.title || '',
          client: {
            name: data.client?.name || '',
            phone: data.client?.phone || '',
            email: data.client?.email || '',
            address: data.client?.address || '',
          },
          quotedTotal: data.quotedTotal?.toString() || '',
          tradeType: data.tradeType || '',
          suburb: data.suburb || '',
          startDate: data.startDate || '',
          targetMarginPct: data.targetMarginPct?.toString() || '30',
        });
      } catch (err) {
        console.error(err);
        toast.error('Failed to load job details');
      } finally {
        setIsLoading(false);
      }
    }
    if (id) fetchJob();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent as keyof typeof prev] as any,
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const payload = {
        ...formData,
        quotedTotal: parseFloat(formData.quotedTotal) || 0,
        targetMarginPct: parseFloat(formData.targetMarginPct) || 30,
      };

      const res = await fetch(`/api/jobs/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error('Failed to update job');

      toast.success('Job updated successfully');
      router.push(`/jobs/${id}`);
      router.refresh();
    } catch (err) {
      console.error(err);
      toast.error('Error updating job. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Loader2 className="w-10 h-10 animate-spin text-indigo-600" />
        <p className="text-slate-500 font-medium">Loading job details...</p>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-10 max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-8"
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <Link 
              href={`/jobs/${id}`}
              className="flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-indigo-600 transition-colors mb-4"
            >
              <ChevronLeft className="w-4 h-4" /> Back to Job Detail
            </Link>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Edit Job</h1>
            <p className="text-slate-500 mt-1">Update project scope or financial targets.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Job Details Section */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 lg:p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center">
                <Briefcase className="w-5 h-5 text-indigo-600" />
              </div>
              <h2 className="text-lg font-bold text-slate-900">Job Information</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Job Name</label>
                <input
                  required
                  type="text"
                  name="title"
                  placeholder="e.g. Meridian Office Fitout"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all text-slate-900 placeholder:text-slate-400 font-medium"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Trade Type</label>
                <div className="relative">
                  <Hammer className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <select
                    required
                    name="tradeType"
                    value={formData.tradeType}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all text-slate-900 font-medium appearance-none"
                  >
                    <option value="">Select trade...</option>
                    <option value="Electrical">Electrical</option>
                    <option value="Plumbing">Plumbing</option>
                    <option value="Carpentry">Carpentry</option>
                    <option value="Building">Building</option>
                    <option value="Landscaping">Landscaping</option>
                    <option value="Painting">Painting</option>
                    <option value="HVAC">HVAC</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Start Date</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    required
                    type="date"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all text-slate-900 font-medium"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Location (Suburb)</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    required
                    type="text"
                    name="suburb"
                    placeholder="e.g. Pyrmont"
                    value={formData.suburb}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all text-slate-900 placeholder:text-slate-400 font-medium"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Client Section */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 lg:p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center">
                <User className="w-5 h-5 text-indigo-600" />
              </div>
              <h2 className="text-lg font-bold text-slate-900">Client Details</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2 space-y-2">
                <label className="text-sm font-bold text-slate-700">Client Name / Business</label>
                <input
                  required
                  type="text"
                  name="client.name"
                  placeholder="e.g. Meridian Property Group"
                  value={formData.client.name}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all text-slate-900 placeholder:text-slate-400 font-medium"
                />
              </div>
            </div>
          </div>

          {/* Financial Section */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 lg:p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-indigo-600" />
              </div>
              <h2 className="text-lg font-bold text-slate-900">Financial Targets</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Contract Value (Inc. GST)</label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    required
                    type="number"
                    name="quotedTotal"
                    placeholder="0.00"
                    value={formData.quotedTotal}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all text-slate-900 placeholder:text-slate-400 font-medium"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Target Margin (%)</label>
                <div className="relative">
                  <Target className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    required
                    type="number"
                    name="targetMarginPct"
                    placeholder="30"
                    value={formData.targetMarginPct}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all text-slate-900 placeholder:text-slate-400 font-medium"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-4">
            <Link 
              href={`/jobs/${id}`}
              className="px-6 py-2.5 text-sm font-bold text-slate-600 hover:text-slate-900 transition-colors"
            >
              Cancel
            </Link>
            <button
              disabled={isSubmitting}
              type="submit"
              className="flex items-center gap-2 bg-indigo-600 text-white font-bold px-8 py-2.5 rounded-lg hover:bg-indigo-700 transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>Saving...</>
              ) : (
                <>
                  <Save className="w-4 h-4" /> Update Job
                </>
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
