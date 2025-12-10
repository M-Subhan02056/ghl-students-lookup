export default async function handler(req, res) {
  try {
    // === HARD CODED API KEY ===
    const apiKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJsb2NhdGlvbl9pZCI6Imc4M05JQmlyYzZQM25IcmQ3alVjIiwidmVyc2lvbiI6MSwiaWF0IjoxNzMzNTMyMTU3MTY3LCJzdWIiOiJMS0huNkVoZW10bmFBNExYOHBCZyJ9.dyxMeIUoETI5tG8QMmmavrhZiXe_yLDx4mXa5NACDH8";

    // === HARD CODED BASE URL ===
    const baseUrl = "https://team.schoolmanagement.me/api/v1/";

    const { query } = req.query;

    if (!query) {
      return res.status(400).json({ error: "Missing query parameter" });
    }

    // === HARD CODED CUSTOM FIELD KEYS ===
    const studentIdField = "contact.student_id_";
    const courseField = "contact.enrolled_courses";

    // Call GHL Search Contacts API
    const response = await fetch(`${baseUrl}contacts/search?query=${encodeURIComponent(query)}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      const errText = await response.text();
      return res.status(response.status).json({ error: errText });
    }

    const data = await response.json();

    if (!data.contacts || data.contacts.length === 0) {
      return res.json({
        found: false,
        message: "No student found with this email, phone, or ID."
      });
    }

    const contact = data.contacts[0];

    return res.json({
      found: true,
      id: contact.id,
      name: (contact.firstName || "") + " " + (contact.lastName || ""),
      email: contact.email || "Not available",
      phone: contact.phone || "Not available",
      studentId: contact[studentIdField] || "Not available",
      enrolledCourses: contact[courseField] || "Not available"
    });

  } catch (err) {
    return res.status(500).json({ error: "Server error", details: err.message });
  }
}
