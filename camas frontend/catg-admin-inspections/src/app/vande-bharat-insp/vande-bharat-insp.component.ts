import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApicallService } from '../apicall.service';
import * as XLSX from 'xlsx';

// Angular Material
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

// Registration Component
import { VandeBharatRegComponent } from '../vande-bharat-reg/vande-bharat-reg.component';

@Component({
  selector: 'app-vande-bharat-insp',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatTableModule,
    MatDialogModule
  ],
  templateUrl: './vande-bharat-insp.component.html',
  styleUrls: ['./vande-bharat-insp.component.css']
})
export class VandeBharatInspComponent implements OnInit {

  vandeBharatList: any[] = [];
  allVandeBharatList: any[] = [];
  search_train_no: string = '';
  fromDate: Date = new Date();
  toDate: Date = new Date();
  fromDateApi: string = '';
  toDateApi: string = '';

  constructor(private api: ApicallService, private dialog: MatDialog) { }

  ngOnInit(): void {
    const today = new Date();
    this.fromDate = new Date(today.getFullYear(), today.getMonth(), 1);
    this.toDate = today;
    this.updateFromDate();
    this.updateToDate();
    this.loadInspectionsByDate();
  }

  updateFromDate() {
    this.fromDateApi = `${this.fromDate.getFullYear()}-${String(this.fromDate.getMonth() + 1).padStart(2, '0')}-${String(this.fromDate.getDate()).padStart(2, '0')}`;
  }

  updateToDate() {
    this.toDateApi = `${this.toDate.getFullYear()}-${String(this.toDate.getMonth() + 1).padStart(2, '0')}-${String(this.toDate.getDate()).padStart(2, '0')}`;
  }

  loadInspectionsByDate() {
    const sendDatedata = { from_date: this.fromDateApi, to_date: this.toDateApi };
    this.api.vande_bharat_getByDateRange(sendDatedata).subscribe({
      next: (res: any) => {
        this.allVandeBharatList = res;
        this.vandeBharatList = res;
      },
      error: (err) => alert(err.error?.message || 'Failed to load inspections')
    });
  }

 apply_filter() {
  const search_value = (this.search_train_no || '').trim().toLowerCase();

  if (!search_value) {
    this.vandeBharatList = [...this.allVandeBharatList];
    return;
  }

  this.vandeBharatList = this.allVandeBharatList.filter(item => {
    const trainNumber = item.pc_details?.T_Number || ''; // <-- access nested property
    return trainNumber.toString().toLowerCase().includes(search_value);
  });
}


  printTable() {
    const printContents = document.getElementById('print-section')?.innerHTML;
    if (!printContents) return;
    const originalContents = document.body.innerHTML;
    document.body.innerHTML = printContents;
    window.print();
    document.body.innerHTML = originalContents;
    window.location.reload();
  }

  exportToExcel(): void {
    const element = document.getElementById('print-section');
    if (!element) return;
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'VandeBharatInspections');
    XLSX.writeFile(wb, 'VandeBharatInspections.xlsx');
  }

goToRegistration() {
  const dialogRef = this.dialog.open(VandeBharatRegComponent, {
    width: '1200px',        // increase width
    maxHeight: '95vh',
    panelClass: 'custom-dialog',
    data: {}
  });

  dialogRef.afterClosed().subscribe(result => {
    if (result) this.loadInspectionsByDate();
  });
}

editVandeBharat(id: any) {
  const dialogRef = this.dialog.open(VandeBharatRegComponent, {
    width: '1200px',        // increase width
    maxHeight: '95vh',
    panelClass: 'custom-dialog',
    data: { id }
  });

  dialogRef.afterClosed().subscribe(result => {
    if (result) this.loadInspectionsByDate();
  });
}

}
