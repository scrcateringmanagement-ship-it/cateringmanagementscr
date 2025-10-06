<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\FormApplication;
use App\Rules\NoScripts;
use App\Models\RailwayInfo;
use App\Models\ContractDetails;
use App\Models\deletetableformapplication;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use App\Helpers\CryptoHelper;
use Carbon\Carbon;

class FormApplicationController extends Controller
{
    public function formApplicationInsert(Request $request)
    {
        $validated = $request->validate([
            'division' => ['required', new NoScripts],
            'zone' => ['required', new NoScripts],
            'blood_group' => ['required', new NoScripts],
            'first_name' => ['required', new NoScripts],
            'middle_initial' => [new NoScripts],
            'last_name' => ['required', new NoScripts],
            'email' => ['required', new NoScripts],
            'gender' => ['required', new NoScripts],
            'civil_status' => ['required', new NoScripts],
            'position' => ['required', new NoScripts],
            'year' => ['required', new NoScripts],
            'name' => ['required', new NoScripts],
            'designation' => ['required', new NoScripts],
            'dob' => ['required', new NoScripts],
            'type_of_card' => ['required', new NoScripts],
            'aadhar_number' => ['required', new NoScripts],
            'phone_number' => ['required', new NoScripts],
            'address' => ['required', new NoScripts],
            'police_station' => ['required', new NoScripts],
            'police_cert_no' => ['required', new NoScripts],
            'police_cert_date' => ['required', new NoScripts],
            'medical_by' => ['required', new NoScripts],
            'medical_date' => ['required', new NoScripts],
            'medical_valid_upto' => ['required', new NoScripts],
            'last_paid_date' => ['required', new NoScripts],
            'licensee_remarks' => ['required', new NoScripts],
            'date_of_application' => ['required', new NoScripts],
            'photo' => ['required', new NoScripts],
            'police_cert_file' => ['required', new NoScripts],
            'medical_cert_file' => ['required', new NoScripts],
            'aadhar_card_file' => ['required', new NoScripts],
            'vendor_signature_file' => ['required', new NoScripts],
            'money_receipt_file' => ['required', new NoScripts],
            'last_paid_file' => ['required', new NoScripts],
            'dd_mr_file' => ['required', new NoScripts],
            'station' => ['required', new NoScripts],
            'contract_code' => ['required', new NoScripts],
            'license_name' => ['required', new NoScripts],
            'location' => ['required', new NoScripts],
            'licensee_id' => ['required', new NoScripts],
            'contract_details_start_date' => ['required', new NoScripts],
            'contract_details_end_date' => ['required', new NoScripts],

            'annexure_two_file' => ['required', new NoScripts],
            'annexure_three_file' => ['required', new NoScripts],

        ]);

        $validated['status_update'] = '0';

        $contract = ContractDetails::where('contract_code', $validated['contract_code'])->first(); //it find the contractdetails using the id

        if (!$contract) {
            return response()->json(['error' => 'No contract found for this licensee.'], 404);
        }

        $employeeLimit = $contract->contract_details_no_of_employees; // in this we get the no.of.employeess in the contract_details table
        $stalltype = $contract->contract_stall; // in this we get the stall type in the contract_details table
        $currentCount = FormApplication::where('contract_code', $validated['contract_code'])
            ->where('licensee_id', $validated['licensee_id'])
            ->count();

        if ($currentCount >= $employeeLimit) {
            return response()->json(['error' => 'Employee limit reached for this contract.'], 400);
        }
        $contract->current_count = $currentCount + 1;
        $contract->save();
        FormApplication::create($validated);
        return response()->json([
            'message' => 'Form Application inserted successfully',
            'current_form_count' => $contract->current_count,
            'contract_stall' => $stalltype,
            'employee_limit' => $employeeLimit
        ], 200);
    }

    public function resetPrint(Request $req)
    {
        $validated = $req->validate([
            'id' => ['required', new NoScripts]
        ]);

        // First search for the record
        $formApplication = FormApplication::find($validated['id']);

        if (!$formApplication) {
            return response()->json([
                "status" => "notok",
                "message" => "Record not found"
            ], 404);
        }

        // Update print_status to null
        $formApplication->print_status = null;
        $formApplication->save();

        return response()->json([
            "status" => "ok",
            "message" => "Print status reset successfully"
        ], 200);
    }


