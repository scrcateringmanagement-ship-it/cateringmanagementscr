import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ApicallService } from '../apicall.service';
import { CryptoService } from '../crypto.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-pantrycarinspdrive',
  standalone: true,
  imports: [FormsModule, CommonModule, ReactiveFormsModule],
  templateUrl: './pantrycarinspdrive.component.html',
  styleUrl: './pantrycarinspdrive.component.css'
})
export class PantrycarinspdriveComponent implements OnInit, OnDestroy {

  form!: FormGroup;
  selectedPantryCarId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private api: ApicallService,
    private encservice: CryptoService,
    private dialogRef: MatDialogRef<PantrycarinspdriveComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {
    this.buildForm();
    if (this.data?.id) {
      this.selectedPantryCarId = this.data.id;
      this.loadPantryCar(this.data.id);
    }
  }

  ngOnDestroy(): void {
    this.form.reset();
    this.selectedPantryCarId = null;
  }

  private buildForm(): void {
    const encryptedUser = localStorage.getItem('user') || '{}';
    const decrypted = this.encservice.decrypt(encryptedUser);
    const userData = JSON.parse(decrypted);

    this.form = this.fb.group({
      official_id: [{ value: userData?.id || null, disabled: true }, Validators.required],
      inspe_officer_official_name: [{ value: userData?.name || '', disabled: true }, Validators.required],
      designation: [{ value: userData?.desig || '', disabled: true }, Validators.required],
      date_of_inspe: ['', Validators.required],
      from_to: ['', Validators.required],
      coach_type: ['', Validators.required],

      pcm_details: this.fb.group({
        train_no: ['', Validators.required],
        pantry_no: ['', Validators.required],
        pcm_name: ['', Validators.required],
        pcm_number: ['', Validators.required],
      }),

      staff: this.fb.group({
        staff_id: ['', Validators.required],
        staff_id_validity: ['', Validators.required],
      }),

      fassai: this.fb.group({
        fassai_id: ['', Validators.required],
        fassai_id_validity: ['', Validators.required],
      }),

      availability_of_fire_safety: this.fb.group({
        equipment: ['', Validators.required],
        equipment_validity: ['', Validators.required],
        Replacement_standard_heating_coils_with_higher: ['', Validators.required],
        use_of_loose_equipment_with_makeshift_wiring_tapping_electrical_connection: ['', Validators.required],
        blocking_of_fire_safety_related_equipment: ['', Validators.required],
        placing_aluminium_foils: ['', Validators.required],
        action_taken: ['', Validators.required],
        any_other_remarks: ['', Validators.required],
      }),
    });
  }

  private loadPantryCar(id: number) {
    this.api.getPantryCar(id).subscribe({
      next: (res: any) => {
        if (res.data) {
          this.form.patchValue({
            ...res.data,
            pcm_details: res.data.pcm_details || {},
            staff: res.data.staff || {},
            fassai: res.data.fassai || {},
            availability_of_fire_safety: res.data.availability_of_fire_safety || {}
          });
        }
      },
      error: (err) => alert('Failed to load Pantry Car details')
    });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const payload = this.form.getRawValue();

    if (this.selectedPantryCarId) {
      this.api.updatePantryCar(this.selectedPantryCarId, payload).subscribe({
        next: () => this.dialogRef.close(true),
        error: () => alert('Failed to update Pantry Car')
      });
    } else {
      this.api.pantry_drive_add(payload).subscribe({
        next: () => this.dialogRef.close(true),
        error: () => alert('Failed to add Pantry Car')
      });
    }
  }

  cancel(): void {
    this.dialogRef.close();
  }
}
