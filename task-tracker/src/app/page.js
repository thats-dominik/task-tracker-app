'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import Link from 'next/link';

export default function Home() {
    const [tasks, setTasks] = useState([]);

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

    const handleDelete = async (taskId) => {
        try {
            await axios.delete('/api/tasks', { data: { id: taskId } });
            setTasks((prevTasks) => prevTasks.filter((task) => task._id !== taskId));
        } catch (error) {
            console.error('Error deleting task:', error);
        }
    };

    return (
        <div className="bg-gray-900 min-h-screen text-white flex flex-col items-center">
            {/* Page Header */}
            <h1 className="text-4xl font-bold my-8 text-teal-300">Task Tracker</h1>

            {/* Add New Task Button */}
            <div className="mb-8">
                <Link
                    href="/add"
                    className="bg-teal-400 text-gray-900 px-4 py-2 rounded shadow hover:bg-teal-300"
                >
                    Add New Task
                </Link>
            </div>

            {/* Task List */}
            <div className="w-full max-w-4xl px-4">
                <h2 className="text-2xl font-semibold mb-4 text-white">Task List</h2>
                <ul className="space-y-4">
                    {tasks.length > 0 ? (
                        tasks.map((task) => (
                            <li
                                key={task._id}
                                className="bg-teal-400 text-gray-900 p-4 rounded shadow-lg"
                            >
                                <h3 className="text-xl font-bold mb-2">{task.title}</h3>
                                <p className="text-sm mb-1">{task.description}</p>
                                <p className="text-sm mb-1">Priority: {task.priority}</p>
                                <p className="text-sm mb-3">
                                    Due: {new Date(task.dueDate).toLocaleDateString()}
                                </p>

                                <div className="flex justify-between">
                                    <Link
                                        href={`/edit/${task._id}`}
                                        className="bg-gray-900 text-teal-400 px-3 py-1 rounded hover:bg-teal-500 hover:text-gray-900"
                                    >
                                        Edit
                                    </Link>
                                    <button
                                        onClick={() => handleDelete(task._id)}
                                        className="bg-red-500 text-gray-900 px-3 py-1 rounded hover:bg-red-700 hover:text-white"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </li>
                        ))
                    ) : (
                        <p className="text-gray-500">No tasks found.</p>
                    )}
                </ul>
            </div>
        </div>
    );
}