    //this code was used to get the all data in the formapplication table 
    public function formApplicationGet(Request $request)
    {
        $validated = $request->validate([
            'zone' => ['required', new NoScripts],
            'division' => ['required', new NoScripts],
            'licensee_id' => ['required', new NoScripts],
            'contract_code' => ['required', new NoScripts],
        ]);

        $formApplications = FormApplication::where('zone', $validated['zone'])
            ->where('division', $validated['division'])
            ->where('licensee_id', $validated['licensee_id'])
            ->where('contract_code', $validated['contract_code'])
            ->get();

        return response()->json([
            'message' => 'Form applications retrieved successfully',
            'data' => $formApplications
        ], 200);
    }


    function cciapprovaldata(Request $request)
    {
        $validated = $request->validate([
            'zone' => ['required', new NoScripts],
            'division' => ['required', new NoScripts],
            'section' => ['required', new NoScripts],
        ]);
        // Get the railway stations based on the section
        $railwayStations = RailwayInfo::where('section', $validated['section'])
            ->whereIn('station_category', ['NSG-4', 'NSG-5', 'NSG-6'])
            ->pluck('station');

        $formApplications = FormApplication::where('zone', $validated['zone'])
            ->where('division', $validated['division'])
            ->whereIn('station', $railwayStations)
            ->where('status_update', '2')
            ->get();

        return response()->json([
            'message' => 'Form applications ',
            'data' => $formApplications
        ], 200);
    }


    //this code was use to get the data fo the cci where the status was the '0' and 'RA'
    public function formApplicationCci(Request $request)
    {

        $validated = $request->validate([
            'zone' => ['required', new NoScripts],
            'division' => ['required', new NoScripts],
            'section' => ['required', new NoScripts],
        ]);
        // Get the railway stations based on the section
        $railwayStations = RailwayInfo::where('section', $validated['section'])
            ->pluck('station');


        $formApplications = FormApplication::where('zone', $validated['zone'])
            ->where('division', $validated['division'])
            ->whereIn('station', $railwayStations)
            ->where(function ($query) {
                $query->whereIn('status_update', ['0', 'RA', 'Re']);
            })->get();

        return response()->json([
            'message' => 'Form applications ',
            'data' => $formApplications
        ], 200);
    }

    public function formapplicationrejectedcci(Request $request)
    {
        $validated = $request->validate([
            'zone' => ['required', new NoScripts],
            'division' => ['required', new NoScripts],
            'section' => ['required', new NoScripts],
        ]);
        // Get the railway stations based on the section
        $railwayStations = RailwayInfo::where('section', $validated['section'])
            ->pluck('station');

        $formApplications = FormApplication::where('zone', $validated['zone'])
            ->where('division', $validated['division'])
            ->whereIn('station', $railwayStations)
            ->where(function ($query) {
                $query->where('status_update', '0');
            })->get();

        return response()->json([
            'message' => 'Form applications ',
            'data' => $formApplications
        ], 200);
    }


    //this code was used for the officeruse to get the data when the status was '1'
    public function formApplicationOfficerUse(Request $request)
    {
        try {
            $validated = $request->validate([
                'zone' => ['required', new NoScripts],
                'division' => ['required', new NoScripts],
            ]);

            $formApplications = FormApplication::where('zone', $validated['zone'])
                ->where('division', $validated['division'])
                ->whereIn('status_update', ['1', 'RE'])
                ->get();

            return response()->json([
                'message' => 'Form applications retrieved successfully.',
                'data' => $formApplications
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error retrieving form applications: ' . $e->getMessage(),
                'data' => []
            ], 500);
        }
    }

    //this was the approver when the status was '2'
    public function formApplicationApproved(Request $request)
    {
        $validated = $request->validate([
            'zone' => ['required', new NoScripts],
            'division' => ['required', new NoScripts],
            'location' => ['required', new NoScripts],
        ]);

        $query = FormApplication::where('zone', $validated['zone'])
            ->where('division', $validated['division'])
            ->where('status_update', '2')
            ->orderBy('station', 'asc');

        if ($validated['location'] !== 'HQRS') {
            $query->where('station', $validated['location']);
        }

        $data = $query->get();
        //->where('status_update', '2')       
        return response()->json([
            'message' => 'Form applications sending the approved data.',
            'data' => $data
        ], 200);
    }


