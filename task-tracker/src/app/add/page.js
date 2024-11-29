'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AddTask() {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        priority: 'Medium',
        dueDate: '',
        tags: [],
    });
    const [tagInput, setTagInput] = useState('');
    const router = useRouter();

    const handleAddTag = () => {
        if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
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
            const response = await fetch('/api/tasks', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
            if (response.ok) {
                router.push('/');
            }
        } catch (error) {
            console.error('Error creating task:', error);
        }
    };

    return (
        <div className="container">
            <h1>Add Task</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
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
                        required
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
                            <span key={index}>
                                #{tag}
                                <button type="button" onClick={() => handleRemoveTag(tag)}>
                                    ×
                                </button>
                            </span>
                        ))}
                    </div>
                </div>
                <button type="submit">Add Task</button>
            </form>
        </div>
    );
}