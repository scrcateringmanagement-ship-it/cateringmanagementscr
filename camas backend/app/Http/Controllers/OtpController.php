<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\ContractDetails;
use App\Models\Licensee;
use App\Models\Otp;
use App\Rules\NoScripts;
use Tymon\JWTAuth\Facades\JWTAuth;
use Tymon\JWTAuth\Exceptions\JWTException;

class OtpController extends Controller
{
    public function sendOtp(Request $request)
    {

        $request->validate([
            'mobile' => ['required', new NoScripts],
        ]);
        $resend = $request->input('resend');
        if ($resend) {
            $mobileresend = $request->input('mobile');;
            $dateOnly = now()->format('Y-m-d');

            $oldotpRecord = Otp::where('mobile_number', $mobileresend)
                ->whereDate('date_time', $dateOnly)
                ->first();
            if ($oldotpRecord) {
                $oldotpRecord->delete();
            }
        }


        $mobile = $request->mobile;

        $licensee = ContractDetails::where('managermobile', $mobile)->first();

        if (!$licensee) {
            return response()->json(['message' => 'Mobile number not found'], 404);
        }

        $otp = rand(10000000, 99999999);
        $app = "CATERING MAMAGEMENT SYSTEM";

        $dateOnly = now()->format('Y-m-d');
        $exists = Otp::where('mobile_number', $mobile)
            ->whereDate('date_time', $dateOnly)
            ->exists();

        if ($exists) {
            return response()->json(['message' => 'OTPsenttoday'], 200);
        }

        $otpRecord = Otp::create([
            'mobile_number' => $mobile,
            'otp' => $otp,
            'date_time' => now()->format('Y-m-d'),
        ]);

        if ($otpRecord) {
            // Send SMS
            $smsData = [
                "filetype" => 2,
                "msisdn" => [$mobile],
                "language" => 0,
                "credittype" => 7,
                "senderid" => "SCRSMS",
                "templateid" => 0,
                "message" => "Login OTP $otp for Railway App/Portal $app. Do not share pls.",
                "ukey" => "SjC4tJEbLu83HQucsC0RUnUag"
            ];

            $curl = curl_init();
            curl_setopt_array($curl, array(
                CURLOPT_URL => "125.16.147.178/VoicenSMS/webresources/CreateSMSCampaignPost",
                CURLOPT_RETURNTRANSFER => true,
                CURLOPT_CUSTOMREQUEST => "POST",
                CURLOPT_POSTFIELDS => json_encode($smsData),
                CURLOPT_HTTPHEADER => ["content-type: application/json"],
            ));

            $resp = curl_exec($curl);
            $dcode = json_decode($resp);
            $valsts = $dcode->status ?? '';
            $valvalue = $dcode->value ?? '';
            curl_close($curl);

            if ($valsts == "success" && $valvalue == "accepted") {
                return response()->json([
                    'status' => 'success',
                    'message' => 'OTPsent',
                    'mobile' => $request->mobile,
                ]);
            } else {
                return response()->json([
                    'status' => 'failure',
                    'message' => 'OTP Not able to send',
                    'mobile' => $request->mobile,
                ]);
            }
        }
    }


    public function verifyOtp(Request $request)
    {
        $request->validate([
            'mobile' => ['required', new NoScripts],
            'otp' => ['required', new NoScripts],
        ]);

        $mobile = $request->mobile;
        $otp = $request->otp;
        $dateOnly = now()->format('Y-m-d');

        $otpRecord = Otp::where('mobile_number', $mobile)
            ->where('otp', $otp)
            ->whereDate('date_time', $dateOnly)
            ->first();

        if (!$otpRecord) {
            return response()->json(['message' => 'Invalid OTP'], 400);
        }

        $otpRecord->delete();

        $contractdetails = ContractDetails::where('managermobile', $mobile)->first();
        $licensee_id = $contractdetails->licensee_id;
        $managermobile = $contractdetails->managermobile;
        $licensee = Licensee::find($licensee_id);

        if (!$licensee) {
            return response()->json(['message' => 'Licensee not found'], 404);
        }

        // ? Generate JWT token
        try {
            $token = JWTAuth::fromUser($licensee);
        } catch (JWTException $e) {
            return response()->json(['message' => 'Could not create token'], 500);
        }

        return response()->json([
            'message' => 'OTP verified successfully',
            'access_token' => $token,
            'licenseeID' => $licensee_id,
            'Managermobile' => $managermobile,
        ]);
    }

    public function logout(Request $request)
    {
        try {
            JWTAuth::invalidate(JWTAuth::getToken());
            return response()->json(['status' => 'success', 'message' => 'Logged out successfully']);
        } catch (JWTException $e) {
            return response()->json(['status' => 'failure', 'message' => 'Logout failed'], 500);
        }
    }
}
