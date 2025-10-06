import { Component, ViewChild, TemplateRef, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModalModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { ApicallService } from '../apicall.service';
import { CryptoService } from '../crypto.service';
import { NgSelectModule } from '@ng-select/ng-select';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NgbModalModule,
    NgSelectModule,
    FormsModule,
  ],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css'
})
export class UsersComponent implements OnInit {
  @ViewChild('dialogTemplate') dialogTemplate!: TemplateRef<any>;
  userForm!: FormGroup;
  modalTitle: string = 'Add New User';
  isEditMode: boolean = false;
  editingUser: any = null;
  searchText: string = '';
  userList: any[] = [];
  filteredUserList: any[] = [];
  usertypeList: any[] = [];
  filteredUsertypeList: any[] = [];
  roletypeList: any[] = [];

  // Dropdown options
  //typeOptions: string[] = ['Admin', 'User', 'Manager'];
  roleOptions: string[] = [];
  // userAppOptions: string[] = ['Web', 'Mobile', 'Both'];
  zoneOptions: string[] = [];
  divisionOptions: string[] = [];
  locationOptions: string[] = [];
  railwayList: any[] = [];
  filteredRailwayList: any[] = [];
  user: any = {};
  userType: String | null = null;



  constructor(
    private modalService: NgbModal,
    private fb: FormBuilder,
    private apicall: ApicallService,
    private encservice: CryptoService
  ) {


    this.userForm = this.fb.group({
      name: ['', Validators.required],
      desig: ['', Validators.required],
      mobile: ['', Validators.required],
      loginid: ['', Validators.required],
      password: ['Catgman@scr#123', Validators.required],
      type: [''],
      role: ['', Validators.required],
      userapp: [''],
      location: ['', Validators.required],
      zone: ['', Validators.required],      // ✅ Set default from localStorage
      division: ['', Validators.required], // ✅ Same here
    });


  }

  openDialog(): void {
    const userstoragedecryptData = this.encservice.decrypt(localStorage.getItem('user') || '{}')
    //console.log(userstoragedecryptData);
    const localuser = JSON.parse(userstoragedecryptData);


    this.modalTitle = 'Add New User';
    this.isEditMode = false;
    this.editingUser = null;

    // Reset the form and set initial values, including zone and division
    this.userForm.reset({
      name: '',
      desig: '',
      mobile: '',
      loginid: '',
      password: 'Catgman@scr#123',
      role: '',
      type: '-',
      location: '',
      userapp: '-',
      zone: localuser.zone || '',
      division: localuser.division || ''
    });

    // Ensure password validation is active
    this.userForm.get('password')?.setValidators(Validators.required);
    this.userForm.get('password')?.updateValueAndValidity();

    // Open the modal
    this.modalService.open(this.dialogTemplate, {
      size: 'lg',
      backdrop: 'static'
    });
  }

  ngOnInit() {
    const userstoragedecryptData = this.encservice.decrypt(localStorage.getItem('user') || '{}')
    //console.log(userstoragedecryptData);
    const userData = JSON.parse(userstoragedecryptData);
    this.userType = userData?.type || null;
    const localuser = JSON.parse(userstoragedecryptData);

    this.userForm.patchValue({
      zone: localuser.zone,
      division: localuser.division,
    });
    //console.log('User Form after patchValue:', this.userForm.value);  // Added console log

    this.getUsers();
    this.getUsertypes();
    this.getRailwayInfo();
    this.getRoletypes();
  }

  getRoletypes() {
    const data = JSON.stringify({
    });

    this.apicall.getRoletype(data).subscribe({
      next: (res: any) => {
       // console.log('Roletype response:', res);
        this.roletypeList = res;
      },
      error: (err) => {
        console.error('Error fetching Role types:', err);
        alert('Failed to fetch Role types. Please try again.');
      }
    });
  }

