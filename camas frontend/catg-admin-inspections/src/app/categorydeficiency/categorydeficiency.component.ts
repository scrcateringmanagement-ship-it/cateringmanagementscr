import { Component, ViewChild, TemplateRef, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModalModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { ApicallService } from '../apicall.service';

@Component({
  selector: 'app-categorydeficiency',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NgbModalModule,
    FormsModule,
  ],
  templateUrl: './categorydeficiency.component.html',
  styleUrls: ['./categorydeficiency.component.css']
})
export class CategoryofDeficiencyComponent implements OnInit {
  @ViewChild('dialogTemplate') dialogTemplate!: TemplateRef<any>;
  categoryOfDeficiencyForm: FormGroup;
  modalTitle: string = 'Add New Category of Deficiency';
  isEditMode: boolean = false;
  editingCategoryOfDeficiency: any = null;
  searchText: string = '';
  categoryOfDeficiencyList: any[] = [];
  filteredCategoryOfDeficiencyList: any[] = [];

  constructor(
    private modalService: NgbModal,
    private fb: FormBuilder,
    private apicall: ApicallService
  ) {
    this.categoryOfDeficiencyForm = this.fb.group({
      CategoryofDeficiency: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.getCategoriesOfDeficiency();
  }

  getCategoriesOfDeficiency() {   

    this.apicall.getCategoryOfDeficiency().subscribe({
      next: (res: any) => {
        //console.log(res);
        this.categoryOfDeficiencyList = res;
        this.filteredCategoryOfDeficiencyList = [...this.categoryOfDeficiencyList];
      },
      error: (err) => {
        console.error('Error fetching categories of deficiency:', err);
        alert('Failed to fetch categories of deficiency. Please try again.');
      }
    });
  }

  onSubmit(): void {
    if (!this.categoryOfDeficiencyForm.valid) {
      alert('Please fill in all required fields');
      return;
    }

    const formData = {
      CategoryofDeficiency: this.categoryOfDeficiencyForm.get('CategoryofDeficiency')?.value,
      id: this.isEditMode ? this.editingCategoryOfDeficiency.id : null,
    };
    //console.log(formData);

    if (this.isEditMode) {
      this.apicall.updateCategoryOfDeficiency(JSON.stringify(formData)).subscribe({
        next: (res: any) => {
          //console.log(res);
          this.getCategoriesOfDeficiency();
          this.modalService.dismissAll();
          alert('Category of deficiency updated successfully!');
        },
        error: (err) => {
          console.error('Error updating category of deficiency:', err);
          alert('Failed to update category of deficiency. Please try again.');
        }
      });
    } else {
      this.apicall.insertCategoryOfDeficiency(JSON.stringify(formData)).subscribe({
        next: (res: any) => {
          this.getCategoriesOfDeficiency();
          this.modalService.dismissAll();
          alert('Category of deficiency added successfully!');
        },
        error: (err) => {
          console.error('Error adding category of deficiency:', err);
          alert('Failed to add category of deficiency. Please try again.');
        }
      });
    }
  }

  deleteCategoryOfDeficiency(category: any): void {
    if (confirm(`Are you sure you want to delete category of deficiency "${category.CategoryofDeficiency}"?`)) {
      const data = {
        id: category.id,
      };

      this.apicall.deleteCategoryOfDeficiency(JSON.stringify(data)).subscribe({
        next: (res: any) => {
          this.getCategoriesOfDeficiency();
          alert('Category of deficiency deleted successfully!');
        },
        error: (err) => {
          console.error('Error deleting category of deficiency:', err);
          alert('Failed to delete category of deficiency. Please try again.');
        }
      });
    }
  }

  closeModal(): void {
    this.modalService.dismissAll();
  }

  filterCategoriesOfDeficiency(): void {
    if (!this.searchText) {
      this.filteredCategoryOfDeficiencyList = [...this.categoryOfDeficiencyList];
      return;
    }

    const searchTerm = this.searchText.toLowerCase();
    this.filteredCategoryOfDeficiencyList = this.categoryOfDeficiencyList.filter(category =>
      category.CategoryofDeficiency?.toLowerCase().includes(searchTerm)
    );
  }

  openDialog(): void {
    this.modalTitle = 'Add New Category of Deficiency';
    this.isEditMode = false;
    this.editingCategoryOfDeficiency = null;
    this.categoryOfDeficiencyForm.reset();

    this.modalService.open(this.dialogTemplate, {
      size: 'md',
      backdrop: 'static'
    });
  }

  editCategoryOfDeficiency(category: any): void {
    this.categoryOfDeficiencyForm.patchValue({
      CategoryofDeficiency: category.CategoryofDeficiency
    });

    this.modalTitle = 'Edit Category of Deficiency';
    this.isEditMode = true;
    this.editingCategoryOfDeficiency = category;

    this.modalService.open(this.dialogTemplate, {
      size: 'md',
      backdrop: 'static'
    });
  }
}