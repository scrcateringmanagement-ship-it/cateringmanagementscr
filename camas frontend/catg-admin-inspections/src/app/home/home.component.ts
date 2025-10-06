import { Component, ViewChild, ViewContainerRef, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BackgroundimageComponent } from '../backgroundimage/backgroundimage.component';
import { LicenseeDetailsComponent } from '../licensee-details/licensee-details.component';
import { ContractAssetDetailsComponent } from '../contract-asset-details/contract-asset-details.component';
import { CategoryComponent } from '../category/category.component';
import { RailywayinfoComponent } from '../railywayinfo/railywayinfo.component';
import { StatusComponent } from '../status/status.component';
import { UsertypeComponent } from '../usertype/usertype.component';
import { ModeofoperationComponent } from '../modeofoperation/modeofoperation.component';
import { ModeofpaymentComponent } from '../modeofpayment/modeofpayment.component';
import { UsersComponent } from '../users/users.component';
import { LogoutComponent } from '../logout/logout.component';
import { ContractDetailsComponent } from '../contractdetails/contract-details.component';
import { LocationtypeComponent } from '../locationtype/locationtype.component';
import { CciRoleGetIdcardsComponent } from '../cci-role-get-idcards/cci-role-get-idcards.component';
import { OffficeuserrolegetidcardsComponent } from '../offficeuserrolegetidcards/offficeuserrolegetidcards.component';
import { ApproverrolegetidcardsComponent } from '../approverrolegetidcards/approverrolegetidcards.component';
import { ApicallService } from '../apicall.service';
import { VendorPositionComponent } from '../vendor-position/vendor-position.component';
import { InspectionListComponent } from '../inspection-list/inspection-list.component';
import { ModeOfInspectionComponent } from '../modeofinspection/modeofinspection.component';
import { CategoryofDeficiencyComponent } from '../categorydeficiency/categorydeficiency.component';
import { ActionTakenComponent } from '../actiontaken/actiontaken.component';
import { CciRoleGetRejectedIdcardsComponent } from '../cci-role-get-rejected-idcards/cci-role-get-rejected-idcards.component';
import { OffficeuserrolegetrejectedidcardsComponent } from '../offficeuserrolegetrejectedidcards/offficeuserrolegetrejectedidcards.component';
import { ApproverGetcancelledIdcardsComponent } from '../approver-getcancelled-idcards/approver-getcancelled-idcards.component';
import { InspectionRegCciComponent } from '../inspection-reg-cci/inspection-reg-cci.component';
import { InspectionRegOfficeuserComponent } from '../inspection-reg-officeuser/inspection-reg-officeuser.component';
import { InspectionRegApproverComponent } from '../inspection-reg-approver/inspection-reg-approver.component';
import { GetInspectionCciComponent } from '../get-inspection-cci/get-inspection-cci.component';
import { GetInspectionOfficeComponent } from '../get-inspection-office/get-inspection-office.component';
import { GetInspectionApproverComponent } from '../get-inspection-approver/get-inspection-approver.component';
import { InspectionFinePaidComponent } from '../inspection-fine-paid/inspection-fine-paid.component';
import { InspectionReportComponent } from '../inspection-report/inspection-report.component';
import { ForwardingInspectionsComponent } from '../forwarding-inspections/forwarding-inspections.component';
import { InspectionReportOfficeuserComponent } from '../inspection-report-officeuser/inspection-report-officeuser.component';
import { CryptoService } from '../crypto.service';
import { TokenService } from '../tokenservice.service';
import { ContractsdetailsComponent } from '../reports/contractsdetails/contractsdetails.component';
import { UnitwiseidcardsComponent } from '../reports/unitwiseidcards/unitwiseidcards.component';
import { RoletypeComponent } from '../roletype/roletype.component';
import { ChangepasswordComponent } from '../changepassword/changepassword.component';
import { SessionTimerService } from '../session-timer.service';
import { CciroleapprovedComponent } from '../cciroleapproved/cciroleapproved.component';
import { IdcardsListComponent } from '../idcards-list/idcards-list.component';
import { VandeBharatRegComponent } from '../vande-bharat-reg/vande-bharat-reg.component';
import { VandeBharatInspComponent } from '../vande-bharat-insp/vande-bharat-insp.component';
import { PantrycarinspdriveComponent } from '../pantrycarinspdrive/pantrycarinspdrive.component';
import { PantryCarInspectionComponent } from '../pantry-car-inspection/pantry-car-inspection.component';
import { SettingsComponent } from '../settings/settings.component';
import { CompletedIdcardsComponent } from '../completed-idcards/completed-idcards.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule], // Add other standalone components if needed
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  @ViewChild('container', { read: ViewContainerRef, static: true }) container!: ViewContainerRef;
  userRole: string | null = null;
  userType: String | null = null;
  userId: string | null = null;
  userProfile: any = null;
  formattedTime: any = '';

  constructor(private apicall: ApicallService, private encservice: CryptoService, private tokenService: TokenService, private sessionTimer: SessionTimerService) { }

  ngOnInit() {

    const tokentimer = localStorage.getItem('token'); // or sessionStorage
    this.sessionTimer.initFromToken(tokentimer);
    /// this.sessionTimer.startTimer();
    this.sessionTimer.remainingTime$.subscribe((seconds) => {
      this.formattedTime = this.formatTime(seconds);
      if (seconds <= 0) {
        this.loadComponent('logout'); // <-- call your logout method
      }

    });

    const userstoragedecryptData = this.encservice.decrypt(localStorage.getItem('user') || '{}')
    //console.log(userstoragedecryptData);
    const userData = JSON.parse(userstoragedecryptData);
    //  console.log('User from localStorage:', userData);

    this.userRole = userData?.role || null;
    this.userId = userData?.id || null;
    this.userType = userData?.type || null;

    // Assign the whole user object to userProfile
    this.userProfile = {
      name: userData?.name,
      role: userData?.role,
      designation: userData?.desig,
      zone: userData?.zone,
      division: userData?.division
    };

    this.loadComponent('bgimage');
  }

  private formatTime(totalSeconds: number): string {
    if (totalSeconds <= 0) return '00:00';
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds
      .toString()
      .padStart(2, '0')}`;
  }

  loadComponent(name: string) {
    this.container.clear();

    if (!this.tokenService.isTokenValid()) {
      this.tokenService.redirectToLogin();
      return;
    }

    let component: any;
    switch (name) {
      case 'conasset':
        component = ContractAssetDetailsComponent;
        break;


      case 'PantryCarInspectionComponent':
        component = PantryCarInspectionComponent;
        break;

      case 'Pantrycarinspdrive':
        component = PantrycarinspdriveComponent;
        break;

      case 'Pantry':
        component = PantryCarInspectionComponent;
        break;

      case 'bharat_reg':
        component = VandeBharatRegComponent;
        break;

      case 'bharat_insp':
        component = VandeBharatInspComponent;
        break;



      case 'licdetails':
        component = LicenseeDetailsComponent;
        break;
      case 'catdetails':
        component = CategoryComponent;
        break;
      case 'rlyinfo':
        component = RailywayinfoComponent;
        break;
      case 'status':
        component = StatusComponent;
        break;
      case 'usertype':
        component = UsertypeComponent;
        break;
      case 'roletype':
        component = RoletypeComponent;
        break;
      case 'modeop':
        component = ModeofoperationComponent;
        break;
      case 'modepay':
        component = ModeofpaymentComponent;
        break;
      case 'users':
        component = UsersComponent;
        break;
      case 'contractdetails':
        component = ContractDetailsComponent;
        break;
      case 'locationtype':
        component = LocationtypeComponent;
        break;
      case 'ccigetidcards':
        this.apicall.ccimenuselect = true;
        component = CciRoleGetIdcardsComponent;
        break;
      case 'ccigetsendidcards':
        this.apicall.ccimenuselect = false;
        component = CciRoleGetIdcardsComponent;
        break;
      case 'ccirejectedidcards':
        this.apicall.ccimenuselect = false;
        component = CciRoleGetRejectedIdcardsComponent;
        break;
      case 'cciidcardsapprove':
        this.apicall.ccimenuselect = false;
        component = CciroleapprovedComponent;
        break;

      case 'officeusergetidcards':
        this.apicall.officemenuselect = true;
        component = OffficeuserrolegetidcardsComponent;
        break;
      case 'officeusergetidcardslist':
        this.apicall.officemenuselect = true;
        component = IdcardsListComponent;
        break;
      case 'officesendidcards':
        this.apicall.officemenuselect = false;
        component = OffficeuserrolegetidcardsComponent;
        break;
      case 'officerejectedidcards':
        this.apicall.officemenuselect = false;
        component = OffficeuserrolegetrejectedidcardsComponent;
        break;
      case 'inspectionlist':
        this.apicall.approvermenuselect = true;
        component = InspectionListComponent;
        break;

      case 'deficiency':
        this.apicall.approvermenuselect = true;
        component = CategoryofDeficiencyComponent;
        break;
      case 'actiontaken':
        this.apicall.approvermenuselect = true;
        component = ActionTakenComponent;
        break;
      case 'modeofinspection':
        this.apicall.approvermenuselect = true;
        component = ModeOfInspectionComponent;
        break;
      case 'approvergetidcards':
        this.apicall.approvermenuselect = true;
        component = ApproverrolegetidcardsComponent;
        break;
      case 'approvesendidcards':
        this.apicall.approvermenuselect = false;
        component = ApproverrolegetidcardsComponent;
        break;
      case 'vendorposition':
        this.apicall.approvermenuselect = false;
        component = VendorPositionComponent;
        break;
      case 'officeusercancelledidcards':
        this.apicall.approvermenuselect = false;
        component = ApproverGetcancelledIdcardsComponent;
        break;
      case 'inspectionccireg':
        this.apicall.approvermenuselect = true;
        component = InspectionRegCciComponent;
        break;
      case 'inspectionofficereg':
        this.apicall.approvermenuselect = true;
        component = InspectionRegOfficeuserComponent;
        break;
      case 'inspectionapproverreg':
        this.apicall.approvermenuselect = true;
        component = InspectionRegApproverComponent;
        break;
      case 'inspectionlistcci':
        this.apicall.approvermenuselect = true;
        component = GetInspectionCciComponent;
        break;
      case 'inspectionlistoffice':
        this.apicall.approvermenuselect = true;
        component = GetInspectionOfficeComponent;
        break;
      case 'inspectionlistapprover':
        this.apicall.approvermenuselect = true;
        component = GetInspectionApproverComponent;
        break;
      case 'inspectionfine':
        this.apicall.approvermenuselect = true;
        component = InspectionFinePaidComponent;
        break;
      case 'inspectionreport':
        this.apicall.approvermenuselect = true;
        component = InspectionReportComponent;
        break;
      case 'inspectionreportOfficeUser':
        this.apicall.approvermenuselect = true;
        component = InspectionReportOfficeuserComponent;
        break;
      case 'forwardinginspections':
        this.apicall.approvermenuselect = true;
        component = ForwardingInspectionsComponent;
        break;
      case 'ContractDetails':
        component = ContractsdetailsComponent;
        break;
      case 'CompletedIdcards':
        component = CompletedIdcardsComponent;
        break;
      case 'UnitWiseIdCards':
        component = UnitwiseidcardsComponent;
        break;

      case 'changepassword':
        component = ChangepasswordComponent;
        break;

      case 'catgsettings':
        component = SettingsComponent;
        break;

      case 'logout':
        component = LogoutComponent;
        break;

      default:
        component = BackgroundimageComponent;
        break;
    }

    if (component) {
      this.container.createComponent(component);
    }
  }
}





// UnitwiseidcardsComponent