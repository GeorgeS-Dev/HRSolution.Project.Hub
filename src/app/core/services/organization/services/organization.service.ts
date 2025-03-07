import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { HttpService } from '../../http/http.service';
import { CreateCompanyRequest } from '../models/create-company.request.model';

@Injectable({
  providedIn: 'root',
})
export class organizationService {
  private readonly apiUrl = environment.organizationServiceApiUrl;

  constructor(private http: HttpClient,
    private httpService: HttpService
  ) {
  }
  
    CreateCompany(request: CreateCompanyRequest): Observable<any> {
        const headers = new HttpHeaders()
          .set('Accept', 'text/plain')
          .set('Content-Type', 'application/json');
        return this.httpService.httpPost<any>(`${this.apiUrl}Company`, request, headers);
    }
}