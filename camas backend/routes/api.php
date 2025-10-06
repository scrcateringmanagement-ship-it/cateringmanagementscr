<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\MasterController;
use App\Http\Controllers\ContractAssestsController;
use App\Http\Controllers\ContractDetailsController;
use App\Http\Controllers\cciinspectionController;
use App\Http\Controllers\FormApplicationController;
use App\Http\Controllers\inspectionapproverController;
use App\Http\Controllers\inspectionFinepaymentController;
use App\Http\Controllers\inspectionOfficeUserController;
use App\Http\Controllers\InspectionRegistrationController;
use App\Http\Controllers\LicenseeController;
use App\Http\Controllers\VerifiedApproveController;
use App\Http\Controllers\OtpController;

use App\Http\Controllers\PantryCarController;
use App\Http\Controllers\VandeBharatInspectionController;
use App\Models\FormApplication;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
*/

//  office admin api routes

Route::post('login', [AuthController::class, 'LoginUser']);
Route::post('getqrcodedetails', [FormApplicationController::class, 'getqrcodedetails']);
Route::post('getqrcodedetailsmobile', [FormApplicationController::class, 'getqrcodedetailsmobile']);

Route::post('maintenanceMode', [MasterController::class, 'maintenanceMode']);
Route::post('deleteOtps', [MasterController::class, 'deleteOtps']);

// validate token route
Route::middleware('auth:user-api')->post('/validate-token', function () {
    return response()->json(['valid' => true]);
});




