<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\OrderService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ReferralController extends Controller
{
    protected $orderService;

    public function __construct(OrderService $orderService)
    {
        $this->orderService = $orderService;
    }

    /**
     * Track a share action and add share points (System B).
     * Only for logged-in users.
     */
    public function trackShare(Request $request): JsonResponse
    {
        $user = Auth::user();

        if (!$user) {
            return response()->json([
                'message' => 'You must be logged in to earn share points.'
            ], 401);
        }

        // Add 1 share point
        $this->orderService->addSharePointsToUser($user, 1);

        return response()->json([
            'message' => 'Share point added successfully',
            'share_points_balance' => $user->share_points_balance,
            'free_meal_credits' => $user->free_meal_credits,
        ]);
    }

    /**
     * Get user's loyalty balances.
     */
    public function getBalances(Request $request): JsonResponse
    {
        $user = Auth::user();

        if (!$user) {
            return response()->json([
                'message' => 'Unauthorized'
            ], 401);
        }

        return response()->json([
            'order_points_balance' => $user->order_points_balance,
            'share_points_balance' => $user->share_points_balance,
            'free_meal_credits' => $user->free_meal_credits,
            'order_points_threshold' => (int) app(\App\Services\SettingService::class)->getValue('system_points_per_order', 12),
            'share_points_threshold' => (int) app(\App\Services\SettingService::class)->getValue('system_points_referral', 50),
        ]);
    }
}
