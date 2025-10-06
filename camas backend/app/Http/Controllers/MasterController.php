<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\File;
use App\Models\categories;
use App\Models\RailwayInfo;
use App\Models\UserType;
use App\Models\RoleType;
use App\Models\Status;
use App\Models\modeOfOperation;
use App\Models\ModeOfPayment;
use App\Models\locationtype;
use App\Rules\NoScripts;
use App\Models\vendordeginsation;
use App\Models\CategoryofDeficiency;
use App\Models\ActionTaken;
use App\Models\ModeOfInspection;
use Illuminate\Http\JsonResponse;

use App\Models\Otp;

class MasterController extends Controller
{
    public function categoryInsert(Request $request)
    {
        $validated = $request->validate([
            'categoryname' => 'required',
            new NoScripts
        ]);

        categories::create($validated);

        return response()->json(['message' => 'Category inserted successfully']);
    }

    public function categoryUpdate(Request $request)
    {
        $validated = $request->validate([
            'id' => 'required',
            new NoScripts,
            'categoryname' => 'required',
            new NoScripts,
        ]);

        $category = categories::find($validated['id']);
        $category->update([
            'categoryname' => $validated['categoryname'],
        ]);

        return response()->json(['message' => 'Category updated successfully']);
    }


    public function categoryGet()
    {
        $categories = categories::all();
        return response()->json($categories);
    }
    public function categoryDelete(Request $request)
    {
        $validated = $request->validate([
            'id' => ['required', new NoScripts],
        ]);

        $category = categories::find($validated['id']);
        if ($category) {
            $category->delete();
            return response()->json(['message' => 'Category deleted successfully'], 200);
        } else {
            return response()->json(['message' => 'Category not found'], 404);
        }
    }

    //railywayinfo
    public function railywayinfoInsert(Request $request)
    {
        $validated = $request->validate([
            'zone' => 'required',
            new NoScripts,
            'division' => 'required',
            new NoScripts,
            'station' => 'required',
            new NoScripts,
            'section' => 'required',
            new NoScripts,
            'station_category' => 'required',
            new NoScripts,
        ]);

        RailwayInfo::create([
            'zone' => $validated['zone'],
            'division' => $validated['division'],
            'station' => $validated['station'],
            'section' => $validated['section'],
            'station_category' => $validated['station_category'],
        ]);

        return response()->json(['message' => 'Railway info inserted successfully']);
    }

    public function railywayinfoUpdate(Request $request)
    {
        $validated = $request->validate([
            'id' => 'required',
            new NoScripts,
            'zone' => 'required',
            new noScripts,
            'division' => 'required',
            new NoScripts,
            'station' => 'required',
            new NoScripts,
            'section' => 'required',
            new NoScripts,
            'station_category' => 'required',
            new NoScripts,
        ]);

        $railwayInfo = RailwayInfo::find($validated['id']);

        if (!$railwayInfo) {
            return response()->json(['message' => 'Record not found'], 404);
        }

        $railwayInfo->update([
            'zone' => $validated['zone'],
            'division' => $validated['division'],
            'station' => $validated['station'],
            'section' => $validated['section'],
            'station_category' => $validated['station_category'],
        ]);

        return response()->json(['message' => 'Railway info updated successfully']);
    }

    public function railywayinfoGet(Request $request)
    {

        // Validate only if present
        $validated = $request->validate([
            'zone' => ['nullable', new NoScripts],
            'division' => ['nullable', new NoScripts],
        ]);

        $query = RailwayInfo::query();

        if (!empty($validated['zone'])) {
            $query->where('zone', $validated['zone']);
        }

        if (!empty($validated['division'])) {
            $query->where('division', $validated['division']);
        }

        $data = $query->get();

        return response()->json($data, 200);
    }

    public function railywayinfoDelete(Request $request)
    {
        $validated = $request->validate([
            'id' => ['required'],
        ]);


        $railywayInfo = RailwayInfo::find($validated['id']);
        if ($railywayInfo) {
            $railywayInfo->delete();
            return response()->json(['message' => 'Railway info deleted successfully'], 200);
        } else {
            return response()->json(['message' => 'Railway info not found'], 404);
        }
    }









    // Removed duplicate modeofpaymentget method to avoid redeclaration error.



    //mode_of_operation    
    public function modeofoperationinsert(Request $request)
    {
        $request->validate([
            'modeofoperation' => 'required',
            new NoScripts,
        ]);

        ModeOfOperation::create([
            'modeofoperation' => $request->modeofoperation,
        ]);

        return response()->json(['message' => 'Mode of operation inserted successfully']);
    }

