<?php

namespace App\Rules;

use Closure;
use Illuminate\Contracts\Validation\ValidationRule;

class NoScripts implements ValidationRule
{
    /**
     * Run the validation rule.
     */
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        // Block <script>, <?php and SQL keywords
        if (preg_match('/(<script|<\/script>|<\?php|select\s|insert\s|update\s|delete\s|drop\s|truncate\s)/i', $value)) {
            $fail("The {$attribute} contains invalid or potentially dangerous content.");
        }
    }
}
