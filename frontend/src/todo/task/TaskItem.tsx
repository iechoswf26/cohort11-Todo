import type {Task} from './TaskType.ts';

type TaskItemProps = {
    initialTask: Task;
};

const categoryBorderMap: Record<string, string> = {
    active: 'border-blue-500',
    closed: 'border-red-500',
    delayed: 'border-red-500',
    Default: 'border-gray-300',
};

export const TaskItem = ({initialTask}: TaskItemProps) => {
    const borderColor =
        categoryBorderMap[initialTask.category.label] ||
        categoryBorderMap.Default;

    return (
        <li
            className={`${borderColor} p-1 card border-l-14`}
            aria-label={`Task ${initialTask.id}`}
            id={initialTask.id}
        >
            <b>{initialTask.title}</b><br/> {initialTask.description}
            <div className={`rounded-pill text-xs px-2 py-1 ${borderColor}`}>{initialTask.category.label}</div>
            <input type={'button'} value={'Delete'} className={'rounded-full border-2 border-red-500'} />
        </li>
    );
};
