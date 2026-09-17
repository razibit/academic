export interface PublicationAuthor {
  name: string;
  highlighted?: boolean;
  equalContribution?: boolean;
}

export interface Publication {
  id: string;
  title: string;
  authors: PublicationAuthor[];
  year: number;
  month?: number;
  venue?: string;
  type: string;
  url?: string;
  doi?: string;
  code?: string;
  pdf?: string;
  poster?: string;
  slides?: string;
  preview?: string;
  abstract?: string;
  description?: string;
  selected: boolean;
  bibtex: string;
}
