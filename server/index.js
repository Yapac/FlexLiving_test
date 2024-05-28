const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
/**
 * 0. This is the server file, it objective is to set up
 *    the server functions so we can call them in the
 *    front-end
 */

/* 1. Using cors to allow the access and expanding the payload limit */
app.use(cors());
app.use(express.json({ limit: "50mb" }));

/* 2. Port and file path variables */
const PORT = 5000;
const filePath = path.join(__dirname, "properties.json");

// 3. The reading function
function readPropertiesFromFile() {
  try {
    const data = fs.readFileSync(filePath, "utf8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading properties file:", error);
    return [];
  }
}

// 4. The writing function
function writePropertiesToFile(newProperty) {
  try {
    fs.writeFileSync(filePath, JSON.stringify(newProperty, null, 2), "utf8");
  } catch (error) {
    console.error("Error writing properties to file:", error);
  }
}

// 5. Get request
app.get("/api/properties", (req, res) => {
  const properties = readPropertiesFromFile();
  res.json(properties);
});

// 6. Post request
app.post("/api/properties", (req, res) => {
  const newProperty = req.body;
  writePropertiesToFile(newProperty);
  res.json({ message: "Properties updated successfully" });
});

// 7. Port setting
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
