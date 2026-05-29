import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { DashboardService } from '../../core/services/dashboard.service';
import { DashboardSummary } from '../../core/models/dashboard.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, NgxChartsModule],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class DashboardComponent implements OnInit {
  private dashboardService = inject(DashboardService);

  summary: DashboardSummary | null = null;
  isLoading = true;

  // Chart data format: [{ name: 'Dept Name', series: [{ name: 'Total', value: X }, { name: 'Compliant', value: Y }] }]
  chartData: any[] = [];
  
  // ngx-charts options
  view: [number, number] = [700, 400];
  showXAxis: boolean = true;
  showYAxis: boolean = true;
  gradient: boolean = false;
  showLegend: boolean = true;
  showXAxisLabel: boolean = true;
  xAxisLabel: string = 'Departments';
  showYAxisLabel: boolean = true;
  yAxisLabel: string = 'Documents Count';
  colorScheme: any = {
    domain: ['#007bff', '#28a745'] // Blue for Total, Green for Compliant
  };

  ngOnInit(): void {
    this.dashboardService.getSummary().subscribe({
      next: (data) => {
        this.summary = data;
        this.formatChartData(data.departmentStats);
        this.isLoading = false;
      },
      error: () => {
        console.error('Failed to load dashboard summary');
        this.isLoading = false;
      }
    });
  }

  formatChartData(stats: any[]): void {
    this.chartData = stats.map(stat => ({
      name: stat.departmentName,
      series: [
        {
          name: 'Total Documents',
          value: stat.totalDocuments
        },
        {
          name: 'Compliant',
          value: stat.compliantCount
        }
      ]
    }));
  }

  getComplianceColorClass(percentage: number): string {
    if (percentage > 80) return 'text-success';
    if (percentage >= 50) return 'text-warning';
    return 'text-danger';
  }

  getActionColor(action: string): string {
    switch (action.toLowerCase()) {
      case 'created': return 'bg-success';
      case 'updated': return 'bg-info';
      case 'deleted': return 'bg-danger';
      case 'viewed': return 'bg-secondary';
      default: return 'bg-primary';
    }
  }
}
