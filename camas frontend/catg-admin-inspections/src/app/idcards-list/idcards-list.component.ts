import { Component, Injectable, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgSelectModule } from '@ng-select/ng-select';
import { ApicallService } from '../apicall.service';
import { CryptoService } from '../crypto.service';

@Component({
  selector: 'app-idcards-list',
  standalone: true,
  imports: [FormsModule, CommonModule, NgSelectModule],
  templateUrl: './idcards-list.component.html',
  styleUrl: './idcards-list.component.css'
})
export class IdcardsListComponent implements OnInit {
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

  Resetidcardprint(id: number) {
    const payload = { id: id }; // backend expects 'id'
   // console.log(payload);
    this.apicall.resetPrint(payload).subscribe({
      next: (res: any) => {
        if (res.status === 'ok') {
          alert('Print status reset successfully ✅');

          // Refresh the list without reloading the whole page
          this.onLicenseeChange({
            licensee_id: this.selectedLicensee,
            contract_code: this.contractcode
          });
        } else {
          alert('Failed to reset print status ❌');
        }
      },
      error: (err) => {
        console.error('Error resetting print status:', err);
        alert('Error contacting server ❌');
      }
    });
  }



}