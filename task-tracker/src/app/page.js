'use client';

import {useState, useEffect} from 'react';
import axios from 'axios';
import Link from 'next/link';

export default function Home() {
    const [tasks, setTasks] = useState([]);

    useEffect(() => {
        axios.get('/api/tasks')
        .then((response) => setTasks(response.data))
        .catch((error) => console.error('error fetching tasks:', error));
    }, []);

    return (
        <div>
            <h1 className="text-2x1 font-bold mb-4">task list</h1>
            <Link href="/add" className="text-blue-500 hover_underline">
            </Link>
            <ul className="mt-4">
                {tasks.map((task) => (
                    <li key={task._id} className="mb-4 border-b pb-2">
                        <h3 className="font-semibold">{task.title}</h3>
                        <p>{task.description}</p>
                        <p>priority: {task.priority}</p>
                        <p>due:{new Date(task.dueDate).toLocaleDateString()}</p>
                        <Link href={'/edit/${task._id}'} className="text-blue-500 hover:underline">
                        edit
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}