import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DragDropModule, CdkDragDrop } from '@angular/cdk/drag-drop';
import { List, Card } from '../models/types';
import { CardComponent } from './card.component';

@Component({
  selector: 'app-list',
  standalone: true,
  imports: [CommonModule, DragDropModule, CardComponent],
  template: `
    <div class="list">
      <h2 class="list-title">{{ list.title }}</h2>
      
      <div
        class="cards-container"
        cdkDropList
        [cdkDropListData]="list.cards"
        [id]="'list-' + list.id"
        [cdkDropListConnectedTo]="connectedTo"
        (cdkDropListDropped)="onDrop.emit($event)"
      >
        @for (card of list.cards; track card.id) {
          <div cdkDrag>
            <app-card
              [card]="card"
              (onEdit)="onEditCard.emit($event)"
              (onToggleComplete)="onToggleComplete.emit($event)"
            />
          </div>
        }
      </div>
      
      @if (addingCard) {
        <input
          #newCard
          type="text"
          class="card"
          placeholder="Inserisci il titolo..."
          (keyup.enter)="onAddCard.emit({ list: list, title: newCard.value }); newCard.value = ''"
          (blur)="addingCard = false"
          autofocus
        >
      } @else {
        <button class="add-card-btn" (click)="addingCard = true">
          + Aggiungi una carta
        </button>
      }
    </div>
  `
})
export class ListComponent {
  @Input({ required: true }) list!: List;
  @Input({ required: true }) connectedTo: string[] = [];
  @Output() onDrop = new EventEmitter<CdkDragDrop<Card[]>>();
  @Output() onAddCard = new EventEmitter<{ list: List; title: string }>();
  @Output() onEditCard = new EventEmitter<Card>();
  @Output() onToggleComplete = new EventEmitter<Card>();

  addingCard = false;
}