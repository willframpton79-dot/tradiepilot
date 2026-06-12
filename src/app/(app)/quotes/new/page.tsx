'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ChevronLeft, 
  Save, 
  FileText, 
  User, 
  DollarSign, 
  Briefcase,
  Loader2,
  Download
} from "lucide-react";
import { motion } from "framer-motion";
import Link from 'next/link';
import { toast } from 'react-hot-toast';
import jsPDF from 'jspdf';

export default function NewQuotePage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    client: '',
    project: '',
    amount: '',
    category: 'General',
    includeGst: true,
    description: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const generatePDF = (quote: any) => {
    const doc = new jsPDF();
    
    // Header
    doc.setFontSize(22);
    doc.setTextColor(79, 70, 229); // Indigo-600
    doc.text('TradiePilot', 20, 20);
    
    doc.setFontSize(10);
    doc.setTextColor(100, 116, 139); // Slate-500
    doc.text('Job Profitability Intelligence', 20, 26);
    
    // Quote Info
    doc.setFontSize(16);
    doc.setTextColor(15, 23, 42); // Slate-900
    doc.text(`QUOTE: ${quote.quoteNumber}`, 140, 20);
    
    doc.setFontSize(10);
    doc.text(`Date: ${new Date().toLocaleDateString('en-AU')}`, 140, 26);
    
    // Horizontal Line
    doc.setDrawColor(226, 232, 240);
    doc.line(20, 35, 190, 35);
    
    // Client & Project
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('CLIENT', 20, 45);
    doc.setFont('helvetica', 'normal');
    doc.text(quote.client, 20, 52);
    
    doc.setFont('helvetica', 'bold');
    doc.text('PROJECT', 110, 45);
    doc.setFont('helvetica', 'normal');
    doc.text(quote.project || quote.job, 110, 52);
    
    // Description
    if (quote.description) {
      doc.setFont('helvetica', 'bold');
      doc.text('DESCRIPTION', 20, 65);
      doc.setFont('helvetica', 'normal');
      const splitDesc = doc.splitTextToSize(quote.description, 170);
      doc.text(splitDesc, 20, 72);
    }
    
    // Line Items (Simple for now)
    const tableTop = 90;
    doc.setFillColor(248, 250, 252);
    doc.rect(20, tableTop, 170, 10, 'F');
    doc.setFont('helvetica', 'bold');
    doc.text('Item Description', 25, tableTop + 7);
    doc.text('Amount', 160, tableTop + 7, { align: 'right' });
    
    doc.setFont('helvetica', 'normal');
    doc.text(quote.project || 'Project Estimate', 25, tableTop + 17);
    doc.text(`$${quote.amountExGst.toLocaleString(undefined, { minimumFractionDigits: 2 })}`, 160, tableTop + 17, { align: 'right' });
    
    // Totals
    const totalsTop = tableTop + 35;
    doc.line(110, totalsTop, 190, totalsTop);
    
    doc.text('Subtotal (Excl. GST):', 110, totalsTop + 10);
    doc.text(`$${quote.amountExGst.toLocaleString(undefined, { minimumFractionDigits: 2 })}`, 190, totalsTop + 10, { align: 'right' });
    
    doc.text('GST (10%):', 110, totalsTop + 18);
    doc.text(`$${quote.gstAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}`, 190, totalsTop + 18, { align: 'right' });
    
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Total (Incl. GST):', 110, totalsTop + 30);
    doc.text(`$${quote.amountIncGst.toLocaleString(undefined, { minimumFractionDigits: 2 })}`, 190, totalsTop + 30, { align: 'right' });
    
    // Footer
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(148, 163, 184); // Slate-400
    doc.text('Automation Layer ABN 55 388 054 921', 105, 285, { align: 'center' });
    
    doc.save(`Quote_${quote.quoteNumber}.pdf`);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const payload = {
        ...formData,
        amount: parseFloat(formData.amount) || 0,
        job: formData.project, // Mapping project to job field in model
      };

      const res = await fetch('/api/quotes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error('Failed to create quote');

      const savedQuote = await res.json();
      
      // Generate and download PDF
      generatePDF(savedQuote);
      
      toast.success('Quote created and PDF generated');
      router.push('/quotes');
      router.refresh();
    } catch (err) {
      console.error(err);
      toast.error('Error creating quote. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

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
              href="/quotes" 
              className="flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-indigo-600 transition-colors mb-4"
            >
              <ChevronLeft className="w-4 h-4" /> Back to Quotes
            </Link>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Create New Quote</h1>
            <p className="text-slate-500 mt-1">Professional estimates that protect your profit.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Client & Project Section */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 lg:p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center">
                <User className="w-5 h-5 text-indigo-600" />
              </div>
              <h2 className="text-lg font-bold text-slate-900">Client Information</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2 space-y-2">
                <label className="text-sm font-bold text-slate-700">Client Name / Business</label>
                <input
                  required
                  type="text"
                  name="client"
                  placeholder="e.g. Meridian Property Group"
                  value={formData.client}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all text-slate-900 placeholder:text-slate-400 font-medium"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Project Name</label>
                <div className="relative">
                  <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    required
                    type="text"
                    name="project"
                    placeholder="e.g. Bathroom Renovation"
                    value={formData.project}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all text-slate-900 font-medium"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Category</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all text-slate-900 font-medium appearance-none"
                >
                  <option value="General">General</option>
                  <option value="Electrical">Electrical</option>
                  <option value="Plumbing">Plumbing</option>
                  <option value="Carpentry">Carpentry</option>
                  <option value="Building">Building</option>
                  <option value="Landscaping">Landscaping</option>
                  <option value="Painting">Painting</option>
                </select>
              </div>
            </div>
          </div>

          {/* Financial Section */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 lg:p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-indigo-600" />
              </div>
              <h2 className="text-lg font-bold text-slate-900">Financials</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Quoted Amount ($)</label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    required
                    type="number"
                    name="amount"
                    placeholder="0.00"
                    value={formData.amount}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all text-slate-900 placeholder:text-slate-400 font-medium"
                  />
                </div>
              </div>

              <div className="flex items-center h-full pt-6">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <div className="relative">
                    <input
                      type="checkbox"
                      name="includeGst"
                      checked={formData.includeGst}
                      onChange={(e) => setFormData(prev => ({ ...prev, includeGst: e.target.checked }))}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                  </div>
                  <span className="text-sm font-bold text-slate-700">Includes 10% GST</span>
                </label>
              </div>

              <div className="md:col-span-2 space-y-2">
                <label className="text-sm font-bold text-slate-700">Scope of Works / Description</label>
                <textarea
                  name="description"
                  rows={4}
                  placeholder="Describe the project scope..."
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all text-slate-900 placeholder:text-slate-400 font-medium resize-none"
                />
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-4">
            <Link 
              href="/quotes"
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
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Saving...
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" /> Generate Quote PDF
                </>
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
