<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\InspectionRegistration;
use App\Models\ContractDetails;
use App\Models\User;

class cciinspectionController extends Controller
{
    function ccigetinspection(Request $request)
    {
        $validated = $request->validate([
            'officialId' => 'required',

        ]);

        $inspections = InspectionRegistration::with('official:id,name,desig')
            ->where('official_id', $validated['officialId'])

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

    function ccigetinspectionFromdateTodate(Request $request)
    {
        $validated = $request->validate([
            'officialId' => 'required',
            'fromDate' => 'required',
            'toDate' => 'required',
        ]);

        $inspections = InspectionRegistration::with('official:id,name,desig')
            ->where('official_id', $validated['officialId'])
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

    function ccigetinspectionbyid(Request $request)
    {
        $validated = $request->validate([
            'inspectionId' => 'required|integer',
        ]);

        $inspection = InspectionRegistration::with('official:id,name,desig')
            ->find($validated['inspectionId']);

        if (!$inspection) {
            return response()->json(['message' => 'Inspection not found'], 404);
        }

        // Convert inspection to array
        $inspectionData = $inspection->toArray();

        // Add official name and designation
        $inspectionData['official_name'] = $inspection->official->name ?? null;
        $inspectionData['official_designation'] = $inspection->official->desig ?? null;

        // Remove nested 'official' from the response
        unset($inspectionData['official']);

        return response()->json([
            'inspdatabyid' => $inspectionData
        ], 200);
    }
}
