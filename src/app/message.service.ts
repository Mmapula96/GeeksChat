import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  private messages: { [key: string]: { sender: string, content: string }[] } = {};
  private messageSubject: Subject<{ sender: string, content: string }> = new Subject<{ sender: string, content: string }>();

  getMessages(conversationId: string): { sender: string, content: string }[] {
    return this.messages[conversationId] || [];
  }

  addMessage(conversationId: string, message: { sender: string, content: string }): void {
    this.messages[conversationId] = this.messages[conversationId] || [];
    this.messages[conversationId].push(message);
    this.messageSubject.next(message);
  }

  getMessageObservable(): Observable<{ sender: string, content: string }> {
    return this.messageSubject.asObservable();
  }
}