    //in the ccisend when the status was not equal to '0'
    public function formapplicationcciSend(Request $request)
    {
        $validated = $request->validate([
            'zone' => ['required', new NoScripts],
            'division' => ['required', new NoScripts],
            'section' => ['required', new NoScripts],
        ]);

        $railwayStations = RailwayInfo::where('section', $validated['section'])
            ->pluck('station');
        $formApplications = FormApplication::where('zone', $validated['zone'])
            ->where('division', $validated['division'])
            ->whereIn('station', $railwayStations)
            ->where('status_update', '!=', '0')->get();
        return response()->json([
            'message' => 'today form checked my cci',
            'data' => $formApplications
        ], 200);
    }

    public function formapplicationcciReject(Request $request)
    {
        $validated = $request->validate([
            'zone' => ['required', new NoScripts],
            'division' => ['required', new NoScripts],
            'section' => ['required', new NoScripts],
        ]);
        $railwayStations = RailwayInfo::where('section', $validated['section'])
            ->pluck('station');

        $formApplications = FormApplication::where('zone', $validated['zone'])
            ->where('division', $validated['division'])
            ->where('status_update', 'R')
            ->orderBy('id', 'asc')
            ->limit(100)->get();
        return response()->json([
            'message' => 'today form checked my cci',
            'data' => $formApplications
        ], 200);
    }

    public function formapplicationofficeusersend(Request $request)
    {
        $validated = $request->validate([
            'zone' => ['required', new NoScripts],
            'division' => ['required', new NoScripts],

        ]);

        $formApplications = FormApplication::where('zone', $validated['zone'])
            ->where('division', $validated['division'])

            ->whereNotIn('status_update', ['0', '1'])
            ->orderBy('id', 'asc')
            ->limit(100)->get();
        return response()->json([
            'message' => 'today form checked my officer',
            'data' => $formApplications
        ], 200);
    }

    public function formapplicationapprovedSend(Request $request)
    {
        $validated = $request->validate([
            'zone' => ['required', new NoScripts],
            'division' => ['required', new NoScripts],

        ]);
        $formApplications = FormApplication::where('zone', $validated['zone'])
            ->where('division', $validated['division'])
            ->whereNotIn('status_update', ['0', '1', '2'])
            ->orderBy('id', 'asc')
            ->limit(100)->get();
        return response()->json([
            'message' => 'today form checked my officer',
            'data' => $formApplications
        ], 200);
    }

    //show the form details from the startdate to end date

    public function formapplicationgetbydate(Request $request)
    {
        $validated = $request->validate([
            'contract_details_start_date' => 'required',
            'contract_details_end_date' => 'required',
        ]);
        $formApplications = FormApplication::whereBetween('contract_details_start_date', [
            $validated['contract_details_start_date'],
            $validated['contract_details_end_date']
        ])->get();


        return response()->json([
            'message' => 'Form applications retrieved successfully',
            'data' => $formApplications
        ], 200);
    }

