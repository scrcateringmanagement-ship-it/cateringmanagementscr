import { Component, OnInit } from '@angular/core';
import { ApicallService } from '../../apicall.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CryptoService } from '../../crypto.service';

@Component({
  selector: 'app-contractsdetails',
  imports: [CommonModule , FormsModule],
  templateUrl: './contractsdetails.component.html',
  styleUrl: './contractsdetails.component.css'
})
export class ContractsdetailsComponent implements OnInit {
 
 constructor(private apicall: ApicallService,  private encservice:CryptoService) { }

  filteredContractorList: any[] = [];
  contractorList: any[] = [];
  searchText: string = '';

  userDivision: any;

 


  ngOnInit(): void {

    const userstoragedecryptData = this.encservice.decrypt(localStorage.getItem('user') || '{}')
    //console.log(userstoragedecryptData);
    const userData = JSON.parse(userstoragedecryptData);
    //console.log('User from localStorage:', userData);

    this.userDivision = userData?.division || null;
    //console.log(this.userDivision);
    this.contractorList = [];

    const paramdata = JSON.stringify({zone: userData.zone,division:userData.division});

     this.getContractorDetails(paramdata)
     this.filterContractors()

  }

  getContractorDetails(data:any) {
    
  //  console.log(data)

    this.apicall.getContractorDetails(data).subscribe({
      next: (res: any) => {
      //  console.log('Contractor details:', res);
        this.contractorList = res.contract_details;
        this.filteredContractorList = [...this.contractorList];
      }
    });
  }



  filterContractors(): void {
    if (!this.searchText || this.searchText.trim() === '') {
      this.filteredContractorList = [...this.contractorList];
      return;
    }

    const searchTerm = this.searchText.trim().toLowerCase();
    //console.log(this.contractorList);
    this.filteredContractorList = this.contractorList.filter(contractor =>
      contractor.Licensee_firm_name?.toLowerCase().includes(searchTerm) ||
      contractor.Licensee_name?.toLowerCase().includes(searchTerm) ||
      contractor.Licensee_mobile?.toString().toLowerCase().includes(searchTerm) ||
      contractor.contract_code?.toString().toLowerCase().includes(searchTerm) ||
      contractor.Lincensee_pan?.toLowerCase().includes(searchTerm) ||
      contractor.contract_station_name?.toLowerCase().includes(searchTerm) ||
      contractor.section_name?.toLowerCase().includes(searchTerm)
    );

    // //console.log('FILTER list:', this.filteredContractorList);
  }

printDiv(divId: string) {
  const printContents = document.getElementById(divId)?.innerHTML;
  if (printContents) {
    const originalContents = document.body.innerHTML;

    document.body.innerHTML = printContents;
    window.print();
    document.body.innerHTML = originalContents;
    location.reload(); // Reload the page to restore original state
  }
}

}
