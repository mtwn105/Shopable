import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UploadService {

  fileUploadApi = environment.fileUploadApi;

  constructor(private http: HttpClient) {
  }

  uploadFile(file: File) {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post(`${this.fileUploadApi}`, formData);
  }

}