    //this was used for the update the data in the form application table
    public function formapplicationupdate(Request $request)
    {
        $validated = $request->validate([
            'id' => 'required',
            new NoScripts,
            'division' => 'required',
            new NoScripts,
            'zone' => 'required',
            new NoScripts,
            'first_name' => 'required',
            new NoScripts,
            'middle_initial' => new NoScripts,
            'last_name' => 'required',
            new NoScripts,
            'email' => 'required',
            new NoScripts,
            'gender' => 'required',
            new NoScripts,
            'civil_status' => 'required',
            new NoScripts,
            'position' => 'required',
            new NoScripts,
            'year' => 'required',
            new NoScripts,
            'name' => 'required',
            new NoScripts,
            'designation' => 'required',
            new NoScripts,
            'dob' => 'required',
            new NoScripts,
            'type_of_card' => 'required',
            new NoScripts,
            'aadhar_number' => 'required',
            new NoScripts,
            'phone_number' => 'required',
            new NoScripts,
            'address' => 'required',
            new NoScripts,
            'police_station' => 'required',
            new NoScripts,
            'police_cert_no' => 'required',
            new NoScripts,
            'police_cert_date' => 'required',
            new NoScripts,
            'medical_by' => 'required',
            new NoScripts,
            'medical_date' => 'required',
            new NoScripts,
            'medical_valid_upto' => 'required',
            new NoScripts,
            'last_paid_date' => 'required',
            new NoScripts,
            'licensee_remarks' => 'required',
            new NoScripts,
            'date_of_application' => 'required',
            new NoScripts,
            'photo' => 'required',
            new NoScripts,
            'police_cert_file' => 'required',
            new NoScripts,
            'medical_cert_file' => 'required',
            new NoScripts,
            'aadhar_card_file' => 'required',
            new NoScripts,
            'vendor_signature_file' => 'required',
            new NoScripts,
            'money_receipt_file' => 'required',
            new NoScripts,
            'last_paid_file' => 'required',
            new NoScripts,
            'dd_mr_file' => 'required',
            new NoScripts,
            'station' => 'required',
            new NoScripts,
            'contract_code' => 'required',
            new NoScripts,
            'license_name' => 'required',
            new NoScripts,
            'location' => 'required',
            new NoScripts,
            'licensee_id' => 'required',
            new NoScripts,
            'contract_details_start_date' => 'required',
            new NoScripts,
            'contract_details_end_date' => 'required',
            new NoScripts,
            'blood_group' => 'required',
            new NoScripts,
            'annexure_two_file' => 'required',
            new NoScripts,
            'annexure_three_file' => 'required',
            new NoScripts,
        ]);
        $formApplication = FormApplication::find($validated['id']);
        if (!$formApplication) {
            return response()->json(['message' => 'Form application not found'], 404);
        }
        $formApplication->update(collect($validated)->except('id')->toArray());

        $formApplication->status_update = 'RA';
        $formApplication->save();
        return response()->json(['message' => 'Form application updated successfully'], 200);
    }

     //this was used for the update the data for renewal in the form application table
    public function formapplicationrenew(Request $request)
    {
        $validated = $request->validate([
            'id' => 'required',
            new NoScripts,
            'division' => 'required',
            new NoScripts,
            'zone' => 'required',
            new NoScripts,
            'first_name' => 'required',
            new NoScripts,
            'middle_initial' => new NoScripts,
            'last_name' => 'required',
            new NoScripts,
            'email' => 'required',
            new NoScripts,
            'gender' => 'required',
            new NoScripts,
            'civil_status' => 'required',
            new NoScripts,
            'position' => 'required',
            new NoScripts,
            'year' => 'required',
            new NoScripts,
            'name' => 'required',
            new NoScripts,
            'designation' => 'required',
            new NoScripts,
            'dob' => 'required',
            new NoScripts,
            'type_of_card' => 'required',
            new NoScripts,
            'aadhar_number' => 'required',
            new NoScripts,
            'phone_number' => 'required',
            new NoScripts,
            'address' => 'required',
            new NoScripts,
            'police_station' => 'required',
            new NoScripts,
            'police_cert_no' => 'required',
            new NoScripts,
            'police_cert_date' => 'required',
            new NoScripts,
            'medical_by' => 'required',
            new NoScripts,
            'medical_date' => 'required',
            new NoScripts,
            'medical_valid_upto' => 'required',
            new NoScripts,
            'last_paid_date' => 'required',
            new NoScripts,
            'licensee_remarks' => 'required',
            new NoScripts,
            'date_of_application' => 'required',
            new NoScripts,
            'photo' => 'required',
            new NoScripts,
            'police_cert_file' => 'required',
            new NoScripts,
            'medical_cert_file' => 'required',
            new NoScripts,
            'aadhar_card_file' => 'required',
            new NoScripts,
            'vendor_signature_file' => 'required',
            new NoScripts,
            'money_receipt_file' => 'required',
            new NoScripts,
            'last_paid_file' => 'required',
            new NoScripts,
            'dd_mr_file' => 'required',
            new NoScripts,
            'station' => 'required',
            new NoScripts,
            'contract_code' => 'required',
            new NoScripts,
            'license_name' => 'required',
            new NoScripts,
            'location' => 'required',
            new NoScripts,
            'licensee_id' => 'required',
            new NoScripts,
            'contract_details_start_date' => 'required',
            new NoScripts,
            'contract_details_end_date' => 'required',
            new NoScripts,
            'blood_group' => 'required',
            new NoScripts,
            'annexure_two_file' => 'required',
            new NoScripts,
            'annexure_three_file' => 'required',
            new NoScripts,
        ]);
        $formApplication = FormApplication::find($validated['id']);
        if (!$formApplication) {
            return response()->json(['message' => 'Form application not found'], 404);
        }
        $formApplication->update(collect($validated)->except('id')->toArray());

        $formApplication->status_update = 'Re';
        $formApplication->save();
        return response()->json(['message' => 'Form application updated successfully'], 200);
    }

