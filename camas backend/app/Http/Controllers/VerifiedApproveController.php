<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Models\FormApplication;
use Illuminate\Support\Facades\Storage;

use BaconQrCode\Common\ErrorCorrectionLevel;
use BaconQrCode\Renderer\ImageRenderer;
use BaconQrCode\Renderer\RendererStyle\RendererStyle;
use BaconQrCode\Renderer\Image\RendererStyle\Fill;
use BaconQrCode\Renderer\Image\SvgImageBackEnd; // Fallback if PNG not found
use BaconQrCode\Writer;

class VerifiedApproveController extends Controller
{
    public function verifiedapproveInsert(Request $request)
    {
        $request->validate([
            'id_form_application' => 'required',
            'sender' => 'required',
            'transcation' => 'required',
            'remarks' => 'required',
            'signature' => 'required',
        ]);

        $sender = $request->sender;
        $formId = $request->id_form_application;
        $transcation = $request->transcation;
        $remarks = $request->remarks;
        $validity = $request->validity_date;
        $signature = $request->signature;

        switch ($sender) {
            case 'cci':

                if ($transcation == 'a') {
                    $data = [

                        'cci_signature' => $signature,
                        'cci_accpet_remarks' => $remarks,
                    ];
                } elseif ($transcation == 'r') {
                    $data = [

                        'cci_signature' => $signature,
                        'cci_reject_remarks' => $remarks,
                    ];
                } else {
                    return response()->json(['message' => 'Invalid transcation'], 400);
                }

                DB::table('verified_approveds')->insert([
                    'id_form_application' => $formId,

                    'cci_accpet_remarks' => $data['cci_accpet_remarks'] ?? null,
                    'cci_reject_remarks' => $data['cci_reject_remarks'] ?? null,
                    'cci_signature' => $signature,
                ]);

                if ($transcation == 'a') {
                    DB::table('form_applications')
                        ->where('id', $formId)
                        ->update([
                            'status_update' => '1',
                        ]);
                } else {
                    DB::table('form_applications')
                        ->where('id', $formId)
                        ->update([
                            'status_update' => 'R',
                        ]);
                }
                return response()->json(['message' => 'CCI successfully verified'], 200);
                break;

            case 'office_user':
                if ($transcation == 'a') {
                    $data = [
                        'officer_signature' => $signature,
                        'officer_accept_remarks' => $remarks,
                    ];
                } elseif ($transcation == 'r') {
                    $data = [
                        'officer_signature' => $signature,
                        'officer_reject_remarks' => $remarks,
                    ];
                } else {
                    return response()->json(['message' => 'Invalid transcation'], 400);
                }

                DB::table('verified_approveds')
                    ->where('id_form_application', $formId)
                    ->update([
                        'officer_accept_remarks' => $data['officer_accept_remarks'] ?? null,
                        'officer_reject_remarks' => $data['officer_reject_remarks'] ?? null,
                        'officer_signature' => $signature,
                    ]);

                if ($transcation == 'a') {
                    DB::table('form_applications')
                        ->where('id', $formId)
                        ->update([
                            'status_update' => '2',
                            'valid_upto' => $validity,
                        ]);
                } else {
                    DB::table('form_applications')
                        ->where('id', $formId)
                        ->update([
                            'status_update' => 'R',
                        ]);
                }
                return response()->json(['message' => 'Officer data updated successfully'], 200);

                break;

            case 'approver':

                if ($transcation == 'a') {

                    $data = [
                        'approver_signature' => $signature,
                        'approver_accpet_remarks' => $remarks,
                    ];
                    // Generate QR Code with formId
                    $baseUrl = 'https://cateringmanagement.indianrailways.gov.in/ViewIDCARd/#/view/';
                    $qrCodeContent = $baseUrl . $formId;
                    $fileName = 'idcardqrcode_' . $formId . '.svg';
                    $filePath = 'public/qrcodes/' . $fileName;

                    // qr generation renderer
                    $renderer = new ImageRenderer(
                        new RendererStyle(300),
                        new SvgImageBackEnd() // SVG works even if PNG is not available
                    );

                    $writer = new Writer($renderer);

                    $qrImage = $writer->writeString($qrCodeContent);

                    Storage::put($filePath, $qrImage);

                    // Ensure the directory exists

                    $qrcodeurl = url('/') . Storage::url($filePath);
                } elseif ($transcation == 'r') {
                    $data = [
                        'approver_signature' => $signature,
                        'approver_reject_remarks' => $remarks,
                    ];
                } else {
                    return response()->json(['message' => 'Invalid transcation'], 400);
                }

                DB::table('verified_approveds')->where('id_form_application', $formId)->update([
                    'approver_accpet_remarks' => $data['approver_accpet_remarks'] ?? null,
                    'approver_reject_remarks' => $data['approver_reject_remarks'] ?? null,

                    'approver_signature' => $signature,
                ]);

                if ($transcation == 'a') {
                    DB::table('form_applications')
                        ->where('id', $formId)
                        ->update([
                            'qr_url' => $qrcodeurl ?? null,
                            'approver_sign' => $signature,
                            'status_update' => 'A',
                        ]);
                } elseif ($transcation == 'r') {
                    DB::table('form_applications')
                        ->where('id', $formId)
                        ->update([
                            'status_update' => 'RE',
                        ]);
                }

                return response()->json(['message' => 'Approver data updated successfully'], 200);
                break;

            default:
                return response()->json(['message' => 'Invalid sender'], 400);
        }
    }

    public function getVerifiedData(Request $request)
    {
        $formId = $request->input('form_id');

        if (!$formId) {
            return response()->json(['message' => 'Form ID is required'], 400);
        }

        $verifiedData = FormApplication::select(
            'form_applications.*',
            'form_applications.id as form_id',
            'latest_verified.*'
        )
            ->leftJoin(DB::raw("
        (SELECT * FROM verified_approveds WHERE id_form_application = ? ORDER BY id DESC LIMIT 1) as latest_verified
    "), 'form_applications.id', '=', 'latest_verified.id_form_application')
            ->addBinding($formId, 'select') // Bind the formId
            ->where('form_applications.id', $formId)
            ->first();

        if (!$verifiedData) {
            return response()->json(['message' => 'No verified data found for this form ID'], 404);
        }

        return response()->json($verifiedData, 200);
    }
}
