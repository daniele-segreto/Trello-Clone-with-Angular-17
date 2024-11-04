import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { bootstrapApplication } from '@angular/platform-browser';
import { DragDropModule, CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { List, Card } from './models/types';
import { ListComponent } from './components/list.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, DragDropModule, ListComponent],
  template: `
    <div class="board">
      <h1 class="board-title">Il Mio Board</h1>
      
      <div class="lists-container">
        @for (list of lists; track list.id) {
          <app-list
            [list]="list"
            [connectedTo]="getConnectedListIds()"
            (onDrop)="drop($event)"
            (onAddCard)="addCard($event.list, $event.title)"
            (onEditCard)="editCard(list, $event)"
            (onToggleComplete)="toggleComplete($event)"
          />
        }
        
        @if (addingList) {
          <input
            #newList
            type="text"
            class="list"
            placeholder="Inserisci il titolo della lista..."
            (keyup.enter)="createList(newList.value); newList.value = ''"
            (blur)="addingList = false"
            autofocus
          >
        } @else {
          <button class="add-list-btn" (click)="addingList = true">
            + Aggiungi una lista
          </button>
        }
      </div>
    </div>
  `
})
export class App implements OnInit {
  lists: List[] = [];
  addingList = false;

  ngOnInit() {
    const savedLists = localStorage.getItem('trello-lists');
    if (savedLists) {
      this.lists = JSON.parse(savedLists);
    } else {
      this.lists = [
        { id: 1, title: 'Da Fare', cards: [] },
        { id: 2, title: 'In Corso', cards: [] },
        { id: 3, title: 'Completato', cards: [] }
      ];
      this.saveLists();
    }
  }

  createList(title: string) {
    if (!title.trim()) return;
    
    const newList: List = {
      id: Date.now(),
      title: title.trim(),
      cards: []
    };
    
    this.lists = [...this.lists, newList];
    this.addingList = false;
    this.saveLists();
  }

  addCard(list: List, title: string) {
    if (!title.trim()) return;
    
    const newCard: Card = {
      id: Date.now(),
      title: title.trim(),
      completed: false
    };
    
    list.cards = [...list.cards, newCard];
    this.saveLists();
  }

  editCard(list: List, card: Card) {
    const newTitle = prompt('Modifica la carta:', card.title);
    if (newTitle?.trim()) {
      card.title = newTitle.trim();
      this.saveLists();
    }
  }

  toggleComplete(card: Card) {
    card.completed = !card.completed;
    this.saveLists();
  }

  getConnectedListIds(): string[] {
    return this.lists.map(list => 'list-' + list.id);
  }

  drop(event: CdkDragDrop<Card[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }
    this.saveLists();
  }

  private saveLists() {
    localStorage.setItem('trello-lists', JSON.stringify(this.lists));
  }
}

bootstrapApplication(App);