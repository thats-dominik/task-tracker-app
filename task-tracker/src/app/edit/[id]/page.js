'use client';

import {useState, useEffect} from 'react';
import {useRouter} from 'next/navigation';
import axios from 'axios';

export default function EditTask({ params }) {
    const {id} = params;

    const [formData, setFormData] = useState({
        title:'',
        description:'',
        priority:'Medium',
        dueDate:'',
    });

    const router = useRouter();

    useEffect(() => {
        if (id) {
            axios.get('/api/tasks/${id}')
            .then((response) => setFormData(response.data))
            .catch((error) => console.error('error updating task:', error));
    }
}, [id]);

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.put('/api/tasks/${id}', formData)
        .then(() => router.push('/'))
        .catch((error) => console.error('error updating task:', error));
    };

    return (
        <div>
            <h1 className="text-2x1 font-bold mb-4">edit task</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className='block font-medium'>title:</label>
                    <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({...setFormData, title: e.target.value})}
                    />
                </div>
                <div>
                    <label className="block font-medium">description:</label>
                    <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({...setFormData, description: e.target.value})}
                    ></textarea>
                </div>
                <div>
                <label className="block font-medium">priority:</label>
                <select
                value={formData.priority}
                onChange={(e) => setFormData ({...setFormData, priority: e.target.value})}
                >
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                </select>
                </div>
                <div>
                <label className='block font-medium'>
                    <input
                    type="date"
                    value={formData.dueDate}
                    onChange={(e) => setFormData({...setFormData, dueDate: e.target.value})}
                    />
                </label>
                </div>
                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
                    update task
                </button>
            </form>
        </div>
    );
}