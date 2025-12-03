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
        Schema::create('requests', function (Blueprint $table) {
            $table->id();
            $table->foreignId('resident_id')->nullable()->constrained('users')->onDelete('set null');
            $table->string('name');
            $table->string('phone');
            $table->string('alternate_phone')->nullable();
            $table->string('district');
            $table->string('address')->nullable();
            $table->string('landmark')->nullable();
            $table->json('coordinates')->nullable(); // {lat, lng}
            $table->string('type_of_need');
            $table->json('dynamic_fields_json')->nullable();
            $table->enum('status', ['submitted', 'unverified', 'verified', 'volunteer_assigned', 'resolved'])->default('submitted');
            $table->foreignId('verified_by')->nullable()->constrained('users')->onDelete('set null');
            $table->foreignId('assigned_volunteer_id')->nullable()->constrained('users')->onDelete('set null');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('requests');
    }
};
