'use client';

import { 
  Settings as SettingsIcon, 
  Bell, 
  Shield, 
  CreditCard, 
  User, 
  Building2,
  ExternalLink
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const settingsSections = [
  {
    title: 'Account',
    description: 'Manage your personal profile and security.',
    icon: User,
    items: [
      { label: 'Profile Information', href: '/settings/account' },
      { label: 'Password & Security', href: '/settings/security' },
      { label: 'Email Preferences', href: '/settings/email-preferences' },
    ],
    link: '/settings/account',
  },
  {
    title: 'Business',
    description: 'Update your construction business details.',
    icon: Building2,
    items: [
      { label: 'Business Profile', href: '/settings/business' },
      { label: 'Team Management', href: '/settings/team' },
      { label: 'Tax Information', href: '/settings/tax' },
    ],
    link: '/settings/business',
  },
  {
    title: 'Billing',
    description: 'Manage your subscription and invoices.',
    icon: CreditCard,
    items: [
      { label: 'Current Plan', href: '/settings/billing' },
      { label: 'Payment Methods', href: '/settings/billing' },
      { label: 'Billing History', href: '/settings/billing' },
    ],
    link: '/settings/billing',
  },
  {
    title: 'Notifications',
    description: 'Configure how you receive alerts.',
    icon: Bell,
    items: [
      { label: 'Email Notifications', href: '/settings/notifications' },
      { label: 'Push Notifications', href: '/settings/notifications' },
      { label: 'Alert Thresholds', href: '/settings/notifications' },
    ],
    link: '/settings/notifications',
  },
  {
    title: 'Xero Integration',
    description: 'Connect your Xero account to sync invoices and data.',
    icon: ExternalLink,
    items: [
      { label: 'Connect Xero', href: '/settings/xero' },
      { label: 'Sync Invoices', href: '/settings/xero' },
      { label: 'Manage Connection', href: '/settings/xero' },
    ],
    link: '/settings/xero',
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.1 } },
};

export default function SettingsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!session) return null;

  return (
    <div className="p-6 lg:p-8 max-w-5xl mx-auto">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={stagger}
        className="space-y-8"
      >
        {/* Header */}
        <motion.div variants={fadeUp}>
          <h1 className="text-2xl lg:text-3xl font-bold text-slate-900 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center shrink-0">
              <SettingsIcon className="w-6 h-6 text-indigo-600" />
            </div>
            Settings
          </h1>
          <p className="mt-2 text-sm sm:text-base text-slate-500">
            Manage your account settings and business preferences.
          </p>
        </motion.div>

        {/* Settings Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {settingsSections.map((section) => (
            <motion.div
              key={section.title}
              variants={fadeUp}
              onClick={() => section.link && router.push(section.link)}
              className={`bg-white border border-slate-200 rounded-xl p-4 sm:p-6 hover:shadow-md transition-shadow ${
                section.link ? 'cursor-pointer hover:border-indigo-200' : ''
              }`}
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-slate-50 flex items-center justify-center shrink-0">
                  <section.icon className="w-6 h-6 text-slate-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="text-lg font-bold text-slate-900">{section.title}</h2>
                  <p className="text-xs sm:text-sm text-slate-500 mt-1">{section.description}</p>
                  <ul className="mt-4 space-y-2">
                    {section.items.map((item: any) => (
                      <li key={typeof item === 'string' ? item : item.label}>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            if (typeof item !== 'string' && item.href) {
                              router.push(item.href);
                            }
                          }}
                          className="text-xs sm:text-sm font-medium text-indigo-600 hover:text-indigo-700 hover:underline transition-all text-left"
                        >
                          {typeof item === 'string' ? item : item.label}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Danger Zone */}
        <motion.div
          variants={fadeUp}
          className="bg-red-50 border border-red-100 rounded-xl p-6"
        >
          <h2 className="text-lg font-bold text-red-900">Danger Zone</h2>
          <p className="text-sm text-red-700 mt-1">
            Irreversible actions for your account and business data.
          </p>
          <button className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-bold hover:bg-red-700 transition-colors">
            Delete Account
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
}
