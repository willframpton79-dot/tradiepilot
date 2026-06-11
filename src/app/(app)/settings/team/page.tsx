'use client';

import { useState, useEffect } from 'react';
import { 
  Users, 
  Plus, 
  Trash2, 
  Edit2, 
  ChevronLeft,
  Loader2,
  DollarSign,
  User
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useSession } from 'next-auth/react';

interface StaffMember {
  _id: string;
  name: string;
  role: string;
  hourlyRate: number;
}

const roles = ['Plumber', 'Apprentice', 'Electrician', 'Carpenter', 'Painter', 'Laborer', 'Other'];

export default function TeamManagementPage() {
  const { data: session, status: authStatus } = useSession();
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // Form state
  const [name, setName] = useState('');
  const [role, setRole] = useState(roles[0]);
  const [hourlyRate, setHourlyRate] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const router = useRouter();

  useEffect(() => {
    if (authStatus === 'unauthenticated') {
      router.push('/login');
    }
  }, [authStatus, router]);

  useEffect(() => {
    if (authStatus === 'authenticated') {
      fetchStaff();
    }
  }, [authStatus]);

  const fetchStaff = async () => {
    try {
      const res = await fetch('/api/settings/team');
      if (res.ok) {
        const data = await res.json();
        setStaff(data);
      }
    } catch (err) {
      console.error('Failed to fetch staff:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const payload = {
      name,
      role,
      hourlyRate: parseFloat(hourlyRate),
    };

    try {
      const url = editingId ? `/api/settings/team/${editingId}` : '/api/settings/team';
      const method = editingId ? 'PUT' : 'POST';
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        await fetchStaff();
        resetForm();
      }
    } catch (err) {
      console.error('Error saving staff:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to remove this staff member?')) return;

    try {
      const res = await fetch(`/api/settings/team/${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        setStaff(staff.filter(s => s._id !== id));
      }
    } catch (err) {
      console.error('Error deleting staff:', err);
    }
  };

  const startEdit = (member: StaffMember) => {
    setEditingId(member._id);
    setName(member.name);
    setRole(member.role);
    setHourlyRate(member.hourlyRate.toString());
    setIsAdding(true);
  };

  const resetForm = () => {
    setName('');
    setRole(roles[0]);
    setHourlyRate('');
    setIsAdding(false);
    setEditingId(null);
  };

  if (authStatus === 'loading' || (authStatus === 'authenticated' && isLoading)) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
        <p className="mt-4 text-slate-500 font-medium">Loading your team...</p>
      </div>
    );
  }

  if (!session) return null;

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <Link 
            href="/settings" 
            className="text-sm font-medium text-slate-500 hover:text-indigo-600 flex items-center gap-1 mb-2 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to Settings
          </Link>
          <h1 className="text-2xl lg:text-3xl font-bold text-slate-900 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center shrink-0">
              <Users className="w-6 h-6 text-indigo-600" />
            </div>
            Team Management
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Manage your staff members and their default hourly rates.
          </p>
        </div>
        
        <button
          onClick={() => setIsAdding(true)}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 text-white rounded-lg font-semibold text-sm hover:bg-indigo-700 transition-all shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Add Staff Member
        </button>
      </div>

      {staff.length === 0 && !isAdding ? (
        <div className="bg-white border border-dashed border-slate-300 rounded-2xl p-12 text-center">
          <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <Users className="w-8 h-8 text-slate-400" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">No staff members yet</h3>
          <p className="text-slate-500 mt-2 max-w-sm mx-auto">
            Add your team members to start tracking their time on jobs more efficiently.
          </p>
          <button
            onClick={() => setIsAdding(true)}
            className="mt-6 inline-flex items-center gap-2 text-indigo-600 font-bold hover:text-indigo-700"
          >
            <Plus className="w-4 h-4" />
            Add your first staff member
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {isAdding && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-indigo-50/50 border-2 border-indigo-200 border-dashed rounded-xl p-6 h-fit"
              >
                <form onSubmit={handleSubmit} className="space-y-4">
                  <h3 className="font-bold text-indigo-900 flex items-center gap-2 text-sm">
                    {editingId ? 'Edit Staff Member' : 'New Staff Member'}
                  </h3>
                  
                  <div>
                    <label className="block text-[10px] font-bold text-indigo-700 uppercase tracking-wider mb-1">
                      Full Name
                    </label>
                    <input
                      required
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. John Smith"
                      className="w-full px-3 py-2 bg-white border border-indigo-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-indigo-700 uppercase tracking-wider mb-1">
                      Role
                    </label>
                    <select
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-indigo-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                    >
                      {roles.map(r => <option key={r} value={r}>{r}</option>)}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-indigo-700 uppercase tracking-wider mb-1">
                      Default Hourly Rate ($)
                    </label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        required
                        type="number"
                        step="0.01"
                        value={hourlyRate}
                        onChange={(e) => setHourlyRate(e.target.value)}
                        placeholder="0.00"
                        className="w-full pl-9 pr-3 py-2 bg-white border border-indigo-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-2">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex-1 py-2 bg-indigo-600 text-white rounded-lg text-sm font-bold hover:bg-indigo-700 transition-colors disabled:opacity-50"
                    >
                      {isSubmitting ? 'Saving...' : editingId ? 'Update' : 'Add Member'}
                    </button>
                    <button
                      type="button"
                      onClick={resetForm}
                      className="px-3 py-2 text-slate-500 hover:text-slate-700 text-sm font-medium"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </motion.div>
            )}

            {staff.map((member) => (
              <motion.div
                key={member._id}
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-white border border-slate-200 rounded-xl p-5 hover:shadow-sm transition-shadow group relative"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
                      <User className="w-5 h-5 text-slate-500" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 truncate max-w-[140px]">
                        {member.name}
                      </h3>
                      <p className="text-xs text-slate-500 font-medium">{member.role}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-1 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => startEdit(member)}
                      className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                      title="Edit member"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(member._id)}
                      className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                      title="Remove member"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-50 flex items-center justify-between">
                  <div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                      Hourly Rate
                    </p>
                    <p className="text-lg font-bold text-indigo-600">
                      ${member.hourlyRate.toFixed(2)}
                    </p>
                  </div>
                  <div className="bg-indigo-50 text-indigo-700 text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wide">
                    Active
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
