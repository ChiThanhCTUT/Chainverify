export interface Certificate {
  id: string;
  recipientName: string;
  courseProgram: string;
  issueDate: string;
  status: 'Valid' | 'Revoked' | 'Pending';
  txHash: string;
  checksum: string;
  issuerName: string;
  issuerLogo: string;
  timestamp: string;
}

export interface ActivityLog {
  studentId: string;
  name: string;
  program: string;
  dateIssued: string;
  status: 'Verified' | 'Revoked';
  txHash: string;
}

export type AppView = 'landing' | 'verify' | 'admin' | 'student';
