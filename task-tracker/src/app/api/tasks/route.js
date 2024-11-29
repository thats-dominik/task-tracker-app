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
    } catch {
        return jsonResponse({}, 500);
    }
}

export async function POST(req) {
    try {
        await connectToDatabase();
        const newTaskData = await req.json();

        const newTask = await Task.create({
            ...newTaskData,
            description: newTaskData.description || "No description",
            tags: newTaskData.tags || [], // Standard: Leeres Array, falls keine Tags übermittelt wurden
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
        const { id, tags, ...updatedData } = await req.json(); // Tags explizit auslesen

        if (!id) return jsonResponse({ error: 'Task ID is required.' }, 400);

        // Überprüfen, ob tags enthalten sind, und sie separat aktualisieren
        const updatedTask = await Task.findByIdAndUpdate(
            id,
            { ...updatedData, ...(tags && { tags }) }, // Tags nur hinzufügen, wenn sie vorhanden sind
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
        const deletedTask = await Task.findByIdAndDelete(id);
        if (!deletedTask) return jsonResponse({}, 404);
        return jsonResponse({ message: 'Task deleted successfully' });
    } catch {
        return jsonResponse({}, 500);
    }
}

export async function PATCH(req) {
    try {
        await connectToDatabase();
        const { id, completed } = await req.json();
        if (!id || completed === undefined) return jsonResponse({}, 400);
        const updatedTask = await Task.findByIdAndUpdate(id, { completed }, { new: true });
        if (!updatedTask) return jsonResponse({}, 404);
        return jsonResponse(updatedTask);
    } catch {
        return jsonResponse({}, 500);
    }
}