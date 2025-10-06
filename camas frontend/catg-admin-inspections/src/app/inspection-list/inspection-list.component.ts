import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApicallService } from '../apicall.service';

@Component({
  selector: 'app-inspection-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './inspection-list.component.html',
  styleUrls: ['./inspection-list.component.css']
})
export class InspectionListComponent implements OnInit {
  inspections: any[] = [];
  fromDate: string = '';
  toDate: string = '';
  userId: string | number = '';

  constructor(private apicall: ApicallService) {}

  ngOnInit() {
    // Retrieve userId from localStorage
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    this.userId = user.id || '';

    // Set fromDate to the first day of the current month
    const today = new Date();
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
    this.fromDate = this.formatDate(firstDay);

    // Set toDate to the current date
    this.toDate = this.formatDate(today);

    // Log dates for debugging
    //console.log('Initial Dates:', { fromDate: this.fromDate, toDate: this.toDate, today: today.toString() });

    // Initial fetch with current month's date range
    this.fetchInspections();
  }

  // Format date to YYYY-MM-DD in local time (IST)
  formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  // Fetch inspections from API
  fetchInspections() {
    if (!this.userId) {
      console.error('User ID not found in localStorage');
      alert('User not logged in. Please log in to view inspections.');
      return;
    }

    const params = {
      official_id: this.userId,
      fromDate: this.fromDate || this.formatDate(new Date(new Date().setDate(new Date().getDate() - 1))),
      toDate: this.toDate || this.formatDate(new Date(new Date().setDate(new Date().getDate() - 1)))
    };

    //console.log('Fetch Params:', params);

    this.apicall.getInspectionData(params).subscribe({
      next: (res: any) => {
        //console.log('Inspection Data:', res);
        // Check if response has data property and it's an array
        const inspectionData = Array.isArray(res.data) ? res.data : [];
        
        this.inspections = inspectionData.map((item: any, index: number) => ({
          sno: index + 1,
          inspId: item.inspection?.id || `INSP${index + 1}`,
          dateOfCheck: item.inspection?.inspection_date || '',
          trainStation: `${item.inspection?.train_number || ''} / ${item.inspection?.station || ''}`,
          official: item.official_name || 'Unknown Official',
          licensee: item.contract_details?.Licensee_name || '',
          unitNumber: item.inspection?.unit_number || '',
          vendorDetails: item.inspection?.vendor_details || '',
          deficiency: item.inspection?.deficiency_details || '',
          fineImposed: item.inspection?.fine_imposed || 0,
          fineRealised: 0,
          balance: item.inspection?.fine_imposed ? (item.inspection?.fine_imposed || 0) : 0,
          prosecution: 0,
          mrNumber: '',
          mrDate: '',
          remarks: item.inspection?.remarks || '',
          contractDetails: {
            firmName: item.contract_details?.Licensee_firm_name || '',
            mobile: item.contract_details?.Licensee_mobile || '',
            name: item.contract_details?.Licensee_name || '',
            division: item.contract_details?.Lincensee_division || '',
            pan: item.contract_details?.Lincensee_pan || '',
            status: item.contract_details?.Lincensee_status || '',
            type: item.contract_details?.Lincensee_type || '',
            zone: item.contract_details?.Lincensee_zone || '',
            contractCode: item.contract_details?.contract_code || '',
            activity: item.contract_details?.contract_details_activity || '',
            awardStatus: item.contract_details?.contract_details_award_status || '',
            duration: item.contract_details?.contract_details_duration || '',
            endDate: item.contract_details?.contract_details_end_date || '',
            modeOfOperation: item.contract_details?.contract_details_mode_of_operation || '',
            employees: item.contract_details?.contract_details_no_of_employees || 0,
            payMode: item.contract_details?.contract_details_pay_mode || '',
            remarks: item.contract_details?.contract_details_remarks || '',
            startDate: item.contract_details?.contract_details_start_date || '',
            location: item.contract_details?.contract_location || '',
            stall: item.contract_details?.contract_stall || '',
            stationName: item.contract_details?.contract_station_name || ''
          }
        }));
      },
      error: (err) => {
        console.error('Error fetching inspection data:', err);
        alert('Failed to fetch inspection data. Please try again.');
        this.inspections = [];
      }
    });
  }

  // Handle date filter changes
  onDateChange() {
    //console.log('Date Changed:', { fromDate: this.fromDate, toDate: this.toDate });
    this.fetchInspections();
  }

  // Determine if screen is large (≥ 768px)
  screenIsLarge(): boolean {
    return window.innerWidth >= 768;
  }

  get filteredInspections() {
    // Add this console log
    const filtered = this.inspections.filter(inspect => {
      const checkDate = new Date(inspect.dateOfCheck);
      const from = this.fromDate ? new Date(this.fromDate) : null;
      const to = this.toDate ? new Date(this.toDate) : null;

      if (from && checkDate < from) return false;
      if (to && checkDate > to) return false;

      return true;
    });
    //console.log('Filtered inspections:', filtered);
    return filtered;
  }
}