    public function modeofoperationupdate(Request $request)
    {
        $request->validate([
            'modeofoperation' => 'required',
            new NoScripts,
            'id' => 'required',
            new NoScripts,
        ]);

        $mode = ModeOfOperation::find($request->id);
        if (!$mode) {
            return response()->json(['message' => 'Mode of operation not found'], 404);
        }

        $mode->update([
            'modeofoperation' => $request->modeofoperation,
        ]);

        return response()->json(['message' => 'Mode of operation updated successfully']);
    }

    public function modeofoperationget(Request $request)
    {
        $modeofoperations = ModeOfOperation::all();
        return response()->json([$modeofoperations], 200);
    }
    public function modeofoperationdelete(Request $request)
    {
        $request->validate([
            'id' => 'required',
            new NoScripts,
        ]);

        $mode = ModeOfOperation::find($request->id);
        if (!$mode) {
            return response()->json(['message' => 'Mode of operation not found'], 404);
        }

        $mode->delete();

        return response()->json(['message' => 'Mode of operation deleted successfully']);
    }





    //status

    public function statusInsert(Request $request)
    {
        $validated = $request->validate([
            'status' => 'required',
            new NoScripts,
        ]);

        Status::create($validated);

        return response()->json(['message' => 'Status inserted successfully']);
    }

    public function statusUpdate(Request $request)
    {
        $validated = $request->validate([
            'id' => 'required',
            new NoScripts,
            'status' => 'required',
        ]);

        $status = Status::find($validated['id']);
        $status->update([
            'status' => $validated['status'],
        ]);

        return response()->json(['message' => 'Status updated successfully']);
    }


    public function statusGet(Request $request)
    {
        if ($request->has('id')) {
            $status = Status::find($request->id);

            if (!$status) {
                return response()->json(['message' => 'Status not found'], 404);
            }

            return response()->json($status);
        }

        $statuses = Status::all();
        return response()->json($statuses);
    }

    // Delete Status
    public function statusDelete(Request $request)
    {
        $validated = $request->validate([
            'id' => 'required',
            new NoScripts,
        ]);

        $status = Status::find($validated['id']);
        $status->delete();

        return response()->json(['message' => 'Status deleted successfully']);
    }


    //usertype

    public function userInsert(Request $request)
    {
        $validated = $request->validate([
            'usertypename' => 'required',
            new NoScripts,
        ]);
        $user_types = UserType::create([
            'usertypename' => $validated['usertypename'],

        ])->save();
        return response()->json(['message' => 'User type inserted successfully']);
    }

    public function userUpdateType(Request $request)
    {
        $validated = $request->validate([
            'id' => 'required',
            new NoScripts,
            'usertypename' => 'required',
            new NoScripts,
        ]);

        $userType = UserType::find($validated['id']);

        $userType->update([
            'usertypename' => $validated['usertypename'],
        ]);

        return response()->json(['message' => 'User type updated successfully']);
    }
    public function userGetType(Request $request)
    {
        if ($request->has('id')) {
            $userType = UserType::find($request->id);

            if (!$userType) {
                return response()->json(['message' => 'User type not found'], 404);
            }

            return response()->json($userType);
        }
        $userTypes = UserType::all();
        return response()->json($userTypes);
    }
    public function userDelete(Request $request)
    {
        $validated = $request->validate([
            'id' => ['required', new NoScripts],
        ]);

        $userType = UserType::find($validated['id']);

        if (!$userType) {
            return response()->json(['message' => 'User type not found'], 404);
        }

        $userType->delete();

        return response()->json(['message' => 'User type deleted successfully']);
    }

    //userroletype

    public function roleTypeInsert(Request $request)
    {
        $validated = $request->validate([
            'roletypename' => 'required',
            new NoScripts,
        ]);
        $role_types = RoleType::create([
            'roletypename' => $validated['roletypename'],

        ])->save();
        return response()->json(['message' => 'Role type inserted successfully']);
    }

