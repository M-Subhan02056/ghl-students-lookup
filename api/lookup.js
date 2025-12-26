export default function handler(req, res) {
  return res.status(200).json({
    status: "API is working",
    query: req.query.query || null
  });
}
