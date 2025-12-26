export default async function handler(req, res) {
  try {
    const apiKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJsb2NhdGlvbl9pZCI6Imc4M05JQmlyYzZQM25IcmQ3alVjIiwidmVyc2lvbiI6MSwiaWF0IjoxNzMzNTMyMTU3MTY3LCJzdWIiOiJMS0huNkVoZW10bmFBNExYOHBCZyJ9.dyxMeIUoETI5tG8QMmmavrhZiXe_yLDx4mXa5NACDH8";
    const locationId = "g83NIBirc6P3nHrd7jUc";
    const baseUrl = "https://api.gohighlevel.com/v1/";

    const { query } = req.query;
    if (!query) {
      return res.status(400).json({ error: "Missing query" });
    }

    // Fetch contacts from GHL
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

    const text = await ghlResponse.text();

    // Debug: check if GHL returns valid JSON
    if (!text.startsWith("{")) {
      return res.status(500).json({
        error: "GHL returned non-JSON response",
        rawResponse: text.substring(0, 500),
      });
    }

    const data = JSON.parse(text);

    if (!data.contacts || data.contacts.length === 0) {
      return res.json({ found: false });
    }

    // Determine search type
    let contact = null;
    if (!query.includes("@") && !/^\+?\d+$/.test(query)) {
      // Likely Student ID → manual match
      contact = data.contacts.find(
        c => c["contact.student_id_"] === query
      );
    } else {
      // Email or Phone → take first result
      contact = data.contacts[0];
    }

    if (!contact) {
      return res.json({ found: false });
    }

    return res.json({
      found: true,
      id: contact.id,
      name: `${contact.firstName || ""} ${contact.lastName || ""}`,
      email: contact.email || "N/A",
      phone: contact.phone || "N/A",
      studentId: contact["contact.student_id_"] || "N/A",
      enrolledCourses: contact["contact.enrolled_courses"] || "N/A",
    });

  } catch (err) {
    return res.status(500).json({
      error: "Server crashed",
      details: err.message,
    });
  }
}
