"use client";
import { useEffect, useState } from "react";

interface Task {
  id: number;
  title: string;
  status: string;
}

export default function Dashboard() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState("");

  // ✅ FIXED: Use environment variable for API URL
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const fetchTasks = async () => {
    try {
      // ✅ FIXED: Correct fetch syntax with parentheses
      const res = await fetch(`${API_URL}/api/tasks`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      if (res.ok) {
        const data = await res.json();
        setTasks(data);
      }
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  useEffect(() => {
    if (token) {
      fetchTasks();
    }
  }, [token]);

  const createTask = async () => {
    if (!title.trim()) {
      alert("Please enter a task title");
      return;
    }

    try {
      // ✅ FIXED: Correct fetch syntax with parentheses
      await fetch(`${API_URL}/api/tasks`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title, status: "TODO" }),
      });
      setTitle("");
      fetchTasks();
    } catch (error) {
      console.error("Error creating task:", error);
      alert("Failed to create task");
    }
  };

  const updateStatus = async (id: number, status: string) => {
    try {
      // ✅ FIXED: Correct fetch syntax with parentheses
      await fetch(`${API_URL}/api/tasks/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });
      fetchTasks();
    } catch (error) {
      console.error("Error updating task:", error);
      alert("Failed to update task");
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Task Board</h1>
      <div className="flex gap-2 mb-4">
        <input
          className="flex-1 border p-2 rounded"
          placeholder="New task..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <button
          onClick={createTask}
          className="bg-blue-500 text-white px-4 rounded"
        >
          Add
        </button>
      </div>
      {tasks.length === 0 && <p>No tasks yet</p>}
      {tasks.map((task) => (
        <div
          key={task.id}
          className="border p-3 rounded mb-2 flex justify-between"
        >
          <div>
            <p className="font-medium">{task.title}</p>
            <p className="text-sm text-gray-500">{task.status}</p>
          </div>
          <select
            value={task.status}
            onChange={(e) => updateStatus(task.id, e.target.value)}
            className="border rounded p-1"
          >
            <option value="TODO">Todo</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="DONE">Done</option>
          </select>
        </div>
      ))}
    </div>
  );
}
