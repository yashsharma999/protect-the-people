export interface Story {
  id: string;
  title: string;
  excerpt: string;
  author: string;
  readTime: string;
  image: string;
}

export interface Report {
  id: string;
  title: string;
  date: string;
  type: string;
}

export interface Project {
  title: string;
  description: string;
  image: string;
}