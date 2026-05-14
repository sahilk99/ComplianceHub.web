export interface DashboardSummary {
  totalDocuments: number;
  compliantCount: number;
  expiringSoonCount: number;
  overdueCount: number;
  overallCompliancePercentage: number;
  departmentStats: DepartmentStat[];
  recentActivity: any[]; // Assuming specific shape isn't strictly defined in prompt
}

export interface DepartmentStat {
  departmentName: string;
  totalDocuments: number;
  compliantCount: number;
  compliancePercentage: number;
}
