const Project = require('../models/Project');
const Task = require('../models/Task');
const AppError = require('../utils/AppError');
const asyncHandler = require('../utils/asyncHandler');

// Finds a project owned by the logged-in user or throws 404
const getOwned = async (id, userId) => {
  const project = await Project.findOne({ _id: id, owner: userId });
  if (!project) throw new AppError('Project not found', 404);
  return project;
};

// POST /api/projects
exports.createProject = asyncHandler(async (req, res) => {
  const { name, description } = req.body;
  const project = await Project.create({ name, description, owner: req.user._id });
  res.status(201).json({ success: true, data: project });
});

// GET /api/projects?page=1&limit=10
exports.getProjects = asyncHandler(async (req, res) => {
  const page = Math.max(parseInt(req.query.page) || 1, 1);
  const limit = Math.min(Math.max(parseInt(req.query.limit) || 10, 1), 100);

  const filter = { owner: req.user._id };
  const [projects, total] = await Promise.all([
    Project.find(filter).sort('-createdAt').skip((page - 1) * limit).limit(limit),
    Project.countDocuments(filter),
  ]);

  res.json({ success: true, count: projects.length, total, page, pages: Math.ceil(total / limit), data: projects });
});

// GET /api/projects/:id
exports.getProject = asyncHandler(async (req, res) => {
  const project = await getOwned(req.params.id, req.user._id);
  res.json({ success: true, data: project });
});

// PUT /api/projects/:id
exports.updateProject = asyncHandler(async (req, res) => {
  const project = await getOwned(req.params.id, req.user._id);
  const { name, description } = req.body;
  if (name !== undefined) project.name = name;
  if (description !== undefined) project.description = description;
  await project.save();
  res.json({ success: true, data: project });
});

// DELETE /api/projects/:id  (also removes the project's tasks)
exports.deleteProject = asyncHandler(async (req, res) => {
  const project = await getOwned(req.params.id, req.user._id);
  await Task.deleteMany({ project: project._id });
  await project.deleteOne();
  res.json({ success: true, message: 'Project and its tasks deleted' });
});
