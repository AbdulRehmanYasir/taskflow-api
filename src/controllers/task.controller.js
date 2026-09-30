const mongoose = require('mongoose');
const Task = require('../models/Task');
const Project = require('../models/Project');
const AppError = require('../utils/AppError');
const asyncHandler = require('../utils/asyncHandler');

const EDITABLE = ['title', 'description', 'status', 'priority', 'dueDate'];

const getOwned = async (id, userId) => {
  const task = await Task.findOne({ _id: id, owner: userId });
  if (!task) throw new AppError('Task not found', 404);
  return task;
};

// POST /api/tasks
exports.createTask = asyncHandler(async (req, res) => {
  const { project, title, description, status, priority, dueDate } = req.body;

  if (!project || !mongoose.isValidObjectId(project)) throw new AppError('A valid project id is required', 400);
  const parent = await Project.findOne({ _id: project, owner: req.user._id });
  if (!parent) throw new AppError('Project not found', 404);

  const task = await Task.create({ project, title, description, status, priority, dueDate, owner: req.user._id });
  res.status(201).json({ success: true, data: task });
});

// GET /api/tasks?project=&status=&priority=&sort=&page=&limit=
exports.getTasks = asyncHandler(async (req, res) => {
  const { project, status, priority, sort = '-createdAt' } = req.query;
  const page = Math.max(parseInt(req.query.page) || 1, 1);
  const limit = Math.min(Math.max(parseInt(req.query.limit) || 10, 1), 100);

  const filter = { owner: req.user._id };
  if (project) filter.project = project;
  if (status) filter.status = status;
  if (priority) filter.priority = priority;

  const [tasks, total] = await Promise.all([
    Task.find(filter).sort(String(sort).split(',').join(' ')).skip((page - 1) * limit).limit(limit).populate('project', 'name'),
    Task.countDocuments(filter),
  ]);

  res.json({ success: true, count: tasks.length, total, page, pages: Math.ceil(total / limit), data: tasks });
});

// GET /api/tasks/:id
exports.getTask = asyncHandler(async (req, res) => {
  const task = await getOwned(req.params.id, req.user._id);
  await task.populate('project', 'name');
  res.json({ success: true, data: task });
});

// PUT /api/tasks/:id
exports.updateTask = asyncHandler(async (req, res) => {
  const task = await getOwned(req.params.id, req.user._id);
  EDITABLE.forEach((field) => {
    if (req.body[field] !== undefined) task[field] = req.body[field];
  });
  await task.save(); // runs schema validators (e.g. enum checks)
  res.json({ success: true, data: task });
});

// DELETE /api/tasks/:id
exports.deleteTask = asyncHandler(async (req, res) => {
  const task = await getOwned(req.params.id, req.user._id);
  await task.deleteOne();
  res.json({ success: true, message: 'Task deleted' });
});
