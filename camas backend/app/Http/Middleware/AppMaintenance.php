<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class AppMaintenance
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Allow admin URLs
        if ($request->is('api/admin/*')) {
            return $next($request);
        }

        // Block if app_down file exists
        if (file_exists(storage_path('framework/app_down'))) {
            return response()->json(['message' => 'Site is under maintenance'], 503);
        }

        return $next($request);
    }
}
