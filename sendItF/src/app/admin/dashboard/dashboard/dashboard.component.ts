import { Component, OnInit, ViewChild } from '@angular/core';
import { ChartData, ChartOptions } from 'chart.js';
import { NgChartsModule, BaseChartDirective } from 'ng2-charts';
import { CommonModule } from '@angular/common';
import { DashboardService } from '../../../services/dashboard.service';
import { ParcelStats } from '../../../interfaces/parcel-stats';
import { UserStats } from '../../../interfaces/user-stats';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, NgChartsModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {

  @ViewChild('pieChart') pieChart?: BaseChartDirective;
  @ViewChild('lineChart') lineChart?: BaseChartDirective;

  public stats: ParcelStats | null = null;
  public userStats: UserStats | null = null;

  public pieChartOptions: ChartOptions<'pie'> = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
    },
  };

  public pieChartData: ChartData<'pie', number[], string> = {
    labels: ['Total', 'Pending', 'In Transit', 'Delivered', 'Cancelled'],
    datasets: [
      {
        data: [0, 0, 0, 0, 0],
        backgroundColor: ['#facc15', '#3b82f6', '#10b981', '#f87171', '#f65171'],
      },
    ],
  };

  public lineChartData: ChartData<'line'> = {
    labels: [],
    datasets: [
      {
        data: [],
        label: 'Parcels This Week',
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59,130,246,0.1)',
        fill: true,
      },
    ],
  };

  public lineChartOptions: ChartOptions<'line'> = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Week',
        },
      },
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Parcels',
        },
      },
    },
  };

  public pieChartType: 'pie' = 'pie';

  constructor(private dashboardService: DashboardService) {}

  ngOnInit(): void {
    this.dashboardService.getParcelStats().subscribe((stats: ParcelStats) => {
      this.stats = stats;
      this.pieChartData.datasets[0].data = [
        stats.total,
        stats.pending,
        stats.inTransit,
        stats.delivered,
        stats.cancelled,
      ];
      this.pieChart?.update();
    });

    this.dashboardService.getParcelTrends().subscribe((trends) => {
      this.lineChartData.labels = trends.map((t) => t.week);
      this.lineChartData.datasets[0].data = trends.map((t) => t.count);
      this.lineChart?.update();
    });

    this.dashboardService.getUserStats().subscribe((res) => {
      this.userStats = res.data;
    });
  }

  exportAsCSV(): void {
    const labels = this.pieChartData.labels ?? [];
    const data = this.pieChartData.datasets[0].data;
    const rows = labels.map((label, i) => `${label},${data[i]}`);
    const csv = `Status,Count\n${rows.join('\n')}`;
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'parcel-stats.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  }

  exportChartImage(): void {
    const canvas = document.querySelector('canvas') as HTMLCanvasElement;
    if (!canvas) return;
    const image = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = image;
    a.download = 'parcel-chart.png';
    a.click();
  }
}
