"use client";

import { useEffect, useCallback, useState } from "react";
import sdk, {
  // FrameNotificationDetails,
 type Context,
} from "@farcaster/frame-sdk";
import Link from 'next/link';
import Image from 'next/image';

export default function DemoN(
  { title }: { title?: string } = { title: "See Who Joined Around You" }

) {
  const [context, setContext] = useState<Context.FrameContext>();
  const [isSDKLoaded, setIsSDKLoaded] = useState(false);
  interface AutoScrollProps {
    targetId: string; // ID of the div to scroll to
  }
  
  const AutoScroll: React.FC<AutoScrollProps> = ({ targetId }) => {
    const scrollToTarget = () => {
      const targetDiv = document.getElementById(targetId);
      if (targetDiv && context?.user.fid) {
        const lowFidHeight = targetDiv.clientHeight * getRowNumber(context?.user.fid) - targetDiv.clientHeight
        const halfHeight = targetDiv.clientHeight / 2 - window.innerHeight / 2 + 22; // (div height / 2) + (screen height / 2)
        const height = context?.user.fid < 78 ? lowFidHeight: halfHeight;
        const startPosition = window.scrollY;
        const distance = height - startPosition;
        let startTime: number | null = null;
  
        const duration = 1000; // Adjust for slower/faster scrolling
  
        const smoothScroll = (currentTime: number) => {
          if (!startTime) startTime = currentTime;
          const elapsed = currentTime - startTime;
          const progress = Math.min(elapsed / duration, 1);
  
          window.scrollTo(0, startPosition + distance * progress);
  
          if (progress < 1) {
            requestAnimationFrame(smoothScroll);
          }
        };
  
        requestAnimationFrame(smoothScroll);
      }
    };
  
    // Auto-scroll when the component mounts
    useEffect(() => {
      scrollToTarget();
    }, []);
  
    return (
      <div>
              <img
    src={context?.user.pfpUrl}
    alt="pfp"
    className="fixed bottom-10 left-10 w-14 aspect-square rounded-full border-2 border-white z-50"
    onClick={scrollToTarget} 
     />
      </div>
    );
  };
  useEffect(() => {
    const load = async () => {
      setContext(await sdk.context);
      sdk.actions.ready({});
    };
    if (sdk && !isSDKLoaded) {
      setIsSDKLoaded(true);
      load();
    }
  }, [isSDKLoaded]);

  interface User {
    fid: number;
    username: string;
    displayName: string;
    pfp: { url: string };  // Profile picture URL
  }
  interface AroundResponse {
    data: User[]; 
  
  }

  const [data, setData] = useState<AroundResponse | null>(null);
  const Around = useCallback(async (fid: string) => {
    try {
      const aroundResponse = await fetch(`/api/wrapcast?fid=${fid}`);
      if (!aroundResponse.ok) {
        throw new Error(`Fid HTTP error! Status: ${aroundResponse.status}`);
      }
      const responseData = await aroundResponse.json();
      if (Array.isArray(responseData) && responseData.length >= 3) {
        setData({ data: responseData });       
      } else {
        throw new Error("Invalid response structure or not enough data");
      }
    } catch (err) {
      console.error("Error fetching data from warpcast", err);
    }
  }, []);



  useEffect(() => {
    if (context?.user.fid) {
      Around(String(context.user.fid));
    }
  }, [context?.user.fid]);



const shareText = encodeURIComponent(
  `See Who Joined Around You \n \nframe by @cashlessman.eth`
);

const shareUrl = `https://warpcast.com/~/compose?text=${shareText}&embeds[]=https://around-joined.vercel.app/`;
const  default_image_url="https://wrpcd.net/cdn-cgi/imagedelivery/BXluQx4ige9GuW0Ia56BHw/7df1c31c-5721-4d33-2d2c-a102a8b3ca00/original" 

function getRowNumber(itemNumber: number): number {
  if (itemNumber < 1) {
      throw new Error("Fid must be at least 1");
  }
  return Math.ceil(itemNumber / 3);
}
  if (!isSDKLoaded) {
    return <div>Loading...</div>;
  }
  
  if (!context?.user.fid)
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900">
      <div className="flex flex-col items-center justify-center text-white text-2xl p-4">
        <p className="flex items-center justify-center text-center">
          you need to access this frame from inside a farcaster client
        </p>
        <p className="flex items-center justify-center text-center">
          (click on the logo to open in Warpcast)
        </p>
    
        <div className="flex items-center justify-center p-2 bg-white rounded-lg mt-4">
          <Link href="https://warpcast.com/cashlessman.eth/0xa030b72c" className="shadow-lg shadow-white">
            <Image
              src="https://warpcast.com/og-logo.png"
              alt="warpcast logo"
              width={100}
              height={100}
            />
          </Link>
        </div>
      </div>
    </div>
    
    );


  return (
<div className="w-auto bg-[#17111F] text-white flex flex-col">
<h1 className="hidden">{title}</h1>

{Array.isArray(data?.data) && data?.data.length > 1 
  ? (
<All/>    ) 
  : (
      <Loading/>
    )
}

  </div>

  );


  function Loading( ) {
    return (
<div className="flex items-center justify-center min-h-screen bg-gray-800">
  <div className="flex flex-col items-center text-center">
    <img 
      src="https://raw.githubusercontent.com/cashlessman/images/refs/heads/main/loader.gif" 
      alt="Loading" 
      className="h-20 w-20"
    />
    <p className="mt-2 text-gray-100 text-lg font-semibold">Loading, please wait...</p>
  </div>
</div>

    
    );
  }

  function All( ) {
    return (
      <div >
<Header/>

{ context?.user.fid && context.user.fid < 78 
  ? <LowFids/>
  : <MainUsers/>
}
<Footer/>

</div>
    );
  }

  function Header( ) {
    return (
<header className="sticky top-0 flex items-center justify-evenly text-gray-100 border-b border-gray-500 py-2 px-3 bg-gray-800 z-50"
>
  <div className="flex items-center">
    <img 
      src="https://i.imgur.com/I2rEbPF.png" 
      alt="Logo" 
      className="h-8 w-8 mr-3 rounded-lg" 
    />
    <h1 className="text-lg font-bold">See who joined around you</h1>
  </div>
  <div
      
      onClick={() => sdk.actions.openUrl(`https://warpcast.com/~/profiles/268438`)}
      >
<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
  <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
</svg>



      </div>
  <div
      onClick={() => sdk.actions.openUrl(shareUrl)}
      >
       <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
  <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186 9.566-5.314m-9.566 7.5 9.566 5.314m0 0a2.25 2.25 0 1 0 3.935 2.186 2.25 2.25 0 0 0-3.935-2.186Zm0-12.814a2.25 2.25 0 1 0 3.933-2.185 2.25 2.25 0 0 0-3.933 2.185Z" />
</svg>

      </div>
</header>
    );
  }
  
  function MainUsers( ) {
    return (
<>
    <AutoScroll targetId="main-container" />
 {/* Auto-scrolls to half of this div's height */}
    <div id="main-container" className="flex flex-col w-full bg-[#17111F]">

      <div className="p-3 flex flex-col justify-between">
        {/* Grid */}
        <div className="grid grid-cols-3 gap-3">
          {data?.data.slice(0, 153).map((item, index) => (
            <div
              key={index}
              className={`flex flex-col items-center justify-center bg-[#2C213F] rounded-xl shadow-lg p-3 transition-transform transform hover:scale-105  ${
                context?.user.fid === item?.fid ? "bg-[#8a63d2]" : ""
              }`}
            >
              <img
                src={item?.pfp?.url || default_image_url}
                alt={`Profile of ${item?.username || "N/A"}`}
                className={`w-14 aspect-square rounded-full object-cover cursor-pointer ${
                  context?.user.fid === item?.fid ? "w-20 rounded-lg" : ""
                }`}
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = default_image_url;
                }}
                onClick={() => sdk.actions.viewProfile({ fid:item?.fid})}
              />
                            <span className="text-xs font-semibold text-white mt-1">
                @{item?.username ?? "N/A"}
              </span>
<span
  className="text-xs text-gray-300 mt-2 flex items-center gap-1"
  onClick={() => sdk.actions.openUrl(`https://warpcast.com/~/profiles/${item?.fid}`)}
>
  {item?.fid ?? "N/A"}
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="h-3 w-3"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
    />
  </svg>
</span>


            </div>
          ))}
        </div>
      </div>
    </div>
  </>
    );
  }
  function LowFids( ) {
    return (
<>
    <AutoScroll targetId="lowFid-container" />
    <Header/> {/* Auto-scrolls to half of this div's height */}
    <div className="flex flex-col w-full bg-[#17111F]">

      <div className="p-3 flex flex-col justify-between">
        {/* Grid */}
        <div className="grid grid-cols-3 gap-3">
          {data?.data.slice(0, 153).map((item, index) => (
            <div id="lowFid-container"
              key={index}
              className={`flex flex-col items-center justify-center bg-[#2C213F] rounded-xl shadow-lg p-3 transition-transform transform hover:scale-105  ${
                context?.user.fid === item?.fid ? "bg-[#8a63d2]" : ""
              }`}
            >
              <img
                src={item?.pfp?.url || default_image_url}
                alt={`Profile of ${item?.username || "N/A"}`}
                className={`w-14 aspect-square rounded-full object-cover cursor-pointer ${
                  context?.user.fid === item?.fid ? "w-20 rounded-lg" : ""
                }`}
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = default_image_url;
                }}
                onClick={() => sdk.actions.viewProfile({ fid:item?.fid})}
              />
                            <span className="text-xs font-semibold text-white mt-1"
                            onClick={()=>alert(getRowNumber(item?.fid))}
                            >
                @{item?.username ?? "N/A"}
              </span>
<span
  className="text-xs text-gray-300 mt-2 flex items-center gap-1"
  onClick={() => sdk.actions.openUrl(`https://warpcast.com/~/profiles/${item?.fid}`)}
>
  {item?.fid ?? "N/A"}
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="h-3 w-3"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
    />
  </svg>
</span>


            </div>
          ))}
        </div>
      </div>
    </div>
  </>
    );
  }

  function Footer( ) {
    return (
      <div className="flex w-full p-3 text-base/6 font-semibold border-t border-gray-500 justify-center">
     <p>
      Made with <span className="text-red-500">&hearts;</span> by <span className="text-blue-500" onClick={() =>sdk.actions.viewProfile({ fid: 268438 })}>cashlessman.eth</span>.
    </p>
    </div>
    );
  }

}