    public function approveCards(Request $request)
    {
        $validated = $request->validate([
            'licensee_id'   => 'required',
            'contract_code' => 'required',
            'zone'          => 'required',
            'division'      => 'required',
        ]);

        $Approvedata = FormApplication::where('licensee_id', $validated['licensee_id'])
            ->where('contract_code', $validated['contract_code'])
            ->where('zone', $validated['zone'])
            ->where('division', $validated['division'])
            ->where('status_update', '1')
            ->get();

        return response()->json([
            'message' => 'Approved form application(s) retrieved successfully',
            'data' => $Approvedata
        ], 200);
    }
    public function rejectCards(Request $request)
    {
        $validated = $request->validate([
            'licensee_id'   => 'required',
            'contract_code' => 'required',
            'zone'          => 'required',
            'division'      => 'required',
        ]);

        $Rejecteddata = FormApplication::with('verifiedApproveds')
            ->where('licensee_id', $validated['licensee_id'])
            ->where('contract_code', $validated['contract_code'])
            ->where('zone', $validated['zone'])
            ->where('division', $validated['division'])
            ->where('status_update', 'R')
            ->get();


        return response()->json([
            'message' => 'Rejected form application(s) retrieved successfully',
            'data' => $Rejecteddata
        ], 200);
    }

     public function renewCards(Request $request)
    {
        $validated = $request->validate([
            'licensee_id'   => 'required',
            'contract_code' => 'required',
            'zone'          => 'required',
            'division'      => 'required',
        ]);

        $renewalData = FormApplication::with('verifiedApproveds')
            ->where('licensee_id', $validated['licensee_id'])
            ->where('contract_code', $validated['contract_code'])
            ->where('zone', $validated['zone'])
            ->where('division', $validated['division'])
            ->whereRaw('STR_TO_DATE(valid_upto, "%Y-%m-%dT%H:%i:%s.000Z") < NOW() AND STR_TO_DATE(valid_upto, "%Y-%m-%dT%H:%i:%s.000Z") < DATE_ADD(NOW(), INTERVAL 10 DAY)')
            ->whereNot('status_update', 'Re')
            ->get();


        return response()->json([
            'message' => 'Renewal form application(s) retrieved successfully',
            'data' => $renewalData
        ], 200);
    }
    public function formapplicationfileinsert(Request $request)
    {
        $validated = $request->validate([
            'fileurl' => 'required',
            new NoScripts,

        ]);
        $data = deletetableformapplication::create($validated);
        return response()->json('data created successful');
    }



    public function formapplicationprint(Request $request)
    {
        $validated = $request->validate([
            'id' => ['required', new NoScripts],
        ]);

        $formApplication = FormApplication::find($validated['id']);

        if (!$formApplication) {
            return response()->json(['message' => 'Form application not found'], 404);
        }

        // Update print_status to 'yes'
        $formApplication->print_status = 'yes';
        $formApplication->save();

        return response()->json([
            'message' => 'Form application retrieved and print status updated successfully',
            'data' => $formApplication
        ], 200);
    }

