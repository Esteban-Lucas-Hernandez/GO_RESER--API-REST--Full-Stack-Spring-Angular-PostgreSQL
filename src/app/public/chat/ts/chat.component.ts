import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HotelService } from '../../hotel.service';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: '../html/chat.component.html',
  styleUrls: ['../css/chat.component.css']
})
export class ChatComponent implements OnInit {
  isVisible = false;
  message = '';
  chatHistory: { sender: string; text: string }[] = [];
  isLoading = false;

  constructor(private hotelService: HotelService) {}

  ngOnInit(): void {}

  trackByMessages(index: number, item: { sender: string; text: string }): number {
    return index;
  }

  toggleChat(): void {
    this.isVisible = !this.isVisible;
  }

  closeChat(): void {
    this.isVisible = false;
  }

  sendMessage(): void {
    if (!this.message.trim()) return;

    // Add user message to chat history
    this.chatHistory.push({ sender: 'user', text: this.message });
    const userMessage = this.message;
    this.message = '';
    this.isLoading = true;

    // Send message to backend
    this.hotelService.sendMessageToChat(userMessage).subscribe({
      next: (response: any) => {
        // Add bot response to chat history
        this.chatHistory.push({ sender: 'bot', text: response.response || 'Respuesta no disponible' });
        this.isLoading = false;
      },
      error: (error: any) => {
        console.error('Error sending message:', error);
        this.chatHistory.push({ sender: 'bot', text: 'Lo siento, hubo un error al procesar tu mensaje.' });
        this.isLoading = false;
      }
    });
  }

  onKeyPress(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.sendMessage();
    }
  }
}