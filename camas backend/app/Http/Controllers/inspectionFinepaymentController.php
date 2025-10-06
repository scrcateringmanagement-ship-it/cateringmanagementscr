<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\InspectionRegistration;

class inspectionFinepaymentController extends Controller
{
    function getInspectionFinePayment(Request $request)
    {
        $inspectionsFined = InspectionRegistration::with('official:id,name,desig')
            ->where(function ($query) {
                $query->where('action_taken', 'Fined')
                    ->orWhere('action_taken', 'Handed Over To IPF');
            })
            ->where('paidstatus', '0')
            ->get();


        $data = $inspectionsFined->map(function ($inspection) {
            // Convert all inspection fields to array
            $inspectionData = $inspection->toArray();

            // Add name and designation from official (User)
            $inspectionData['official_name'] = $inspection->official->name ?? null;
            $inspectionData['official_designation'] = $inspection->official->desig ?? null;

            // Remove nested official
            unset($inspectionData['official']);

            return $inspectionData;
        });

        return response()->json([
            'message' => 'Fine payment details',
            'finePaymentInspections' => $data
        ], 200);
    }



    function updatefinePaymentDetails(Request $request)
    {
        $validated = $request->validate([
            'inspectionId' => 'required',
            'paymentDate' => 'required|string', // Assuming you want to store the date as a string
            'recieptNumber' => 'required|string',
            'paidAmount' => 'required',
            'paidLocation' => 'required|string',
            'prosecuted_amount' => 'required', // Assuming this is a numeric field
        ]);

        $inspection = InspectionRegistration::find($validated['inspectionId']);

        if (!$inspection) {
            return response()->json(['message' => 'Inspection not found'], 404);
        }

        $inspection->paymentDate = $validated['paymentDate'];
        $inspection->recieptNumber = $validated['recieptNumber'];
        $inspection->paidAmount = $validated['paidAmount'];
        $inspection->prosecutionAmount = $validated['prosecuted_amount'];
        $inspection->paidLocation = $validated['paidLocation'];
        $inspection->paidstatus = "1";

        $inspection->save();

        return response()->json(['message' => 'Fine payment details updated successfully', 'data' => $inspection], 200);
    }
}