    public function roleTypeUpdate(Request $request)
    {
        $validated = $request->validate([
            'id' => 'required',
            new NoScripts,
            'roletypename' => 'required',
            new NoScripts,
        ]);

        $roleType = RoleType::find($validated['id']);

        $roleType->update([
            'roletypename' => $validated['roletypename'],
        ]);

        return response()->json(['message' => 'Role type updated successfully']);
    }
    public function roleTypeGet(Request $request)
    {
        if ($request->has('id')) {
            $roleType = RoleType::find($request->id);

            if (!$roleType) {
                return response()->json(['message' => 'Role type not found'], 404);
            }

            return response()->json($roleType);
        }
        $roleTypes = RoleType::all();
        return response()->json($roleTypes);
    }
    public function roleTypeDelete(Request $request)
    {
        $validated = $request->validate([
            'id' => ['required', new NoScripts],
        ]);

        $roleType = RoleType::find($validated['id']);

        if (!$roleType) {
            return response()->json(['message' => 'Role type not found'], 404);
        }

        $roleType->delete();

        return response()->json(['message' => 'Role type deleted successfully']);
    }


    //mode_of_payment

    public function modeofpaymentinsert(Request $request)
    {
        $validated = $request->validate([
            'mode_of_payment' => 'required',
            new NoScripts,
        ]);

        ModeOfPayment::create($validated);

        return response()->json(['message' => 'Mode of payment inserted successfully']);
    }
    public function modeofpaymentupdate(Request $request)
    {
        $validate = $request->validate([
            'id' => 'required',
            'mode_of_payment' => 'required',
        ]);
        $modeOfPayment = ModeOfPayment::find($validate['id']);
        $modeOfPayment->update([
            'mode_of_payment' => $validate['mode_of_payment'],
        ]);
        return response()->json(['message' => 'Mode of payment updated successfully']);
    }
    public function modeofpaymentget(Request $request)
    {
        $modeOfPayment = ModeOfPayment::all();
        return response()->json($modeOfPayment);
    }
    public function modeofpaymentdelete(Request $request)
    {
        $validated = $request->validate([
            'id' => 'required',
            new NoScripts,
        ]);

        $modeOfPayment = ModeOfPayment::find($validated['id']);
        $modeOfPayment->delete();

        return response()->json(['message' => 'Mode of payment deleted successfully']);
    }

    //locationtype
    public function contractlocationtypeInsert(Request $request)
    {
        $validated = $request->validate([
            'contract_location_type' => 'required',
            new NoScripts,
            'contract_category' => 'required',
            new NoScripts,
        ]);

        locationtype::create($validated);

        return response()->json(['message' => 'Location type inserted successfully']);
    }
    public function contractlocationtypeUpdate(Request $request)
    {
        $validated = $request->validate([
            'id' => 'required',
            new NoScripts,
            'contract_location_type' => 'required',
            new NoScripts,
            'contract_category' => 'required',
            new NoScripts,
        ]);

        $locationType = locationtype::find($validated['id']);
        $locationType->update([
            'contract_location_type' => $validated['contract_location_type'],
            'contract_category' => $validated['contract_category'],
        ]);

        return response()->json(['message' => 'Location type updated successfully']);
    }
    public function contractlocationtypeGet(Request $request)
    {
        $locationTypes = locationtype::all();
        return response()->json($locationTypes);
    }
    public function contractlocationtypeDelete(Request $request)
    {
        $validated = $request->validate([
            'id' => 'required',
            new NoScripts,
        ]);
        $locationType = locationtype::find($validated['id']);
        if (!$locationType) {
            return response()->json(['message' => 'Location type not found'], 404);
        }
        $locationType->delete();
        return response()->json(['message' => 'Location type deleted successfully']);
    }


    //vendor position

    public function getvendorposition(Request $request)
    {
        $detils = vendordeginsation::all();
        return response()->json($detils);
    }
    public function vendorpositionInsert(Request $request)
    {
        $validated = $request->validate([
            'vendorPositionName' => 'required',
            new NoScripts,
        ]);

        vendordeginsation::create($validated);

        return response()->json(['message' => 'Vendor position inserted successfully']);
    }
    public function vendorpositionUpdate(Request $request)
    {
        $validated = $request->validate([
            'id' => 'required',
            new NoScripts,
            'vendorPositionName' => 'required',
            new NoScripts,
        ]);

        $vendorPositionName = vendordeginsation::find($validated['id']);
        $vendorPositionName->update([
            'vendorPositionName' => $validated['vendorPositionName'],
        ]);

        return response()->json(['message' => 'Vendor position updated successfully']);
    }
    public function vendorpositionDelete(Request $request)
    {
        $validated = $request->validate([
            'id' => 'required',
            new NoScripts,
        ]);

        $vendorPositionName = vendordeginsation::find($validated['id']);
        if (!$vendorPositionName) {
            return response()->json(['message' => 'Vendor position not found'], 404);
        }
        $vendorPositionName->delete();
        return response()->json(['message' => 'Vendor position deleted successfully']);
    }
    public function vendorget(Request $request)
    {
        $detils1 = vendordeginsation::all();
        return response()->json($detils1);
    }

