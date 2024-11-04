export interface Card {
  id: number;
  title: string;
  completed: boolean;
}

export interface List {
  id: number;
  title: string;
  cards: Card[];
}