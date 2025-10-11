// Fix for "global is not defined" error in browsers
if (typeof (window as any).global === 'undefined') {
  (window as any).global = window;
}

import { Injectable } from '@angular/core';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { environment } from '../../../environments/environment';
import { Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class WebSocketService {
  private stompClient!: Client;
  private sessionEventSubject = new Subject<any>();
  sessionEvents$ = this.sessionEventSubject.asObservable();

  connect(): void {
    this.stompClient = new Client({
      brokerURL: undefined, // using SockJS instead of WebSocket directly
      webSocketFactory: () => new SockJS(`${environment.apiUrl.replace('/api', '')}/ws`),
      reconnectDelay: 5000, // auto-reconnect every 5 seconds
      debug: (msg) => console.log('[STOMP]', msg),

      onConnect: () => {
        console.log('Connected to WebSocket broker');
        this.stompClient.subscribe('/topic/session-events', (message) => {
          if (message.body) {
            const event = JSON.parse(message.body);
            this.sessionEventSubject.next(event);
          }
        });
      },

      onStompError: (frame) => {
        console.error('STOMP Error:', frame.headers['message']);
      },
    });

    this.stompClient.activate();
  }

  disconnect(): void {
    if (this.stompClient?.active) {
      this.stompClient.deactivate();
      console.log('WebSocket disconnected');
    }
  }
}