import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

export async function GET(req: NextRequest) {
  console.log(`API route called at ${new Date().toISOString()}`);
  console.log(`Full URL: ${req.url}`);

  const fid = req.nextUrl.searchParams.get("fid");
    // const fid = "10"

  console.log(`Requested fid: ${fid}`);

  if (!fid) {
    console.log("Error: fid parameter is missing");
    return NextResponse.json(
      { error: "fid parameter is required" },
      { status: 400 }
    );
  }

  const fidNum = parseInt(fid);
  if (isNaN(fidNum)) {
    return NextResponse.json(
      { error: "Invalid fid parameter, must be a number" },
      { status: 400 }
    );
  }

  try {
    console.log(`Fetching data from API for fid: ${fidNum}`);

    // Determine the value of nfid based on fidNum
    const nfid = fidNum < 78 ? 1 : fidNum - 76;

    // Array to hold the details for the next 17 fid values
    const userDetailsPromises = [];
    
    for (let i = 0; i < 153; i++) {
      const currentFid = nfid + i;
      const apiUrl = `https://api.warpcast.com/v2/user?fid=${currentFid}`;
      userDetailsPromises.push(
        axios
          .get(apiUrl)
          .then((response) => {
            const user = response.data.result.user;
            if (!user) {
              return {
                fid: currentFid,
                error: "No user data found for this fid",
              };
            }

            const { fid: userFid, username, displayName, pfp } = user;
            const pfpUrl = pfp?.url || null;


            return {
              fid: userFid,
              username,
              displayName,
              pfp: { url: pfpUrl },
            };
          })
          .catch((error) => {
            console.error(`Error fetching data for fid ${currentFid}:`, error);
            return {
              fid: currentFid,
              error: "An unexpected error occurred",
            };
          })
      );
    }

    // Wait for all the API calls to finish
    const userDetails = await Promise.all(userDetailsPromises);

    // console.log( userDetails);
    // console.log("hehe")
    // console.log(userDetails[0]?.fid )

    return NextResponse.json(userDetails);
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
