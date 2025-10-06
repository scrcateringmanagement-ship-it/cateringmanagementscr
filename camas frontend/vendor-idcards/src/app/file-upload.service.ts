import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError, retry, tap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class FileUploadService {
private apiUrl= 'https://script.google.com/macros/s/AKfycbw_3gXoxT5wTQKo9W5xAaLArBqjPeuqb7rp-N9B8wSHT9Di4j6ie6ibOMqGbu2sUk82wA/exec';

  constructor(private http: HttpClient) {}
  getHeaderOptionsdata() {
    return {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    };
  }
 
  uploadFilePhoto(payload: string): Observable<any> {
    //console.log("payload ",payload);
    return this.http.post(this.apiUrl, payload);
  }

}

