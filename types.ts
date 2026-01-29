export interface Inspiration {
  id: string;
  content: string;
  createdAt: number;
}

export interface Box {
  id: string;
  title: string;
  description: string;
  themeColor: string;
  icon: string;
  inspirations: Inspiration[];
}

export type ViewMode = 'dashboard' | 'box_view' | 'box_edit';
