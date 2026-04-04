import { Component, ElementRef, inject, signal, ViewChild } from '@angular/core';
import { MatCardModule, MatCard } from '@angular/material/card';
import { MatToolbar } from "@angular/material/toolbar";
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { NgClass } from '@angular/common';
import { ChatService } from '../chat-service';
import { catchError, throwError } from 'rxjs';

@Component({
  selector: 'app-simple-chat',
  imports: [MatCard, MatToolbar, MatToolbarModule, MatInputModule, MatButtonModule, MatIconModule, FormsModule, NgClass],
  templateUrl: './simple-chat.html',
  styleUrl: './simple-chat.scss',
})
export class SimpleChat { 

  userInput = '';

  @ViewChild('chatHistory')
  private chatHistory!: ElementRef;

  private chatService = inject(ChatService);

  isLoading = false;

  messages = signal([
    {
      text: 'Hello, how are you?',
      isBot: true
    }
  ])

  sendMessage() {
    this.trimUserMessage();

    if (this.userInput == '' || this.isLoading) {
      return;
    }

    const text = this.userInput;
    this.updateMessages(text);
    this.isLoading = true;
    this.userInput = '';
    this.sendChatMessage(text);
  }

  private sendChatMessage(text: string) {
    this.chatService
      .sendChatMessage(text)
      .pipe(
        catchError((err) => {
          this.updateMessages(
            'Sorry, I am not able to answer your question. Please try again later.',
            true,
          );
          this.isLoading = false;
          return throwError(() => err);
        }),
      )
      .subscribe((response) => {
        this.updateMessages(response.message, true);
        this.isLoading = false;
      });
  }



  /*private simulateResponse() {
    setTimeout(() => {
      const response = 'I am fine, thank you!';
      this.updateMessages(response, true);
      this.isLoading = false;
    }, 6000);
  }*/

  private updateMessages(message: string, isBot: boolean = false) {
    this.messages.update((messages) => [...messages, { text: message, isBot: isBot }]);
    this.scrollToBottom();
  }

  private scrollToBottom() {
    try {
      this.chatHistory.nativeElement.scrollTop = this.chatHistory.nativeElement.scrollHeight;
    } catch (error) {}
  }

  private trimUserMessage() {
    this.userInput = this.userInput.trim();
  }

}
