'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

export default function EditTask({ params }) {
    const [id, setId] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        priority: 'Medium',
        dueDate: '',
        tags: [],
    });

    const router = useRouter();

    // Unwrap params using useEffect
    useEffect(() => {
        async function fetchParamsAndTask() {
            try {
                const resolvedParams = await params; // Await params as a promise
                const taskId = resolvedParams?.id; // Access ID safely
                setId(taskId);

                if (taskId) {
                    const response = await axios.get(`/api/tasks?id=${taskId}`);
                    setFormData(response.data);
                } else {
                    console.error('Task ID is missing.');
                }
            } catch (error) {
                console.error('Error fetching task data:', error);
            }
        }

        fetchParamsAndTask();
    }, [params]);

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.put('/api/tasks', { id, ...formData });
            router.push('/'); // Redirect to home page
        } catch (error) {
            console.error('Error updating task:', error);
        }
    };

    return (
        <div>
            <h1 className="text-2x1 font-bold mb-4">Edit Task</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block font-medium">Title:</label>
                    <input
                        type="text"
                        value={formData.title}
                        onChange={(e) =>
                            setFormData({ ...formData, title: e.target.value })
                        }
                        className="w-full p-2 border rounded"
                        required
                    />
                </div>
                <div>
                    <label className="block font-medium">Description:</label>
                    <textarea
                        value={formData.description}
                        onChange={(e) =>
                            setFormData({ ...formData, description: e.target.value })
                        }
                        className="w-full p-2 border rounded"
                        required
                    ></textarea>
                </div>
                <div>
                    <label className="block font-medium">Priority:</label>
                    <select
                        value={formData.priority}
                        onChange={(e) =>
                            setFormData({ ...formData, priority: e.target.value })
                        }
                        className="w-full p-2 border rounded"
                        required
                    >
                        <option value="High">High</option>
                        <option value="Medium">Medium</option>
                        <option value="Low">Low</option>
                    </select>
                </div>
                <div>
                    <label className="block font-medium">Due Date:</label>
                    <input
                        type="date"
                        value={formData.dueDate?.slice(0, 10)} // Format date correctly
                        onChange={(e) =>
                            setFormData({ ...formData, dueDate: e.target.value })
                        }
                        className="w-full p-2 border rounded"
                        required
                    />
                </div>
                <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                    Update Task
                </button>
            </form>
        </div>
    );
}