import {useForm} from "react-hook-form";
import * as Yup from "yup";
import {number, string} from "yup";
import {axiosSaveTask} from "./TaskService.ts";
import type {Task} from "./TaskType.ts";
import {yupResolver} from "@hookform/resolvers/yup/src";

const validationSchema = Yup.object({
        id: number(),
        title: string().required('Title is required.'),
        description: string().required('Description is required.'),
    }
);

export const TaskForm = () => {
    const {
        register,
        handleSubmit,
        formState: {errors}
    } = useForm<Task>({
        resolver: yupResolver(validationSchema)
    });

    const onSubmit = (data: Task) => {
        axiosSaveTask(data);
    }

    return (
        <>
            <h2>Task Form</h2>
            <form onSubmit={handleSubmit(data => onSubmit(data))} method={'POST'}>
                <label htmlFor={'Title'}>Title</label>
                <input id={'Title'} type={'text'} {...register('title')}/>

                <label htmlFor={'Description'}>Description</label>
                <input id={'Description'} type={'text'} {...register('description')} />

                <input type={'hidden'} value={1} {...register('category.id')}/>
                <input type={'hidden'} value={'active'} {...register('category.label')}/>

                <input type={'submit'} value={'Add Task'}/>
            </form>
        </>
    );
}
