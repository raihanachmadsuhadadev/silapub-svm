<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Aspiration;
use App\Models\AspirationCategory;
use App\Models\Region;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        User::updateOrCreate(
            ['email' => 'admin@silapub.test'],
            [
                'name' => 'Admin Kelurahan',
                'password' => Hash::make('password'),
                'role' => 'admin',
                'nik' => null,
                'phone' => null,
                'rt' => null,
                'rw' => null,
                'address' => null,
                'is_active' => true,
            ],
        );

        User::updateOrCreate(
            ['email' => 'warga@silapub.test'],
            [
                'name' => 'Warga Demo',
                'password' => Hash::make('password'),
                'role' => 'warga',
                'nik' => '3209000000000001',
                'phone' => '081234567890',
                'rt' => '01',
                'rw' => '02',
                'address' => 'Kelurahan Watubelah',
                'is_active' => true,
            ],
        );

        $categories = [
            ['code' => 'KAT-INFRA', 'name' => 'Infrastruktur'],
            ['code' => 'KAT-KEB', 'name' => 'Kebersihan'],
            ['code' => 'KAT-KAM', 'name' => 'Keamanan'],
            ['code' => 'KAT-ADM', 'name' => 'Pelayanan Administrasi'],
            ['code' => 'KAT-SOS', 'name' => 'Sosial Kemasyarakatan'],
            ['code' => 'KAT-LING', 'name' => 'Lingkungan'],
            ['code' => 'KAT-EKO', 'name' => 'Ekonomi dan UMKM'],
            ['code' => 'KAT-LAIN', 'name' => 'Lainnya'],
        ];

        foreach ($categories as $category) {
            AspirationCategory::updateOrCreate(
                ['code' => $category['code']],
                [
                    'name' => $category['name'],
                    'description' => null,
                    'is_active' => true,
                ],
            );
        }

        $regions = [
            ['code' => 'WIL-RT01-RW01', 'rt' => '01', 'rw' => '01', 'name' => 'Lingkungan Watubelah Utara'],
            ['code' => 'WIL-RT02-RW01', 'rt' => '02', 'rw' => '01', 'name' => 'Lingkungan Watubelah Utara'],
            ['code' => 'WIL-RT03-RW01', 'rt' => '03', 'rw' => '01', 'name' => 'Lingkungan Watubelah Utara'],
            ['code' => 'WIL-RT01-RW02', 'rt' => '01', 'rw' => '02', 'name' => 'Lingkungan Watubelah Tengah'],
            ['code' => 'WIL-RT02-RW02', 'rt' => '02', 'rw' => '02', 'name' => 'Lingkungan Watubelah Tengah'],
            ['code' => 'WIL-RT03-RW02', 'rt' => '03', 'rw' => '02', 'name' => 'Lingkungan Watubelah Tengah'],
            ['code' => 'WIL-RT01-RW03', 'rt' => '01', 'rw' => '03', 'name' => 'Lingkungan Watubelah Selatan'],
            ['code' => 'WIL-RT02-RW03', 'rt' => '02', 'rw' => '03', 'name' => 'Lingkungan Watubelah Selatan'],
        ];

        foreach ($regions as $region) {
            Region::updateOrCreate(
                ['code' => $region['code']],
                [
                    'rt' => $region['rt'],
                    'rw' => $region['rw'],
                    'name' => $region['name'],
                    'address' => 'Kelurahan Watubelah',
                    'description' => null,
                    'is_active' => true,
                ],
            );
        }

        $warga = User::where('email', 'warga@silapub.test')->first();

        $aspirationSeeds = [
            ['code' => 'ASP-20260707-0001', 'category' => 'KAT-INFRA', 'region' => 'WIL-RT01-RW01', 'title' => 'Jalan berlubang di depan RT 01', 'status' => 'submitted'],
            ['code' => 'ASP-20260707-0002', 'category' => 'KAT-KEB', 'region' => 'WIL-RT02-RW01', 'title' => 'Sampah menumpuk di pinggir jalan', 'status' => 'verified'],
            ['code' => 'ASP-20260707-0003', 'category' => 'KAT-KAM', 'region' => 'WIL-RT03-RW01', 'title' => 'Lampu jalan mati di gang utama', 'status' => 'in_progress'],
            ['code' => 'ASP-20260707-0004', 'category' => 'KAT-LING', 'region' => 'WIL-RT01-RW02', 'title' => 'Saluran air tersumbat saat hujan', 'status' => 'completed'],
            ['code' => 'ASP-20260707-0005', 'category' => 'KAT-ADM', 'region' => 'WIL-RT02-RW02', 'title' => 'Pelayanan administrasi perlu antrean lebih rapi', 'status' => 'rejected'],
            ['code' => 'ASP-20260707-0006', 'category' => 'KAT-KEB', 'region' => 'WIL-RT03-RW02', 'title' => 'Usulan penambahan tempat sampah', 'status' => 'submitted'],
            ['code' => 'ASP-20260707-0007', 'category' => 'KAT-KAM', 'region' => 'WIL-RT01-RW03', 'title' => 'Pos ronda membutuhkan perbaikan', 'status' => 'verified'],
            ['code' => 'ASP-20260707-0008', 'category' => 'KAT-INFRA', 'region' => 'WIL-RT02-RW03', 'title' => 'Drainase meluap saat hujan deras', 'status' => 'in_progress'],
            ['code' => 'ASP-20260707-0009', 'category' => 'KAT-LING', 'region' => 'WIL-RT01-RW01', 'title' => 'Taman lingkungan kurang terawat', 'status' => 'completed'],
            ['code' => 'ASP-20260707-0010', 'category' => 'KAT-EKO', 'region' => 'WIL-RT02-RW02', 'title' => 'Kegiatan UMKM butuh pendampingan', 'status' => 'submitted'],
        ];

        foreach ($aspirationSeeds as $index => $seed) {
            $category = AspirationCategory::where('code', $seed['category'])->first();
            $region = Region::where('code', $seed['region'])->first();
            $submittedAt = now()->subDays(10 - $index);

            $aspiration = Aspiration::updateOrCreate(
                ['code' => $seed['code']],
                [
                    'user_id' => $warga?->id,
                    'aspiration_category_id' => $category?->id,
                    'region_id' => $region?->id,
                    'title' => $seed['title'],
                    'content' => 'Aspirasi demo untuk kebutuhan pengujian fitur warga dan monitoring status aspirasi pada sistem SILAPUB.',
                    'location_detail' => 'Area sekitar '.$region?->name,
                    'status' => $seed['status'],
                    'priority_recommendation' => null,
                    'svm_score' => null,
                    'submitted_at' => $submittedAt,
                    'verified_at' => in_array($seed['status'], ['verified', 'in_progress', 'completed'], true) ? $submittedAt->copy()->addDay() : null,
                    'processed_at' => in_array($seed['status'], ['in_progress', 'completed'], true) ? $submittedAt->copy()->addDays(2) : null,
                    'completed_at' => $seed['status'] === 'completed' ? $submittedAt->copy()->addDays(4) : null,
                ],
            );

            $aspiration->statusHistories()->updateOrCreate(
                ['status' => 'submitted'],
                [
                    'note' => 'Aspirasi berhasil diajukan oleh warga',
                    'created_by' => $warga?->id,
                    'created_at' => $submittedAt,
                    'updated_at' => $submittedAt,
                ],
            );

            if ($seed['status'] !== 'submitted') {
                $aspiration->statusHistories()->updateOrCreate(
                    ['status' => $seed['status']],
                    [
                        'note' => 'Status demo: '.$seed['status'],
                        'created_by' => null,
                        'created_at' => $submittedAt->copy()->addDay(),
                        'updated_at' => $submittedAt->copy()->addDay(),
                    ],
                );
            }
        }
    }
}