  getRailwayInfo() {
    const userstoragedecryptData = this.encservice.decrypt(localStorage.getItem('user') || '{}')
    //console.log(userstoragedecryptData);
    const localuser = JSON.parse(userstoragedecryptData);

    const data = {
      "zone": localuser.zone,
      "division": localuser.division,
    };


    this.apicall.getRailwayInfo(data).subscribe({
      next: (res: any) => {
        //console.log('Railway Info Response:', res);  // Added console log
        this.railwayList = res;
        // Assuming each item has a `section` property
        // const seenSections = new Set();
        // this.filteredRailwayList = this.railwayList.filter(item => {
        //   if (!seenSections.has(item.section)) {
        //     seenSections.add(item.section);
        //     return true;
        //   }
        //   return false;
        // });

        const seenStations = new Set();
        this.filteredRailwayList = this.railwayList.filter(item => {
          if (!seenStations.has(item.station)) {
            seenStations.add(item.station);
            return true;
          }
          return false;
        });

      },
      error: (err) => {
        console.error('Error fetching railway info:', err);
        alert('Failed to fetch railway info. Please try again.');
      }
    });
  }

  getUsertypes() {
    const data = JSON.stringify({
    });

    this.apicall.getUsertype(data).subscribe({
      next: (res: any) => {
        //console.log('User types:', res);
        this.usertypeList = res;
        this.filteredUsertypeList = [...this.usertypeList];
      },
      error: (err) => {
        console.error('Error fetching user types:', err);
        alert('Failed to fetch user types. Please try again.');
      }
    });
  }

  getUsers() {
    const userstoragedecryptData = this.encservice.decrypt(localStorage.getItem('user') || '{}')
    //console.log(userstoragedecryptData);
    const localuser = JSON.parse(userstoragedecryptData);


    const data = JSON.stringify({
      zone: localuser.zone,
      division: localuser.division
    });

    this.apicall.getUser(data).subscribe({
      next: (res: any) => {
        this.userList = res;
        this.filteredUserList = [...this.userList];
      },
      error: (err) => {
        console.error('Error fetching users:', err);
        alert('Failed to fetch users. Please try again.');
      }
    });
  }

  onSubmit(): void {
    if (!this.userForm.valid) {
      alert('Please fill in all required fields');
      return;
    }

    const formData = {

      ...this.userForm.value,
      id: this.isEditMode ? this.editingUser.id : null,
    };
    //console.log('Form Data being sent:', formData);  // Added console log
    if (this.isEditMode) {
      this.apicall.updateUser(JSON.stringify(formData)).subscribe({
        next: (res: any) => {
          this.getUsers();
          this.modalService.dismissAll();
          alert('User updated successfully!');
        },
        error: (err) => {
          console.error('Error updating user:', err);
          alert('Failed to update user. Please try again.');
        }
      });
    } else {
      this.apicall.insertUser(JSON.stringify(formData)).subscribe({
        next: (res: any) => {
          this.getUsers();
          this.modalService.dismissAll();
          alert('User added successfully!');
        },
        error: (err) => {
          console.error('Error adding user:', err);
          alert('Failed to add user. Please try again.');
        }
      });
    }
  }

  deleteUser(user: any): void {
    if (confirm(`Are you sure you want to delete user "${user.name}"?`)) {
      const data = JSON.stringify({
        id: user.id,
      });

      this.apicall.deleteUser(data).subscribe({
        next: (res: any) => {
          this.getUsers();
          alert('User deleted successfully!');
        },
        error: (err) => {
          console.error('Error deleting user:', err);
          alert('Failed to delete user. Please try again.');
        }
      });
    }
  }

  closeModal(): void {
    this.modalService.dismissAll();
  }

  filterUsers(): void {
    if (!this.searchText) {
      this.filteredUserList = [...this.userList];
      return;
    }

    const searchTerm = this.searchText.toLowerCase();
    this.filteredUserList = this.userList.filter(user =>
      user.name?.toLowerCase().includes(searchTerm) ||
      user.mobile?.toLowerCase().includes(searchTerm) ||
      user.loginid?.toLowerCase().includes(searchTerm)
    );
  }

  editUser(user: any): void {
    this.userForm.patchValue({
      name: user.name,
      desig: user.desig,
      mobile: user.mobile,
      loginid: user.loginid,
      type: user.type,
      role: user.role,
      userapp: user.userapp,
      location: user.location,
      zone: user.zone,
      division: user.division,

    });

    this.modalTitle = 'Edit User';
    this.isEditMode = true;
    this.editingUser = user;
    this.userForm.get('password')?.clearValidators();
    this.userForm.get('password')?.updateValueAndValidity();

    this.modalService.open(this.dialogTemplate, {
      size: 'lg',
      backdrop: 'static'
    });
  }
}
