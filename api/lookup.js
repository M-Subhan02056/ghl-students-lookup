export default async function handler(req, res) {
  try {
    const apiKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJsb2NhdGlvbl9pZCI6Imc4M05JQmlyYzZQM25IcmQ3alVjIiwidmVyc2lvbiI6MSwiaWF0IjoxNzMzNTMyMTU3MTY3LCJzdWIiOiJMS0huNkVoZW10bmFBNExYOHBCZyJ9.dyxMeIUoETI5tG8QMmmavrhZiXe_yLDx4mXa5NACDH8";
    const baseUrl = "https://team.schoolmanagement.me/api/v1/";
    const { query } = req.query;

    if (!query) {
      return res.json({ found: false, message: "No query provided" });
    }

    let searchUrl = "";

    // Detect input type
    if (query.includes("@")) {
      // Email search
      searchUrl = `${baseUrl}contacts/search?email=${encodeURIComponent(query)}`;
    } else if (/^\d+$/.test(query)) {
      // Phone search
      searchUrl = `${baseUrl}contacts/search?phone=${encodeURIComponent(query)}`;
    } else {
      // Student ID (custom field → requires full contacts fetch)
      searchUrl = `${baseUrl}contacts/`;
    }

    const response = await fetch(searchUrl, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        Accept: "application/json"
      }
    });

    const data = await response.json();

    let contact = null;

    if (data.contacts && data.contacts.length) {
      if (!query.includes("@") && !/^\d+$/.test(query)) {
        // Manually match student ID
        contact = data.contacts.find(
          c => c["contact.student_id_"] === query
        );
      } else {
        contact = data.contacts[0];
      }
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
      enrolledCourses: contact["contact.enrolled_courses"] || "N/A"
    });

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

