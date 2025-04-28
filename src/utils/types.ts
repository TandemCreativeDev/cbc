export interface Page {
  title: string;
  content: string;
}

export type TourDateType = {
  eventDate: string;
  location: string;
  venue: string;
  locationUrl?: string;
  ticketUrl?: string;
};

export interface IFrameProps {
  src: string;
  title: string;
  href?: string;
  type?: string;
  categorie?: string;
  category?: string;
}

export interface LyricsProps {
  title: string;
  album?: string;
  date?: string;
  lyrics: string;
  paroles: string;
}
