"use client";

import { useLanguage } from "../../context/LanguageContext";
import { Page } from "../../utils/types";
import Carousel from "../../components/Carousel";

const carouselImages = [
  "/images/carousel/argentic.jpg",
  "/images/carousel/posing.jpg",
  "/images/carousel/leaving.jpg",
  "/images/carousel/yesday.jpg",
];

const french: Page = {
  title: "Bio",
  content:
    "Clark's Bowling Club est un groupe de funk/pop qui fait vibrer les dancefloors lyonnais dans une ambiance disco-funk remise au goût du jour. À la croisée de Deluxe et Jungle, ils ont partagé la scène avec des artistes de renom tels que Guts, Vulfpeck, Dabeull, Imanbek, Peter Bence, Arnaud Rebotini, Etienne de Crécy... En 2023, le groupe a été sélectionné par le programme d'accompagnement Ninkasi Musik Lab.",
};

const english: Page = {
  title: "About",
  content:
    "Clark's Bowling Club is a 6-piece funk/pop band based in Lyon, France. Inspired by the likes of Jungle and Deluxe, their music brings a modern twist to disco-funk, hip-hop, and jazz genres, breathing new life into the vibrant music scene. They have shared the stage with acclaimed artists including Guts, Dabeull, Imanbek, Vulfpeck, Peter Bence, Arnaud Rebotini, Etienne de Crécy, and many more. Rising to prominence with their unique spin on funk, Clark's Bowling Club has achieved notable recognition, notably being selected for the prestigious Ninkasi Musik Lab program in 2023.",
};

export default function About() {
  const { isFrench } = useLanguage();
  const pageContent = isFrench ? french : english;

  return (
    <div className="container mx-auto pt-28 mb-5xl max-w-5xl p-8">
      <h2 className="text-4xl font-blanch mb-6">{pageContent.title}</h2>
      <p className="text-lg leading-relaxed mb-8">{pageContent.content}</p>
      <Carousel images={carouselImages} />
    </div>
  );
}
