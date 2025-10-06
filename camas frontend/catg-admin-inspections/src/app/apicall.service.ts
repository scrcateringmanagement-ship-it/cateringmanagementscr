import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApicallService {

 // public apiUrl = 'https://cateringmanagement.indianrailways.gov.in/api/';
  public apiUrl = 'http://10.196.22.101:8001/api/'
  ccimenuselect: any;
  officemenuselect: any
  approvermenuselect: any;

  constructor(private http: HttpClient) {
    this.ccimenuselect = true;
    this.officemenuselect = true;
    this.approvermenuselect = true
  }


  private getHeaderOptions() {
    return {
      headers: new HttpHeaders()
        .set('Authorization', `Bearer ` + localStorage.getItem("token"))
        .set('Content-Type', 'application/json')
    };
  }

  private getHeaderOptionsToken() {
    return {
      headers: new HttpHeaders()
        .set('Authorization', `Bearer ` + localStorage.getItem("token"))
    };
  }


  getHeaderOptionsdata() {
    return {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    };
  }

  headeroptionsjson() {
    return {
      headers: {
        'Content-Type': 'application/json' // Change this to application/json
      }
    };
  }

  //login 
  login(data: any) {
    return this.http.post(this.apiUrl + 'login', data, { ...this.headeroptionsjson(), observe: 'response' as const });
  }

  //logout
  logout(data: any) {
    return this.http.post(this.apiUrl + 'logoutadmin', data, this.getHeaderOptions());
  }

  //changepassword api calls
  changepassword(data: any) {
    return this.http.post(this.apiUrl + 'changepassword', data, this.getHeaderOptions());
  }

  //catergory api calls
  getcatergory() {
    return this.http.post(this.apiUrl + 'catergoryget', {}, this.getHeaderOptions());
  }

  getDistRailwayInfo() {
    return this.http.post(this.apiUrl + 'getDistinctRailwayInfo', {}, this.getHeaderOptions());
  }


  //Licensee details api calls 

  insertLicenseeDetails(lData: any) {
    return this.http.post(this.apiUrl + 'licenseinsert', lData, this.getHeaderOptions());
  }
  getLicenseeDetails(data: any) {
    return this.http.post(this.apiUrl + 'licenseget', data, this.getHeaderOptions());
  }
  updateLicenseeDetails(lData: any) {
    return this.http.post(this.apiUrl + 'licenseupdate', lData, this.getHeaderOptions());
  }
  deleteLicenseeDetails(lData: any) {
    return this.http.post(this.apiUrl + 'licensedelete', lData, this.getHeaderOptions());
  }

  // Contract Asset Details
  insertContractAssetDetails(lData: any) {
    return this.http.post(this.apiUrl + 'contractassestsinsert', lData, this.getHeaderOptions());
  }
  getContractAssetDetails(data: any) {
    return this.http.post(this.apiUrl + 'contractassestsget ', data, this.getHeaderOptions());
  }
  updateContractAssetDetails(lData: any) {
    return this.http.post(this.apiUrl + 'contractassestsupdate', lData, this.getHeaderOptions());
  }
  deleteContractAssetDetails(lData: any) {
    return this.http.post(this.apiUrl + 'contractassestsdelete', lData, this.getHeaderOptions());
  }

  insertContractDetails(data: any) {
    return this.http.post(this.apiUrl + 'contractdetailsinsert', data, this.getHeaderOptions());
  }

  //Contractor Details
  insertContractorDetails(lData: any) {
    return this.http.post(this.apiUrl + 'licenseinsert', lData, this.getHeaderOptions());
  }
  getContractorDetails(data: any) {
    return this.http.post(this.apiUrl + 'contractdetailsget', data, this.getHeaderOptions());
  }
  updateContractorDetails(lData: any) {
    return this.http.post(this.apiUrl + 'contractdetailsupdate', lData, this.getHeaderOptions());
  }
  terminateContractDetails(data: any) {
    return this.http.post(this.apiUrl + 'contractdetailsdelete', data, this.getHeaderOptions());
  }

  resetPrint(payload: any) {
    return this.http.post(this.apiUrl + 'resetPrint', payload, this.getHeaderOptions());
  }


  //Master Details
  //Category
  insertCategory(data: any) {
    return this.http.post(this.apiUrl + 'categoryinsert', data, this.getHeaderOptions());
  }

  updateCategory(data: any) {
    return this.http.post(this.apiUrl + 'categoryupdate', data, this.getHeaderOptions());
  }

  deleteCategory(data: any) {
    return this.http.post(this.apiUrl + 'categorydelete', data, this.getHeaderOptions());
  }

  getCategory(data: any) {
    return this.http.post(this.apiUrl + 'catergoryget', data, this.getHeaderOptions());
  }
  //Mode of Operation
  insertModeOfOperation(data: any) {
    return this.http.post(this.apiUrl + 'modeofoperationinsert', data, this.getHeaderOptions());
  }

  updateModeOfOperation(data: any) {
    return this.http.post(this.apiUrl + 'modeofoperationupdate', data, this.getHeaderOptions());
  }

  deleteModeOfOperation(data: any) {
    return this.http.post(this.apiUrl + 'modeofoperationdelete', data, this.getHeaderOptions());
  }

  getModeOfOperation(data: any) {
    return this.http.post(this.apiUrl + 'modeofoperationget', data, this.getHeaderOptions());
  }

  //Mode of Payment
  insertModeOfPayment(data: any) {
    return this.http.post(this.apiUrl + 'modeofpaymentinsert', data, this.getHeaderOptions());
  }

  updateModeOfPayment(data: any) {
    return this.http.post(this.apiUrl + 'modeofpaymentupdate', data, this.getHeaderOptions());
  }

  deleteModeOfPayment(data: any) {
    return this.http.post(this.apiUrl + 'modeofpaymentdelete', data, this.getHeaderOptions());
  }

  getModeOfPayment(data: any) {
    return this.http.post(this.apiUrl + 'modeofpaymentget', data, this.getHeaderOptions());
  }
  // Railway Information
  insertRailwayInfo(data: any) {
    return this.http.post(this.apiUrl + 'railywayinfoinsert', data, this.getHeaderOptions());
  }

  updateRailwayInfo(data: any) {
    return this.http.post(this.apiUrl + 'railywayinfoupdate', data, this.getHeaderOptions());
  }

  deleteRailwayInfo(data: any) {
    return this.http.post(this.apiUrl + 'railywayinfodelete', data, this.getHeaderOptions());
  }

  getRailwayInfo(data: any) {
    return this.http.post(this.apiUrl + 'railywayinfoget', data, this.getHeaderOptions());
  }

  // Status Management
  insertStatus(data: any) {
    return this.http.post(this.apiUrl + 'statusinsert', data, this.getHeaderOptions());
  }

  getStatus(data: any) {
    return this.http.post(this.apiUrl + 'statusget', data, this.getHeaderOptions());
  }

  updateStatus(data: any) {
    return this.http.post(this.apiUrl + 'statusupdate', data, this.getHeaderOptions());
  }

  deleteStatus(data: any) {
    return this.http.post(this.apiUrl + 'statusdelete', data, this.getHeaderOptions());
  }

  // User Type Management
  insertUsertype(data: any) {
    return this.http.post(this.apiUrl + 'userinsert', data, this.getHeaderOptions());
  }

  getUsertype(data: any) {
    return this.http.post(this.apiUrl + 'userget', data, this.getHeaderOptions());
  }

  updateUsertype(data: any) {
    return this.http.post(this.apiUrl + 'userupdate', data, this.getHeaderOptions());
  }

  deleteUsertype(data: any) {
    return this.http.post(this.apiUrl + 'userdelete', data, this.getHeaderOptions());
  }

  // Role Type Management
  insertRoletype(data: any) {
    return this.http.post(this.apiUrl + 'roletypeinsert', data, this.getHeaderOptions());
  }
  getRoletype(data: any) {
    return this.http.post(this.apiUrl + 'roletypeget', data, this.getHeaderOptions());
  }

  updateRoletype(data: any) {
    return this.http.post(this.apiUrl + 'roletypeupdate', data, this.getHeaderOptions());
  }

  deleteRoletype(data: any) {
    return this.http.post(this.apiUrl + 'roletypedelete', data, this.getHeaderOptions());
  }

  //User Management
  insertUser(data: any) {
    return this.http.post(this.apiUrl + 'createuser', data, this.getHeaderOptions());
  }

  getUser(data: any) {
    return this.http.post(this.apiUrl + 'userloginget', data, this.getHeaderOptions());
  }

  updateUser(data: any) {
    return this.http.post(this.apiUrl + 'updateloginuser', data, this.getHeaderOptions());
  }
  deleteUser(data: any) {
    return this.http.post(this.apiUrl + 'userlogindelete', data, this.getHeaderOptions());
  }

  //Location Type
  insertLocationType(data: any) {
    return this.http.post(this.apiUrl + 'contractlocationtypeinsert', data, this.getHeaderOptions());
  }

  updateLocationType(data: any) {
    return this.http.post(this.apiUrl + 'contractlocationtypeupdate', data, this.getHeaderOptions());
  }

  deleteLocationType(data: any) {
    return this.http.post(this.apiUrl + 'contractlocationtypedelete', data, this.getHeaderOptions());
  }

  getLocationType(data: any) {
    return this.http.post(this.apiUrl + 'contractlocationtypeget', data, this.getHeaderOptions());
  }

  //Vendor Position
  insertVendorPosition(data: any) {
    return this.http.post(this.apiUrl + 'vendorpositioninsert', data, this.getHeaderOptions());
  }

  updateVendorPosition(data: any) {
    return this.http.post(this.apiUrl + 'vendorpositionupdate', data, this.getHeaderOptions());
  }

  deleteVendorPosition(data: any) {
    return this.http.post(this.apiUrl + 'vendorpositiondelete', data, this.getHeaderOptions());
  }

  getVendorPosition(data: any) {
    return this.http.post(this.apiUrl + 'vendorget', data, this.getHeaderOptions());
  }

  // CCI Admin Get Data
  getCciData(data: any) {
    return this.http.post(this.apiUrl + 'formapplicationcci', data, this.getHeaderOptions());
  }
  getCciRejectedData(data: any) {
    return this.http.post(this.apiUrl + 'formapplicationrejectedcci', data, this.getHeaderOptions());
  }
  getCciIdcardsendData(data: any) {
    return this.http.post(this.apiUrl + 'formapplicationccisend', data, this.getHeaderOptions());
  }
  getofficroleData(data: any) {
    return this.http.post(this.apiUrl + 'formapplicationofficeruse', data, this.getHeaderOptions());
  }
  getofficerolesenddata(data: any) {
    return this.http.post(this.apiUrl + 'formapplicationofficeusersend', data, this.getHeaderOptions());
  }

  getapproverroleData(data: any) {
    return this.http.post(this.apiUrl + 'formapplicationapproved', data, this.getHeaderOptions());
  }

  formapplicationgetcancelled(data: any) {
    return this.http.post(this.apiUrl + 'formapplicationgetcancelledadmin', data, this.getHeaderOptions());
  }

  getapproverrolesendData(data: any) {
    return this.http.post(this.apiUrl + 'formapplicationapprovedsend', data, this.getHeaderOptions());
  }

  cciIdCardApprove(data: any) {
    return this.http.post(this.apiUrl + 'verifiedapproveinsert', data, this.getHeaderOptions());
  }
  cciIdCardReject(data: any) {
    return this.http.post(this.apiUrl + 'verifiedapproveinsert', data, this.getHeaderOptions());
  }
  getcciapprovaldata(data: string) {
    return this.http.post(this.apiUrl + 'cciapprovaldata', data, this.getHeaderOptions());
  }
  officeIdCardApprove(data: any) {
    return this.http.post(this.apiUrl + 'verifiedapproveinsert', data, this.getHeaderOptions());
  }
  officeIdCardReject(data: any) {
    return this.http.post(this.apiUrl + 'verifiedapproveinsert', data, this.getHeaderOptions());
  }

  officerIdCardApprove(data: any) {
    return this.http.post(this.apiUrl + 'verifiedapproveinsert', data, this.getHeaderOptions());
  }
  officerIdCardReject(data: any) {
    return this.http.post(this.apiUrl + 'verifiedapproveinsert', data, this.getHeaderOptions());
  }

  officerIdCardCancelApprove(data: any) {
    return this.http.post(this.apiUrl + 'cancelledidcardsapprove', data, this.getHeaderOptions());
  }

  getVerifiedData(data: any) {
    return this.http.post(this.apiUrl + 'getVerifiedData', data, this.getHeaderOptions());
  }


  // Get CCI Inspection Data
  getCciInspectionData(data: any) {
    return this.http.post(this.apiUrl + 'ccigetinspection', data, this.getHeaderOptions());
  }
  getCciInspectionDetails(data: any) {
    return this.http.post(this.apiUrl + 'ccigetinspectionbyid', data, this.getHeaderOptions());
  }

  // Get Inpection Unit Dropdown
  getInspectionUnit(data: any) {
    return this.http.post(this.apiUrl + 'contractdetailsgetstncodelinces', data, this.getHeaderOptions());
  }
  getidcardsadmin(data: any) {
    return this.http.post(this.apiUrl + 'formapplicationgetadmin', data, this.getHeaderOptions());
  }

  //  Category of Deficiency Dropdown
  getCategoryOfDeficiency() {
    return this.http.post(this.apiUrl + 'categoryofdeficiencyget', {}, this.getHeaderOptions());
  }
  insertCategoryOfDeficiency(data: any) {
    return this.http.post(this.apiUrl + 'categoryofdeficiencyinsert', data, this.getHeaderOptions());
  }
  updateCategoryOfDeficiency(data: any) {
    return this.http.post(this.apiUrl + 'categoryofdeficiencyupdate', data, this.getHeaderOptions());
  }
  deleteCategoryOfDeficiency(data: any) {
    return this.http.post(this.apiUrl + 'categoryofdeficiencydelete', data, this.getHeaderOptions());
  }

  // Action Taken
  getActionTaken() {
    return this.http.post(this.apiUrl + 'actiontakenget', {}, this.getHeaderOptions());
  }
  insertActionTaken(data: any) {
    return this.http.post(this.apiUrl + 'actiontakeninsert', data, this.getHeaderOptions());
  }
  updateActionTaken(data: any) {
    return this.http.post(this.apiUrl + 'actiontakenupdate', data, this.getHeaderOptions());
  }
  deleteActionTaken(data: any) {
    return this.http.post(this.apiUrl + 'actiontakendelete', data, this.getHeaderOptions());
  }

  // Mode Of Inspection
  getModeOfInspection() {
    return this.http.post(this.apiUrl + 'modeofinspectionget', {}, this.getHeaderOptions());
  }
  insertModeOfInspection(data: any) {
    return this.http.post(this.apiUrl + 'modeofinspectioninsert', data, this.getHeaderOptions());
  }
  updateModeOfInspection(data: any) {
    return this.http.post(this.apiUrl + 'modeofinspectionupdate', data, this.getHeaderOptions());
  }
  deleteModeOfInspection(data: any) {
    return this.http.post(this.apiUrl + 'modeofinspectiondelete', data, this.getHeaderOptions());
  }


  submitInspection(data: any) {
    return this.http.post(this.apiUrl + 'inspectionregistrationinsert', data, this.getHeaderOptions());
  }
  getInspectionData(data: any) {
    return this.http.post(this.apiUrl + 'inspectionregistrationget', data, this.getHeaderOptions());
  }


  getInspectionPaidData() {
    return this.http.post(this.apiUrl + 'getInspectionFinePayment', {}, this.getHeaderOptions());
  }

  // Save inspection payment details
  saveInspectionPaymentDetails(data: any) {
    return this.http.post(this.apiUrl + 'updateFinePaymentDetails', data, this.getHeaderOptions());
  }

  //Get Forwarding Inspection Details
  getForwardingInspectionDetails(data: any) {
    return this.http.post(this.apiUrl + 'forwardgetinspection', data, this.getHeaderOptions());
  }

  // Get Approver Users list
  getApproverUsersList(data: any) {
    return this.http.post(this.apiUrl + 'approveruserdetails', data, this.getHeaderOptions());
  }
  // Update Forwareding Inspections
  updateForwardingInspection(data: any) {
    return this.http.post(this.apiUrl + 'updateforwardinginspection', data, this.getHeaderOptions());
  }

  // Get Inspections Report Office User
  getInspectionsReportOfficeUser(data: any) {
    return this.http.post(this.apiUrl + 'officeusergetinspection', data, this.getHeaderOptions());
  }
  // Get Inspections Report CCI
  getInspectionsReportCCI(data: any) {
    return this.http.post(this.apiUrl + 'ccigetinspectionFromdateTodate', data, this.getHeaderOptions());
  }

  // Approve Inspection
  approverUpdateAction(data: any) {
    return this.http.post(this.apiUrl + 'approverupdateaction', data, this.getHeaderOptions());
  }
  //Return Inspection
  returnInspection(data: any) {
    return this.http.post(this.apiUrl + 'returninspectiontoofficeuser', data, this.getHeaderOptions());
  }

  // Get Inspection Details Office User
  getInspectionDetailsOfficeUser(data: any) {
    return this.http.post(this.apiUrl + 'forwardgetinspection', data, this.getHeaderOptions());
  }

  //Get Inspection Approver Report
  getForwardInspectionData(data: any) {
    return this.http.post(this.apiUrl + 'approvergetinspection', data, this.getHeaderOptions());
  }

  //Re award Contracts
  reAssignContracts(data: any) {
    return this.http.post(this.apiUrl + 'contractDetailsReassign', data, this.getHeaderOptions());
  }

  //reports 

  //pantry_drive

  pantry_drive_add(data: any) {
    return this.http.post(this.apiUrl + 'pantry-car', data, this.getHeaderOptions())

  }
  updatePantryCar(id: number, data: any) {
    return this.http.put(this.apiUrl + `pantry-car/${id}`, data, this.getHeaderOptions());
  }
  getPantryCar(id: number): Observable<any> {
    return this.http.get<any>(this.apiUrl + `pantry-car/${id}`, this.getHeaderOptionsToken());
  }

  getpantry_all() {
    return this.http.get<any>(this.apiUrl + `get_all`, this.getHeaderOptionsToken())
  }


  //vande_bharat
  vande_bhart_add(data: any) {
    return this.http.post(this.apiUrl + 'vande-bharat', data, this.getHeaderOptions());
  }

  vande_bhart_update(id: number, data: any) {
    return this.http.put(this.apiUrl + 'vande-bharat/' + id, data, this.getHeaderOptionsToken());
  }

  get_by_id(id: number): Observable<any> {
    return this.http.get<any>(this.apiUrl + 'vande-bharat/' + id, this.getHeaderOptionsToken());
  }

  // vande_bharat_getAll():Observable<any> {
  //   return this.http.get<any>(this.apiUrl + 'vande-bharat', this.getHeaderOptionsToken());
  // }


vande_bharat_getByDateRange(datesdata:any): Observable<any> {
   return this.http.post(this.apiUrl + 'vande-bharat/date-range', datesdata, this.getHeaderOptions());
}


pantry_cars_getByDateRange(datesdata:any): Observable<any> {
   return this.http.post(this.apiUrl + 'pantrycar/date-range', datesdata, this.getHeaderOptions());
}

// Delete OTPs
deleteOtps() {
  return this.http.post(this.apiUrl + 'deleteOtps', {}, this.getHeaderOptions());
}

// Maintenance Mode
maintenanceMode(enable: boolean) {
  return this.http.post(this.apiUrl + 'maintenanceMode', { enable }, this.getHeaderOptions());
}

// Get Expired Applications
getExpiredApplications() {
  return this.http.post(this.apiUrl + 'getExpiredApplications', {}, this.getHeaderOptions());
}

}
