<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\ContractAssests;
use App\Rules\NoScripts;
use Illuminate\Support\Facades\DB;

class ContractAssestsController extends Controller
{
    public function contractassestsInsert(Request $request)
    {
        $validated = $request->validate([
            'contract_code' => ['required', new NoScripts],
            'station_name' => ['required', new NoScripts],
            'stall' => ['required', new NoScripts],
            'type' => ['required',  new NoScripts],
            'status' => ['required', new NoScripts],
            'zone' => ['required', new NoScripts],
            'division' => ['required', new NoScripts],
            'contract_location' => ['required', new NoScripts],
        ]);

        ContractAssests::create($validated);
        return response()->json(['message' => 'Contract Assests inserted successfully'], 200);
    }
    public function contractassestsUpdate(Request $request)
    {
        $validated = $request->validate([
            'contract_code' => ['required', new NoScripts],
            'station_name' => ['required', new NoScripts],
            'stall' => ['required', new NoScripts],
            'type' => ['required', new NoScripts],
            'status' => ['required', new NoScripts],
            'zone' => ['required', new NoScripts],
            'division' => ['required', new NoScripts],
            'contract_location' => ['required', new NoScripts],
            'id' => ['required', new NoScripts],
        ]);

        ContractAssests::where('id', $validated['id'])->update(collect($validated)->except('id')->toArray());

        return response()->json(['message' => 'Contract Assests updated successfully'], 200);
    }
    public function contractassestsGet(Request $request)
    {
        $validated = $request->validate([
            'zone' => ['required'],
            'division' => ['required'],
        ]);

        $data = ContractAssests::where('zone', $validated['zone'])
            ->where('division', $validated['division'])
            ->get();

        return response()->json($data, 200);
    }
    public function contractassestsDelete(Request $request)
    {
        $validated = $request->validate([
            'id' => ['required'],
        ]);

        $contractAssestsdetails = ContractAssests::find($validated['id']);
        if (!$contractAssestsdetails) {
            return response()->json(['message' => 'Contract Assests deleted successfully'], 200);
        }
        DB::table("contract_assests_details_deletes")->insert([
            'contract_code' => $contractAssestsdetails->contract_code,
            'station_name' => $contractAssestsdetails->station_name,
            'stall' => $contractAssestsdetails->stall,
            'type' => $contractAssestsdetails->type,
            'status' => $contractAssestsdetails->status,
            'zone' => $contractAssestsdetails->zone,
            'division' => $contractAssestsdetails->division,
            'contract_location' => $contractAssestsdetails->contract_location,
            'contract_details_award_status' => $contractAssestsdetails->contract_details_award_status,
        ]);
        $contractAssestsdetails->delete();
        return response()->json(['message' => 'Contract Assests deleted successfully'], 200);
    }
}
