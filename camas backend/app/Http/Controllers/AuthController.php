<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use App\Rules\NoScripts;
use App\Helpers\CryptoHelper;
use Illuminate\Support\Facades\Validator;
use Tymon\JWTAuth\Facades\JWTAuth;
use Tymon\JWTAuth\Exceptions\JWTException;
use Illuminate\Support\Facades\Log;

class AuthController extends Controller
{
    // Create user with hash
    public function CreateUser(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', new NoScripts],
            'desig' => ['required', new NoScripts],
            'mobile' => ['required', new NoScripts],
            'loginid' => ['required', new NoScripts],
            'password' => ['required', new NoScripts],
            'type' => ['required', new NoScripts],
            'role' => ['required', new NoScripts],
            'userapp' => ['required', new NoScripts],
            'zone' => ['required', new NoScripts],
            'division' => ['required', new NoScripts],
            'location' => ['required', new NoScripts],
        ]);

        User::create([
            'name' => $validated['name'],
            'desig' => $validated['desig'],
            'mobile' => $validated['mobile'],
            'loginid' => $validated['loginid'],
            'password' => Hash::make($validated['password']),
            'type' => $validated['type'],
            'role' => $validated['role'],
            'userapp' => $validated['userapp'],
            'zone' => $validated['zone'],
            'division' => $validated['division'],
            'location' => $validated['location'],
        ]);

        return response()->json(['message' => 'User created successfully'], 201);
    }
    // Validation of credentials 


    public function LoginUser(Request $request)
    {
        $dataRecieved = $request->input('data');
        $decodedData = CryptoHelper::decode($dataRecieved);

        $validator = Validator::make($decodedData, [
            'username' => ['required', new NoScripts],
            'password' => ['required', new NoScripts],
            'captcha' => ['required'],
        ]);



        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        // check if the username exists in log table 
        //     $existingLogin = DB::table('login_timechecks')
        //     ->where('loginid', $decryptedUsername)
        //     ->whereNull('logoutstatus')
        //     ->first();

        // if ($existingLogin) {
        //     return response()->json([
        //         'message' => 'Already logged in on another device. Please log out first.'
        //     ], 401);
        // }
        // insert the login details into the log table

        $captchaToken = $decodedData['captcha'];

        Log::info('ENV RECAPTCHA_SECRET: ' . env('RECAPTCHA_SECRET'));
        Log::info('CONFIG RECAPTCHA_SECRET: ' . config('services.recaptcha.secret'));

        $captchasecret = config('services.recaptcha.secret');
        if (!$captchasecret) {
            return response()->json(['message' => 'reCAPTCHA secret key not configured'], 500);
        }
        // Validate reCAPTCHA
        $curl = curl_init();
        curl_setopt_array($curl, [
            CURLOPT_URL => 'https://www.google.com/recaptcha/api/siteverify',
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_POST => true,
            CURLOPT_POSTFIELDS => [
                'secret' => $captchasecret,
                'response' => $captchaToken,
            ],
            CURLOPT_SSL_VERIFYPEER => false,
        ]);

        $response = curl_exec($curl);
        curl_close($curl);

        $captchaData = json_decode($response, true);

        if (isset($captchaData['success']) && $captchaData['success'] === true) {
            $decryptedUsername = CryptoHelper::decrypt($decodedData['username']);
            $decryptedPassword = CryptoHelper::decrypt($decodedData['password']);

            $credentials = [
                'loginid' => $decryptedUsername,
                'password' => $decryptedPassword,
            ];

            if (!$token = auth('user-api')->attempt($credentials)) {
                return response()->json(['message' => 'Invalid credentials'], 401);
            }

            date_default_timezone_set('Asia/Kolkata');

            $nowtime = date('Y-m-d H:i:s');
            $insertedId = DB::table('login_timechecks')->insertGetId([
                'loginid' => $decryptedUsername,
                'logtype' => 'login',
                'transactiondatatime' => now(),
                'loginstatus' =>  $nowtime,
                'logoutstatus' => null,
                'created_at' =>  $nowtime,
            ]);

            $authuser = auth('user-api')->user();

            $userdata = [
                'LoinInsertedId' => $insertedId,
                'user' => $authuser,
                'access_token' => $token,
            ];

            return response()->json([
                'data' => CryptoHelper::encode($userdata)
            ], 200);
        } else {
            return response()->json(['message' => 'reCAPTCHA validation failed'], 422);
        }
    }
    //upadate Login user 

    public function updateLoginUser(Request $request)
    {
        $validated = $request->validate([
            'id' => ['required', new NoScripts],
            'name' => ['required', new NoScripts],
            'desig' => ['required', new NoScripts],
            'mobile' => ['required', new NoScripts],
            'loginid' => ['required', new NoScripts],
            'type' => ['required', new NoScripts],
            'role' => ['required', new NoScripts],
            'userapp' => ['required', new NoScripts],
            'zone' => ['required', new NoScripts],
            'division' => ['required', new NoScripts],
            'location' => ['required', new NoScripts],
        ]);

        $user = User::find($validated['id']);
        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }

        $user->update($validated);

        return response()->json(['message' => 'User updated successfully'], 200);
    }
    //get all users list


    public function userLoginGet(Request $request)
    {
        $validated = $request->validate([
            'zone' => ['nullable', new NoScripts],
            'division' => ['nullable', new NoScripts]
        ]);

        $query = User::query();

        if (!empty($validated['zone'])) {
            $query->where('zone', $validated['zone']);
        }

        if (!empty($validated['division'])) {
            $query->where('division', $validated['division']);
        }

        $users = $query->get();


        if ($users->isEmpty()) {
            return response()->json(['message' => 'No users found'], 404);
        }

        return response()->json($users, 200);
    }

    // user delete 

    public function userLoginDelete(Request $request)
    {
        $validated = $request->validate([
            'id' => ['required', new NoScripts],
        ]);

        $datadelete = User::find($validated['id']);
        if (!$datadelete) {
            return response()->json(['message' => 'User detail not found'], 404);
        }

        DB::table('login_details_deletes')->insert([
            'name' => $datadelete->name,
            'desig' => $datadelete->desig,
            'mobile' => $datadelete->mobile,
            'loginid' => $datadelete->loginid,
            'password' => $datadelete->password,
            'type' => $datadelete->type,
            'role' => $datadelete->role,
            'userapp' => $datadelete->userapp,
            'zone' => $datadelete->zone,
            'division' => $datadelete->division,
            'location' => $datadelete->location,
            'firebase_key' => $datadelete->firebase_key,
        ]);

        $datadelete->delete();

        return response()->json(['message' => 'User detail deleted successfully'], 200);
    }
    // user logged in data

    public function logindata(Request $request)
    {
        $user = auth('user-api')->user();

        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }

        return response()->json($user, 200);
    }

    // log out


    public function logout(Request $request)
    {
        $logoutid = $request->input('LoginInsertedId');
        try {
            JWTAuth::invalidate(JWTAuth::getToken());

            $user = auth('user-api')->user();
            date_default_timezone_set('Asia/Kolkata');

            $nowtime = date('Y-m-d H:i:s');
            if ($user) {
                DB::table('login_timechecks')
                    ->where('id', $logoutid)
                    ->update([
                        'logoutstatus' => $nowtime,
                    ]);
                return response()->json(['status' => 'Loggedout'], 200);
            }

            return response()->json(['status' => 'UserNotFound'], 200);
        } catch (JWTException $e) {
            return response()->json(['error' => 'Failed to logout, token invalid'], 500);
        }
    }

    public function changePassword(Request $request)
    {
        $validated = $request->validate([
            'userid' => ['required', new NoScripts],
            'currentPassword' => ['required', new NoScripts],
            'newPassword' => ['required', new NoScripts]
        ]);



        // Find user
        $user = User::find($validated['userid']);

        if (!$user) {
            return response()->json(['status' => 'usrnotfound', 'message' => 'User not found'], 404);
        }

        // Check current password
        if (!Hash::check($validated['currentPassword'], $user->password)) {
            return response()->json([
                'status' => "invalidpassword",
                'message' => 'Current password is incorrect'
            ]);
        }

        // Update with hashed new password
        $user->password = Hash::make($request->newPassword);
        $user->save();

        return response()->json(['status' => "true"]);
    }

    //End of Class     
}
