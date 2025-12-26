export default async function handler(req, res) {
  try {
    const apiKey = "YOUR_LOCATION_API_KEY"; // replace
    const locationId = "YOUR_LOCATION_ID"; // replace
    const { query } = req.query;

    if (!query) {
      return res.status(400).json({ error: "Missing query" });
    }

    const ghlResponse = await fetch(
      `https://api.gohighlevel.com/v1/contacts/?locationId=${locationId}&query=${encodeURIComponent(query)}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          Accept: "application/json",
        },
      }
    );

    const text = await ghlResponse.text();

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

    const contact = data.contacts[0];

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
    return res.status(500).json({ error: "Server crashed", details: err.message });
  }
}