    public function formapplicationcancel(Request $request)
    {
        $validated = $request->validate([
            'id' => ['required', new NoScripts],
            'remarks' => ['required', new NoScripts],
        ]);

        $formApplication = FormApplication::find($validated['id']);

        if (!$formApplication) {
            return response()->json(['message' => 'Form application not found'], 404);
        }

        // Update status_update to 'CA' and cancel_remarks
        $formApplication->status_update = 'CA';
        $formApplication->cancel_remarks = $validated['remarks'];
        $formApplication->save();

        return response()->json([
            'message' => 'Form application cancelled successfully',
            'data' => $formApplication
        ], 200);
    }
    public function formapplicationgetcancelled(Request $request)
    {
        $validated = $request->validate([
            'zone' => ['required', new NoScripts],
            'division' => ['required', new NoScripts],
        ]);

        $formApplications = FormApplication::where('zone', $validated['zone'])
            ->where('division', $validated['division'])
            ->where('status_update', 'CA') // Filter for cancelled applications
            ->get();

        return response()->json([
            'message' => 'Cancelled form applications retrieved successfully',
            'data' => $formApplications
        ], 200);
    }

    public function approvecardslic(Request $request)
    {
        $validated = $request->validate([
            'licensee_id'   => 'required',
            'contract_code' => 'required',
            'zone'          => 'required',
            'division'      => 'required',
        ]);

        $Approvedata = FormApplication::where('licensee_id', $validated['licensee_id'])
            ->where('contract_code', $validated['contract_code'])
            ->where('zone', $validated['zone'])
            ->where('division', $validated['division'])
            ->where('status_update', 'A')
            ->get();

        return response()->json([
            'message' => 'Approved form application(s) retrieved successfully',
            'data' => $Approvedata
        ], 200);
    }


    public function cancelledidcardsapprove(Request $request)
    {
        $validated = $request->validate([
            'id' => 'required|exists:form_applications,id',
        ]);

        DB::beginTransaction();

        try {
            $formApp = FormApplication::find($validated['id']);

            DB::table('form_applications_delete')->insert([
                'form_id' => $formApp->id,
                'division' => $formApp->division,
                'zone' => $formApp->zone,
                'first_name' => $formApp->first_name,
                'middle_initial' => $formApp->middle_initial,
                'last_name' => $formApp->last_name,
                'email' => $formApp->email,
                'gender' => $formApp->gender,
                'civil_status' => $formApp->civil_status,
                'position' => $formApp->position,
                'year' => $formApp->year,
                'name' => $formApp->name,
                'designation' => $formApp->designation,
                'dob' => $formApp->dob,
                'type_of_card' => $formApp->type_of_card,
                'aadhar_number' => $formApp->aadhar_number,
                'phone_number' => $formApp->phone_number,
                'address' => $formApp->address,
                'police_station' => $formApp->police_station,
                'police_cert_no' => $formApp->police_cert_no,
                'police_cert_date' => $formApp->police_cert_date,
                'medical_by' => $formApp->medical_by,
                'medical_date' => $formApp->medical_date,
                'medical_valid_upto' => $formApp->medical_valid_upto,
                'last_paid_date' => $formApp->last_paid_date,
                'licensee_remarks' => $formApp->licensee_remarks,
                'date_of_application' => $formApp->date_of_application,
                'photo' => $formApp->photo,
                'police_cert_file' => $formApp->police_cert_file,
                'medical_cert_file' => $formApp->medical_cert_file,
                'aadhar_card_file' => $formApp->aadhar_card_file,
                'vendor_signature_file' => $formApp->vendor_signature_file,
                'money_receipt_file' => $formApp->money_receipt_file,
                'last_paid_file' => $formApp->last_paid_file,
                'dd_mr_file' => $formApp->dd_mr_file,
                'station' => $formApp->station,
                'contract_code' => $formApp->contract_code,
                'license_name' => $formApp->license_name,
                'location' => $formApp->location,
                'licensee_id' => $formApp->licensee_id,
                'contract_details_start_date' => $formApp->contract_details_start_date,
                'contract_details_end_date' => $formApp->contract_details_end_date,
                'status_update' => $formApp->status_update,
                'created_at' => $formApp->created_at,
                'updated_at' => $formApp->updated_at,
                'date_time_approve' => Carbon::now('Asia/Kolkata'),
                'contract_stall' => $formApp->contract_stall,
                'valid_upto' => $formApp->valid_upto,
                'annexure_two_file' => $formApp->annexure_two_file,
                'annexure_three_file' => $formApp->annexure_three_file
            ]);

            // Decrease current_count in contract_details table
            DB::table('contract_details')
                ->where('contract_code', $formApp->contract_code)
                ->decrement('current_count');

            $formApp->delete();

            DB::commit();

            return response()->json([
                'message' => 'Form application moved, current count decreased, and deleted successfully',
            ], 200);
        } catch (\Exception $e) {
            DB::rollBack();

            return response()->json([
                'message' => 'An error occurred: ' . $e->getMessage(),
            ], 500);
        }
    }

