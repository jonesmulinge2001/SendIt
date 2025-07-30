import { Component, OnInit } from '@angular/core';
import { Parcel } from '../../interfaces/parcel';
import { ParcelTrackingHistory } from '../../interfaces/parcel-tracking-history';
import { UserParcelService } from '../../services/user-parcel.service';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { NavbarComponent } from "../navbar/navbar.component";

type ParcelTab = 'sent' | 'received' | 'pending';

@Component({
  imports: [CommonModule, NavbarComponent],
  selector: 'app-user-parcels',
  templateUrl: './my-dashboard.component.html',
})
export class UserParcelsComponent implements OnInit {
  sentParcels: Parcel[] = [];
  receivedParcels: Parcel[] = [];
  pendingPickups: Parcel[] = [];
  activeTab: ParcelTab = 'sent';

  selectedTrackingHistory: ParcelTrackingHistory[] = [];
  showTrackingModal = false;

  currentPage = 1;
  itemsPerPage = 4;

  constructor(
    private userParcelService: UserParcelService,
    toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.fetchAllParcels();
  }

  fetchAllParcels() {
    this.userParcelService.getSentParcels().subscribe((data) => {
      this.sentParcels = data;
      console.log(
        'Sent Statuses:',
        this.sentParcels.map((p) => p.status)
      );
    });
    this.userParcelService.getReceivedParcels().subscribe((data) => {
      this.receivedParcels = data;
      console.log(
        'Received Statuses:',
        this.receivedParcels.map((p) => p.status)
      );
    });
    this.userParcelService.getPendingPickups().subscribe((data) => {
      this.pendingPickups = data;
      console.log(
        'Pending Statuses:',
        this.pendingPickups.map((p) => p.status)
      );
    });
  }

  toggleTab(tab: ParcelTab) {
    this.activeTab = tab;
    this.currentPage = 1;
  }

  openTrackingHistory(parcelId: string): void {
    this.userParcelService.getTrackingHistory(parcelId).subscribe((history) => {
      this.selectedTrackingHistory = history;
      this.showTrackingModal = true;
    });
  }

  closeTrackingModal(): void {
    this.showTrackingModal = false;
  }

  get paginatedParcels(): Parcel[] {
    const list = this.getActiveParcelList();
    const start = (this.currentPage - 1) * this.itemsPerPage;
    return list.slice(start, start + this.itemsPerPage);
  }

  get totalPages(): number {
    return Math.ceil(this.getActiveParcelList().length / this.itemsPerPage);
  }

  getActiveParcelList(): Parcel[] {
    switch (this.activeTab) {
      case 'sent':
        return this.sentParcels;
      case 'received':
        return this.receivedParcels;
      case 'pending':
        return this.pendingPickups;
      default:
        return [];
    }
  }

  goToPage(page: number): void {
    this.currentPage = page;
  }

  downloadSimpleReceipt(parcels: Parcel[], fileName: string): void {
    if (!parcels.length) return;
  
    const doc = new jsPDF();
    doc.setFontSize(12);
    doc.text('Parcels Receipt Report', 14, 20);
  
    const tableBody = parcels.map(parcel => [
      parcel.id,
      parcel.title,
      parcel.description,
      parcel.receiverName || '',
      parcel.destination || '',
      parcel.status,
      parcel.updatedAt ? new Date(parcel.updatedAt).toLocaleString() : '',
    ]);
  
    autoTable(doc, {
      head: [['Order ID', 'Title', 'Description', 'Receiver', 'Destination', 'Status', 'Last Updated']],
      body: tableBody,
      startY: 30,
      styles: { fontSize: 10 },
      headStyles: { fillColor: [41, 128, 185] }
    });
  
    doc.save(`${fileName}.pdf`);
  }

  downloadSentReceipt(): void {
    this.downloadSimpleReceipt(this.sentParcels, 'sent-parcels');
  }

  downloadReceivedReceipt(): void {
    this.downloadSimpleReceipt(this.receivedParcels, 'received-parcels');
  }

  getStatusCount(status: string): number {
    const list = this.getActiveParcelList();
    return list.filter(
      (parcel) => parcel.status?.toUpperCase() === status.toUpperCase()
    ).length;
  }

  generateReceipt(parcel: Parcel): void {
    const doc = new jsPDF();

    doc.setFontSize(10);
    doc.text('Parcel Receipt', 10, 20);

    doc.setFontSize(12);
    doc.text(`Order ID: ${parcel.id}`, 10, 40);
    doc.text(`Parcel Title: ${parcel.title}`, 10, 50);
    doc.text(`Description: ${parcel.description}`, 10, 60);
    doc.text(`Recipient: ${parcel.receiverName || 'N/A'}`, 10, 70);
    doc.text(`Destination: ${parcel.destination || 'N/A'}`, 10, 80);
    doc.text(`Status: ${parcel.status}`, 10, 90);
    doc.text(
      `Last Updated: ${new Date(
        parcel.updatedAt || parcel.createdAt
      ).toLocaleString()}`,
      10,
      100
    );

    doc.save(`parcel-receipt-${parcel.id}.pdf`);
  }
}
