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
        Schema::create('bill_settlements', function (Blueprint $table) {
            $table->foreignId('bill_id');
            $table->decimal('cash')->default(0);
            $table->decimal('card')->default(0);
            $table->decimal('upi')->default(0);
            $table->decimal('return')->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('bill_settlements');
    }
};
