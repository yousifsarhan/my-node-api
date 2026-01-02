const express = require("express");
const path = require("path");

const app = express();

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// Portfolio projects (fake DB for now)
let projects = [
  { id: 1, title: "React Portfolio", tech: ["React", "CSS"], featured: true },
  { id: 2, title: "Node REST API", tech: ["Node.js", "Express"], featured: true },
];

// API Routes
app.get("/api/projects", (req, res) => {
  res.json(projects);
});

app.get("/api/projects/:id", (req, res) => {
  const id = Number(req.params.id);
  const project = projects.find((p) => p.id === id);
  if (!project) return res.status(404).json({ message: "Project not found" });
  res.json(project);
});

app.post("/api/projects", (req, res) => {
  const { title, tech, featured } = req.body;
  if (!title) return res.status(400).json({ message: "title is required" });

  const newProject = {
    id: Date.now(),
    title,
    tech: Array.isArray(tech) ? tech : [],
    featured: Boolean(featured),
  };

  projects.push(newProject);
  res.status(201).json(newProject);
});

app.delete("/api/projects/:id", (req, res) => {
  const id = Number(req.params.id);
  const exists = projects.some((p) => p.id === id);
  if (!exists) return res.status(404).json({ message: "Project not found" });

  projects = projects.filter((p) => p.id !== id);
  res.status(204).send();
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Running on http://localhost:${PORT}`));
