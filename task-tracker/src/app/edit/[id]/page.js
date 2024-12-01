'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import '@/app/edit/[id]/page.css';

export default function EditTask({ params }) {
    const router = useRouter();

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        priority: 'Medium',
        dueDate: '',
        tags: [],
    });

    const [tagInput, setTagInput] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true); 

    useEffect(() => {
        async function fetchTask() {
            try {
                const { id } = await params;

                if (id) {
                    const response = await axios.get(`/api/tasks?id=${id}`);
                    const taskData = response.data;

                    setFormData({
                        ...taskData,
                        tags: taskData.tags || [],
                    });
                    setLoading(false);
                }
            } catch (error) {
                console.error('Error fetching task:', error);
                setError('Failed to fetch task data.');
                setLoading(false);
            }
        }

        fetchTask();
    }, [params]);

    const handleAddTag = () => {
        if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
            setFormData((prevData) => ({
                ...prevData,
                tags: [...prevData.tags, tagInput.trim()],
            }));
            setTagInput('');
        }
    };

    const handleRemoveTag = (tag) => {
        setFormData((prevData) => ({
            ...prevData,
            tags: prevData.tags.filter((t) => t !== tag),
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.put('/api/tasks', { id: formData._id, ...formData });
            router.push('/');
        } catch (error) {
            console.error('Error updating task:', error);
            setError('Failed to update task.');
        }
    };

    if (loading) {
        return (
            <div className="container">
                <h1>Loading...</h1>
            </div>
        );
    }

    return (
        <div className="container">
            <h1>Edit Task</h1>
            {error && <p className="text-red-500">{error}</p>}
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Title:</label>
                    <input
                        type="text"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        required
                    />
                </div>
                <div>
                    <label>Description:</label>
                    <textarea
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        required
                    ></textarea>
                </div>
                <div>
                    <label>Priority:</label>
                    <select
                        value={formData.priority}
                        onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                    >
                        <option value="High">High</option>
                        <option value="Medium">Medium</option>
                        <option value="Low">Low</option>
                    </select>
                </div>
                <div>
                    <label>Due Date:</label>
                    <input
                        type="date"
                        value={formData.dueDate}
                        onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                        required
                    />
                </div>
                <div>
                    <label>Tags:</label>
                    <div>
                        <input
                            type="text"
                            value={tagInput}
                            onChange={(e) => setTagInput(e.target.value)}
                            placeholder="Add a tag"
                        />
                        <button type="button" onClick={handleAddTag}>
                            Add Tag
                        </button>
                    </div>
                    <div>
                        {formData.tags.map((tag, index) => (
                            <span key={index} className="tag">
                                #{tag}
                                <button type="button" onClick={() => handleRemoveTag(tag)}>
                                    &times;
                                </button>
                            </span>
                        ))}
                    </div>
                </div>
                <button type="submit">Update Task</button>
            </form>
        </div>
    );
}