'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import Link from 'next/link';

export default function Home() {
    const [tasks, setTasks] = useState([]);

    useEffect(() => {
        axios.get('/api/tasks')
            .then((response) => setTasks(response.data))
            .catch((error) => console.error('Error fetching tasks:', error));
    }, []);

    const handleAction = async (action, taskId, data) => {
        try {
            if (action === 'delete') {
                await axios.delete('/api/tasks', { data: { id: taskId } });
                setTasks((prev) => prev.filter((task) => task._id !== taskId));
            } else if (action === 'toggle') {
                const updatedStatus = !data.completed;
                await axios.patch('/api/tasks', { id: taskId, completed: updatedStatus });
                setTasks((prev) =>
                    prev.map((task) =>
                        task._id === taskId ? { ...task, completed: updatedStatus } : task
                    )
                );
            }
        } catch (error) {
            console.error(`Error performing ${action}:`, error);
        }
    };

    const renderTask = (task, isCompleted) => (
        <li
            key={task._id}
            className={`bg-teal-400 text-gray-900 p-4 rounded shadow-lg ${isCompleted ? 'opacity-30' : ''}`}
        >
            <h3 className="text-xl font-bold mb-2">{task.title}</h3>
            <p className="text-sm mb-1">{task.description}</p>
            <p className="text-sm mb-1">Priority: {task.priority}</p>
            <p className="text-sm mb-3">Due: {new Date(task.dueDate).toLocaleDateString()}</p>
            <div className="card-buttons">
                {!isCompleted && (
                    <>
                        <Link href={`/edit/${task._id}`} className="px-3 py-1 rounded hover:bg-teal-500 hover:text-gray-900">
                            Edit
                        </Link>
                        <button
                            onClick={() => handleAction('delete', task._id)}
                            className="delete px-3 py-1 rounded"
                        >
                            Delete
                        </button>
                    </>
                )}
                <button
                    onClick={() => handleAction('toggle', task._id, task)}
                    className="complete px-3 py-1 rounded"
                >
                    {isCompleted ? 'Undo' : 'Complete'}
                </button>
            </div>
        </li>
    );

    return (
        <div>
            <h1>Task Tracker</h1>
            <div>
                <Link href="/add" className="add-task-btn bg-teal-400 text-gray-900 px-4 py-2 rounded shadow hover:bg-teal-300">
                    Add New Task
                </Link>
            </div>
            <div>
                <h2>Task List</h2>
                <ul>
                    {tasks.some((task) => !task.completed) ? (
                        tasks.filter((task) => !task.completed).map((task) => renderTask(task, false))
                    ) : (
                        <p>No tasks found.</p>
                    )}
                </ul>
            </div>
            <div>
                <h2>Completed Tasks</h2>
                <ul>
                    {tasks.some((task) => task.completed) ? (
                        tasks.filter((task) => task.completed).map((task) => renderTask(task, true))
                    ) : (
                        <p>No completed tasks found.</p>
                    )}
                </ul>
            </div>
        </div>
    );
}