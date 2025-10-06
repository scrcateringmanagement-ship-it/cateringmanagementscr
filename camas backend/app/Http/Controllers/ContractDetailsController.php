<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\ContractDetails;
use App\Rules\NoScripts;
use App\models\Licensee;
use App\models\ContractAssests;
use Illuminate\Support\Facades\DB;

use App\Models\ContractDetailDelete;

class ContractDetailsController extends Controller
{
    public function contractdetailsinsert(Request $request)
    {
        $validated = $request->validate([
            'Licensee_firm_name' => ['required', new NoScripts],
            'contract_code' => ['required', new NoScripts],
            'contract_id' => ['required', new NoScripts],
            'licensee_id' => ['required', new NoScripts],
            'Licensee_name' => ['required', new NoScripts],
            'Licensee_mobile' => ['required', new NoScripts],
            'Lincensee_pan' => ['required', new NoScripts],
            'Lincensee_type' => ['required', new NoScripts],
            'Lincensee_status' => ['required', new NoScripts],
            'Lincensee_zone' => ['required', new NoScripts],
            'Lincensee_division' => ['required', new NoScripts],
            'contract_station_name' => ['required', new NoScripts],
            'contract_stall' => ['required', new NoScripts],
            'contract_type' => ['required', new NoScripts],
            'contract_status' => ['required', new NoScripts],
            'contract_zone' => ['required', new NoScripts],
            'contract_division' => ['required', new NoScripts],
            'contract_details_start_date' => ['required', new NoScripts],
            'contract_details_end_date' => ['required', new NoScripts],
            'contract_details_activity' => ['required', new NoScripts],
            'contract_details_remarks' => ['nullable', new NoScripts],
            'managermobile' => ['required', new NoScripts],
            'contract_details_mode_of_operation' => ['required', new NoScripts],
            'contract_details_no_of_employees' => ['required', new NoScripts],
            'contract_details_duration' => ['required', new NoScripts],
            'contract_details_award_status' => ['required', new NoScripts],
            'contract_location' => ['required', new NoScripts],
        ]);

        DB::table('contract_assests')
            ->where('id', $validated['contract_id'])
            ->update([
                'contract_details_award_status' => $validated['contract_details_award_status'],
            ]);
        ContractDetails::create($validated);
        return response()->json(['message' => 'Contract Details inserted successfully'], 200);
    }


    public function contractdetailsGet()
    {
        // $contractdetails = ContractDetails::all();
        $contractdetails = DB::select('SELECT *,b.stn_category,b.section_name FROM contract_details a left join(select station_category as stn_category, station,section as section_name from  railway_infos) b on a.contract_station_name = b.station order by b.section_name');


        $awardStatus = 'yes';

        return response()->json([
            'contract_details' => $contractdetails,
            'contract_details_award_status' => $awardStatus,
        ], 200);
    }

    function contractdetailsgetbymobile(Request $request)
    {
        // return response()->json(['message' => $request]);
        // Validate the request
        $request->validate([
            'licensee_id' => ['required', new NoScripts],
            'managermobile' => ['required', new NoScripts],

        ]);
        $licensee_id = $request->licensee_id;
        $managermobile = $request->managermobile;

        $today = date('Y-m-d');
        // where('licensee_id', $licensee_id)
        $contractDetails = ContractDetails::where('managermobile', $managermobile)
            ->where('contract_details_end_date', '>', $today)
            ->get();

        if ($contractDetails->isEmpty()) {
            return response()->json(['message' => 'No contract details found for this mobile number'], 404);
        }


        return response()->json(['contract_details' => $contractDetails], 200);
    }
    public function contractdetailsUpdate(Request $request)
    {
        $validated = $request->validate([
            'id' => ['required', new NoScripts],
            'Licensee_firm_name' => ['required', new NoScripts],
            'contract_code' => ['required', new NoScripts],
            'Licensee_name' => ['required', new NoScripts],
            'Licensee_mobile' => ['required', new NoScripts],
            'Lincensee_pan' => ['required', new NoScripts],
            'Lincensee_type' => ['required', new NoScripts],
            'Lincensee_status' => ['required', new NoScripts],
            'Lincensee_zone' => ['required', new NoScripts],
            'Lincensee_division' => ['required', new NoScripts],
            'contract_station_name' => ['required', new NoScripts],
            'contract_stall' => ['required', new NoScripts],
            'contract_type' => ['required', new NoScripts],
            'contract_status' => ['required', new NoScripts],
            'contract_zone' => ['required', new NoScripts],
            'contract_division' => ['required', new NoScripts],
            'contract_details_start_date' => ['required', new NoScripts],
            'contract_details_end_date' => ['required', new NoScripts],
            'contract_details_activity' => ['required', new NoScripts],
            'contract_details_remarks' => ['required', new NoScripts],
            'contract_details_mode_of_operation' => ['required', new NoScripts],
            'contract_details_no_of_employees' => ['required', new NoScripts],
            'contract_details_duration' => ['required', new NoScripts],
            'contract_details_award_status' => ['required', new NoScripts],
            'contract_id' => ['required', new NoScripts],
            'licensee_id' => ['required', new NoScripts],
            'contract_location' => ['required', new NoScripts],
            'managermobile' => ['required', new NoScripts],

        ]);

        $contract = ContractDetails::find($validated['id']);

        if (!$contract) {
            return response()->json(['message' => 'Contract not found'], 404);
        }


        $contract->update(collect($validated)->except('id')->toArray());


        $affected = DB::table('contract_assests')
            ->where('id', $validated['contract_id'])
            ->update([
                'contract_details_award_status' => $validated['contract_details_award_status'],
            ]);

        return response()->json(['message' => 'Contract Details updated successfully'], 200);
    }

