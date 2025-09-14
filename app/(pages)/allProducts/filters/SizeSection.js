'use client';

import { useState } from "react";

const SizeSection = () => {
  const [selected, setSelected] = useState("Large");

  const sizes = [
    "XX-Small",
    "X-Small", 
    "Small",
    "Medium",
    "Large",
    "X-Large",
    "XX-Large",
    "3X-Large",
    "4X-Large",
  ];

  return (
    <div className="space-y-4">
      <h3 className="text-black font-bold text-xl">Size</h3>
      <div className="flex items-center flex-wrap">
        {sizes.map((size, index) => (
          <button
            key={index}
            type="button"
            className={`bg-[#F0F0F0] m-1 flex items-center justify-center px-5 py-2.5 text-sm rounded-full max-h-[39px] ${
              selected === size ? "bg-gray-900 font-medium text-white" : ""
            }`}
            onClick={() => setSelected(size)}
          >
            {size}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SizeSection;