    // Uploading file for ID card
    public function uploadFileIdCard(Request $request)
    {
        $request->validate([
            'file' => 'required|file|mimes:jpg,jpeg,png|max:2048',
        ]);

        // Store the file in storage/app/idcards

        $path = $request->file('file')->store('idcarddocs', 'public');

        $fileidcarddocsurl = url('/') . Storage::url($path);

        return response()->json([
            'message' => 'File uploaded successfully',
            'path' =>  $fileidcarddocsurl
            // url('/') . '/storage/';
        ]);
    }
    function getqrcodedetails(Request $request)
    {
        $dataRecieved = $request->input('data');
        $decodedString = CryptoHelper::decrypt($dataRecieved); // <- still returns string
        // convert JSON string to associative array
        $decodedData = json_decode($decodedString, true);

        $mobilekey = $decodedData['mobilekey'];
        $qrid = $decodedData['qrid'];

        if ($mobilekey != 'TBR0Wg39DfL3NJS' || !$mobilekey) {
            return response()->json(['message' => 'You are not authorized to access this resource'], 401);
        } else {
            $qrdata = FormApplication::find($qrid);
            // convert to JSON string for encryption
            $payload = json_encode($qrdata->toArray());

            $qrenc = CryptoHelper::encrypt($payload);

            return response()->json(['qrdata' => $qrenc]);
        }
    }

     function getqrcodedetailsmobile(Request $request)
    {
        $mobilekey = $request->mobilekey;
        if ($mobilekey != 'TBR0Wg39DfL3NJS' || !$mobilekey) {
            return response()->json(['message' => 'You are not authorized to access this resource'], 401);
        } else {
            $qrid = $request->input('qrid');
            $qrdata = FormApplication::find($qrid);
            return response()->json(['qrdata' => $qrdata]);
        }
    }

    public function checkAadhaar(Request $request)
    {
        $request->validate([
            'aadhar_number' => 'required|string|size:12'
        ]);

        $adharNumber = $request->input('aadhar_number');
        $exists = FormApplication::aadhaarExists($adharNumber);

        return response()->json([
            'status' => $exists
        ]);
    }

    public function cancelledcards(Request $request)
    {
        $validated = $request->validate([
            'licensee_id'   => 'required',
            'contract_code' => 'required',
            'zone'          => 'required',
            'division'      => 'required',
        ]);

        $cancelleddata = DB::table('form_applications_delete')
            ->where('licensee_id', $validated['licensee_id'])
            ->where('contract_code', $validated['contract_code'])
            ->where('zone', $validated['zone'])
            ->where('division', $validated['division'])
            ->get();

        return response()->json([
            'message' => 'Cancelled form application(s) retrieved successfully',
            'data' => $cancelleddata
        ], 200);
    }

    public function formApplicationGetadmin(Request $request)
    {
        $validated = $request->validate([
            'zone' => ['required', new NoScripts],
            'division' => ['required', new NoScripts],
            'licensee_id' => ['required', new NoScripts],
            'contract_code' => ['required', new NoScripts],
        ]);

        $formApplications = FormApplication::where('zone', $validated['zone'])
            ->where('division', $validated['division'])
            ->where('licensee_id', $validated['licensee_id'])
            ->where('contract_code', $validated['contract_code'])
            ->get();

        $cancelleddata = DB::table('form_applications_delete')
            ->where('licensee_id', $validated['licensee_id'])
            ->where('contract_code', $validated['contract_code'])
            ->where('zone', $validated['zone'])
            ->where('division', $validated['division'])
            ->get();

        return response()->json([
            'message' => 'Form applications retrieved successfully',
            'liveidcards' => $formApplications,
            'cancelledidcards' => $cancelleddata
        ], 200);
    }

    public function getExpiredApplications(Request $request)
    {
        $expiredApplications = FormApplication::where('valid_upto', '<', Carbon::now())->get();

        return response()->json([
            'message' => 'Expired form applications retrieved successfully',
            'data' => $expiredApplications
        ], 200);
    }
}
