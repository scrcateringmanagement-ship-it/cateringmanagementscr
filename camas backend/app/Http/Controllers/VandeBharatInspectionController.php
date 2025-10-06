<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\VandeBharatInspection;
use App\Rules\NoScripts;
use Illuminate\Support\Facades\Log;


class VandeBharatInspectionController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([

            'official_id'        => 'required|integer',
            'inspe_officer_official_name'    => 'required|string',
            'designation'                   => 'required|string',

            'date_of_insp'        => 'required|date',
          
            'from_to'             => 'required|string|max:255',
            'short_service'       => 'nullable|string',
            'rail_neer_non_avail' => 'nullable|string',
            'quality'             => 'nullable|string',
            'quantity'            => 'nullable|string',
            'hygiene'             => 'nullable|string',
            'miss_behave'         => 'nullable|string',
            'other_remarks'       => 'nullable|string',
            'pc_details'          => 'required|array',   // ✅ validate as array
            'pc_details.T_Number' => 'required|string|max:50',
            'pc_details.pcm_name' => 'required|string|max:255',
            'pc_details.pcm_number' => 'required|string|max:50',
            'fine_imposed'        => 'nullable|integer|min:0',
            'warned'              => 'nullable|string',
            'suitably_adv'        => 'nullable|string',
            'not_Substantiated'   => 'nullable|string',
            'resolved_adv'        => 'nullable|string',
            'any_other'           => 'nullable|string',
            'total'               => 'required|integer|min:0',
        ]);

        $inspection = VandeBharatInspection::create($validated);

        return response()->json([
            'message'    => 'Inspection created successfully!',
            'inspection' => $inspection
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $vande_bhart = VandeBharatInspection::find($id);

        if (!$vande_bhart) {
            return response()->json(['message' => 'Inspection not found'], 404);
        }

        $data = $request->validate([
            'official_id'        => 'required|integer',
            'inspe_officer_official_name'    => 'required|string',
            'designation'                   => 'required|string',
            'date_of_insp'        => 'required|date',
           
            'from_to'             => 'required|string|max:255',
            'short_service'       => 'nullable|string',
            'rail_neer_non_avail' => 'nullable|string',
            'quality'             => 'nullable|string',
            'quantity'            => 'nullable|string',
            'hygiene'             => 'nullable|string',
            'miss_behave'         => 'nullable|string',
            'other_remarks'       => 'nullable|string',
            'pc_details'          => 'required|array',   // ✅ validate as array
            'pc_details.T_Number' => 'required|string|max:50',
            'pc_details.pcm_name' => 'required|string|max:255',
            'pc_details.pcm_number' => 'required|string|max:50',
            'fine_imposed'        => 'nullable|integer|min:0',
            'warned'              => 'nullable|string',
            'suitably_adv'        => 'nullable|string',
            'not_Substantiated'   => 'nullable|string',
            'resolved_adv'        => 'nullable|string',
            'any_other'           => 'nullable|string',
            'total'               => 'required|integer|min:0',
        ]);

        $vande_bhart->update($data);

        return response()->json([
            'message' => 'Inspection updated successfully',
            'data'    => $vande_bhart
        ], 200);
    }

    public function vande_bhart_getby_id($id)
    {
        $vande_bhart_byid = VandeBharatInspection::find($id);

        if (!$vande_bhart_byid) {
            return response()->json([
                'message' => 'Inspection not found'
            ], 404);
        }

        return response()->json([
            'message' => 'Inspection fetched successfully',
            'data'    => $vande_bhart_byid
        ], 200);
    }


    public function getByDateRange(Request $request)
    {
        $validated = $request->validate([
            'from_date' => ['required', new NoScripts],
            'to_date' => ['required', new NoScripts],
        ]);

        $from = $validated['from_date'];
        $to   = $validated['to_date'];
        $inspections = VandeBharatInspection::whereBetween('date_of_insp', [$from, $to])->get();
        return response()->json($inspections);
    }
}
