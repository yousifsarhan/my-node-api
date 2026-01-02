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

// Helper: generate next id (incrementing)
function getNextId() {
  return projects.length ? Math.max(...projects.map((p) => p.id)) + 1 : 1;
}

// --------------------
// API Routes
// --------------------

// GET all projects
// Optional filter: /api/projects?featured=true
app.get("/api/projects", (req, res) => {
  const { featured } = req.query;

  if (featured === "true") {
    return res.json(projects.filter((p) => p.featured === true));
  }
  if (featured === "false") {
    return res.json(projects.filter((p) => p.featured === false));
  }

  res.json(projects);
});

// GET project by id
app.get("/api/projects/:id", (req, res) => {
  const id = Number(req.params.id);
  const project = projects.find((p) => p.id === id);

  if (!project) return res.status(404).json({ message: "Project not found" });
  res.json(project);
});

// POST create project
app.post("/api/projects", (req, res) => {
  const { title, tech, featured } = req.body;

  if (!title || typeof title !== "string") {
    return res.status(400).json({ message: "title is required (string)" });
  }

  const newProject = {
    id: getNextId(),
    title: title.trim(),
    tech: Array.isArray(tech) ? tech : [],
    featured: Boolean(featured),
  };

  projects.push(newProject);
  res.status(201).json(newProject);
});

// PUT update project (CRUD "U")
app.put("/api/projects/:id", (req, res) => {
  const id = Number(req.params.id);
  const project = projects.find((p) => p.id === id);

  if (!project) return res.status(404).json({ message: "Project not found" });

  const { title, tech, featured } = req.body;

  // Only update fields that were provided
  if (title !== undefined) {
    if (typeof title !== "string" || !title.trim()) {
      return res.status(400).json({ message: "title must be a non-empty string" });
    }
    project.title = title.trim();
  }

  if (tech !== undefined) {
    if (!Array.isArray(tech)) {
      return res.status(400).json({ message: "tech must be an array of strings" });
    }
    project.tech = tech;
  }

  if (featured !== undefined) {
    project.featured = Boolean(featured);
  }

  res.json(project);
});

// DELETE project
app.delete("/api/projects/:id", (req, res) => {
  const id = Number(req.params.id);
  const exists = projects.some((p) => p.id === id);

  if (!exists) return res.status(404).json({ message: "Project not found" });

  projects = projects.filter((p) => p.id !== id);
  res.status(204).send();
});

// --------------------
// Start server
// --------------------
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Running on http://localhost:${PORT}`));
