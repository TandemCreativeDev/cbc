"use client";

import IFrame from "../../components/IFrame";
import { IFrameProps } from "../../components/IFrame";
import { useLanguage } from "../../context/LanguageContext";
import { Page } from "../../utils/types";

const french: Page = {
  title: "Clips Vidéo",
  content: "Une sélection de certains de nos meilleurs clips.",
};

const english: Page = {
  title: "Music Videos",
  content: "A selection of some of our best music videos.",
};

const iFrames: IFrameProps[] = [
  {
    src: "https://www.youtube.com/embed/VIx11K825D4?si=jo3ifq9OblwX0Spn",
    title:
      "Clark's Bowling Club - Just Gotta Live With It (Live @ La Belle Électrique)",
  },
  {
    src: "https://www.youtube.com/embed/vCIa2vHbyXs?si=3fBh7XLTScSzO6eq",
    title: "Clark's Bowling Club - YES Day!",
  },
  {
    src: "https://www.youtube.com/embed/P5dGCwb9MFg?si=FAhwM-FyRqduVtIL",
    title: "Clark's Bowling Club - Monroe (ft. Odd Man Black)",
  },
  {
    src: "https://www.youtube.com/embed/xwL8jhBOjSo?si=ESmK1R-utBaa02Ex",
    title: "Clark's Bowling Club - Blue Bird (Live @CNSM de Paris)",
  },
  {
    src: "https://www.youtube.com/embed/KsyHePWnm8k?si=bHffp6tr1neMM-dU",
    title: "Clark's Bowling Club - The Night is Here (live at Musilac)",
  },
];

export default function Music() {
  const { isFrench } = useLanguage();
  const pageContent = isFrench ? french : english;

  return (
    <div className="container mx-auto pt-28 mb-5xl max-w-5xl p-8">
      <h2 className="text-4xl font-[Blanch-Caps] mb-6">{pageContent.title}</h2>
      <p className="text-lg leading-relaxed mb-8">{pageContent.content}</p>
      <div className="grid gap-8">
        {iFrames.map((video) => (
          <IFrame key={video.title} src={video.src} title={video.title} />
        ))}
      </div>
    </div>
  );
}
