import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApicallService } from '../apicall.service';
import { CryptoService } from '../crypto.service';

@Component({
  selector: 'app-inspection-report',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './inspection-report.component.html',
  styleUrls: ['./inspection-report.component.css']
})
export class InspectionReportComponent implements OnInit {
  inspections: any[] = [];
  fromDate: string = '';
  toDate: string = '';
  userId: string | number = '';

  constructor(private apicall: ApicallService, private encservice: CryptoService) { }

  ngOnInit() {
    const userstoragedecryptData = this.encservice.decrypt(localStorage.getItem('user') || '{}')
    //console.log(userstoragedecryptData);
    const userData = JSON.parse(userstoragedecryptData);

    const user = userData;
    this.userId = user.id || '';

    const today = new Date();
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
    const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);

    this.fromDate = this.formatDate(firstDay);
    this.toDate = this.formatDate(lastDay);
    //console.log('Initial Dates:', { fromDate: this.fromDate, toDate: this.toDate, today: today.toString() });
    this.fetchInspections();
  }

  formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  fetchInspections() {
    if (!this.userId) {
      console.error('User ID not found in localStorage');
      alert('User not logged in. Please log in to view inspections.');
      this.inspections = [];
      return;
    }

    const params = {
      officialId: this.userId,
      fromDate: this.fromDate || this.formatDate(new Date()),
      toDate: this.toDate || this.formatDate(new Date())
    };

    //console.log('Fetch Params:', params);

    this.apicall.getInspectionsReportCCI(params).subscribe({
      next: (res: any) => {
        //console.log('Inspection Data:', res);
        const inspectionData = Array.isArray(res.inspdata) ? res.inspdata : [];
        this.inspections = inspectionData.map((item: any, index: number) => ({
          ...item,
          sno: index + 1
        }));
        //console.log('Inspections:', this.inspections);
      },
      error: (err) => {
        console.error('Error fetching inspection data:', err);
        alert('Failed to fetch inspection data. Please try again.');
        this.inspections = [];
      }
    });
  }

  onDateChange() {
    //console.log('Date Changed:', { fromDate: this.fromDate, toDate: this.toDate });
    if (this.fromDate && this.toDate && new Date(this.fromDate) <= new Date(this.toDate)) {
      this.fetchInspections();
    }
  }

  screenIsLarge(): boolean {
    return window.innerWidth >= 768;
  }

  getVendorDetails(row: any): string {
    const vendorDetails = [row.vendor_name, row.vendor_id, row.vendor_aadhar]
      .filter(item => item)
      .join(', ');
    const lecenseeDetails = [row.licensee_name, row.licensee_number, row.licensee_division]
      .filter(item => item)
      .join(', ');
    return vendorDetails || lecenseeDetails || 'N/A';
  }

  printReport() {
    document.body.classList.add('print-mode');
    window.print();
    document.body.classList.remove('print-mode');
  }
}