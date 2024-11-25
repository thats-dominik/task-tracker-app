import connectToDatabase from '@/lib/mongodb';
import Task from '@/models/task';

export async function GET(req) {
    try {
        await connectToDatabase();

        const url = new URL(req.url);
        const id = url.searchParams.get('id'); // ID aus Query-Param extrahieren

        if (id) {
            // Fetch einzelner Task
            const task = await Task.findById(id);
            if (!task) {
                return new Response(JSON.stringify({ error: 'Task not found' }), {
                    status: 404,
                });
            }
            return new Response(JSON.stringify(task), {
                status: 200,
                headers: { 'Content-Type': 'application/json' },
            });
        } else {
            // Fetch aller Tasks
            const tasks = await Task.find();
            return new Response(JSON.stringify(tasks), {
                status: 200,
                headers: { 'Content-Type': 'application/json' },
            });
        }
    } catch (error) {
        console.error('Error fetching tasks:', error);
        return new Response(JSON.stringify({ error: 'Failed to fetch tasks' }), {
            status: 500,
        });
    }
}

export async function POST(req) {
    try {
        await connectToDatabase();
        const body = await req.json();
        const newTask = await Task.create(body);
        return new Response(JSON.stringify(newTask), {
            status: 201,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        console.error('Error creating task:', error);
        return new Response(JSON.stringify({ error: 'Failed to create task' }), {
            status: 500,
        });
    }
}

export async function PUT(req) {
    try {
        await connectToDatabase();
        const { id, ...updatedData } = await req.json();

        const updatedTask = await Task.findByIdAndUpdate(id, updatedData, {
            new: true,
        });

        if (!updatedTask) {
            return new Response(JSON.stringify({ error: 'Task not found' }), {
                status: 404,
            });
        }

        return new Response(JSON.stringify(updatedTask), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        console.error('Error updating task:', error);
        return new Response(JSON.stringify({ error: 'Failed to update task' }), {
            status: 500,
        });
    }
}

export async function DELETE(req) {
    try {
        await connectToDatabase();
        const { id } = await req.json();

        const deletedTask = await Task.findByIdAndDelete(id);

        if (!deletedTask) {
            return new Response(JSON.stringify({ error: 'Task not found' }), {
                status: 404,
            });
        }

        return new Response(JSON.stringify({ message: 'Task deleted successfully' }), {
            status: 200,
        });
    } catch (error) {
        console.error('Error deleting task:', error);
        return new Response(JSON.stringify({ error: 'Failed to delete task' }), {
            status: 500,
        });
    }
}