//middleware for user
Route::middleware('auth:user-api')->group(function () {
    //authenticated user routes**********************************************
    Route::post('changepassword', [AuthController::class, 'changePassword']);
    Route::post('logindata', [AuthController::class, 'logindata']);
    Route::post('logoutadmin', [AuthController::class, 'logout']);
    Route::post('createuser', [AuthController::class, 'CreateUser']);
    Route::post('updateloginuser', [AuthController::class, 'updateLoginUser']);
    Route::post('userloginget', [AuthController::class, 'userLoginGet']);
    Route::post('userlogindelete', [AuthController::class, 'userLoginDelete']);

    // Master data routes*****************************************************


    //catergorycontroller//
    Route::post('categoryinsert', [MasterController::class, 'categoryInsert']);
    Route::post('categoryupdate', [MasterController::class, 'categoryUpdate']);
    Route::post('catergoryget', [MasterController::class, 'categoryGet']);
    Route::post('categorydelete', [MasterController::class, 'categoryDelete']);

    //Railywayinfo Controller//
    Route::post('railywayinfoinsert', [MasterController::class, 'railywayinfoInsert']);
    Route::post('railywayinfoupdate', [MasterController::class, 'railywayinfoUpdate']);
    Route::post('railywayinfoget', [MasterController::class, 'railywayinfoGet']);
    Route::post('railywayinfodelete', [MasterController::class, 'railywayinfoDelete']);

    //mode_of_operation
    Route::post('modeofoperationinsert', [MasterController::class, 'modeofoperationinsert']);
    Route::post('modeofoperationupdate', [MasterController::class, 'modeofoperationupdate']);
    Route::post('modeofoperationget', [MasterController::class, 'modeofoperationget']);
    Route::post('modeofoperationdelete', [MasterController::class, 'modeofoperationdelete']);

    //status
    Route::post('statusinsert', [MasterController::class, 'statusInsert']);
    Route::post('statusupdate', [MasterController::class, 'statusUpdate']);
    Route::post('statusget', [MasterController::class, 'statusGet']);
    Route::post('statusdelete', [MasterController::class, 'statusDelete']);

    //usertype
    Route::post('userinsert', [MasterController::class, 'userInsert']);
    Route::post('userupdate', [MasterController::class, 'userUpdateType']);
    Route::post('userget', [MasterController::class, 'userGetType']);
    Route::post('userdelete', [MasterController::class, 'userDelete']);

    //userroletype
    Route::post('roletypeinsert', [MasterController::class, 'roleTypeInsert']);
    Route::post('roletypeupdate', [MasterController::class, 'roleTypeUpdate']);
    Route::post('roletypeget', [MasterController::class, 'roleTypeGet']);
    Route::post('roletypedelete', [MasterController::class, 'roleTypeDelete']);

    //cotractdetails
    Route::post('contractinsert', [MasterController::class, 'contractInsert']);
    Route::post('contractupdate', [MasterController::class, 'contractUpdate']);
    Route::post('contractget', [MasterController::class, 'contractGet']);
    Route::post('contractdelete', [MasterController::class, 'contractDelete']);

    //mode_of_payment Controller
    Route::post('modeofpaymentinsert', [MasterController::class, 'modeofpaymentinsert']);
    Route::post('modeofpaymentupdate', [MasterController::class, 'modeofpaymentupdate']);
    Route::post('modeofpaymentget', [MasterController::class, 'modeofpaymentget']);
    Route::post('modeofpaymentdelete', [MasterController::class, 'modeofpaymentdelete']);

    //ActionTaken
    Route::post('actiontakeninsert', [MasterController::class, 'actiontakeninsert']);
    Route::post('actiontakenupdate', [MasterController::class, 'actiontakenupdate']);
    Route::post('actiontakenget', [MasterController::class, 'actiontakenget']);
    Route::post('actiontakendelete', [MasterController::class, 'actiontakendelete']);

    //modeofinpection
    Route::post('modeofinspectioninsert', [MasterController::class, 'modeofinspectioninsert']);
    Route::post('modeofinspectionupdate', [MasterController::class, 'modeofinspectionupdate']);
    Route::post('modeofinspectionget', [MasterController::class, 'modeofinspectionget']);
    Route::post('modeofinspectiondelete', [MasterController::class, 'modeofinspectiondelete']);


    //vendor_position
    Route::post('vendorpositioninsert', [MasterController::class, 'vendorpositionInsert']);
    Route::post('vendorpositionupdate', [MasterController::class, 'vendorpositionUpdate']);
    Route::post('vendorpositiondelete', [MasterController::class, 'vendorpositionDelete']);
    Route::post('vendorget', [MasterController::class, 'vendorget']);

    //CategoryofDeficiency
    Route::post('categoryofdeficiencyinsert', [MasterController::class, 'CategoryofDeficiencyinsert']);
    Route::post('categoryofdeficiencyupdate', [MasterController::class, 'CategoryofDeficiencyupdate']);
    Route::post('categoryofdeficiencyget', [MasterController::class, 'CategoryofDeficiencyget']);
    Route::post('categoryofdeficiencydelete', [MasterController::class, 'categoryofdeficiencydelete']);

    //ActionTaken
    Route::post('actiontakeninsert', [MasterController::class, 'actiontakeninsert']);
    Route::post('actiontakenupdate', [MasterController::class, 'actiontakenupdate']);
    Route::post('actiontakenget', [MasterController::class, 'actiontakenget']);
    Route::post('actiontakendelete', [MasterController::class, 'actiontakendelete']);

    //modeofinpection
    Route::post('modeofinspectioninsert', [MasterController::class, 'modeofinspectioninsert']);
    Route::post('modeofinspectionupdate', [MasterController::class, 'modeofinspectionupdate']);
    Route::post('modeofinspectionget', [MasterController::class, 'modeofinspectionget']);
    Route::post('modeofinspectiondelete', [MasterController::class, 'modeofinspectiondelete']);

    //locationtype
    Route::post('contractlocationtypeinsert', [MasterController::class, 'contractlocationtypeInsert']);
    Route::post('contractlocationtypeupdate', [MasterController::class, 'contractlocationtypeUpdate']);
    Route::post('contractlocationtypeget', [MasterController::class, 'contractlocationtypeGet']);
    Route::post('contractlocationtypedelete', [MasterController::class, 'contractlocationtypeDelete']);

    //contract_assests
    Route::post('contractassestsinsert', [ContractAssestsController::class, 'contractassestsInsert']);
    Route::post('contractassestsupdate', [ContractAssestsController::class, 'contractassestsUpdate']);
    Route::post('contractassestsget', [ContractAssestsController::class, 'contractassestsGet']);
    Route::post('contractassestsdelete', [ContractAssestsController::class, 'contractassestsDelete']);
    Route::post('contractassestsall', [ContractAssestsController::class, 'contractassestsAll']);

    //contract_details
    Route::post('contractdetailsinsert', [ContractDetailsController::class, 'contractdetailsInsert']);
    Route::post('contractdetailsupdate', [ContractDetailsController::class, 'contractdetailsUpdate']);
    Route::post('contractdetailsget', [ContractDetailsController::class, 'contractdetailsGet']);
    Route::post('contractdetailsdelete', [ContractDetailsController::class, 'contractdetailsDelete']);
    Route::post('contractDetailsReassign', [ContractDetailsController::class, 'contractDetailsReassign']);
    Route::post('contractdetailsgetstncodelinces', [ContractDetailsController::class, 'contractdetailsgetstncodelinces']);

    // Get inspections 
    Route::post('ccigetinspection', [cciinspectionController::class, 'ccigetinspection']);
    Route::post('ccigetinspectionbyid', [cciinspectionController::class, 'ccigetinspectionbyid']);
    Route::post('ccigetinspectionFromdateTodate', [cciinspectionController::class, 'ccigetinspectionFromdateTodate']);

    //contract_assests
    Route::post('contractassestsinsert', [ContractAssestsController::class, 'contractassestsInsert']);
    Route::post('contractassestsupdate', [ContractAssestsController::class, 'contractassestsUpdate']);
    Route::post('contractassestsget', [ContractAssestsController::class, 'contractassestsGet']);
    Route::post('contractassestsdelete', [ContractAssestsController::class, 'contractassestsDelete']);
    Route::post('contractassestsall', [ContractAssestsController::class, 'contractassestsAll']);

    //contract_assests
    Route::post('contractassestsinsert', [ContractAssestsController::class, 'contractassestsInsert']);
    Route::post('contractassestsupdate', [ContractAssestsController::class, 'contractassestsUpdate']);
    Route::post('contractassestsget', [ContractAssestsController::class, 'contractassestsGet']);
    Route::post('contractassestsdelete', [ContractAssestsController::class, 'contractassestsDelete']);
    Route::post('contractassestsall', [ContractAssestsController::class, 'contractassestsAll']);

    // Form Application Controller
    Route::post('formapplicationgetbydate', [FormApplicationController::class, 'formapplicationgetbydate']);
    Route::post('formapplicationupdate', [FormApplicationController::class, 'formapplicationupdate']);
    Route::post('formapplicationfileinsert', [FormApplicationController::class, 'formapplicationfileinsert']);
    Route::post('approvecards', [FormApplicationController::class, 'approveCards']);
    Route::post('rejectcards', [FormApplicationController::class, 'rejectCards']);
    Route::post('formapplicationprint', [FormApplicationController::class, 'formapplicationprint']);
    Route::post('formapplicationcancel', [FormApplicationController::class, 'formapplicationcancel']);
    Route::post('uploadFileIdCard', [FormApplicationController::class, 'uploadFileIdCard']);
    Route::post('formapplicationapproved', [FormApplicationController::class, 'formApplicationApproved']);
    Route::post('formapplicationgetcancelledadmin', [FormApplicationController::class, 'formapplicationgetcancelled']);
    Route::post('formapplicationcci', [FormApplicationController::class, 'formApplicationCci']);
    Route::post('formapplicationofficeruse', [FormApplicationController::class, 'formApplicationOfficerUse']);
    Route::post('cancelledidcardsapprove', [FormApplicationController::class, 'cancelledidcardsapprove']);
    Route::post('formapplicationgetadmin', [FormApplicationController::class, 'formApplicationGetadmin']);
    Route::post('cciapprovaldata', [FormApplicationController::class, 'cciapprovaldata']);
    Route::post('resetPrint', [FormApplicationController::class, 'resetPrint']);
    Route::post('getExpiredApplications',[FormApplicationController::class, 'getExpiredApplications']);
    
    // inspection approver controller
    Route::post('approvergetinspection', [inspectionapproverController::class, 'approvergetinspection']);
    Route::post('approverupdateaction', [inspectionapproverController::class, 'approverupdateaction']);
    Route::post('returninspectiontoofficeuser', [inspectionapproverController::class, 'returninspectiontoofficeuser']);

    //inspections fine payment
    Route::post('getInspectionFinePayment', [inspectionFinepaymentController::class, 'getInspectionFinePayment']);
    // Update fine payment details
    Route::post('updateFinePaymentDetails', [inspectionFinepaymentController::class, 'updatefinePaymentDetails']);
    // get approver user details
    Route::post('approveruserdetails', [inspectionOfficeUserController::class, 'approveruserdetails']);

    // Get inspections for forwarding
    Route::post('forwardgetinspection', [inspectionOfficeUserController::class, 'forwardgetinspection']);
    // Update inspection forwarding details
    Route::post('updateforwardinginspection', [inspectionOfficeUserController::class, 'updateforwardinginspection']);
    // Get inspections for office user
    Route::post('officeusergetinspection', [inspectionOfficeUserController::class, 'officeusergetinspection']);

    ///InspectionRegistration
    Route::post('inspectionregistrationinsert', [InspectionRegistrationController::class, 'inspectionregistrationinsert']);
    Route::post('inspectionregistrationget', [InspectionRegistrationController::class, 'inspectionregistrationget']);

    //license 
    Route::post('licenseinsert', [LicenseeController::class, 'licenseinsert']);
    Route::post('licenseupdate', [LicenseeController::class, 'licenseupdate']);
    Route::post('licenseget', [LicenseeController::class, 'licenseget']);
    Route::post('licensedelete', [LicenseeController::class, 'licensegetdelete']);

    //verifed_approved table
    Route::post('verifiedapproveinsert', [VerifiedApproveController::class, 'verifiedapproveInsert']);

    // Get verified data
    Route::post('getVerifiedData', [VerifiedApproveController::class, 'getVerifiedData']);

    // PANTRY
    Route::post('pantry-car', [PantryCarController::class, 'store']);
    Route::put('pantry-car/{id}', [PantryCarController::class, 'update']);
    Route::get('pantry-car/{id}', [PantryCarController::class, 'getPantryCar']);
    Route::get('get_all', [PantryCarController::class, 'get_all']);

    //vande_bharat
    Route::post('vande-bharat', [VandeBharatInspectionController::class, 'store']);
    Route::put('vande-bharat/{id}', [VandeBharatInspectionController::class, 'update']);
    Route::get('vande-bharat/{id}', [VandeBharatInspectionController::class, 'vande_bhart_getby_id']);
    // Route::get('vande-bharat', [VandeBharatInspectionController::class, 'get_all']);         
    // routes/api.php

    Route::post('vande-bharat/date-range', [VandeBharatInspectionController::class, 'getByDateRange']);
    Route::post('pantrycar/date-range', [PantryCarController::class, 'getByDateRange']);
});


