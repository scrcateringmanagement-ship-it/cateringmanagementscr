import { Injectable } from '@angular/core';
import CryptoJS from 'crypto-js';

const base64Key = 'qmDhyhsHWK6AX5+cOPN45dbojXc7OdZzQQ+/W5QT+tid/g3w08XmDHLexffD8sfhbqBUeHcRT5jkq+mqcZAl8w=='; // Must match Laravel's .env
const key = CryptoJS.enc.Base64.parse(base64Key);

@Injectable({
  providedIn: 'root'
})

export class CryptoService {

  constructor() { }
  private key = CryptoJS.enc.Base64.parse('0dGFiLIoGhTIiEroa7tTIKlz9F2sOZ2QJBBW7WswZj0=');

  encrypt(text: string): string {
    const iv = CryptoJS.lib.WordArray.random(16);
    const encrypted = CryptoJS.AES.encrypt(text, this.key, {
      iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    });

    const result = iv.concat(encrypted.ciphertext);
    return CryptoJS.enc.Base64.stringify(result);
  }

  decrypt(encryptedBase64: string): string {
    try {
      // Decode Base64 string back to WordArray
      const combined = CryptoJS.enc.Base64.parse(encryptedBase64);

      // Extract IV (first 16 bytes = 4 words)
      const iv = CryptoJS.lib.WordArray.create(combined.words.slice(0, 4), 16);

      // Extract ciphertext (after IV)
      const ciphertext = CryptoJS.lib.WordArray.create(
        combined.words.slice(4),
        combined.sigBytes - 16
      );

      // Create CipherParams object from ciphertext
      const cipherParams = CryptoJS.lib.CipherParams.create({
        ciphertext: ciphertext
      });

      // Use the same key as in encryption (your private key)
      const decrypted = CryptoJS.AES.decrypt(cipherParams, this.key, {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
      });

      return decrypted.toString(CryptoJS.enc.Utf8);

    } catch (error) {
      console.error('Decryption error:', error);
      return '';
    }
  }





}// end of file
