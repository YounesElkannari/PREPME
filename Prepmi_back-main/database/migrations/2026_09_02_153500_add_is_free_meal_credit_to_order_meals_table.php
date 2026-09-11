<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class() extends Migration
{
    /**
     * Mark order meal lines paid with a loyalty free-meal credit.
     */
    public function up(): void
    {
        Schema::table('order_meals', function (Blueprint $table) {
            $table->boolean('is_free_meal_credit')
                ->default(false)
                ->after('is_reward_meal');
        });
    }

    public function down(): void
    {
        Schema::table('order_meals', function (Blueprint $table) {
            $table->dropColumn('is_free_meal_credit');
        });
    }
};
