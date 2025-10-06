import { Injectable } from '@angular/core';
import AES from 'crypto-js/aes';
import Utf8 from 'crypto-js/enc-utf8';
import { environment } from '../../environment/environment';

@Injectable({
  providedIn: 'root'
})
export class CryptoService {
  private secretKey = environment.encryptionKey
  
  encrypt(data: any): string {
    const jsonData = JSON.stringify(data);
    return AES.encrypt(jsonData, this.secretKey).toString();
  }

  decrypt(cipherText: string): any {
    try {
      const bytes = AES.decrypt(cipherText, this.secretKey);
      const decryptedData = bytes.toString(Utf8);
      return JSON.parse(decryptedData);
    } catch (e) {
      console.error('Decryption error:', e);
      return null;
    }
  }

  setItem(key: string, value: any): void {
    const encrypted = this.encrypt(value);
    localStorage.setItem(key, encrypted);
  }

  getItem(key: string): any {
    const stored = localStorage.getItem(key);
    return stored ? this.decrypt(stored) : null;
  }
}
