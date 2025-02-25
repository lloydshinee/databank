import { useTabVisibility } from "@/context/TabVisibilityContext";
import Image from "next/image";
import React from "react";

export default function TabbedOutWarning() {
  const { dismissWarning } = useTabVisibility();

  return (
    <div className="main-container fixed inset-0 bg-[#000000d6]  flex justify-center items-center z-50">
      <div className="rounded-lg h-[530px] w-[800px] absolute top-[10%]  bg-white shadow-md flex flex-col justify-between items-center p-10 z-50">
        <div
          onClick={() => dismissWarning()}
          className="header flex justify-end w-full"
        >
          <Image src="/CloseIcon.png" alt="Close" height={20} width={20} />
        </div>
        <div className="body flex-1 flex justify-center items-center gap-5">
          <div className="image-container ">
            <Image
              src="/EyesIcon.png"
              alt="Eyes Icon"
              height={115}
              width={124}
            />
          </div>
          <div className="text-container flex-1">
            <h1 className="font-bold text-4xl">IT SEEMS YOU CHANGED TABS</h1>
            <p>
              We monitor activity through logs. Please be mindful when switching
              tabs and ensure you have a valid reason. Thank you!
            </p>
          </div>
        </div>
        <div className="footer">
          <button
            onClick={() => dismissWarning()}
            className="bg-[#720000] hover:bg-[#320000] rounded-md flex justify-center items-center gap-3 px-5 py-2 text-white"
          >
            <Image src="/SadIcon.png" alt="SadIcon" height={12} width={12} />
            <span className="font-light text-xs">I UNDERSTAND</span>
          </button>
        </div>
      </div>
    </div>
  );
}
