<?php

namespace Database\Seeders;

use App\Models\User;
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
    }
}