    public function contractdetailsDelete(Request $request)
    {

        $validated = $request->validate([
            'id' => ['required', new NoScripts],
            'remarks' => ['required', new NoScripts],
        ]);


        $datadelete = ContractDetails::find($validated['id']);


        if (!$datadelete) {
            return response()->json(['message' => 'Contract detail not found'], 404);
        }
        // Archive the contract detail before deleting
        $contract_Id = $datadelete->contract_id;

        $deletedata = DB::table('contract_detail_deletes')->insert([
            'Licensee_firm_name' => $datadelete->Licensee_firm_name,
            'Licensee_name' => $datadelete->Licensee_name,
            'contract_id' => $datadelete->contract_id,
            'licensee_id' => $datadelete->licensee_id,
            'contract_code' => $datadelete->contract_code,
            'Licensee_mobile' => $datadelete->Licensee_mobile,
            'Lincensee_pan' => $datadelete->Lincensee_pan,
            'Lincensee_type' => $datadelete->Lincensee_type,
            'Lincensee_status' => $datadelete->Lincensee_status,
            'Lincensee_zone' => $datadelete->Lincensee_zone,
            'Lincensee_division' => $datadelete->Lincensee_division,
            'contract_station_name' => $datadelete->contract_station_name,
            'contract_stall' => $datadelete->contract_stall,
            'contract_type' => $datadelete->contract_type,
            'contract_status' => $datadelete->contract_status,
            'contract_zone' => $datadelete->contract_zone,
            'contract_division' => $datadelete->contract_division,
            'contract_details_start_date' => $datadelete->contract_details_start_date,
            'contract_details_end_date' => $datadelete->contract_details_end_date,
            'contract_details_activity' => $datadelete->contract_details_activity,
            'contract_details_remarks' => $datadelete->contract_details_remarks,
            'contract_details_mode_of_operation' => $datadelete->contract_details_mode_of_operation,
            'contract_details_no_of_employees' => $datadelete->contract_details_no_of_employees,
            'contract_details_duration' => $datadelete->contract_details_duration,
            'contract_details_award_status' => $datadelete->contract_details_award_status,
            'contract_location' => $datadelete->contract_location,
            'termination_date' => now(),
            'remarks' => $validated['remarks'],
            'created_at' => now(),
            'updated_at' => now(),
            'managermobile' => $datadelete->managermobile,
        ]);

        if (!$deletedata) {
            return response()->json(['message' => 'Failed to archive contract detail'], 500);
        }
        // Delete the original contract detail
        $datadelet = $datadelete->delete();

        if (!$datadelet) {
            return response()->json(['message' => 'Contract detail not found'], 404);
        }

        DB::table('contract_assests')
            ->where('id', $contract_Id)
            ->update([
                'contract_details_award_status' => 'no',
            ]);



        return response()->json(['message' => 'Contract detail deleted and archived successfully'], 200);
    }

    public function contractdetailsgetstncodelinces(Request $request)
    {
        $zone = $request->input('zone');        // Or from a parameter
        $division =  $request->input('division');

        $contracts = ContractDetails::where('contract_zone', $zone)
            ->where('contract_division', $division)
            ->get()
            ->map(function ($ContractDetails) {
                return [
                    'contract_code' => $ContractDetails->contract_code,
                    'licensee_id' => $ContractDetails->licensee_id,
                    'contarct_details' => "{$ContractDetails->contract_station_name} - {$ContractDetails->contract_code}-{$ContractDetails->Licensee_name} -{$ContractDetails->contract_location} "
                ];
            });


        return response()->json($contracts);
    }

  public function contractDetailsReassign(Request $req)
{
    $contractAward_id = $req->input('contractawdid');
    // Step 1: Fetch ContractDetails
    $dataContractDetails = ContractDetails::find($contractAward_id);
    if (!$dataContractDetails) {
        return response()->json(['message' => 'ContractDetails not found'], 404);
    }

    // Step 2: Fetch related ContractAssests and Licensee
    $licensee_id = $dataContractDetails->licensee_id;
    $contract_id = $dataContractDetails->contract_id;

    $contractData = ContractAssests::find($contract_id);
    $licenseeData = Licensee::find($licensee_id);

    if (!$contractData || !$licenseeData) {
        return response()->json(['message' => 'Related data not found'], 404);
    }

    // Step 3: Update from ContractAssests
    $dataContractDetails->contract_code = $contractData->contract_code;
    $dataContractDetails->contract_station_name = $contractData->station_name;
    $dataContractDetails->contract_stall = $contractData->stall;
    $dataContractDetails->contract_type = $contractData->type;
    $dataContractDetails->contract_status = $contractData->status;
    $dataContractDetails->contract_zone = $contractData->zone;
    $dataContractDetails->contract_division = $contractData->division;
    $dataContractDetails->contract_location = $contractData->contract_location;
    $dataContractDetails->contract_details_award_status = $contractData->contract_details_award_status;

    // Step 4: Update from Licensee
    $dataContractDetails->licensee_firm_name = $licenseeData->Licensee_firm_name;
    $dataContractDetails->licensee_name = $licenseeData->Licensee_name;
    $dataContractDetails->licensee_mobile = $licenseeData->mobile;
    $dataContractDetails->Lincensee_pan = $licenseeData->pan;
    $dataContractDetails->Lincensee_type = $licenseeData->type;
    $dataContractDetails->Lincensee_status = $licenseeData->status;
    $dataContractDetails->Lincensee_zone = $licenseeData->zone;
    $dataContractDetails->Lincensee_division = $licenseeData->division;

    // Step 5: Save
    $dataContractDetails->save();

    return response()->json(['message' => 'success'], 200);
}


}// end of class