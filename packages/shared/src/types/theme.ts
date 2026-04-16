export interface Theme {
  id: string;
  name: string;
  description?: string;
  colorPrimary: string;
  colorSecondary: string;
  colorAccent: string;
  iconSet?: string;
  soundSet?: string;
  bgPattern?: string;
  isActive: boolean;
  displayOrder: number;
}
