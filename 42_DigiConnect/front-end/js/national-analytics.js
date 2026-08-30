// ═══════════════════════════════════════════
// national-analytics.js — Shared National Dataset & Analytics Engine
// ═══════════════════════════════════════════

import { apiGetStates, apiGetCentralRevenue } from './api.js';

export const NATIONAL_STATES_DATA = [
  { id: 'state_ap', name: 'Andhra Pradesh', code: 'AP', applications: 8420, completed: 5900, pending: 1650, rejected: 580, query: 290, revenue: 425000, grievances: 1250, grvPending: 290, grvResolved: 880, grvEscalated: 80 },
  { id: 'state_ka', name: 'Karnataka', code: 'KA', applications: 7820, completed: 5400, pending: 1580, rejected: 550, query: 290, revenue: 390000, grievances: 1180, grvPending: 280, grvResolved: 820, grvEscalated: 80 },
  { id: 'state_tn', name: 'Tamil Nadu', code: 'TN', applications: 5980, completed: 4200, pending: 1210, rejected: 410, query: 160, revenue: 295000, grievances: 890, grvPending: 210, grvResolved: 630, grvEscalated: 50 },
  { id: 'state_kl', name: 'Kerala', code: 'KL', applications: 1980, completed: 1480, pending: 360, rejected: 100, query: 40, revenue: 98000, grievances: 290, grvPending: 70, grvResolved: 210, grvEscalated: 10 },
];

export const NATIONAL_TIME_TRENDS = {
  daily: [
    { label: 'Mon', apps: 1620, revenue: 82000 },
    { label: 'Tue', apps: 1890, revenue: 95000 },
    { label: 'Wed', apps: 2150, revenue: 109000 },
    { label: 'Thu', apps: 1980, revenue: 101000 },
    { label: 'Fri', apps: 2420, revenue: 124000 },
    { label: 'Sat', apps: 1410, revenue: 71000 },
    { label: 'Sun', apps: 980, revenue: 49000 }
  ],
  weekly: [
    { label: 'Week 1', apps: 5400, revenue: 270000 },
    { label: 'Week 2', apps: 6150, revenue: 312000 },
    { label: 'Week 3', apps: 6880, revenue: 341000 },
    { label: 'Week 4', apps: 5770, revenue: 285000 }
  ],
  monthly: [
    { label: 'Jan', apps: 1820, revenue: 94000 },
    { label: 'Feb', apps: 2120, revenue: 109000 },
    { label: 'Mar', apps: 2380, revenue: 118000 },
    { label: 'Apr', apps: 2120, revenue: 109000 },
    { label: 'May', apps: 2450, revenue: 125000 },
    { label: 'Jun', apps: 2610, revenue: 130000 },
    { label: 'Jul', apps: 2540, revenue: 128000 },
    { label: 'Aug', apps: 2780, revenue: 140000 },
    { label: 'Sep', apps: 2410, revenue: 122000 },
    { label: 'Oct', apps: 2950, revenue: 149000 },
    { label: 'Nov', apps: 2820, revenue: 143000 },
    { label: 'Dec', apps: 3010, revenue: 153000 }
  ],
  yearly: [
    { label: '2023', apps: 14400, revenue: 720000 },
    { label: '2024', apps: 18200, revenue: 910000 },
    { label: '2025', apps: 21100, revenue: 1060000 },
    { label: '2026', apps: 24200, revenue: 1208000 }
  ]
};

/**
 * Loads merged national dataset (combining backend dynamic states + national repository)
 */
