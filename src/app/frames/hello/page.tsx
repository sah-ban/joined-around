import { Metadata } from "next";
import App from "~/app/app";

const appUrl = process.env.NEXT_PUBLIC_URL;

const frame = {
  version: "next",
  imageUrl: `https://raw.githubusercontent.com/cashlessman/images/refs/heads/main/banner.png`,
  button: {
    title: "SEE",
    action: {
      type: "launch_frame",
      name: "See Who Joined Around You",
      url: `${appUrl}`,
      splashImageUrl: `https://raw.githubusercontent.com/cashlessman/images/refs/heads/main/pfp.png`,
      splashBackgroundColor: "#333333",
    },
  },
};

export const metadata: Metadata = {
  title: "Hello, world!",
  description: "A simple hello world frame",
  openGraph: {
    title: "Hello, world!",
    description: "A simple hello world frame",
  },
  other: {
    "fc:frame": JSON.stringify(frame),
  },
};

export default function HelloFrame() {
  return <App title={"Hello, world!"} />;
}
