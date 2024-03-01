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
        Schema::create('bill_details', function (Blueprint $table) {
            $table->foreignId('bill_id');
            $table->string('code');
            $table->decimal('qty');
            $table->decimal('rate');
            $table->decimal('amount');
            $table->decimal('disc_perc')->default(0);
            $table->decimal('disc_value')->default(0);
            $table->decimal('mrp');
            $table->foreignId('old_bill_id')->default(0);
            $table->string('bill_mode')->default('normal');
            $table->string('emp_code')->nullable();
            $table->integer('s_no');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('bill_details');
    }
};
