const Images = require("../../../models/Images");

export default async function handler(req, res) {
  const { method } = req;

  try {
    if (method === "GET") {
      const imgs = await Images.find().sort({ id: -1 });
      return res.status(200).json({ success: true, data: imgs });
    }

    if (method === "POST") {
      const created = await Images.create(req.body);
      return res.status(200).json({ success: true, data: created });
    }

    res.setHeader("Allow", ["GET", "POST"]);
    return res.status(405).json({ success: false });
  } catch (err) {
    console.error("Images API error:", err);
    return res.status(500).json({ success: false, error: err.message });
  }
}
