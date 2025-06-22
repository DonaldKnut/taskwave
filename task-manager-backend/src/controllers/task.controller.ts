import { Request, Response } from "express";
import mongoose from "mongoose";
import { ITask, Task } from "../models/Task";

/**
 * GET /api/tasks
 * Get all tasks for the authenticated user
 */
export const getTasks = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const tasks: ITask[] = await Task.find({ userId }).sort({ createdAt: -1 });
    return res.status(200).json(tasks);
  } catch (error) {
    console.error("Error fetching tasks:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

/**
 * POST /api/tasks
 * Create a new task
 */
export const createTask = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const { title } = req.body;

    if (!title || typeof title !== "string") {
      return res
        .status(400)
        .json({ message: "Title is required and must be a string" });
    }

    const newTask = new Task({
      title,
      userId,
    });

    const savedTask = await newTask.save();
    return res.status(201).json(savedTask);
  } catch (error) {
    console.error("Error creating task:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

/**
 * PUT /api/tasks/:id
 * Update a task by ID
 */
export const updateTask = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;
    const { title, completed } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid task ID" });
    }

    const task = await Task.findOne({ _id: id, userId });

    if (!task) {
      return res
        .status(404)
        .json({ message: "Task not found or unauthorized" });
    }

    if (title !== undefined) task.title = title;
    if (completed !== undefined) task.completed = completed;

    const updatedTask = await task.save();
    return res.status(200).json(updatedTask);
  } catch (error) {
    console.error("Error updating task:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

/**
 * PATCH /api/tasks/:id/complete
 * Mark a task as completed
 */
export const completeTask = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid task ID" });
    }

    const task = await Task.findOne({ _id: id, userId });

    if (!task) {
      return res
        .status(404)
        .json({ message: "Task not found or unauthorized" });
    }

    task.completed = true;
    const updatedTask = await task.save();

    return res.status(200).json(updatedTask);
  } catch (error) {
    console.error("Error completing task:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

/**
 * DELETE /api/tasks/:id
 * Delete a task by ID
 */
export const deleteTask = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid task ID" });
    }

    const task = await Task.findOneAndDelete({ _id: id, userId });

    if (!task) {
      return res
        .status(404)
        .json({ message: "Task not found or unauthorized" });
    }

    return res.status(204).send();
  } catch (error) {
    console.error("Error deleting task:", error);
    return res.status(500).json({ message: "Server error" });
  }
};
