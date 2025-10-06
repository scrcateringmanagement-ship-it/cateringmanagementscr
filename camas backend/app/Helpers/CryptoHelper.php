<?php

namespace App\Helpers;

class CryptoHelper
{
    private static function getKey()
    {
        return base64_decode(env('CUSTOM_ENCRYPTION_KEY'));
    }

    public static function encrypt($plainText)
    {
        $key = self::getKey();
        $iv = random_bytes(16);
        $cipherText = openssl_encrypt($plainText, 'AES-256-CBC', $key, OPENSSL_RAW_DATA, $iv);

        return base64_encode($iv . $cipherText);
    }

    public static function decrypt($base64)
    {
        $key = self::getKey();
        $raw = base64_decode($base64);

        if (strlen($raw) <= 16) {
            return null;
        }

        $iv = substr($raw, 0, 16);
        $cipherText = substr($raw, 16);

        return openssl_decrypt($cipherText, 'AES-256-CBC', $key, OPENSSL_RAW_DATA, $iv);
    }

    public static function encode(array $data): string
    {
        return base64_encode(json_encode($data));
    }

    public static function decode(string $base64): array
    {
        $json = base64_decode($base64);
        return json_decode($json, true);
    }

    public static function maskAadhaar($aadhaar)
    {
        if (strlen($aadhaar) !== 12) {
            return 'Invalid Aadhaar';
        }

        return 'XXXX-XXXX-' . substr($aadhaar, -4);
    }
}
