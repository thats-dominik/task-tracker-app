'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import Link from 'next/link';

export default function Home() {
    const [tasks, setTasks] = useState([]);

    // Fetch tasks from the backend API
    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const response = await axios.get('/api/tasks');
                setTasks(response.data);
            } catch (error) {
                console.error('Error fetching tasks:', error);
            }
        };

        fetchTasks();
    }, []);

    // Delete a task
    const handleDelete = async (taskId) => {
        try {
            await axios.delete('/api/tasks', { data: { id: taskId } });
            setTasks((prevTasks) => prevTasks.filter((task) => task._id !== taskId));
        } catch (error) {
            console.error('Error deleting task:', error);
        }
    };
    

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-4xl font-bold mb-6">Task Tracker</h1>

            {/* Link to Add Task Page */}
            <Link href="/add" className="text-blue-500 underline">
                Add New Task
            </Link>

            <h2 className="text-2xl font-semibold mt-6">Task List</h2>
            <ul className="mt-4">
                {/* Render Tasks */}
                {tasks.length > 0 ? (
                    tasks.map((task) => (
                        <li key={task._id} className="mb-4 p-4 border rounded shadow">
                            <h3 className="font-bold text-lg">{task.title}</h3>
                            <p className="text-gray-700">{task.description}</p>
                            <p className="text-sm text-gray-600">Priority: {task.priority}</p>
                            <p className="text-sm text-gray-600">
                                Due: {new Date(task.dueDate).toLocaleDateString()}
                            </p>

                            {/* Edit and Delete Links */}
                            <div className="mt-2">
                                <Link
                                    href={`/edit/${task._id}`}
                                    className="text-blue-500 underline hover:text-blue-700"
                                >
                                    Edit
                                </Link>
                                <button
                                    onClick={() => handleDelete(task._id)}
                                    className="text-red-500 ml-4 hover:text-red-700"
                                >
                                    Delete
                                </button>
                            </div>
                        </li>
                    ))
                ) : (
                    <p className="text-gray-500 mt-4">No tasks found.</p>
                )}
            </ul>
        </div>
    );
}