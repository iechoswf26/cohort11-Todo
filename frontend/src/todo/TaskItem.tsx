import type {Task} from "./TaskType.ts";

type TaskItemProps = {
    initialTask: Task
}

export const TaskItem = ({initialTask}: TaskItemProps) => {

    return (
            <li className='p-1' aria-label={`Task ${initialTask.id}`} id={initialTask.id}>{initialTask.title}: {initialTask.description}</li>

    );
};