'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import Link from 'next/link';

export default function Home() {
    const [tasks, setTasks] = useState([]);
    const [filter, setFilter] = useState('default');
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        axios.get('/api/tasks')
            .then((response) => setTasks(response.data))
            .catch((error) => console.error('Error fetching tasks:', error));
    }, []);

    const sortTasks = (tasks, filter) => {
        switch (filter) {
            case 'dueDateAsc':
                return [...tasks].sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
            case 'dueDateDesc':
                return [...tasks].sort((a, b) => new Date(b.dueDate) - new Date(a.dueDate));
            case 'alphabetical':
                return [...tasks].sort((a, b) => a.title.localeCompare(b.title));
            default:
                return tasks; // Keine Sortierung
        }
    };

    const handleFilterChange = (e) => {
        setFilter(e.target.value);
    };

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

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

    const filteredTasks = tasks.filter(task => {
        return (
            task.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (typeof task.description === 'string' &&
                task.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
            (Array.isArray(task.tags) &&
                task.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())))
        );
    });

    const sortedAndFilteredTasks = sortTasks(filteredTasks, filter);

    const renderTask = (task, isCompleted) => (
    <li
        key={task._id}
        className={`bg-teal-400 text-gray-900 p-4 rounded shadow-lg ${isCompleted ? 'opacity-30' : ''}`}
    >
        <h3 className="text-xl font-bold mb-2">{task.title}</h3>
        <p className="text-sm mb-1">{task.description}</p>
        <p className="text-sm mb-1">Priority: {task.priority}</p>
        <p className="text-sm mb-3">Due: {new Date(task.dueDate).toLocaleDateString()}</p>
        <p className="text-sm mb-3">
            Tags: {Array.isArray(task.tags) && task.tags.length > 0 ? (
                task.tags.map((tag, index) => (
                    <span
                        key={index}
                        onClick={() => setSearchQuery(tag)}
                        className="text-blue-500 cursor-pointer hover:underline"
                    >
                        #{tag}
                    </span>
                ))
            ) : (
                'No tags'
            )}
        </p>
        <div className="card-buttons">
            {!isCompleted && (
                <>
                    <Link href={`/edit/${task._id}`} className="px-3 py-1 rounded hover:bg-teal-500 hover:text-gray-900">
                        Edit
                    </Link>
                    <button
                        onClick={() => handleAction('delete', task._id)}
                        className="delete px-3 py-1 rounded bg-red-500 text-white"
                    >
                        Delete
                    </button>
                </>
            )}
            <button
                onClick={() => handleAction('toggle', task._id, task)}
                className={`complete px-3 py-1 rounded ${isCompleted ? 'bg-green-700' : 'bg-green-500'} text-white`}
            >
                {isCompleted ? 'Undo' : 'Complete'}
            </button>
        </div>
    </li>
);

    return (
        <div>
            <h1>Task Tracker</h1>
            <div className="mb-4">
                <label htmlFor="search" className="mr-2 font-bold">Search:</label>
                <input
                    id="search"
                    type="text"
                    value={searchQuery}
                    onChange={handleSearchChange}
                    placeholder="Search by title or description"
                    className="bg-gray-200 text-black px-2 py-1 rounded"
                />
            </div>

            <div className="mb-4">
                <label htmlFor="filter" className="mr-2 font-bold">Sort By:</label>
                <select
                    id="filter"
                    value={filter}
                    onChange={handleFilterChange}
                    className="bg-gray-200 text-black px-2 py-1 rounded"
                >
                    <option value="default">Default</option>
                    <option value="dueDateAsc">Due Date (Ascending)</option>
                    <option value="dueDateDesc">Due Date (Descending)</option>
                    <option value="alphabetical">Alphabetical (A–Z)</option>
                </select>
            </div>

            <div className="my-4">
                <Link
                    href="/add"
                    className="bg-teal-500 text-white px-4 py-2 rounded shadow hover:bg-teal-300"
                >
                    Add New Task
                </Link>
            </div>

            <div>
                <h2>Task List</h2>
                <ul>
                    {sortedAndFilteredTasks.some((task) => !task.completed) ? (
                        sortedAndFilteredTasks.filter((task) => !task.completed).map((task) => renderTask(task, false))
                    ) : (
                        <p>No tasks match your search.</p>
                    )}
                </ul>
            </div>
            <div>
                <h2>Completed Tasks</h2>
                <ul>
                    {sortedAndFilteredTasks.some((task) => task.completed) ? (
                        sortedAndFilteredTasks.filter((task) => task.completed).map((task) => renderTask(task, true))
                    ) : (
                        <p>No completed tasks match your search.</p>
                    )}
                </ul>
            </div>
        </div>
    );
}