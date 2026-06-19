export interface Listing {
  id: string;
  site: string;
  title: string;
  price: string;
  url: string;
  address?: string;
}

export interface House extends Listing {
  status: string;
}

export interface Scraper {
  fetch(): Promise<Listing[]>;
}
