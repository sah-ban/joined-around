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

  const myProfile = useCallback(() => {
    sdk.actions.viewProfile({ fid: 268438 }) 
  }, []);

  const openWarpcastUrl = useCallback(() => {
    sdk.actions.openUrl(shareUrl);
  }, []);

  const close = useCallback(() => {
    sdk.actions.close();
  }, []);


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
  `See Who Joined Around You \n \nV2 frame by @cashlessman.eth`
);

const shareUrl = `https://warpcast.com/~/compose?text=${shareText}&embeds[]=https://around-joined.vercel.app/`;
const  default_image_url="https://wrpcd.net/cdn-cgi/imagedelivery/BXluQx4ige9GuW0Ia56BHw/7df1c31c-5721-4d33-2d2c-a102a8b3ca00/original" 

const handleImageClick = (fid: number | null) => {
  if (fid) {
   sdk.actions.viewProfile({ fid: fid }) 

  } else {
    alert(JSON.stringify("user might have deleted tha account"))
  }
};
const [showTopHiddenRows, setShowTopHiddenRows] = useState(false);

const toggleTopRows = () => {
  setShowTopHiddenRows((prev) => !prev);
};
const [showBottomHiddenRows, setShowBottomHiddenRows] = useState(false);

const toggleBottomRows = () => {
  setShowBottomHiddenRows((prev) => !prev);
};
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
<div className="w-auto h-max bg-[#17111F]  text-white flex flex-col">
<h1 className="text-2xl font-bold text-center mb-4 hidden">{title}</h1>

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
      <div className="text-center">
        <div className="loader animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-500 mx-auto"></div>
        <p className="mt-4 text-gray-100 text-lg font-semibold">Loading, please wait...</p>
      </div>
    </div>
    
    );
  }

  function All( ) {
    return (
      <div >
<Header/>
<Grid/>
<Footer/>

</div>
    );
  }

  function Header( ) {
    return (
<header className="flex items-center justify-between text-gray-100 border-b border-gray-500 py-2 px-3">
  <div className="flex items-center">
    <img 
      src="https://i.imgur.com/I2rEbPF.png" 
      alt="Logo" 
      className="h-8 w-8 mr-3 rounded-lg" 
    />
    <h1 className="text-lg font-bold">See who joined around you</h1>
  </div>
  <div
        className="bg-[#422E8D] p-2 ml-3 justify-self-center flex-1 text-center rounded-lg"
        onClick={openWarpcastUrl}
      >
        Share
      </div>
</header>
    );
  }
  
  function Grid( ) {
    return (
      <div className="flex flex-row justify-self-center w-full">

      <div className="p-3 flex flex-col justify-between">
        <div className="flex justify-center mb-3">
          <button
            onClick={toggleTopRows}
            className="bg-[#422E8D] text-white px-4 py-2 rounded-lg"
          >
            {showTopHiddenRows ? "Hide" : "See previous six users"}
          </button>
        </div>
  
        {/* Grid */}
        <div className="grid grid-cols-3 gap-3">
          {data?.data.slice(0, 27).map((item, index) => {
            const isHidden =
              (!showTopHiddenRows && index < 6) || (!showBottomHiddenRows && index >= 21);
  
            return (
              <div
                key={index}
                className={`flex flex-col items-center justify-center bg-[#2C213F] rounded-xl shadow-lg p-3 transition-transform transform hover:scale-105 ${
                  isHidden ? "hidden" : ""
                }`}
              >
                <img
                  src={item?.pfp?.url || default_image_url}
                  alt={`Profile of ${item?.username || "N/A"}`}
                  className={`w-14 aspect-square rounded-full object-cover cursor-pointer ${
                    context?.user.fid === item?.fid ? "w-20 rounded-lg" : ""
                  }`}
                  onClick={() => handleImageClick(item?.fid)}
                />
                <span className="text-xs text-gray-300 mt-2">{item?.fid ?? "N/A"}</span>

                <span className="text-xs font-semibold text-white mt-1">
                  @{item?.username ?? "N/A"}
                  
  
                </span>
              </div>
            );
          })}
        </div>
  
        {/* Bottom Button */}
        <div className="flex justify-center mt-4">
          <button
            onClick={toggleBottomRows}
            className="bg-[#422E8D] text-white px-4 py-2 rounded-lg"
          >
            {showBottomHiddenRows ? "Hide" : "See next six users "}
          </button>
        </div>
      </div>
      </div>
    );
  }

  function Footer( ) {
    return (
      <div className="flex flex-row justify-self-center w-full px-3 text-base/6 font-semibold border-t border-gray-500 mb-3 text-center">
      <div
        className="bg-[#422E8D] p-3 mt-2 flex-1 rounded-lg"
        onClick={myProfile}
      >
        @cashlessman.eth
      </div>
      <div
      className="bg-[#422E8D] p-3 mt-2 flex-1 rounded-lg ml-2"
      onClick={close}
    >
      Close Frame
    </div>
    </div>
    );
  }

}
