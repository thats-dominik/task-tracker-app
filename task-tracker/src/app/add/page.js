'use client';

import {useState} from 'react';
import {useRouter} from 'next/navigation';
import axios from 'axios';

export default function AddTask() {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        priority: 'Medium',
        dueDate: '',
    });

    const router = useRouter();

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.post('/api/tasks', formData)
        .then(() => router.push('/'))
        .catch((error) => console.error('error adding task:', error));
    };

    return (
        <div>
            <h1 className="text-2x1 font-bold mb-4">add new task</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block font-medium">title:</label>
                    <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    />
                </div>
                <div>
                    <label className="block font-medium">description:</label>
                    <textarea
                    value={fromData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    ></textarea>
                </div>
                <div>
                    <label className="block font-medium">priority:</label>
                    <select
                    value={formData.priority}
                    onChange={(e) => setFormData({...formData, priority: e.target.value})}>
                        <option value="High">High</option>
                        <option value="Medium">Medium</option>
                        <option value="Low">Low</option>
                    </select>
                </div>
                <div>
                    <label className="block font-medium">due date:</label>
                    <input
                    type="date"
                    value={formData.dueDate}
                    onChange={(e) => setFormData({...formData, dueDate: e.target.value})}
                    />
                </div>
                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
                    add task
                </button>
            </form>
        </div>
    )
}