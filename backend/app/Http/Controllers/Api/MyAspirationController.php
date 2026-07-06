<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Aspiration;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Throwable;

class MyAspirationController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        if ($response = $this->wargaOnly($request)) {
            return $response;
        }

        $aspirations = Aspiration::query()
            ->where('user_id', $request->user()->id)
            ->with(['category', 'region', 'statusHistories'])
            ->withCount('attachments')
            ->latest()
            ->get();

        return $this->success('Data aspirasi saya berhasil dimuat', $aspirations);
    }

    public function store(Request $request): JsonResponse
    {
        if ($response = $this->wargaOnly($request)) {
            return $response;
        }

        $validated = $request->validate([
            'aspiration_category_id' => ['required', 'exists:aspiration_categories,id'],
            'region_id' => ['required', 'exists:regions,id'],
            'title' => ['required', 'string', 'max:150'],
            'content' => ['required', 'string', 'min:20'],
            'location_detail' => ['nullable', 'string', 'max:255'],
            'attachments' => ['nullable', 'array', 'max:3'],
            'attachments.*' => ['file', 'max:5120', 'mimes:jpg,jpeg,png,pdf,doc,docx'],
        ], [
            'attachments.array' => 'Lampiran harus dikirim sebagai daftar file.',
            'attachments.max' => 'Maksimal 3 file lampiran yang dapat diunggah.',
            'attachments.*.file' => 'File lampiran tidak valid. Pilih file asli dari perangkat Anda.',
            'attachments.*.max' => 'Ukuran setiap file lampiran maksimal 5MB.',
            'attachments.*.mimes' => 'Format file lampiran harus jpg, jpeg, png, pdf, doc, atau docx.',
        ]);

        try {
            $aspiration = DB::transaction(function () use ($request, $validated) {
                $aspiration = Aspiration::create([
                    'code' => $this->generateCode(),
                    'user_id' => $request->user()->id,
                    'aspiration_category_id' => $validated['aspiration_category_id'],
                    'region_id' => $validated['region_id'],
                    'title' => $validated['title'],
                    'content' => $validated['content'],
                    'location_detail' => $validated['location_detail'] ?? null,
                    'status' => 'submitted',
                    'submitted_at' => now(),
                ]);

                foreach ($request->file('attachments', []) as $file) {
                    $path = $file->store('aspiration-attachments', 'public');

                    if (! $path) {
                        throw new \RuntimeException('File lampiran gagal disimpan ke storage public.');
                    }

                    $aspiration->attachments()->create([
                        'file_name' => $file->getClientOriginalName(),
                        'file_path' => $path,
                        'file_type' => $file->getClientMimeType(),
                        'file_size' => $file->getSize(),
                    ]);
                }

                $aspiration->statusHistories()->create([
                    'status' => 'submitted',
                    'note' => 'Aspirasi berhasil diajukan oleh warga',
                    'created_by' => $request->user()->id,
                ]);

                return $aspiration;
            });
        } catch (Throwable $exception) {
            Log::error('Failed to create aspiration with attachment', [
                'message' => $exception->getMessage(),
                'user_id' => $request->user()?->id,
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Aspirasi gagal dikirim. Pastikan file lampiran valid dan storage dapat ditulis.',
                'data' => (object) [],
                'errors' => [
                    'attachments' => ['File lampiran gagal diproses atau disimpan.'],
                ],
            ], 500);
        }

        return $this->success(
            'Aspirasi berhasil diajukan',
            $aspiration->load(['category', 'region', 'attachments', 'statusHistories']),
            201,
        );
    }

    public function show(Request $request, Aspiration $myAspiration): JsonResponse
    {
        if ($response = $this->wargaOnly($request)) {
            return $response;
        }

        if ($myAspiration->user_id !== $request->user()->id) {
            return response()->json([
                'success' => false,
                'message' => 'Aspirasi tidak ditemukan.',
                'data' => (object) [],
            ], 404);
        }

        return $this->success(
            'Detail aspirasi berhasil dimuat',
            $myAspiration->load(['user', 'category', 'region', 'attachments', 'statusHistories.creator', 'responses.admin']),
        );
    }

    private function generateCode(): string
    {
        $date = now()->format('Ymd');
        $lastAspiration = Aspiration::where('code', 'like', "ASP-{$date}-%")
            ->orderByDesc('code')
            ->lockForUpdate()
            ->first();

        $nextNumber = 1;

        if ($lastAspiration) {
            $nextNumber = ((int) substr($lastAspiration->code, -4)) + 1;
        }

        do {
            $code = sprintf('ASP-%s-%04d', $date, $nextNumber);
            $nextNumber++;
        } while (Aspiration::where('code', $code)->exists());

        return $code;
    }

    private function wargaOnly(Request $request): ?JsonResponse
    {
        if ($request->user()->role === 'warga') {
            return null;
        }

        return response()->json([
            'success' => false,
            'message' => 'Akses hanya untuk warga.',
            'data' => (object) [],
        ], 403);
    }

    private function success(string $message, mixed $data = [], int $status = 200): JsonResponse
    {
        return response()->json([
            'success' => true,
            'message' => $message,
            'data' => $data,
        ], $status);
    }
}
