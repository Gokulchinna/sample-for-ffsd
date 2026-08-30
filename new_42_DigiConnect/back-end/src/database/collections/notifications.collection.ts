export interface InAppNotification {
  id: string;
  recipientId: string; // Citizen ID ('CIT-101') or Officer ID ('OFF-VRO-01') or 'ALL'
  recipientRole?: 'citizen' | 'officer' | 'admin';
  recipientDesignationId?: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'action_required';
  linkUrl: string;
  isRead: boolean;
  createdAt: string;
}

export const NOTIFICATIONS_MASTER: InAppNotification[] = [
  // Notification for Citizen Ramesh
  {
    id: 'NOTIF-001',
    recipientId: 'CIT-101',
    recipientRole: 'citizen',
    title: 'Stage Completed: Field Verification',
    message: 'Your Income Certificate application #APP-2026-1042 was verified by the VRO and forwarded to the Revenue Inspector.',
    type: 'info',
    linkUrl: 'citizen/track-application.html?id=APP-2026-1042',
    isRead: false,
    createdAt: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
  },
  // Notification for Citizen Priya
  {
    id: 'NOTIF-002',
    recipientId: 'CIT-102',
    recipientRole: 'citizen',
    title: '🎉 Certificate Issued & Ready to Download',
    message: 'Your Income Certificate #APP-2026-1011 has been signed by Tahsildar. Click to view and print.',
    type: 'success',
    linkUrl: 'citizen/certificates.html',
    isRead: false,
    createdAt: new Date(Date.now() - 4 * 3600 * 1000).toISOString(),
  },
  // Notification for VRO Officer
  {
    id: 'NOTIF-003',
    recipientId: 'OFF-VRO-01',
    recipientRole: 'officer',
    recipientDesignationId: 'DESIG-VRO',
    title: 'New Application in Queue',
    message: 'New application #APP-2026-1042 from Pocharam Village assigned to your field verification queue.',
    type: 'action_required',
    linkUrl: 'officer/review-application.html?id=APP-2026-1042',
    isRead: false,
    createdAt: new Date(Date.now() - 18 * 3600 * 1000).toISOString(),
  },
  // Notification for Revenue Inspector Officer
  {
    id: 'NOTIF-004',
    recipientId: 'OFF-RI-01',
    recipientRole: 'officer',
    recipientDesignationId: 'DESIG-RI',
    title: 'Application Pending Scrutiny',
    message: 'Application #APP-2026-1038 forwarded by VRO K. Venkatesh with inquiry notes. Scrutiny due in 2 days.',
    type: 'action_required',
    linkUrl: 'officer/review-application.html?id=APP-2026-1038',
    isRead: false,
    createdAt: new Date(Date.now() - 8 * 3600 * 1000).toISOString(),
  },
];
