'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { use } from 'react';
import axios from 'axios';

export default function EditTask({ params }) {
    const resolvedParams = use(params);
    const id = resolvedParams?.id;
    const router = useRouter();

    // Initialisiere tags korrekt als leeres Array
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        priority: 'Medium',
        dueDate: '',
        tags: [], // Tags korrekt initialisiert
    });

    const [tagInput, setTagInput] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        if (id) {
            axios
                .get(`/api/tasks?id=${id}`)
                .then((response) => {
                    const taskData = response.data;
                    // Stelle sicher, dass tags immer ein Array ist
                    taskData.tags = taskData.tags || [];
                    setFormData(taskData);
                })
                .catch((error) => {
                    console.error('Error fetching task:', error);
                    setError('Failed to fetch task data.');
                });
        }
    }, [id]);

    const handleAddTag = () => {
        if (
            tagInput.trim() && 
            Array.isArray(formData.tags) && 
            !formData.tags.includes(tagInput.trim())
        ) {
            setFormData({ ...formData, tags: [...formData.tags, tagInput.trim()] });
            setTagInput('');
        }
    };

    const handleRemoveTag = (tag) => {
        setFormData({ ...formData, tags: formData.tags.filter((t) => t !== tag) });
    };
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.put('/api/tasks', { id, ...formData });
            router.push('/'); // Zurück zur Hauptseite
        } catch (error) {
            console.error('Error updating task:', error);
        }
    };

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
                        {formData.tags.length > 0 &&
                            formData.tags.map((tag, index) => (
                                <span key={index} className="tag">
                                    #{tag}{' '}
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