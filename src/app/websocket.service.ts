import { Injectable } from '@angular/core';
import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';
import { StompSubscription } from '@stomp/stompjs';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {
 
  private stompClient!: Stomp.Client;
  private messageSubject: Subject<any> = new Subject<any>();
  private isConnected: boolean = false;

  constructor() { 
    
  }

  connect(callback?: () => void): void {
    if (!this.isConnected) {
      const socket = new SockJS('http://localhost:8080/websocket-chat');
      this.stompClient = Stomp.over(socket);

      this.stompClient.connect({}, () => {
        console.log('Connected to WebSocket');
        this.isConnected = true;


        this.stompClient.subscribe('/topic/messages', (message: Stomp.Message) => {
          this.messageSubject.next(JSON.parse(message.body));
        });

        if (callback) {
          callback();
        }
      });
    }
  }

  disconnect(): void {
    if (this.stompClient && this.stompClient.connected) {
      this.stompClient.disconnect(() => {
        console.log('Disconnected from WebSocket');
      });
    }
  }

  subscribe(destination: string, callback: (message: Stomp.Message) => void): StompSubscription {
    return this.stompClient.subscribe(destination, callback);
  }

  sendMessage(destination: string, message: any): void {
    this.stompClient.send(destination, {}, JSON.stringify(message));
  }

  getMessages(): Observable<any> {
    return this.messageSubject.asObservable();
  }


}
