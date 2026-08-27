import data from "./experience.json";

export interface LocalizedText {
  ru: string;
  uz: string;
}

export interface TimelineItem {
  id: string;
  year: string;
  title: LocalizedText;
  org: LocalizedText;
  desc: LocalizedText;
}

export interface Review {
  id: string;
  name: string;
  role: LocalizedText;
  text: LocalizedText;
}

interface ExperienceData {
  timeline: TimelineItem[];
  reviews: Review[];
}

const experienceData = data as unknown as ExperienceData;

export const timeline: TimelineItem[] = experienceData.timeline;
export const reviews: Review[] = experienceData.reviews;
