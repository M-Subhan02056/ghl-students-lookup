export default async function handler(req, res) {
  try {
    const apiKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJsb2NhdGlvbl9pZCI6Imc4M05JQmlyYzZQM25IcmQ3alVjIiwidmVyc2lvbiI6MSwiaWF0IjoxNzMzNTMyMTU3MTY3LCJzdWIiOiJMS0huNkVoZW10bmFBNExYOHBCZyJ9.dyxMeIUoETI5tG8QMmmavrhZiXe_yLDx4mXa5NACDH8";
    const baseUrl = "https://team.schoolmanagement.me/api/v1/";
    const { query } = req.query;

    if (!query) {
      return res.json({ found: false, message: "No query provided" });
    }

    // ✅ SINGLE VALID GHL SEARCH
    const response = await fetch(
      `${baseUrl}contacts/?query=${encodeURIComponent(query)}`,
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          Accept: "application/json",
        },
      }
    );

    const data = await response.json();

    if (!data.contacts || data.contacts.length === 0) {
      return res.json({ found: false });
    }

    let contact = null;

    // 🔎 If looks like Student ID → manual match
    if (!query.includes("@") && !query.startsWith("+") && !/^\d{10,}$/.test(query)) {
      contact = data.contacts.find(
        c => c["contact.student_id_"] === query
      );
    } else {
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
      e