export async function getNationalAnalyticsData() {
  let backendStates = [];
  let backendRevenue = null;

  try {
    const [statesRes, revRes] = await Promise.all([
      apiGetStates().catch(() => ({ data: [] })),
      apiGetCentralRevenue().catch(() => ({ data: null }))
    ]);
    backendStates = statesRes?.data || [];
    backendRevenue = revRes?.data || null;
  } catch (e) {
    console.warn('Backend fetch fallback to national dataset', e);
  }

  // Base state dataset
  let states = [];

  if (backendStates.length > 0) {
    states = backendStates.map(bs => {
      const match = NATIONAL_STATES_DATA.find(s => s.code.toUpperCase() === (bs.code || '').toUpperCase() || s.id === bs.id);
      const apps = bs.totalApplications || match?.applications || 500;
      const rev = bs.totalRevenue || match?.revenue || 25000;
      return {
        id: bs.id,
        name: bs.name,
        code: bs.code || (bs.name.slice(0, 2).toUpperCase()),
        applications: apps,
        completed: match?.completed || Math.round(apps * 0.7),
        pending: match?.pending || Math.round(apps * 0.2),
        rejected: match?.rejected || Math.round(apps * 0.07),
        query: match?.query || Math.round(apps * 0.03),
        revenue: rev,
        grievances: match?.grievances || Math.round(apps * 0.15),
        grvPending: match?.grvPending || Math.round(apps * 0.04),
        grvResolved: match?.grvResolved || Math.round(apps * 0.1),
        grvEscalated: match?.grvEscalated || Math.max(1, Math.round(apps * 0.01))
      };
    });
  } else {
    states = [...NATIONAL_STATES_DATA];
  }

  // Aggregates
  const totalRevenue = states.reduce((sum, s) => sum + s.revenue, 0);
  const totalApplications = states.reduce((sum, s) => sum + s.applications, 0);
  const totalCompleted = states.reduce((sum, s) => sum + s.completed, 0);
  const totalPending = states.reduce((sum, s) => sum + s.pending, 0);
  const totalRejected = states.reduce((sum, s) => sum + s.rejected, 0);
  const totalQuery = states.reduce((sum, s) => sum + s.query, 0);
  const totalGrievances = states.reduce((sum, s) => sum + s.grievances, 0);
  const totalGrvPending = states.reduce((sum, s) => sum + s.grvPending, 0);
  const totalGrvResolved = states.reduce((sum, s) => sum + s.grvResolved, 0);
  const totalGrvEscalated = states.reduce((sum, s) => sum + s.grvEscalated, 0);
  const totalGrvInProgress = totalGrievances - (totalGrvPending + totalGrvResolved + totalGrvEscalated);

  const avgRevPerApp = totalApplications > 0 ? Math.round(totalRevenue / totalApplications) : 0;
  
  // Sort states by revenue descending
  const sortedByRevenue = [...states].sort((a, b) => b.revenue - a.revenue);
  const highestState = sortedByRevenue[0] || { name: 'Andhra Pradesh', revenue: 425000 };

  return {
    states: sortedByRevenue,
    timeTrends: NATIONAL_TIME_TRENDS,
    summary: {
      totalStates: states.length,
      totalCitizens: Math.round(totalApplications * 4.2),
      totalApplications,
      totalCompleted,
      totalPending,
      totalRejected,
      totalQuery,
      totalRevenue,
      avgRevPerApp,
      highestRevenueState: highestState.name,
      highestRevenueAmount: highestState.revenue,
      totalGrievances,
      totalGrvPending,
      totalGrvInProgress,
      totalGrvResolved,
      totalGrvEscalated,
      slaComplianceRate: 94.2
    }
  };
}

/**
 * Currency formatter (INR)
 */
export function formatINR(val, compact = false) {
  const n = Number(val) || 0;
  if (compact) {
    if (n >= 10000000) return `₹${(n / 10000000).toFixed(2)}Cr`;
    if (n >= 100000) return `₹${(n / 100000).toFixed(2)}L`;
    if (n >= 1000) return `₹${(n / 1000).toFixed(1)}K`;
    return `₹${n}`;
  }
  return '₹' + n.toLocaleString('en-IN');
}

/**
 * Number formatter
 */
export function formatNum(val) {
  return (Number(val) || 0).toLocaleString('en-IN');
}
