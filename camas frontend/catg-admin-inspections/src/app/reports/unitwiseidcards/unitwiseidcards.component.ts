import { Component, Injectable, OnInit } from '@angular/core';
import { ApicallService } from '../../apicall.service';
import { CryptoService } from '../../crypto.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgSelectModule } from '@ng-select/ng-select';

@Component({
  selector: 'app-unitwiseidcards',
  standalone: true,
  imports: [FormsModule, CommonModule, NgSelectModule],
  templateUrl: './unitwiseidcards.component.html',
  styleUrl: './unitwiseidcards.component.css'
})


export class UnitwiseidcardsComponent implements OnInit {
  contractcode: any;

  constructor(private apicall: ApicallService, private encservice: CryptoService) { }

  unitList: any;
  selectedLicensee: any;
  filteredContractorList: any[] = [];
  contractorList: any[] = [];

  liveidcards: any[] = [];
  cancelledIdcards: any[] = [];
  searchText: string = '';
  paramdata: any;
  userDivision: any;
  userData: any;

  ngOnInit(): void {

    const userstoragedecryptData = this.encservice.decrypt(localStorage.getItem('user') || '{}')
    //console.log(userstoragedecryptData);
    this.userData = JSON.parse(userstoragedecryptData);
    //console.log('User from localStorage:', userData);

    this.userDivision = this.userData?.division || null;
    this.contractorList = [];

    this.paramdata = JSON.stringify({ zone: this.userData.zone, division: this.userData.division });

    this.getunitList(this.paramdata);

  }

  getunitList(pdata: any) {
    this.apicall.getInspectionUnit(pdata).subscribe({
      next: (res: any) => {
        this.unitList = res;
      },
      error: (err) => console.error('Error fetching licensees:', err)
    });
  }

  onLicenseeChange(selected: any): void {

    this.selectedLicensee = selected.licensee_id;
    this.contractcode = selected.contract_code;

    const sendparamdata = JSON.stringify({ zone: this.userData.zone, division: this.userData.division, licensee_id: this.selectedLicensee, contract_code: this.contractcode });
    //console.log(sendparamdata);cancelledidcards   

    this.apicall.getidcardsadmin(sendparamdata).subscribe({
      next: (res: any) => {
        this.liveidcards = res.liveidcards;
        this.cancelledIdcards = res.cancelledidcards;
    //    console.log(this.liveidcards)
    //    console.log(this.cancelledIdcards)



      },
      error: (err) => console.error('Error fetching licensees:', err)

    });



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




  getBgColor(status: string): string {
    switch (status) {
      case 'RA': return 'bg-yellow';
      case 'R': return 'bg-red';
      case 'A': return 'bg-green';
      case '0': return 'bg-blue';
      case 'CA': return 'bg-pred';
      default: return 'bg-blue';

    }
  }

  getStatus(status: string) {
    switch (status) {
      case '1':
        return 'uv office admin'
      case '2':
        return 'uv approver'
      case 'RA':
        return 'Reapplied'
      case 'R':
        return 'Rejected'
       case 'CA':
        return 'CANCEL APPLIED'
      case 'A':
        return 'Approved'
      default:
        return 'uv cci'
    }
  }
}
