// pages/api/news/index.js
const { getPool } = require("../../../utils/db");

// Helper: map DB row (snake_case) → API object (camelCase)
function mapNewsRow(row) {
  if (!row) return null;

  return {
    _id: row._id, // varchar ID used in URLs
    id: row.id,   // integer primary key
    title: row.title,
    content: row.content,
    image: row.image,
    imgId: row.imgid,
    isPublished: row.ispublished,
    createdAt: row.createdat,
    publishedAt: row.publishedat,
    category: row.category, // ✅ include category
  };
}

export default async function handler(req, res) {
  const pool = getPool();
  const { method } = req;

  try {
    switch (method) {
      // GET /api/news  → list all news
      case "GET": {
        const q = `
          SELECT
            _id,
            id,
            title,
            content,
            image,
            imgid,
            ispublished,
            createdat,
            publishedat,
            category              -- ✅ select category
          FROM news
          ORDER BY COALESCE(publishedat, createdat) DESC
        `;
        const { rows } = await pool.query(q);
        const data = (rows || []).map(mapNewsRow);
        return res.status(200).json({ success: true, data });
      }

      // POST /api/news  → create news
      case "POST": {
        const {
          title,
          content,
          image,
          imgid,        // snake_case (old)
          imgId,        // camelCase (preferred)
          isPublished,  // camelCase (preferred)
          ispublished,  // snake_case (fallback)
          publishedAt,  // camelCase (preferred)
          publishedat,  // snake_case (fallback)
          category,     // ✅ from frontend
        } = req.body || {};

        if (!title) {
          return res
            .status(400)
            .json({ success: false, error: "Title is required" });
        }

        // ✅ make sure we keep the value from the frontend
        const finalImgId =
          typeof imgId !== "undefined"
            ? imgId
            : typeof imgid !== "undefined"
            ? imgid
            : null;

        const finalIsPublished =
          typeof isPublished !== "undefined"
            ? isPublished
            : typeof ispublished !== "undefined"
            ? ispublished
            : false;

        const finalPublishedAt = publishedAt ?? publishedat ?? null;

        const finalCategory =
          category && category.toString().trim()
            ? category.toString().trim()
            : "Events"; // default only if user didn't choose anything

        const insertQ = `
          INSERT INTO news (
            title,
            content,
            image,
            imgid,
            ispublished,
            createdat,
            publishedat,
            category             -- ✅ insert category
          )
          VALUES ($1, $2, $3, $4, $5, NOW(), $6, $7)
          RETURNING
            _id,
            id,
            title,
            content,
            image,
            imgid,
            ispublished,
            createdat,
            publishedat,
            category
        `;

        const values = [
          title,
          content ?? null,
          image ?? null,
          finalImgId,
          finalIsPublished,
          finalPublishedAt ? new Date(finalPublishedAt) : null,
          finalCategory,
        ];

        const { rows } = await pool.query(insertQ, values);
        const data = mapNewsRow(rows[0]);
        return res.status(201).json({ success: true, data });
      }

      default: {
        res.setHeader("Allow", ["GET", "POST"]);
        return res
          .status(405)
          .json({ success: false, error: `Method ${method} Not Allowed` });
      }
    }
  } catch (err) {
    console.error("News API error:", err);
    return res.status(500).json({ success: false, error: err.message });
  }
}
