<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class OrderMeal extends Model
{
    use HasFactory;

    protected $table = 'order_meals';

    protected $fillable = [
        'order_id',
        'meal_id',
        'quantity',
        'plan_id',
        'is_reward_meal',
        'is_free_meal_credit',
        'price',
    ];

    protected $casts = [
        'quantity' => 'integer',
        'price' => 'decimal:2',
        'is_free_meal_credit' => 'boolean',
    ];

    /**
     * Get the order that owns this order meal.
     */
    public function order(): BelongsTo
    {
        return $this->belongsTo(Order::class, 'order_id');
    }

    /**
     * Get the meal associated with this order meal.
     */
    public function meal(): BelongsTo
    {
        return $this->belongsTo(Meal::class);
    }

    /**
     * Get the subtotal for this order meal item.
     */
    public function getSubtotalAttribute(): float
    {
        return $this->quantity * $this->price;
    }
}