    //CategoryofDeficiency
    public function CategoryofDeficiencyinsert(Request $request)
    {
        $validated = $request->validate([
            'CategoryofDeficiency' => ['required', new NoScripts],
        ]);

        $data = CategoryofDeficiency::create([
            'CategoryofDeficiency' => $validated['CategoryofDeficiency'],
        ]);

        return response()->json($data);
    }

    public function CategoryofDeficiencyUpdate(Request $request)
    {
        $validated = $request->validate([
            'id' => 'required',
            'CategoryofDeficiency' => 'required',
            new NoScripts,
        ]);

        $data = CategoryofDeficiency::find($validated['id']);

        $data->update([
            'CategoryofDeficiency' => $validated['CategoryofDeficiency'],
        ]);

        return response()->json($data);
    }

    public function CategoryofDeficiencyget(Request $request)
    {
        $details = CategoryofDeficiency::all(); // Fixed typo: $detils1 -> $details
        return response()->json($details);
    }
    public function categoryofdeficiencydelete(Request $request)
    {

        $request->validate([
            'id' => 'required',
        ]);
        $category = CategoryOfDeficiency::find($request->id);

        if ($category) {
            $category->delete();
            return response()->json(['message' => 'Category of deficiency deleted successfully.'], 200);
        } else {
            return response()->json(['message' => 'Category of deficiency not found.'], 404);
        }
    }
    //actiontaken
    public function actiontakeninsert(Request $request)
    {
        $validated = $request->validate([
            'actiontaken' => ['required', new NoScripts],
        ]);

        $data = ActionTaken::create([
            'actiontaken' => $validated['actiontaken'],
        ]);

        return response()->json($data, 201);
    }
    public function actiontakenupdate(Request $request)
    {
        $validated = $request->validate([
            'id' => 'required|exists:action_takens,id',
            'actiontaken' => ['required', new NoScripts],
        ]);

        $data = ActionTaken::find($validated['id']);
        $data->update([
            'actiontaken' => $validated['actiontaken'],
        ]);

        return response()->json($data);
    }
    public function actiontakenget(Request $request)
    {
        $data = ActionTaken::all();
        return response()->json($data);
    }
    public function actiontakendelete(Request $request)
    {

        $request->validate([
            'id' => 'required',
        ]);


        $action = ActionTaken::find($request->id);

        if ($action) {
            $action->delete();
            return response()->json(['message' => 'Action Taken record deleted successfully.'], 200);
        } else {
            return response()->json(['message' => 'Action Taken record not found.'], 404);
        }
    }
    //modeofinspection

    public function modeofinspectioninsert(Request $request)
    {
        $validated = $request->validate([
            'modeofinspection' => ['required', new NoScripts],
        ]);

        $data = ModeOfInspection::create([
            'modeofinspection' => $validated['modeofinspection'],
        ]);

        return response()->json($data, 201);
    }

    public function modeofinspectionupdate(Request $request)
    {
        $validated = $request->validate([
            'id' => 'required',
            'modeofinspection' => ['required', new NoScripts],
        ]);

        $data = ModeOfInspection::find($validated['id']);
        $data->update([
            'modeofinspection' => $validated['modeofinspection'],
        ]);

        return response()->json($data);
    }
    public function modeofinspectionget(Request $request)
    {
        $data = ModeOfInspection::all();
        return response()->json($data);
    }
    public function modeofinspectiondelete(Request $request)
    {

        $request->validate([
            'id' => 'required',
        ]);

        $mode = ModeOfInspection::find($request->id);

        if ($mode) {
            $mode->delete();
            return response()->json(['message' => 'Mode of inspection deleted successfully.'], 200);
        } else {
            return response()->json(['message' => 'Mode of inspection not found.'], 404);
        }
    }

    public function maintenanceMode(Request $request)
    {
        $enable = $request->input('enable');
        $path = storage_path('framework/app_down');

        if ($enable) {
            File::put($path, 'down');
        } else {
            File::delete($path);
        }

        return response()->json(['status' => $enable ? 'down' : 'up']);
    }

    public function deleteOtps(Request $request)
    {
        Otp::truncate();
        return response()->json(['message' => 'All OTPs deleted successfully']);
    }
    
    
}
