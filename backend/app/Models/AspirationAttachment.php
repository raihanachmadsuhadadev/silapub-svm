<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\Storage;

#[Fillable(['aspiration_id', 'file_name', 'file_path', 'file_type', 'file_size'])]
class AspirationAttachment extends Model
{
    use HasFactory;

    protected $appends = ['file_url', 'url'];

    public function aspiration(): BelongsTo
    {
        return $this->belongsTo(Aspiration::class);
    }

    public function getUrlAttribute(): string
    {
        return $this->file_url;
    }

    public function getFileUrlAttribute(): string
    {
        return rtrim((string) config('app.url'), '/').Storage::url($this->file_path);
    }
}
