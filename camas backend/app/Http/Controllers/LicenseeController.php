<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Licensee;
use App\Rules\NoScripts;
use Illuminate\Support\Facades\DB;
use App\Models\LicenseeDetailsDelete;

class LicenseeController extends Controller
{
    public function licenseinsert(Request $request)
    {
        $validated = $request->validate([
            'Licensee_firm_name' => ['required', new NoScripts],
            'Licensee_name'      => ['required', new NoScripts],
            'mobile'             => ['required', new NoScripts],
            'pan'                => ['required', new NoScripts],
            'type'               => ['required', new NoScripts],
            'status'             => ['required', new NoScripts],
            'zone'               => ['required', new NoScripts],
            'division'           => ['required', new NoScripts],
        ]);

        Licensee::create($validated);
        return response()->json(['message' => 'Licensee inserted successfully'], 200);
    }
    public function licenseupdate(Request $request)
    {
        $validated = $request->validate([
            'Licensee_firm_name' => ['required', 'string'],
            'Licensee_name'      => ['required', 'string'],
            'mobile'             => ['required', 'string'],
            'pan'                => ['required', 'string'],
            'type'               => ['required', 'string'],
            'status'             => ['required', 'string'],
            'zone'               => ['required', 'string'],
            'division'           => ['required', 'string'],
            'id'                 => ['required', 'integer'],
        ]);

        Licensee::where('id', $validated['id'])->update(collect($validated)->except('id')->toArray());

        return response()->json(['message' => 'Licensee updated successfully'], 200);
    }
    public function licenseget(Request $request)
    {
        $validated = $request->validate([
            'zone' => 'required',
            'division' => 'required',
        ]);

        $data = Licensee::where('zone', $validated['zone'])
            ->where('division', $validated['division'])
            ->get();

        return response()->json($data, 200);
    }

    public function licensegetdelete(Request $request)
    {
        $validated = $request->validate([
            'id' => ['required'],
        ]);
        $data = Licensee::where('id', $validated['id'])->first();
        if (!$data) {
            return response()->json(["message" => "Licensee not found"], 404);
        }
        DB::table('licensee_details_deletes')->insert([
            'Licensee_firm_name' => $data->Licensee_firm_name,
            'Licensee_name' => $data->Licensee_name,
            'mobile' => $data->mobile,
            'pan' => $data->pan,
            'type' => $data->type,
            'status' => $data->status,
            'zone' => $data->zone,
            'division' => $data->division,
        ]);
        Licensee::where('id', $validated['id'])->delete();
        return response()->json(['message' => 'Licensee deleted successfully'], 200);
    }
}
