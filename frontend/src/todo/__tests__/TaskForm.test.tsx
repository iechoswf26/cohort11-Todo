import {render, screen} from "@testing-library/react";
import {TaskForm} from "../TaskForm.tsx";
import {expect} from "vitest";
import {userEvent} from "@testing-library/user-event";
import * as taskApi from "../TaskService.ts";
import type {Category} from "../TaskType.ts";

describe('Task Form', () => {
    const user = userEvent.setup();

    it('should display form heading and fields', () => {
        render(<TaskForm/>);

        expect(screen.getByRole('heading', {name: /task form/i})).toBeInTheDocument();
        expect(screen.getByLabelText(/Title/i)).toBeInTheDocument();
        expect(screen.getByRole('textbox', {name: /title/i})).toBeInTheDocument();
        expect(screen.getByRole('textbox', {name: /description/i})).toBeInTheDocument();
        expect(screen.getByRole('button', {name: /add task/i})).toBeInTheDocument();
    });

    describe('Mock Task Form', () => {
        vi.mock('../TaskService.ts');

        const category: Category = {id:1, label:'active'};
        const initialTask =
            { id: 1, title: 'First Task', description: 'get form component built.', category: category };

        const initialTaskList = [{ id: 1, title: 'First Task', description: 'test form component.', category:category }, { id: 2, title: 'Secondi Task', description: 'get form component built.', category:category }]
        // beforeEach(() => {
        //     vi.clearAllMocks();
        // });
        // afterEach(() => {
        //     vi.restoreAllMocks()
        // })

        it('should be able to type into fields and click submit', async () => {

            //vi.mocked(taskApi.axiosSaveTask).mockResolvedValue(mockData);
            vi.spyOn(taskApi, 'axiosGetAllTasks').mockResolvedValue(initialTaskList);

//            const handleSubmit = vi.fn();

            const mockCreateTask = vi.spyOn(taskApi, 'axiosSaveTask').mockResolvedValueOnce({id: 1, title: 'Feed cat', description: 'feed boots wet food', category:{id:1, label:'active'}});

            render(<TaskForm/>)
            const title = screen.getByRole('textbox', {name: /title/i});
            const description = screen.getByRole('textbox', {name: /description/i});
            const submit = screen.getByRole('button', {name: /add task/i});

            await user.type(title, 'new title');
            expect(title).toHaveValue('new title');

            await user.type(description, 'new description');
            expect(description).toHaveValue('new description');

            await user.click(submit);
            expect(mockCreateTask).toHaveBeenCalledWith(initialTask)
            expect(mockCreateTask).toHaveBeenCalledOnce();

        });

        it('should save new task when add task is clicked', () => {
            //
        });
    });
});