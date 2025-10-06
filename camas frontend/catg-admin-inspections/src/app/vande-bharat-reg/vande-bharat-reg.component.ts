import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ApicallService } from '../apicall.service';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { CryptoService } from '../crypto.service';


@Component({
  selector: 'app-vande-bharat-reg',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormsModule,
    CommonModule,

    // Add Angular Material modules you use in the template
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule
  ],
  templateUrl: './vande-bharat-reg.component.html',
  styleUrls: ['./vande-bharat-reg.component.css']
})
export class VandeBharatRegComponent implements OnInit {

  form!: FormGroup;
  selectedId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private api: ApicallService,
    private encservice: CryptoService,
    public dialogRef: MatDialogRef<VandeBharatRegComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {
    this.buildForm();
    if (this.data?.id) this.loadForEdit(this.data.id);
  }

  buildForm(): void {
    const encryptedUser = localStorage.getItem('user') || '{}';
    const decrypted = this.encservice.decrypt(encryptedUser);
    const userData = JSON.parse(decrypted);

    this.form = this.fb.group({
      official_id: [{ value: userData?.id || null, disabled: true }, Validators.required],
      inspe_officer_official_name: [{ value: userData?.name || '', disabled: true }, Validators.required],
      designation: [{ value: userData?.desig || '', disabled: true }, Validators.required],
      date_of_insp: ['', Validators.required],
      from_to: ['', Validators.required],



      short_service: ['', Validators.required],
      rail_neer_non_avail: ['', Validators.required],
      quality: ['', Validators.required],
      quantity: ['', Validators.required],
      hygiene: ['', Validators.required],
      miss_behave: ['', Validators.required],
      fine_imposed: ['', Validators.required],
      warned: ['', Validators.required],
      suitably_adv: ['', Validators.required],
      not_Substantiated: ['', Validators.required],
      resolved_adv: ['', Validators.required],
      any_other: ['', Validators.required],
      total: ['', Validators.required],
      other_remarks: ['', Validators.required],
      pc_details: this.fb.group({
        T_Number: ['', Validators.required],
        pcm_name: ['', Validators.required],
        pcm_number: ['', Validators.required]
      })
    });
  }

  loadForEdit(id: number) {
    this.selectedId = id;
    this.api.get_by_id(id).subscribe({
      next: (res: any) => {
        this.form.patchValue({ ...res.data, pc_details: res.data.pc_details || {} });
      },
      error: (err) => alert('Failed to load record')
    });
  }

  onSubmit() {
    if (this.form.invalid) return this.form.markAllAsTouched();
    const payload = this.form.getRawValue();

    if (this.selectedId) {
      this.api.vande_bhart_update(this.selectedId, payload).subscribe({
        next: (res: any) => this.dialogRef.close(true),
        error: (err) => alert('Failed to update record')
      });
    } else {
      this.api.vande_bhart_add(payload).subscribe({
        next: (res: any) => this.dialogRef.close(true),
        error: (err) => alert('Failed to create record')
      });
    }
  }

  cancel() {
    this.dialogRef.close();
  }
}
