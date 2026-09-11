<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            // System A: Order/Plan points balance
            $table->integer('order_points_balance')->default(0)->after('total_points_earned');
            
            // System B: Share points balance
            $table->integer('share_points_balance')->default(0)->after('order_points_balance');
            
            // Total pending free meal credits (from both systems)
            $table->integer('free_meal_credits')->default(0)->after('share_points_balance');
            
            // Referral tracking: who referred this user
            $table->foreignId('referrer_id')->nullable()->after('free_meal_credits');
            
            // When referral popup was last shown to this user
            $table->timestamp('referral_popup_shown_at')->nullable()->after('referrer_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropForeign(['referrer_id']);
            $table->dropColumn([
                'order_points_balance',
                'share_points_balance',
                'free_meal_credits',
                'referrer_id',
                'referral_popup_shown_at',
            ]);
        });
    }
};
