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
        Schema::create('bill_masters', function (Blueprint $table) {
            $table->id();
            $table->string('bill_no')->unique();
            $table->decimal('total_qty');
            $table->decimal('total_amount');
            $table->decimal('disc_perc')->default(0);
            $table->decimal('disc_amount')->default(0);
            $table->foreignId('customer_id')->default(0);
            $table->string('remarks')->nullable();
            $table->foreignId('user_id');
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('bill_masters');
    }
};
