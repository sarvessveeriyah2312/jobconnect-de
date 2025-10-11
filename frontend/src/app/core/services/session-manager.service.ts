import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';

export interface UserSession {
  id: string;
  username: string;
  role: string;
  ipAddress: string;
  userAgent: string;
  loginTime: string;
  lastActive: string;
  status: 'active' | 'terminated';
}

@Injectable({
  providedIn: 'root'
})
export class SessionManagerService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/sessions`;

  /** 🧠 Helper: build HTTP headers with token */
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token'); // or 'access_token' depending on your auth setup
    return new HttpHeaders({
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    });
  }

  /** 🔹 Fetch all active/terminated sessions */
  getSessions(): Observable<UserSession[]> {
    return this.http.get<UserSession[]>(this.baseUrl, {
      headers: this.getAuthHeaders()
    });
  }

  /** 🔹 Terminate a specific session */
  terminateSession(sessionId: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${sessionId}`, {
      headers: this.getAuthHeaders()
    });
  }

  /** 🔹 Terminate all sessions */
  terminateAllSessions(): Observable<void> {
    return this.http.delete<void>(this.baseUrl, {
      headers: this.getAuthHeaders()
    });
  }
}
