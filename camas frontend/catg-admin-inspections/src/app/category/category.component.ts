import { Component, ViewChild, TemplateRef, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModalModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { ApicallService } from '../apicall.service';

@Component({
  selector: 'app-category',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NgbModalModule,
    FormsModule,
  ],
  templateUrl: './category.component.html',
  styleUrl: './category.component.css'
})
export class CategoryComponent implements OnInit {
  @ViewChild('dialogTemplate') dialogTemplate!: TemplateRef<any>;
  categoryForm: FormGroup;
  modalTitle: string = 'Add New Category';
  isEditMode: boolean = false;
  editingCategory: any = null;
  searchText: string = '';
  categoryList: any[] = [];
  filteredCategoryList: any[] = [];

  constructor(
    private modalService: NgbModal,
    private fb: FormBuilder,
    private apicall: ApicallService
  ) {
    this.categoryForm = this.fb.group({
      categoryname: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.getCategories();
  }

     getCategories() {
    const data = JSON.stringify({
      zone: localStorage.getItem('zone') || 'SCR',
      division: localStorage.getItem('division') || 'BZA'
    });
    
    this.apicall.getCategory(data).subscribe({
      next: (res: any) => {
        this.categoryList = res;
        this.filteredCategoryList = [...this.categoryList];
      },
      error: (err) => {
        console.error('Error fetching categories:', err);
        alert('Failed to fetch categories. Please try again.');
      }
    });
  } 

  onSubmit(): void {
    if (!this.categoryForm.valid) {
      alert('Please fill in all required fields');
      return;
    }

    const formData = {
      categoryname: this.categoryForm.get('categoryname')?.value,
      id: this.isEditMode ? this.editingCategory.id : null,
    };

    if (this.isEditMode) {
      this.apicall.updateCategory(JSON.stringify(formData)).subscribe({
        next: (res: any) => {
          //console.log(res);
          this.getCategories();
          this.modalService.dismissAll();
          alert('Category updated successfully!');
        },
        error: (err) => {
          console.error('Error updating category:', err);
          alert('Failed to update category. Please try again.');
        }
      });
    } else {
      this.apicall.insertCategory(JSON.stringify(formData)).subscribe({
        next: (res: any) => {
          this.getCategories();
          this.modalService.dismissAll();
          alert('Category added successfully!');
        },
        error: (err) => {
          console.error('Error adding category:', err);
          alert('Failed to add category. Please try again.');
        }
      });
    }
}

  deleteCategory(category: any): void {
    if (confirm(`Are you sure you want to delete category "${category.categoryname}"?`)) {
      const data = {
        id: category.id,
        zone: localStorage.getItem('zone') || 'SCR',
        division: localStorage.getItem('division') || 'BZA'
      };
      
      this.apicall.deleteCategory(JSON.stringify(data)).subscribe({
        next: (res: any) => {
          this.getCategories();
          alert('Category deleted successfully!');
        },
        error: (err) => {
          console.error('Error deleting category:', err);
          alert('Failed to delete category. Please try again.');
        }
      });
    }
  }

  closeModal(): void {
    this.modalService.dismissAll();
  }

  filterCategories(): void {
    if (!this.searchText) {
      this.filteredCategoryList = [...this.categoryList];
      return;
    }

    const searchTerm = this.searchText.toLowerCase();
    this.filteredCategoryList = this.categoryList.filter(category =>
      category.categoryname?.toLowerCase().includes(searchTerm)
    );
  }

  openDialog(): void {
    this.modalTitle = 'Add New Category';
    this.isEditMode = false;
    this.editingCategory = null;
    this.categoryForm.reset();
    
    this.modalService.open(this.dialogTemplate, {
      size: 'md',
      backdrop: 'static'
    });
  }

  editCategory(category: any): void {
    this.categoryForm.patchValue({
      categoryname: category.categoryname
    });
    
    this.modalTitle = 'Edit Category';
    this.isEditMode = true;
    this.editingCategory = category;
    
    this.modalService.open(this.dialogTemplate, {
      size: 'md',
      backdrop: 'static'
    });
  }
}
