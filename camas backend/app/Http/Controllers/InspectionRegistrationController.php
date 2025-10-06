<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\InspectionRegistration;
use App\Models\ContractDetails;
use App\Models\User;


class InspectionRegistrationController extends Controller
{

    public function inspectionregistrationinsert(Request $request)
    {

        $validated = $request->validate([
            'officialId' => 'required',
            'unitNumber' => 'required',
            'inspectionDate' => 'required|date',
            'inspectionMode' => 'required',
            'deficiencies' => 'required',
            'deficiencyCategory' => 'required',
            'trainNumber' => 'nullable',
            'station' => 'nullable',
            'section' => 'nullable',
            'vendorDetails' => 'nullable',
            'vendorName' => 'nullable',
            'vendorNumber' => 'nullable',
            'vendorAadhar' => 'nullable',
            'licenseeName' => 'nullable',
            'licenseeNumber' => 'nullable',
            'licenseeDivision' => 'nullable',
            // These are conditionally required, so keep them nullable here
            'action_taken' => 'nullable',
            'fine_imposed' => 'nullable',
            'action_remarks' => 'nullable',
            'prosecutionAmount' => 'nullable',
            'zone' => 'nullable',
            'division' => 'nullable',
            'roleap' => 'nullable', // Assuming roleap can be either 'approver' or 'forwarder'
        ]);

        $specialUnits = ['Un Authorised', 'Pantry Others', 'Others'];

        $data = [
            'official_id' => $validated['officialId'],
            'unit_number' => $validated['unitNumber'],
            'inspection_date' => $validated['inspectionDate'],
            'inspection_mode' => $validated['inspectionMode'],
            'train_number' => $validated['trainNumber'] ?? null,
            'station' => $validated['station'] ?? null,
            'section' => $validated['section'] ?? null,
            'vendor_details' => $validated['vendorDetails'] ?? null,
            'deficiency_details' => $validated['deficiencies'],
            'deficiency_category' => $validated['deficiencyCategory'],
            'vendor_name' => $validated['vendorName'] ?? null,
            'vendor_id' => $validated['vendorNumber'] ?? null,
            'vendor_aadhar' => $validated['vendorAadhar'] ?? null,
            'licensee_name' => $validated['licenseeName'] ?? null,
            'licensee_number' => $validated['licenseeNumber'] ?? null,
            'licensee_division' => $validated['licenseeDivision'] ?? null,
            'status_update' => "0", // Default status update
            'paidstatus' => "0", // Default paid status
            'zone' => $validated['zone'] ?? null,
            'division' => $validated['division'] ?? null,
        ];

        if ($validated['roleap'] == 'approver') {
            $data['status_update'] = "2"; // Default status update
            $data['action_taken'] = $validated['action_taken'] ?? null;
            $data['fine_imposed'] = $validated['fine_imposed'] ?? null;
            $data['action_remarks'] = $validated['action_remarks'] ?? null;
        }


        // Add additional fields only if the unitNumber matches special units
        if (in_array($validated['unitNumber'], $specialUnits)) {
            $data['status_update'] = "2"; // Default status update
            $data['action_taken'] = $validated['action_taken'] ?? null;
            $data['fine_imposed'] = $validated['fine_imposed'] ?? null;
            $data['action_remarks'] = $validated['action_remarks'] ?? null;
        }

        $inspection = InspectionRegistration::create($data);
        if (!$inspection) {
            return response()->json(['message' => 'Failed to register inspection'], 500);
        }
        // If the inspection is successfully created, return the contract details
        return response()->json([
            'message' => 'Inspection registered successfully',
            'data' => $inspection
        ], 200);
    }

    public function inspectionregistrationget(Request $request)
    {
        $validated = $request->validate([
            'official_id' => 'required',

        ]);

        $inspections = InspectionRegistration::where('official_id', $validated['official_id'])
            ->get();

        // Get the official's name once
        $username = User::where('id', $validated['official_id'])->value('name');

        $result = [];

        foreach ($inspections as $inspection) {
            $unitNumber = $inspection->unit_number;

            $contractDetail = ContractDetails::where('contract_code', $unitNumber)->first();

            if ($contractDetail) {
                $result[] = [
                    'official_name' => $username,
                    'inspection' => $inspection,
                    'contract_details' => $contractDetail
                ];
            }
        }

        if (empty($result)) {
            return response()->json(['message' => 'No matching data found'], 404);
        }

        return response()->json([
            'data' => $result
        ]);
    }
}
