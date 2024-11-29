import mongoose from 'mongoose';

const TaskSchema = new mongoose.Schema({
    title: {type: String, required: true },
    description: {type: String},
    priority: {type: String, enum: ['High', 'Medium', 'Low'], default: 'Medium'},
    dueDate: {type: Date},
    completed: {type: Boolean, default: false},
    tags: {type: [String], default: []},
});

const Task = mongoose.models.Task || mongoose.model('Task', TaskSchema);
export default Task;