"use client";

import { useState, useEffect, ChangeEvent, KeyboardEvent } from "react";
import confetti from "canvas-confetti";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

type Task = {
  id: number;
  text: string;
  completed: boolean;
};

export default function TodoList() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState<string>("");
  const [editingTaskId, setEditingTaskId] = useState<number | null>(null);
  const [editedTaskText, setEditedTaskText] = useState<string>("");
  const [isMounted, setIsMounted] = useState<boolean>(false);

  useEffect(() => {
    setIsMounted(true);
    const savedTasks = localStorage.getItem("tasks");
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks) as Task[]);
    }
  }, []);

  useEffect(() => {
    if (isMounted) {
      localStorage.setItem("tasks", JSON.stringify(tasks));
    }
  }, [tasks, isMounted]);

  const addTask = (): void => {
    if (newTask.trim() !== "") {
      const newTaskObj: Task = {
        id: Date.now(),
        text: newTask,
        completed: false,
      };
      setTasks([...tasks, newTaskObj]);
      setNewTask("");
      confetti({
        particleCount: 150,
        spread: 100,
        origin: { x: 0.5, y: 0.5 },
      });
    }
  };

  const toggleTaskCompletion = (id: number): void => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const startEditingTask = (id: number, text: string): void => {
    setEditingTaskId(id);
    setEditedTaskText(text);
  };

  const updateTask = (): void => {
    if (editedTaskText.trim() !== "") {
      setTasks(
        tasks.map((task) =>
          task.id === editingTaskId ? { ...task, text: editedTaskText } : task
        )
      );
      setEditingTaskId(null);
      setEditedTaskText("");
    }
  };

  const deleteTask = (id: number): void => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  if (!isMounted) {
    return null;
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-red-100">
      <div className="w-full max-w-lg bg-white shadow-lg rounded-lg p-6">
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
          Todo List
        </h1>
        <div className="flex items-center mb-6">
          <Input
            type="text"
            placeholder="Add a new task"
            value={newTask}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setNewTask(e.target.value)}
            onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => {
              if (e.key === "Enter") {
                addTask();
              }
            }}
            className="flex-1 px-3 py-2 rounded-md border border-gray-300"
          />
          <Button
            onClick={addTask}
            className="ml-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Add
          </Button>
        </div>

        <div className="space-y-4">
          {tasks.map((task) => (
            <div
              key={task.id}
              className="flex items-center justify-between bg-gray-100 rounded-md p-4"
            >
              <div className="flex items-center">
                <Checkbox
                  checked={task.completed}
                  onCheckedChange={() => toggleTaskCompletion(task.id)}
                  className="mr-3"
                />
                {editingTaskId === task.id ? (
                  <Input
                    type="text"
                    value={editedTaskText}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      setEditedTaskText(e.target.value)
                    }
                    onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => {
                      if (e.key === "Enter") {
                        updateTask();
                      }
                    }}
                    className="flex-1 px-3 py-2 rounded-md border border-gray-300"
                  />
                ) : (
                  <span
                    className={`text-lg ${
                      task.completed
                        ? "line-through text-gray-500"
                        : "text-gray-800"
                    }`}
                  >
                    {task.text}
                  </span>
                )}
              </div>
              <div className="flex items-center space-x-2">
                {editingTaskId === task.id ? (
                  <Button
                    onClick={updateTask}
                    className="px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-700"
                  >
                    Save
                  </Button>
                ) : (
                  <Button
                    onClick={() => startEditingTask(task.id, task.text)}
                    className="px-3 py-1 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400"
                  >
                    Edit
                  </Button>
                )}
                <Button
                  onClick={() => deleteTask(task.id)}
                  className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600"
                >
                  Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
