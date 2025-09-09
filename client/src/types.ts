export interface Song {
  id: string;
  name: string;
  image: string;
}

export interface ArtistAnimationProps {
    chartData: {
        short_term: { name: string, value: number }[];
        medium_term: { name: string, value: number }[];
        long_term: { name: string, value: number }[];
    }
}