export default async function handler(req, res) {
  try {
    const apiKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJsb2NhdGlvbl9pZCI6Imc4M05JQmlyYzZQM25IcmQ3alVjIiwidmVyc2lvbiI6MSwiaWF0IjoxNzY2NzUyODY2MjA0LCJzdWIiOiJTS0x3YUJRWXhLRlhScGhIR1RxMiJ9.L7o2yUekjbPmJATR-eiUUY4istV64_ipRmBLPlA7pq4";
    const locationId = "g83NIBirc6P3nHrd7jUc";
    const baseUrl = "https://api.gohighlevel.com/v1/";
    const { query } = req.query;

    if (!query) return res.status(400).json({ error: "Missing query" });

    const ghlResponse = await fetch(
      `${baseUrl}contacts/?locationId=${locationId}&query=${encodeURIComponent(query)}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          Accept: "application/json",
        },
      }
    );

    const data = await ghlResponse.json();

    // Return raw API data for inspection
    return res.status(200).json({ raw: data });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

