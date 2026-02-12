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

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const fetchTasks = async () => {
    const res = await fetch("http://localhost:5000/api/tasks", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();
    setTasks(data);
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const createTask = async () => {
    await fetch("http://localhost:5000/api/tasks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ title, status: "TODO" }),
    });

    setTitle("");
    fetchTasks();
  };

  const updateStatus = async (id: number, status: string) => {
    await fetch(`http://localhost:5000/api/tasks/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status }),
    });

    fetchTasks();
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
