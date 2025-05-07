import { createServer } from "http";
import { readFile } from "fs/promises";
import { join, extname } from "path";
import { fileURLToPath } from "url";

const __dirname = fileURLToPath(new URL(".", import.meta.url));

const MIME_TYPES = {
  ".html": "text/html",
  ".js": "application/javascript",
  ".css": "text/css",
  ".json": "application/json",
  ".vue": "application/javascript",
};

const server = createServer(async (req, res) => {
  try {
    // Handle root path
    let path = req.url === "/" ? "/index.html" : req.url;

    // Remove query parameters
    path = path.split("?")[0];

    // Get the file extension
    const ext = extname(path);

    // Set the content type based on the file extension
    if (MIME_TYPES[ext]) {
      res.setHeader("Content-Type", MIME_TYPES[ext]);
    }

    // Read the file
    const filePath = join(__dirname, path);
    const content = await readFile(filePath);

    // For JSON files, ensure proper formatting
    if (ext === ".json") {
      try {
        // Parse and stringify to ensure valid JSON
        const jsonContent = JSON.parse(content.toString());
        res.end(JSON.stringify(jsonContent));
        return;
      } catch (jsonError) {
        console.error(`Error parsing JSON file ${path}:`, jsonError);
        res.statusCode = 500;
        res.end("Invalid JSON file");
        return;
      }
    }

    // Send the response
    res.end(content);
  } catch (error) {
    console.error(`Error serving ${req.url}:`, error);
    res.statusCode = 404;
    res.end("Not found");
  }
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});
