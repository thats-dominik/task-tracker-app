import connectToDatabase from '@/lib/mongodb';
import Task from '@/models/task';

const jsonResponse = (data, status = 200) => 
    new Response(JSON.stringify(data), { status, headers: { 'Content-Type': 'application/json' } });

export async function GET(req) {
    try {
        await connectToDatabase();
        const id = new URL(req.url).searchParams.get('id');
        const tasks = id ? await Task.findById(id) : await Task.find();
        if (id && !tasks) return jsonResponse({}, 404);
        return jsonResponse(tasks);
    } catch (error) {
        console.error('Error fetching tasks:', error);
        return jsonResponse({ error: 'Failed to fetch tasks' }, 500);
    }
}

export async function POST(req) {
    try {
        await connectToDatabase();
        const newTaskData = await req.json();

        const newTask = await Task.create({
            ...newTaskData,
            description: newTaskData.description || "No description",
            completed: newTaskData.completed || false,
            tags: newTaskData.tags || [],
        });

        return jsonResponse(newTask, 201);
    } catch (error) {
        console.error("Error creating task:", error);
        return jsonResponse({ error: "Failed to create task" }, 500);
    }
}

export async function PUT(req) {
    try {
        await connectToDatabase();
        const { id, tags, ...updatedData } = await req.json();

        if (!id) return jsonResponse({ error: 'Task ID is required.' }, 400);

        const updatedTask = await Task.findByIdAndUpdate(
            id,
            { ...updatedData, ...(tags && { tags }) },
            { new: true }
        );

        return updatedTask
            ? jsonResponse(updatedTask)
            : jsonResponse({ error: 'Task not found.' }, 404);
    } catch (error) {
        console.error('Error updating task:', error);
        return jsonResponse({ error: 'Failed to update task.' }, 500);
    }
}

export async function DELETE(req) {
    try {
        await connectToDatabase();
        const { id } = await req.json();
        if (!id) return jsonResponse({ error: 'Task ID is required.' }, 400);

        const deletedTask = await Task.findByIdAndDelete(id);
        if (!deletedTask) return jsonResponse({ error: 'Task not found.' }, 404);

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
        if (!id || completed === undefined) {
            return jsonResponse({ error: 'Task ID and completed status are required.' }, 400);
        }

        const updatedTask = await Task.findByIdAndUpdate(
            id,
            { completed },
            { new: true }
        );

        return updatedTask
            ? jsonResponse(updatedTask)
            : jsonResponse({ error: 'Task not found.' }, 404);
    } catch (error) {
        console.error('Error updating task completion status:', error);
        return jsonResponse({ error: 'Failed to update task completion status.' }, 500);
    }
}