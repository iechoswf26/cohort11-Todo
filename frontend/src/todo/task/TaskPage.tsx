import {useEffect, useState} from 'react';
import {TaskItem} from './TaskItem.tsx';
import {axiosGetAllTasks} from './TaskService.ts';
import type {Task} from './TaskType.ts';
import {TaskForm} from "./TaskForm.tsx";

export const TaskPage = () => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const refreshData = async () => {
        try {
            const data = await axiosGetAllTasks();
            setTasks(data);
        } catch (error) {
            console.error('Failed to fetch tasks:', error);
        }
    };

    const handleDelete = (id: number) => {
        deleteTask(id).then(refreshData);
    }

    useEffect(() => {
        refreshData();
    }, []);

    return (
        <>
            <h2 className={'font-extrabold'}>Task List</h2>
            <ul id={"list"} className={'grid grid-cols-3 gap-4'}>
                {tasks.length > 0 ? (
                    tasks.map((task) => <TaskItem key={task.id} initialTask={task}/>)
                ) : (
                    <li>No Tasks found.</li>
                )}
            </ul>
            <button onClick={() => setIsModalOpen(true)}
                    className="rounded-lg bg-blue-500 mx-auto px-4 py-2 my-auto text-sm text-white hover:bg-blue-700">Add
                Task
            </button>

            <TaskForm isOpen={isModalOpen}
                      onClose={() => setIsModalOpen(false)}
                      onSuccess={refreshData}
            />
        </>
    );
};
