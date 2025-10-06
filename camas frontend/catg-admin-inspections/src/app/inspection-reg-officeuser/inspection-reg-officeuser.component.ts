import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { Router } from '@angular/router';
import { ApicallService } from '../apicall.service';

@Component({
  selector: 'app-inspection-reg-officeuser',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgSelectModule],
  templateUrl: './inspection-reg-officeuser.component.html',
  styleUrl: './inspection-reg-officeuser.component.css'
})
export class InspectionRegOfficeuserComponent implements OnInit {

  inspectionForm: FormGroup;
  unitNumbers: any[] = [];
  modesOfInspection: any[] = [];
  categoriesOfDeficiency: any[] = [];
  actionsTaken: any[] = [];
  userRole: string = '';
  userId: string | number = '';
  zone: string = '';
  division: string = '';

  constructor(
    private fb: FormBuilder,
    private apicall: ApicallService,
    private router: Router
  ) {
    this.inspectionForm = this.fb.group({
      officialId: ['', Validators.required],
      unitNumber: ['', Validators.required],
      inspectionDate: ['', Validators.required],
      inspectionMode: ['', Validators.required],
      locationType: ['train', Validators.required],
      trainNumber: [''],
      station: [''],
      section: [''],
      vendorDetails: [''],
      deficiencies: ['', Validators.required],
      deficiencyCategory: ['', Validators.required],
      vendorName: [''],
      vendorNumber: [''],
      vendorAadhar: [''],
      licenseeName: [''],
      licenseeNumber: [''],
      licenseeDivision: [''],
      actionTaken: [''],
      fineImposed: [''],
      actionRemarks: ['']
    });
  }

  ngOnInit() {
    // Retrieve user from localStorage
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    this.userRole = user.role || '';
    this.userId = user.id || '';
    this.zone = user.zone || '';
    this.division = user.division || '';

    // Set officialId value and make it read-only
    this.inspectionForm.patchValue({
      officialId: this.userId
    });
    this.inspectionForm.get('officialId')?.disable();

    // Fetch dropdown data
    this.getUnitDetails();
    this.getModesOfInspection();
    this.getCategoriesOfDeficiency();
    this.getActionsTaken();

    // Subscribe to actionTaken changes
    this.inspectionForm.get('actionTaken')?.valueChanges.subscribe(value => {
      const fineImposedControl = this.inspectionForm.get('fineImposed');
      const actionRemarksControl = this.inspectionForm.get('actionRemarks');

      // Handle fine imposed field
      if (value === 'Fined') {
        fineImposedControl?.enable();
        fineImposedControl?.setValidators([Validators.required, Validators.min(1)]);
      } else {
        fineImposedControl?.setValue(0);
        fineImposedControl?.disable();
        fineImposedControl?.clearValidators();
      }
      fineImposedControl?.updateValueAndValidity();

      // Handle action remarks based on action taken
      if (value === 'Handed Over To IPF') {
        actionRemarksControl?.setValue('Handed Over To IPF');
      } else if (value === 'Handed Over To P-CTI') {
        actionRemarksControl?.setValue('Handed Over To P-CTI');
      } else {
        actionRemarksControl?.setValue('');
      }
    });
  }

  

  onLocationTypeChange() {
    const locationType = this.inspectionForm.get('locationType')?.value;
    if (locationType === 'train') {
      this.inspectionForm.get('trainNumber')?.setValidators([Validators.required]);
      this.inspectionForm.get('station')?.clearValidators();
      this.inspectionForm.get('section')?.clearValidators();
      this.inspectionForm.get('vendorName')?.clearValidators();
      this.inspectionForm.get('vendorNumber')?.clearValidators();
      this.inspectionForm.get('vendorAadhar')?.clearValidators();
      this.inspectionForm.get('licenseeName')?.setValidators([Validators.required]);
      this.inspectionForm.get('licenseeNumber')?.setValidators([Validators.required]);
      this.inspectionForm.get('licenseeDivision')?.setValidators([Validators.required]);
    } else {
      this.inspectionForm.get('station')?.setValidators([Validators.required]);
      this.inspectionForm.get('vendorName')?.setValidators([Validators.required]);
      this.inspectionForm.get('vendorNumber')?.setValidators([Validators.required]);
      this.inspectionForm.get('vendorAadhar')?.setValidators([Validators.required]);
      this.inspectionForm.get('trainNumber')?.clearValidators();
      this.inspectionForm.get('licenseeName')?.clearValidators();
      this.inspectionForm.get('licenseeNumber')?.clearValidators();
      this.inspectionForm.get('licenseeDivision')?.clearValidators();
    }
    // Update validity
    ['trainNumber', 'station', 'section', 'vendorName', 'vendorNumber', 'vendorAadhar',
      'licenseeName', 'licenseeNumber', 'licenseeDivision'].forEach(field => {
        this.inspectionForm.get(field)?.updateValueAndValidity();
      });
  }

