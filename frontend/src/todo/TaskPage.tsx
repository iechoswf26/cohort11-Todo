import {useEffect, useState} from 'react';
import {TaskItem} from './TaskItem.tsx';
import {axiosGetAllTasks} from './TaskService.ts';
import type {Task} from './TaskType.ts';

export const TaskPage = () => {
    const [tasks, setTasks] = useState<Task[]>([]);

    const refreshData = async () => {
        try {
            const data = await axiosGetAllTasks();
            setTasks(data);
        } catch (error) {
            console.error('Failed to fetch tasks:', error);
        }
    };

    useEffect(() => {
        refreshData();
    }, []);

    return (
        <>
            <h1>Task List</h1>
            <ul>
                {tasks.length > 0 ? (
                    tasks.map((task) => <TaskItem key={task.id} initialTask={task}/>)
                ) : (
                    <li>No Tasks found.</li>
                )}
            </ul>
        </>
    );
};
