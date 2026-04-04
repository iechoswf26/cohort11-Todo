import {useEffect, useState} from 'react';
import {TaskItem} from "./TaskItem.tsx";
import type {Task} from "./TaskType.ts";
import {axiosGetAllTasks, getAllTasks} from "./TaskService.ts";

export const TaskPage = () => {
    const [tasks, setTasks] = useState<Task[]>([]);

    const refreshData = () => {
        axiosGetAllTasks().then(setTasks);
    };

    useEffect(() => {
       refreshData();
    }, [])

    return (
        <>
        <h1>Task List</h1>
            <ul>{Array.isArray(tasks) ? (
                tasks.map(task =>
                    <TaskItem
                        key={task.id}
                        initialTask={task}
                    />
                )) : <div>No Tasks found.</div> }
            </ul>

        </>
    );
};
