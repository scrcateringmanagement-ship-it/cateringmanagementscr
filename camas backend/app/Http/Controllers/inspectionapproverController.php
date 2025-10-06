<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\InspectionRegistration;

class inspectionapproverController extends Controller
{
    // Get inspections for forwarding by zone and division
    public function approvergetinspection(Request $request)
    {
        $validated = $request->validate([
            'zone' => 'required',
            'division' => 'required',
        ]);

        $zone = $validated['zone'];
        $division = $validated['division'];

        $inspections = InspectionRegistration::with('official:id,name,desig')
            ->where('zone', $zone)
            ->where('division', $division)
            ->where('status_update', '1') // Assuming 0 means not forwarded
            ->whereNotIn('unit_number', ['Pantry Others', 'Un Authorised', 'Others'])
            ->get();

        if ($inspections->isEmpty()) {
            return response()->json(['message' => 'Noinspections'], 200);
        }

        $inspectionData = $inspections->map(function ($inspection) {
            return [
                ...$inspection->toArray(),
                'official_name' => $inspection->official->name ?? null,
                'official_designation' => $inspection->official->desig ?? null,
            ];
        });

        return response()->json(['inspforwardingdata' => $inspectionData], 200);
    }
   function approverupdateaction(Request $request)
    {
        $validated = $request->validate([
            'inspectionId' => 'required|integer',
            'actionTaken' => 'required|string|max:255',
            'finedAmount' => 'required|numeric|min:0',
            'remarks' => 'nullable|string|max:500',
        ]);

        $inspection = InspectionRegistration::find($validated['inspectionId']);
        if (!$inspection) {
            return response()->json(['message' => 'Inspection not found'], 404);
        }

        $inspection->action_taken = $validated['actionTaken'];
        $inspection->fine_imposed = $validated['finedAmount'];
        $inspection->action_remarks = $validated['remarks'];
        $inspection->status_update = 2; // Assuming 2 means action taken

        if ($inspection->save()) {
            return response()->json(['message' => 'Action taken and fined amount updated successfully'], 200);
        } else {
            return response()->json(['message' => 'Failed to update inspection'], 500);
        }
    }
    function returninspectiontoofficeuser(Request $request)
    {
        $validated = $request->validate([
            'inspectionId' => 'required|integer',
            'returnRemarks' => 'required|string|max:500',
        ]);

        $inspection = InspectionRegistration::find($validated['inspectionId']);
        if (!$inspection) {
            return response()->json(['message' => 'Inspection not found'], 404);
        }

        $inspection->status_update = '3'; // Assuming 3 means returned
        $inspection->returnRemarks = $validated['returnRemarks'];

        if ($inspection->save()) {
            return response()->json(['message' => 'Inspection record returned successfully'], 200);
        } else {
            return response()->json(['message' => 'Failed to return inspection record'], 500);
        }
    }
}
