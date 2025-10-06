import { Component, ViewChild, TemplateRef, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModalModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { ApicallService } from '../apicall.service';
import { CryptoService } from '../crypto.service';

@Component({
  selector: 'app-railywayinfo',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NgbModalModule,
    FormsModule,
  ],
  templateUrl: './railywayinfo.component.html',
  styleUrl: './railywayinfo.component.css'
})
export class RailywayinfoComponent implements OnInit {
  @ViewChild('dialogTemplate') dialogTemplate!: TemplateRef<any>;
  railwayForm: FormGroup;
  modalTitle: string = 'Add New Railway Info';
  isEditMode: boolean = false;
  editingInfo: any = null;
  searchText: string = '';
  railwayList: any[] = [];
  filteredRailwayList: any[] = [];
  user: any = {};
  userType: String | null = null;
  zone: any;
  division: any;
  stationCategories: string[] = ['NSG-1', 'NSG-2','NSG-3', 'NSG-4','NSG-5', 'NSG-6','NSG-7','NSG-8','HG-1','HG-2','HG-3'];



  constructor(
    private modalService: NgbModal,
    private fb: FormBuilder,
    private apicall: ApicallService,
    private encservice: CryptoService
  ) {

    this.railwayForm = this.fb.group({
      zone: ['', Validators.required],
      division: ['', Validators.required],
      section: ['', Validators.required],
      station: ['', Validators.required],  // Changed from status to station
      station_category: ['', Validators.required],
    });
  }

  ngOnInit() {
    const userstoragedecryptData = this.encservice.decrypt(localStorage.getItem('user') || '{}')
    //console.log(userstoragedecryptData);
    const userData = JSON.parse(userstoragedecryptData);
    this.userType = userData?.type || null;

    this.user = userData;
    //  console.log(this.user);
    this.zone = this.user.zone;
    this.division = this.user.division;


    this.getRailwayInfo();

  }

  getRailwayInfo() {
    const userstoragedecryptData = this.encservice.decrypt(localStorage.getItem('user') || '{}')
    //console.log(userstoragedecryptData);
    const userData = JSON.parse(userstoragedecryptData);

    const user = userData;
    const data = {
      "zone": this.userType == 'Masters' ? '' : user.zone,
      "division": this.userType == 'Masters' ? '' : user.division,
    };



    this.apicall.getRailwayInfo(data).subscribe({
      next: (res: any) => {
        //   console.log('Railway Info Response:', res);  // Added console log
        this.railwayList = res;
        this.filteredRailwayList = [...this.railwayList];
      },
      error: (err) => {
        console.error('Error fetching railway info:', err);
        alert('Failed to fetch railway info. Please try again.');
      }
    });
  }

  onSubmit(): void {
    this.railwayForm.patchValue({
      zone: this.zone,
      division: this.division,
    });

    if (!this.railwayForm.valid) {
      alert('Please fill in all required fields');
      return;
    }

    const userstoragedecryptData = this.encservice.decrypt(localStorage.getItem('user') || '{}')
    // console.log(userstoragedecryptData);
    const userData = JSON.parse(userstoragedecryptData);

    const user = userData;

    const formData = {
      ...this.railwayForm.value,
      // zone: this.userType == 'Masters'? railwayForm.zone: user.zone,
      // division: this.userType == 'Masters'? this.division: user.division,
      id: this.isEditMode ? this.editingInfo.id : null
    };

    // console.log('Form Data being sent:', formData);  // Added console log

    if (this.isEditMode) {
      this.apicall.updateRailwayInfo(JSON.stringify(formData)).subscribe({
        next: (res: any) => {

          //console.log('Update Response:', res);  // Added console log
          this.getRailwayInfo();
          this.modalService.dismissAll();
          alert('Railway Info updated successfully!');
        },
        error: (err) => {
          console.error('Error updating railway info:', err);
          alert('Failed to update railway info. Please try again.');
        }
      });
    } else {
      this.apicall.insertRailwayInfo(JSON.stringify(formData)).subscribe({
        next: (res: any) => {
          //console.log('Insert Response:', res);  // Added console log
          this.getRailwayInfo();
          this.modalService.dismissAll();
          alert('Railway Info added successfully!');
        },
        error: (err) => {
          console.error('Error adding railway info:', err);
          alert('Failed to add railway info. Please try again.');
        }
      });
    }
  }

  deleteInfo(info: any): void {
    if (confirm(`Are you sure you want to delete this railway info?`)) {
      const userstoragedecryptData = this.encservice.decrypt(localStorage.getItem('user') || '{}')
      //console.log(userstoragedecryptData);
      const userData = JSON.parse(userstoragedecryptData);

      const user = userData;
      const data = {
        id: info.id,
        zone: user.zone,
        division: user.division
      };

      this.apicall.deleteRailwayInfo(JSON.stringify(data)).subscribe({
        next: (res: any) => {
          this.getRailwayInfo();
          alert('Railway Info deleted successfully!');
        },
        error: (err) => {
          console.error('Error deleting railway info:', err);
          alert('Failed to delete railway info. Please try again.');
        }
      });
    }
  }

  closeModal(): void {
    this.modalService.dismissAll();
  }

  filterRailwayInfo(): void {
    if (!this.searchText) {
      this.filteredRailwayList = [...this.railwayList];
      return;
    }

    const searchTerm = this.searchText.toLowerCase();
    this.filteredRailwayList = this.railwayList.filter(info =>
      info.zone?.toLowerCase().includes(searchTerm) ||
      info.division?.toLowerCase().includes(searchTerm) ||
      info.station?.toLowerCase().includes(searchTerm)  // Changed from status to station
    );
  }

  openDialog(): void {

    this.zone = this.user.zone;
    this.division = this.user.division;

    this.modalTitle = 'Add New Railway Info';
    this.isEditMode = false;
    this.editingInfo = null;
    this.railwayForm.reset();


    this.modalService.open(this.dialogTemplate, {
      size: 'md',
      backdrop: 'static'
    });
  }

  editInfo(info: any): void {
    this.zone = info.zone;
    this.division = info.division;

    this.railwayForm.patchValue({
      zone: info.zone,
      division: info.division,
      station: info.station,  // Changed from status to station
      section: info.section,
      station_category: info.station_category,
    });

    this.modalTitle = 'Edit Railway Info';
    this.isEditMode = true;
    this.editingInfo = info;

    this.modalService.open(this.dialogTemplate, {
      size: 'md',
      backdrop: 'static'
    });
  }
}
