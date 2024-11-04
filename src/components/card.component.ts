import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Card } from '../models/types';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="card" [class.completed]="card.completed">
      <span class="card-content" (click)="onEdit.emit(card)">
        {{ card.title }}
      </span>
      <div class="card-actions">
        <div
          class="checkbox"
          [class.checked]="card.completed"
          (click)="onToggleComplete.emit(card)"
        >
          @if (card.completed) {
            ✓
          }
        </div>
      </div>
    </div>
  `
})
export class CardComponent {
  @Input({ required: true }) card!: Card;
  @Output() onEdit = new EventEmitter<Card>();
  @Output() onToggleComplete = new EventEmitter<Card>();
}