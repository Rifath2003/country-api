const express = require("express");
const fs = require("fs");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();

app.use(cors());
app.use(bodyParser.json());

// Utility functions
const loadData = () => {
  const data = fs.readFileSync("./countries.json");
  return JSON.parse(data);
};

const saveData = (data) => {
  fs.writeFileSync("./countries.json", JSON.stringify(data, null, 2));
};

// Routes
app.get("/countries", (req, res) => {
  const countries = loadData();
  res.json(countries);
});

app.get("/countries/:id", (req, res) => {
  const countries = loadData();
  const country = countries.find((c) => c.id == req.params.id);

  if (!country) return res.status(404).json({ message: "Country not found" });

  res.json(country);
});

app.post("/countries", (req, res) => {
  const countries = loadData();

  const newCountry = {
    id: countries.length ? countries[countries.length - 1].id + 1 : 1,
    ...req.body,
  };

  countries.push(newCountry);
  saveData(countries);

  res.status(201).json(newCountry);
});

app.put("/countries/:id", (req, res) => {
  const countries = loadData();
  const index = countries.findIndex((c) => c.id == req.params.id);

  if (index === -1)
    return res.status(404).json({ message: "Country not found" });

  countries[index] = { id: parseInt(req.params.id), ...req.body };

  saveData(countries);
  res.json(countries[index]);
});

app.delete("/countries/:id", (req, res) => {
  const countries = loadData();
  const filtered = countries.filter((c) => c.id != req.params.id);

  if (filtered.length === countries.length)
    return res.status(404).json({ message: "Country not found" });

  saveData(filtered);
  res.json({ message: "Country deleted successfully" });
});

// Start server
app.listen(3000, () => console.log("Server running on port 3000"));