  onSubmit() {
    if (this.inspectionForm.valid) {
      const formData = {
        ...this.inspectionForm.getRawValue(),
        userId: this.userId,
        userRole: this.userRole
      };

      // Map the form fields to match backend expectations
      const mappedData = {
        officialId: formData.officialId,
        unitNumber: formData.unitNumber,
        inspectionDate: formData.inspectionDate,
        inspectionMode: formData.inspectionMode,
        trainNumber: formData.trainNumber,
        station: formData.station,
        section: formData.section,
        vendorDetails: formData.vendorDetails,
        deficiencies: formData.deficiencies,
        deficiencyCategory: formData.deficiencyCategory,
        vendorName: formData.vendorName,
        vendorNumber: formData.vendorNumber,
        vendorAadhar: formData.vendorAadhar,
        licenseeName: formData.licenseeName,
        licenseeNumber: formData.licenseeNumber,
        licenseeDivision: formData.licenseeDivision,
        action_taken: formData.actionTaken,
        fine_imposed: formData.fineImposed,
        action_remarks: formData.actionRemarks,
        zone : this.zone,
        division: this.division,
        roleap:'officeUser'
      };

      //console.log('Submitting form data:', mappedData);

      this.apicall.submitInspection(mappedData).subscribe({
        next: (response: any) => {
          //console.log('Inspection submitted successfully:', response);
          alert('Inspection submitted successfully!');    
           // Navigate back to the previous page
         // history.back();    
        },
        error: (error: any) => {
          console.error('Error submitting inspection:', error);
          alert('Failed to submit inspection. Please try again.');
        }
      });
    } else {
      Object.keys(this.inspectionForm.controls).forEach(key => {
        const control = this.inspectionForm.get(key);
        control?.markAsTouched();
        if (control?.invalid) {
          //console.log(`Field ${key} is invalid:`, control.errors);
        }
      });
      alert('Please fill out all required fields correctly.');
    }
  }



  getUnitDetails() {
      const paramdata = JSON.stringify({zone:this.zone,division:this.division})
    this.apicall.getInspectionUnit(paramdata).subscribe({
      next: (res: any) => {
        //console.log('Unit Details:', res);
        if (Array.isArray(res)) {
          this.unitNumbers = [
            { label: 'Pantry Others', value: 'Pantry Others' },
            { label: 'Un Authorised', value: 'Un Authorised' },
            { label: 'Others', value: 'Others' },
            ...res.map((item: any) => ({
              label: item.contarct_details,
              value: item.contract_code
            }))
          ];
        } else {
          console.warn('Unit Details response is not an array:', res);
        }
      },
      error: (err) => {
        console.error('Error fetching unit details:', err);
        alert('Failed to fetch unit details. Please try again.');
      }
    });
  }

  getModesOfInspection() {
    this.apicall.getModeOfInspection().subscribe({
      next: (res: any) => {
        //console.log('Modes of Inspection:', res);
        if (Array.isArray(res)) {
          this.modesOfInspection = res.map((item: any) => ({
            label: item.modeofinspection,
            value: item.modeofinspection
          }));
        } else {
          console.warn('Modes of Inspection response is not an array:', res);
        }
      },
      error: (err) => {
        console.error('Error fetching modes of inspection:', err);
        alert('Failed to fetch modes of inspection. Please try again.');
      }
    });
  }

  getCategoriesOfDeficiency() {
    this.apicall.getCategoryOfDeficiency().subscribe({
      next: (res: any) => {
        //console.log('Categories of Deficiency:', res);
        if (Array.isArray(res)) {
          this.categoriesOfDeficiency = res.map((item: any) => ({
            label: item.CategoryofDeficiency,
            value: item.CategoryofDeficiency
          }));
        } else {
          console.warn('Categories of Deficiency response is not an array:', res);
        }
      },
      error: (err) => {
        console.error('Error fetching categories of deficiency:', err);
        alert('Failed to fetch categories of deficiency. Please try again.');
      }
    });
  }

  getActionsTaken() {
    this.apicall.getActionTaken().subscribe({
      next: (res: any) => {
        if (Array.isArray(res)) {
          this.actionsTaken = res.map((item: any) => ({
            label: item.actiontaken,
            value: item.actiontaken
          }));
        }
      },
      error: (err) => {
        console.error('Error fetching actions taken:', err);
        alert('Failed to fetch actions taken. Please try again.');
      }
    });
  }
}