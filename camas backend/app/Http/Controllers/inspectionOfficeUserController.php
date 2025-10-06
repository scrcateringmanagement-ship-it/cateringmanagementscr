<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Models\InspectionRegistration;

class inspectionOfficeUserController extends Controller
{
    // Get approver user details by zone and division
    public function approveruserdetails(Request $request)
    {
        $validated = $request->validate([
            'zone' => 'required',
            'division' => 'required',
        ]);

        $zone = $validated['zone'];
        $division = $validated['division'];

        $users = User::where('zone', $zone)
            ->where('division', $division)
            ->where('role', 'approver')
            ->get(['id', 'name']);

        if ($users->isEmpty()) {
            return response()->json(['message' => 'No approver users found for the specified zone and division.'], 404);
        }

        return response()->json(['appdata' => $users], 200);
    }

    // Get inspections for forwarding by zone and division
    public function forwardgetinspection(Request $request)
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
            ->where('status_update', '0') // Assuming 0 means not forwarded
            ->orWhere('status_update', '3') // Assuming 3 means returned from approver
            ->whereNotIn('unit_number', ['Pantry Others', 'Un Authorised', 'Others'])
            ->get();

        if ($inspections->isEmpty()) {
            return response()->json(['message' => 'Noinspections'], 404);
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
    // Update inspection forwarding details
    function updateforwardinginspection(Request $request)
    {
        $validated = $request->validate([
            'inspection_id' => 'required',
            'forwarded_to' => 'required',
            'forwarded_remarks' => 'required|string',

        ]);

        $inspection = InspectionRegistration::find($validated['inspection_id']);
        if (!$inspection) {
            return response()->json(['message' => 'Inspection not found'], 404);
        }

        // Update the inspection with the forwarded details
        $inspection->update([
            'status_update' => '1',
            'fowardingRemarks' => $validated['forwarded_remarks'],
            'forwardingID' => $validated['forwarded_to'],
        ]);

        return response()->json(['message' => 'Inspection forwarded successfully'], 200);
    }
    function officeusergetinspection(Request $request)
    {
        $validated = $request->validate([
            'zone' => 'required',
            'division' => 'required',
            'fromDate' => 'nullable',
            'toDate' => 'nullable',
        ]);

        $zone = $validated['zone'];
        $division = $validated['division'];

        $inspections = InspectionRegistration::with('official:id,name,desig')
            ->where('zone', $zone)
            ->where('division', $division)
            ->whereBetween('inspection_date', [$validated['fromDate'], $validated['toDate']])

            ->get();
        if ($inspections->isEmpty()) {
            return response()->json(['message' => 'No inspections found'], 404);
        }

        // Transform inspections to include official name and designation
        $inspectionData = $inspections->map(function ($inspection) {
            $data = $inspection->toArray();
            $data['official_name'] = $inspection->official->name ?? null;
            $data['official_designation'] = $inspection->official->desig ?? null;
            unset($data['official']);
            return $data;
        });

        return response()->json(['inspdata' => $inspectionData], 200);
    }
}
