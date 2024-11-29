import connectToDatabase from '@/lib/mongodb';
import Task from '@/models/task';

const jsonResponse = (data, status = 200) => 
    new Response(JSON.stringify(data), { status, headers: { 'Content-Type': 'application/json' } });

export async function GET(req) {
    try {
        await connectToDatabase();
        const id = new URL(req.url).searchParams.get('id');
        const tasks = id ? await Task.findById(id) : await Task.find();
        if (id && !tasks) return jsonResponse({ error: 'Task not found' }, 404);
        return jsonResponse(tasks);
    } catch (error) {
        console.error('Error fetching tasks:', error);
        return jsonResponse({ error: 'Failed to fetch tasks' }, 500);
    }
}

export async function POST(req) {
    try {
        await connectToDatabase();
        const newTask = await Task.create(await req.json());
        return jsonResponse(newTask, 201);
    } catch (error) {
        console.error('Error creating task:', error);
        return jsonResponse({ error: 'Failed to create task' }, 500);
    }
}

export async function PUT(req) {
    try {
        await connectToDatabase();
        const { id, completed, ...updatedData } = await req.json();
        const updatedTask = await Task.findByIdAndUpdate(
            id,
            completed !== undefined ? { completed } : updatedData,
            { new: true }
        );
        if (!updatedTask) return jsonResponse({ error: 'Task not found' }, 404);
        return jsonResponse(updatedTask);
    } catch (error) {
        console.error('Error updating task:', error);
        return jsonResponse({ error: 'Failed to update task' }, 500);
    }
}

export async function DELETE(req) {
    try {
        await connectToDatabase();
        const { id } = await req.json();
        const deletedTask = await Task.findByIdAndDelete(id);
        if (!deletedTask) return jsonResponse({ error: 'Task not found' }, 404);
        return jsonResponse({ message: 'Task deleted successfully' });
    } catch (error) {
        console.error('Error deleting task:', error);
        return jsonResponse({ error: 'Failed to delete task' }, 500);
    }
}

export async function PATCH(req) {
    try {
        await connectToDatabase();
        const { id, completed } = await req.json();
        if (!id || completed === undefined) return jsonResponse({ error: 'Invalid data: ID and completed status are required' }, 400);
        const updatedTask = await Task.findByIdAndUpdate(id, { completed }, { new: true });
        if (!updatedTask) return jsonResponse({ error: 'Task not found' }, 404);
        return jsonResponse(updatedTask);
    } catch (error) {
        console.error('Error updating task status:', error);
        return jsonResponse({ error: 'Failed to update task status' }, 500);
    }
}