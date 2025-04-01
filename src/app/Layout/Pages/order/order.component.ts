import { Component, OnInit } from '@angular/core';
import { OrderService } from '../../../Shared/Services/order/order.service';
import { CommonModule } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';
import { ChartData, ChartOptions, TooltipItem } from 'chart.js';
import { CartItem, Order } from '../../../Shared/Interfaces/product';


@Component({
  selector: 'app-order',
  standalone: true,
  imports: [CommonModule, BaseChartDirective],
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css']
})
export class OrderComponent implements OnInit {
  AllOrders: Order[] = [];
  isLoading = true;
  
  priceChartData!: ChartData<'bar'>;
  productDistributionChartData!: ChartData<'pie'>;
  paymentMethodChartData!: ChartData<'doughnut'>;
  
  private goldenPalette = [
    '#FED700', // Primary gold
    '#FFE44D', // Lighter gold
    '#F5C400', // Darker gold
    '#FFF5CC', // Very light gold
    '#D4AF37'  // Metallic gold
  ];

  private complementaryPalette = [
    '#2E3A59', // Dark blue
    '#5C6BC0', // Medium blue
    '#8BC34A', // Green
    '#FF7043', // Orange
    '#7E57C2'  // Purple
  ];

  chartOptions: ChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          color: '#333',
          font: {
            size: 12,
            family: "'Inter', sans-serif"
          },
          padding: 20,
          usePointStyle: true,
          pointStyle: 'circle'
        }
      },
      tooltip: {
        backgroundColor: '#2E3A59',
        titleColor: '#FED700',
        bodyColor: 'white',
        borderColor: '#FED700',
        borderWidth: 1,
        padding: 12,
        cornerRadius: 8,
        displayColors: true,
        callbacks: {
          label: (context: TooltipItem<'bar'> | TooltipItem<'pie'> | TooltipItem<'doughnut'>) => {
            return `${context.dataset.label}: ${context.formattedValue}`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)'
        },
        ticks: {
          color: '#666'
        }
      },
      x: {
        grid: {
          display: false
        },
        ticks: {
          color: '#666'
        }
      }
    }
  };

  constructor(private orderService: OrderService) {}

  ngOnInit(): void {
    this.getAllOrders();
  }

  getAllOrders(): void {
    this.isLoading = true;
    this.orderService.getAllOrders().subscribe({
      next: (response: any) => {
        this.AllOrders = response.data || response;
        this.prepareChartData();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error fetching orders:', error);
        this.isLoading = false;
      }
    });
  }

  private prepareChartData(): void {
    if (!this.AllOrders.length) {
      console.warn('No orders data available');
      return;
    }

    this.priceChartData = {
      labels: this.AllOrders.map((order: Order) => `Order #${order.id}`),
      datasets: [{
        label: 'Total Order Price',
        data: this.AllOrders.map((order: Order) => order.totalOrderPrice),
        backgroundColor: this.goldenPalette[0],
        borderColor: this.goldenPalette[2],
        borderWidth: 2,
        borderRadius: 6,
        hoverBackgroundColor: this.goldenPalette[1]
      }]
    };

  
    const paymentMethods = this.AllOrders.reduce((acc: Record<string, number>, order: Order) => {
      acc[order.paymentMethodType] = (acc[order.paymentMethodType] || 0) + 1;
      return acc;
    }, {});

    this.paymentMethodChartData = {
      labels: Object.keys(paymentMethods),
      datasets: [{
        label: 'Payment Methods',
        data: Object.values(paymentMethods),
        backgroundColor: [
          this.goldenPalette[0],
          this.complementaryPalette[0],
          this.complementaryPalette[1]
        ],
        borderWidth: 1,
        hoverOffset: 10
      }]
    };
  }
}