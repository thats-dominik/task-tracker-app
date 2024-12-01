'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import Link from 'next/link';
import SearchIcon from '@/icons/search.svg';
import FilterIcon from '@/icons/filter.svg';

export default function Home() {
    const [tasks, setTasks] = useState([]);
    const [filter, setFilter] = useState('default');
    const [searchQuery, setSearchQuery] = useState('');
    const [searchVisible, setSearchVisible] = useState(false);
    const [filterVisible, setFilterVisible] = useState(false);

    useEffect(() => {
        axios
            .get('/api/tasks')
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
            case 'priority':
                const priorityMap = { High: 1, Medium: 2, Low: 3 };
                return [...tasks].sort((a, b) => priorityMap[a.priority] - priorityMap[b.priority]);
            default:
                return tasks;
        }
    };

    const handleFilterChange = (e) => {
        const selectedFilter = e.target.value;
        setFilter(selectedFilter);
        const sortedTasks = sortTasks(tasks, selectedFilter);
        setTasks(sortedTasks);
    };

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const toggleSearch = () => {
        setSearchVisible(!searchVisible);
    };

    const toggleFilter = () => {
        setFilterVisible(!filterVisible);
    };

    const handleToggleComplete = async (taskId, isCompleted) => {
        try {
            const response = await axios.patch('/api/tasks', {
                id: taskId,
                completed: isCompleted,
            });

            if (response.status === 200) {
                setTasks((prevTasks) =>
                    prevTasks.map((task) =>
                        task._id === taskId ? { ...task, completed: isCompleted } : task
                    )
                );
            } else {
                console.error('Failed to update task:', response.statusText);
            }
        } catch (error) {
            console.error('Error updating task:', error);
        }
    };

    const handleDelete = async (taskId) => {
        try {
            await axios.delete('/api/tasks', { data: { id: taskId } });
            setTasks((prevTasks) => prevTasks.filter((task) => task._id !== taskId));
        } catch (error) {
            console.error('Error deleting task:', error);
        }
    };

    const filteredTasks = tasks.filter(
        (task) =>
            task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (task.description && task.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
            (Array.isArray(task.tags) && task.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase())))
    );

    const sortedAndFilteredTasks = sortTasks(filteredTasks, filter);
    const completedTasks = sortedAndFilteredTasks.filter((task) => task.completed);
    const activeTasks = sortedAndFilteredTasks.filter((task) => !task.completed);

    const renderTask = (task, isCompleted) => (
        <li
            key={task._id}
            className={`card ${isCompleted ? 'opacity-50' : ''}`}
        >
            <h3 className="text-lg font-bold mb-1">{task.title}</h3>
            <p className="mb-2 text-sm">{task.description}</p>
            <p className="text-xs text-gray-500">Due: {new Date(task.dueDate).toLocaleDateString()}</p>
            <p className="text-xs text-gray-500">
                Tags: {task.tags && task.tags.length > 0 ? task.tags.join(', ') : 'No tags'}
            </p>
            <p className="priority">Priority: {task.priority || 'Normal'}</p>
            <div className="card-buttons">
                <Link href={`/edit/${task._id}`} className="btn-primary">Edit</Link>
                <button
                    className="delete-btn"
                    onClick={() => handleDelete(task._id)}
                >
                    Delete
                </button>
                <button
                    className="complete-btn"
                    onClick={() => handleToggleComplete(task._id, !task.completed)}
                >
                    {task.completed ? 'Undo' : 'Complete'}
                </button>
            </div>
        </li>
    );

    return (
        <div className="container">
            <h1 className="text-center text-4xl font-bold text-secondary mb-6">Task Tracker</h1>

            <div className="flex justify-between items-center mb-4">
                <Link href="/add" className="btn-add">Add New Task</Link>
                <div className="flex space-x-4">
                <div className={`relative search-container ${filterVisible ? 'shifted' : ''}`}>
                    <button onClick={toggleSearch} className="btn-secondary">
                        <SearchIcon width={24} height={24} alt="Search" />
                    </button>
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={handleSearchChange}
                        placeholder="Search by title or tags"
                        className={`search-input ${searchVisible ? 'show' : ''}`}
                    />
                </div>
                <div className="relative filter-container">
                    <button onClick={toggleFilter} className="btn-secondary">
                        <FilterIcon width={24} height={24} alt="Filter" />
                    </button>
                    <select
                        value={filter}
                        onChange={handleFilterChange}
                        className={`filter-input ${filterVisible ? 'show' : ''}`}
                    >
                        <option value="default">Default</option>
                        <option value="dueDateAsc">Due Date (Ascending)</option>
                        <option value="dueDateDesc">Due Date (Descending)</option>
                        <option value="alphabetical">Alphabetical</option>
                        <option value="priority">By Priority</option>
                    </select>
                </div>
            </div>
            </div>

            <h2 className="text-2xl font-semibold text-secondary mt-6">Active Tasks</h2>
            <ul className="card-container">
                {activeTasks.length > 0 ? (
                    activeTasks.map((task) => renderTask(task, false))
                ) : (
                    <p>No active tasks found</p>
                )}
            </ul>

            <h2 className="text-2xl font-semibold text-secondary mt-6">Completed Tasks</h2>
            <ul className="card-container">
                {completedTasks.length > 0 ? (
                    completedTasks.map((task) => renderTask(task, true))
                ) : (
                    <p>No completed tasks found</p>
                )}
            </ul>
        </div>
    );
}