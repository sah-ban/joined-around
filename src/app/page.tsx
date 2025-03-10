import { Metadata } from "next";
import App from "./app";

const appUrl = process.env.NEXT_PUBLIC_URL;

const frame = {
  version: "next",
  imageUrl: `https://raw.githubusercontent.com/cashlessman/images/refs/heads/main/banner.png`,
  button: {
    title: "SEE",
    action: {
      type: "launch_frame",
      name: "Joined Around You",
      url: appUrl,
      splashImageUrl: `https://raw.githubusercontent.com/cashlessman/images/refs/heads/main/pfp.png`,
      splashBackgroundColor: "#333333",
    },
  },
};

export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: " @cashlessman.eth",
    openGraph: {
      title: "Farcaster Frame v2 By @cashlessman.eth",
      description: "A Farcaster Frames v2",
    },
    other: {
      "fc:frame": JSON.stringify(frame),
    },
  };
}

export default function Home() {
  return (<App />);
}
