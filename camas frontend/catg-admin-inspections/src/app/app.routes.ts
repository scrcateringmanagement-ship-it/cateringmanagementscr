import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { LicenseeDetailsComponent } from './licensee-details/licensee-details.component';
import { ContractAssetDetailsComponent } from './contract-asset-details/contract-asset-details.component';
import { CategoryComponent } from './category/category.component';
import { RailywayinfoComponent } from './railywayinfo/railywayinfo.component';
import { StatusComponent } from './status/status.component';
import { UsertypeComponent } from './usertype/usertype.component';
import { ModeofoperationComponent } from './modeofoperation/modeofoperation.component';
import { ModeofpaymentComponent } from './modeofpayment/modeofpayment.component';
import { AuthGuard } from './auth-guard.guard';
import { PantryCarInspectionComponent } from './pantry-car-inspection/pantry-car-inspection.component';
import { VandeBharatRegComponent } from './vande-bharat-reg/vande-bharat-reg.component';


export const routes: Routes = [

  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
  {
    path: 'home',
    canActivate: [AuthGuard],
    children: [
      { path: 'conasset', component: ContractAssetDetailsComponent },
      { path: 'licdetails', component: LicenseeDetailsComponent },
       { path: 'pantry-inspection', component: PantryCarInspectionComponent },
       {path:'vande-bharat' , component:VandeBharatRegComponent},
    ],
  },


];
