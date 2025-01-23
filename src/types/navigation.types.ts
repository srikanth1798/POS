export interface SubMenuItem {
  id: string;
  title: string;
  path: string;
}

export interface MenuItem {
  id: string;
  title: string;
  icon: string;
  path?: string;
  subItems?: SubMenuItem[];
} 