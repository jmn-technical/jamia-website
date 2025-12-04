// pages/api/news-export.js
export default async function handler(req, res) {
  try {
    const type = (req.query.type || "csv").toLowerCase();

    // Fetch the news list from your API or DB directly.
    // If your existing /api/news returns { data: [...] }, call it:
    const base = process.env.NEXT_PUBLIC_PORT ? process.env.NEXT_PUBLIC_PORT : `http://${req.headers.host}`;
    const apiRes = await fetch(`${base}/api/news`, { headers: { "Content-Type": "application/json" }});
    if (!apiRes.ok) {
      const txt = await apiRes.text();
      return res.status(500).json({ error: "Failed to fetch news: " + txt });
    }
    const json = await apiRes.json();
    const news = Array.isArray(json.data) ? json.data : (json || []);

    const escapeCsv = (val = "") => {
      if (val === null || val === undefined) return "";
      const s = String(val);
      if (/[,"\r\n]/.test(s)) return '"' + s.replace(/"/g, '""') + '"';
      return s;
    };

    if (type === "sql") {
      const cols = ["_id","title","content","image","imgId","isPublished","createdAt","publishedAt"];
      let sql = `-- SQL Export generated at ${new Date().toISOString()}\n\nDELETE FROM \`news\`;\n\n`;
      for (const r of news) {
        const values = cols.map(c => {
          let v = r[c];
          if (v === null || v === undefined) return "NULL";
          if (typeof v === "boolean") return v ? "1" : "0";
          if (typeof v === "object") v = JSON.stringify(v);
          return "'" + String(v).replace(/'/g, "''") + "'";
        });
        sql += `INSERT INTO \`news\` (\`${cols.join("`,`")}\`) VALUES (${values.join(", ")});\n`;
      }
      res.setHeader("Content-Type", "application/sql; charset=utf-8");
      res.setHeader("Content-Disposition", `attachment; filename="news-export-${Date.now()}.sql"`);
      return res.status(200).send(sql);
    }

    // CSV
    const csvCols = ["_id","title","content","image","imgId","isPublished","createdAt","publishedAt"];
    let csv = csvCols.join(",") + "\n";
    for (const r of news) {
      const row = csvCols.map(c => {
        let v = r[c];
        if (typeof v === "object" && v !== null) v = JSON.stringify(v);
        return escapeCsv(v);
      }).join(",");
      csv += row + "\n";
    }

    res.setHeader("Content-Type", "text/csv; charset=utf-8");
    res.setHeader("Content-Disposition", `attachment; filename="news-export-${Date.now()}.csv"`);
    return res.status(200).send(csv);
  } catch (err) {
    console.error("Export error:", err);
    return res.status(500).json({ error: err.message || "Unknown error" });
  }
}
