<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable([
    'code',
    'user_id',
    'aspiration_category_id',
    'region_id',
    'title',
    'content',
    'location_detail',
    'status',
    'priority_recommendation',
    'svm_score',
    'submitted_at',
    'verified_at',
    'processed_at',
    'completed_at',
])]
class Aspiration extends Model
{
    use HasFactory;

    protected function casts(): array
    {
        return [
            'svm_score' => 'decimal:4',
            'submitted_at' => 'datetime',
            'verified_at' => 'datetime',
            'processed_at' => 'datetime',
            'completed_at' => 'datetime',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(AspirationCategory::class, 'aspiration_category_id');
    }

    public function region(): BelongsTo
    {
        return $this->belongsTo(Region::class);
    }

    public function attachments(): HasMany
    {
        return $this->hasMany(AspirationAttachment::class);
    }

    public function statusHistories(): HasMany
    {
        return $this->hasMany(AspirationStatusHistory::class)->oldest();
    }
}