// ********************************************************************************************************************************************************************
//*****************************************////////////////////***************************************************************************************************** */ */

//licensee login apis
//otp
Route::post('sendotp', [OtpController::class, 'sendOtp']);
Route::post('verifyOtp', [OtpController::class, 'verifyOtp']);

Route::middleware('auth:licensee-api')->group(function () {
    Route::post('renewalcards', [FormApplicationController::class, 'renewCards']);
    Route::post('logout', [OtpController::class, 'logout']);
    Route::post('liccontractDetails', [ContractDetailsController::class, 'contractdetailsgetbymobile']);
    // Form Application Contoller
    Route::post('formapplicationinsert', [FormApplicationController::class, 'formApplicationInsert']);
    Route::post('rejectcards', [FormApplicationController::class, 'rejectCards']);
    Route::post('formapplicationupdate', [FormApplicationController::class, 'formapplicationupdate']);
    Route::post('formapplicationrenew', [FormApplicationController::class, 'formapplicationrenew']);
    Route::post('formapplicationgetcancelled', [FormApplicationController::class, 'formapplicationgetcancelled']);
    Route::post('approvecardslic', [FormApplicationController::class, 'approvecardslic']);
    Route::post('formapplicationinsert', [FormApplicationController::class, 'formApplicationInsert']);
    Route::post('getvendorposition', [MasterController::class, 'getvendorposition']);
    Route::post('formapplicationfileinsert', [FormApplicationController::class, 'formapplicationfileinsert']);
    Route::post('formapplicationprint', [FormApplicationController::class, 'formapplicationprint']);
    Route::post('formapplicationcancel', [FormApplicationController::class, 'formapplicationcancel']);
    Route::post('uploadFileIdCard', [FormApplicationController::class, 'uploadFileIdCard']);
    Route::post('formapplicationget', [FormApplicationController::class, 'formApplicationGet']);
    Route::post('validate_aadhar', [FormApplicationController::class, 'checkAadhaar']);
    Route::post('formapplicationgetcancelled', [FormApplicationController::class, 'cancelledcards']);
});
