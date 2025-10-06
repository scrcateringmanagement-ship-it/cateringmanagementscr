<?php

namespace App\Http\Controllers;

use App\Models\PantryCar;
use App\Models\Status;
use Illuminate\Http\Request;
use App\Rules\NoScripts;

class PantryCarController extends Controller
{
    public function store(Request $request)
    {
        $data = $request->validate([
            'official_id' => 'required|integer',
            'inspe_officer_official_name' => 'required|string',
            'designation' => 'required|string',
            'date_of_inspe' => 'required|date',
            'from_to' => 'required|string',
            'coach_type' => 'required|string',
            'pcm_details' => 'required|array',
            'staff' => 'required|array',
            'fassai' => 'required|array',
            'availability_of_fire_safety' => 'required|array',

        ]);

        $pantryCar = PantryCar::create($data);

        return response()->json([
            'message' => 'Pantry Car created successfully',
            'data' => $pantryCar
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $pantryCar = PantryCar::find($id);

        if (!$pantryCar) {
            return response()->json(['message' => 'Pantry Car not found'], 404);
        }

        $data = $request->validate([
            'official_id' => 'sometimes|integer',
            'inspe_officer_official_name' => 'sometimes|string',
            'designation' => 'sometimes|string',
            'date_of_inspe' => 'sometimes|date',
            'from_to' => 'sometimes|string',
            'coach_type' => 'sometimes|string',
            'pcm_details' => 'required|array',
            'staff' => 'required|array',
            'fassai' => 'required|array',
            'availability_of_fire_safety' => 'required|array',

        ]);

        $pantryCar->update($data);

        return response()->json([
            'message' => 'Pantry Car updated successfully',
            'data' => $pantryCar
        ], 200);
    }

    public function getPantryCar(Request $request, $id)
    {
        $pantryCar = PantryCar::find($id);

        if (!$pantryCar) {
            return response()->json([
                'message' => 'Pantry Car not found'
            ], 404);
        }

        return response()->json([
            'message' => 'Pantry Car fetched successfully',
            'data' => $pantryCar
        ], 200);
    }


    public function get_all()
    {
        $pantryCar = PantryCar::all();
        return response()->json([
            'status' => true,
            'data'   => $pantryCar
        ]);
    }


    public function getByDateRange(Request $request)
    {
        $validated = $request->validate([
            'from_date' => ['required', new NoScripts],
            'to_date'   => ['required', new NoScripts],
        ]);

        $from = $validated['from_date'];
        $to   = $validated['to_date'];

        $inspections = PantryCar::whereBetween('date_of_inspe', [$from, $to])->get();

        return response()->json($inspections);
    }
}
