export async function GET() {
  const appUrl = process.env.NEXT_PUBLIC_URL;

  const config = {
    accountAssociation: {
      header: "eyJmaWQiOjI2ODQzOCwidHlwZSI6ImN1c3RvZHkiLCJrZXkiOiIweDIxODA4RUUzMjBlREY2NGMwMTlBNmJiMEY3RTRiRkIzZDYyRjA2RWMifQ",
      payload: "eyJkb21haW4iOiJhcm91bmQtam9pbmVkLnZlcmNlbC5hcHAifQ",
      signature: "MHhhYjFmNzkwNzc4ZmI4ZTI2YzA4ZGQ4ZjdjYjA3MDE4MGE4MmU0OWExMjk0NmQxN2NlZGQ5MDU3NDRmNzhjZDNmNmIzMmVmM2FiNTU4M2NkMTVkODk2MWY0OTFkZTY5YjY1NDE3ZDE3NTNjY2M3NWI5NjhlNmI1YWE4M2Y0YzAxZjFj"
    },
    frame: {
      version: "1",
      name: "Joined Around You",
      iconUrl: `https://raw.githubusercontent.com/cashlessman/images/refs/heads/main/people.png`,
      homeUrl: appUrl,
      imageUrl: `https://raw.githubusercontent.com/cashlessman/images/refs/heads/main/banner.png`,
      buttonTitle: "SEE",
      splashImageUrl: `https://raw.githubusercontent.com/cashlessman/images/refs/heads/main/pfp.png`,
      splashBackgroundColor: "#333333",
      webhookUrl: `${appUrl}/api/webhook`,
    },
  };

  return Response.json(config);
}
