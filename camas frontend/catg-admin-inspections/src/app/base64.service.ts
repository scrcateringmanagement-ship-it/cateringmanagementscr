import { Injectable } from '@angular/core';
import { Base64 } from 'js-base64';

@Injectable({
  providedIn: 'root'
})
export class Base64Service {

  constructor() { }
  
  encode(data: any): string {
    return Base64.encode(JSON.stringify(data));
  }

  decode<T = any>(base64Str: string): T {
    return JSON.parse(Base64.decode(base64Str));
  }

}
