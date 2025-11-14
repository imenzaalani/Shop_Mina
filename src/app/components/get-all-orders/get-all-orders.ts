import { Component, OnInit } from '@angular/core';
import { OrderService, Order } from '../../services/order/order.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-get-all-orders',
  imports: [CommonModule, FormsModule, DecimalPipe],
  templateUrl: './get-all-orders.html',
  styleUrl: './get-all-orders.css',
})
export class GetAllOrders implements OnInit {
  orders: Order[] = [];
  filterText = '';
  selectedStatusDropdown = '';
  selectedStatusBar = '';
  filteredOrders: Order[] = [];
  currentPage = 1;
  pageSize = 10;

  showItemsModal = false;
  selectedOrder: Order | null = null;

  constructor(private orderService: OrderService) {}

  ngOnInit(): void {
    this.orderService.getOrders().subscribe({
      next: (data: Order[]) => {
        this.orders = data;
        console.log('Fetched orders:', this.orders);
        this.applyFilter();
      },
      error: (err: any) => {
        console.error('Failed to fetch orders', err);
        this.orders = [];
        this.applyFilter();
      }
    });
  }

  get statusCounts() {
    return {
      all: this.orders.length,
      pending: this.orders.filter(o => o.status === 'pending').length,
      paid: this.orders.filter(o => o.status === 'paid').length,
      shipped: this.orders.filter(o => o.status === 'shipped').length,
      cancelled: this.orders.filter(o => o.status === 'cancelled').length
    };
  }

  applyFilter(): void {
    this.filteredOrders = this.orders.filter(o => {
      const matchesText = this.filterText ? (
        (typeof o.userId === 'string' && o.userId.toLowerCase().includes(this.filterText.toLowerCase())) ||
        (typeof o.userId === 'object' && (
          (o.userId.firstName && o.userId.firstName.toLowerCase().includes(this.filterText.toLowerCase())) ||
          (o.userId.lastName && o.userId.lastName.toLowerCase().includes(this.filterText.toLowerCase())) ||
          (o.userId.email && o.userId.email.toLowerCase().includes(this.filterText.toLowerCase()))
        )) ||
        (o._id && o._id.includes(this.filterText))
      ) : true;
      const statusToFilter = this.selectedStatusBar || this.selectedStatusDropdown;
      const matchesStatus = statusToFilter ? o.status === statusToFilter : true;
      return matchesText && matchesStatus;
    });
    this.currentPage = 1;
  }

  setStatusBar(status: string) {
    this.selectedStatusBar = status;
    this.applyFilter();
  }

  get paginatedOrders(): Order[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filteredOrders.slice(start, start + this.pageSize);
  }

  get totalPages(): number {
    return Math.ceil(this.filteredOrders.length / this.pageSize) || 1;
  }

  prevPage(): void {
    if (this.currentPage > 1) this.currentPage--;
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) this.currentPage++;
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) this.currentPage = page;
  }

  view(order: Order): void {
    alert('View order: ' + (order._id || ''));
  }

  preview(order: Order): void {
    alert('Preview order: ' + (order._id || ''));
  }

  delete(order: Order): void {
    if (confirm('Delete this order?')) {
      this.orders = this.orders.filter(o => o._id !== order._id);
      this.applyFilter();
    }
  }

  openItemsModal(order: Order): void {
    this.selectedOrder = order;
    this.showItemsModal = true;
  }

  closeItemsModal(): void {
    this.showItemsModal = false;
    this.selectedOrder = null;
  }

  // Add these helper methods for user display
  getUserName(order: any): string {
    if (order.isGuestOrder) {
      // Guest order: use guest info
      return (order.guest?.firstName || '') + ' ' + (order.guest?.lastName || '');
    }
    // Registered user: use userId object if available
    if (order.userId && typeof order.userId === 'object') {
      return (order.userId.firstName || '') + ' ' + (order.userId.lastName || '');
    }
    return '-';
  }

  getUserEmail(order: any): string {
    if (order.isGuestOrder) {
      return order.guest?.email || '-';
    }
    if (order.userId && typeof order.userId === 'object') {
      return order.userId.email || '-';
    }
    return '-';
  }
}

