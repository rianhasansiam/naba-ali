'use client';

import Link from "next/link";
import { MdKeyboardArrowRight } from "react-icons/md";

const dressStylesData = [
  {
    title: "Casual",
    slug: "/shop?style=casual",
  },
  {
    title: "Formal", 
    slug: "/shop?style=formal",
  },
  {
    title: "Party",
    slug: "/shop?style=party",
  },
  {
    title: "Gym",
    slug: "/shop?style=gym",
  },
];

const DressStyleSection = () => {
  return (
    <div className="space-y-4">
      <h3 className="text-black font-bold text-xl">Dress Style</h3>
      <div className="flex flex-col text-black/60 space-y-0.5">
        {dressStylesData.map((dStyle, idx) => (
          <Link
            key={idx}
            href={dStyle.slug}
            className="flex items-center justify-between py-2"
          >
            {dStyle.title} <MdKeyboardArrowRight />
          </Link>
        ))}
      </div>
    </div>
  );
};

export default DressStyleSection;