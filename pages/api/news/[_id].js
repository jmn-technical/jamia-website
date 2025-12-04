// pages/api/news/[_id].js
const { getPool } = require("../../../utils/db");

// Helper: map DB row (snake_case) → API object (camelCase)
function mapNewsRow(row) {
  if (!row) return null;

  return {
    _id: row._id,             // varchar ID used in URLs
    id: row.id,               // integer primary key
    title: row.title,
    content: row.content,
    image: row.image,
    imgId: row.imgid,
    isPublished: row.ispublished,
    createdAt: row.createdat,
    publishedAt: row.publishedat,
    slug: row.slug,
  };
}

module.exports = async (req, res) => {
  const {
    query: { _id },
    method,
  } = req;

  const pool = getPool();

  // basic validation
  if (!_id) {
    return res
      .status(400)
      .json({ success: false, error: "_id is required" });
  }

  try {
    switch (method) {
      // GET /api/news/[_id]  → single news item
      case "GET": {
        const q = `SELECT * FROM news WHERE _id = $1 LIMIT 1`;
        const { rows } = await pool.query(q, [_id]);

        if (!rows || rows.length === 0) {
          return res
            .status(404)
            .json({ success: false, error: "Not found" });
        }

        const data = mapNewsRow(rows[0]);
        return res.status(200).json({ success: true, data });
      }

      // PUT /api/news/[_id]  → update news item
      case "PUT": {
        // Accept updatable fields only (prevent arbitrary SQL injection)
        const {
          slug,
          title,
          content,
          image,
          imgId,        // camelCase from frontend
          isPublished,  // camelCase from frontend
          publishedAt,  // camelCase from frontend
        } = req.body || {};

        // Build dynamic SET clause safely
        const fields = [];
        const values = [];
        let idx = 1;

        if (slug !== undefined) {
          fields.push(`slug = $${idx++}`);
          values.push(slug);
        }
        if (title !== undefined) {
          fields.push(`title = $${idx++}`);
          values.push(title);
        }
        if (content !== undefined) {
          fields.push(`content = $${idx++}`);
          values.push(content);
        }
        if (image !== undefined) {
          fields.push(`image = $${idx++}`);
          values.push(image);
        }
        if (imgId !== undefined) {
          fields.push(`imgid = $${idx++}`); // map to DB column
          values.push(imgId);
        }
        if (isPublished !== undefined) {
          fields.push(`ispublished = $${idx++}`); // map to DB column
          values.push(isPublished);
        }
        if (publishedAt !== undefined) {
          fields.push(`publishedat = $${idx++}`); // map to DB column
          values.push(publishedAt ? new Date(publishedAt) : null);
        }

        if (fields.length === 0) {
          return res.status(400).json({
            success: false,
            error: "No updatable fields provided",
          });
        }

        const setClause = fields.join(", ");

        // push _id for WHERE
        values.push(_id);

        const updateQ = `
          UPDATE news
          SET ${setClause}
          WHERE _id = $${idx}
          RETURNING *
        `;

        const { rows } = await pool.query(updateQ, values);
        if (!rows || rows.length === 0) {
          return res
            .status(404)
            .json({ success: false, error: "Not found" });
        }

        const data = mapNewsRow(rows[0]);
        return res.status(200).json({ success: true, data });
      }

      // DELETE /api/news/[_id]  → delete news item
      case "DELETE": {
        const delQ = `DELETE FROM news WHERE _id = $1 RETURNING *`;
        const { rows } = await pool.query(delQ, [_id]);

        if (!rows || rows.length === 0) {
          return res
            .status(404)
            .json({ success: false, error: "Not found" });
        }

        const data = mapNewsRow(rows[0]);
        return res.status(200).json({ success: true, data });
      }

      default: {
        res.setHeader("Allow", ["GET", "PUT", "DELETE"]);
        return res
          .status(405)
          .json({ success: false, error: `Method ${method} Not Allowed` });
      }
    }
  } catch (err) {
    console.error("news[_id] API error:", err);
    return res.status(500).json({ success: false, error: err.message });
  }
};
