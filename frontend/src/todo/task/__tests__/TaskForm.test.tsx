import {render, screen, waitFor} from "@testing-library/react";
import {TaskForm} from "../TaskForm.tsx";
import {expect} from "vitest";
import {userEvent} from "@testing-library/user-event";
import * as taskApi from "../TaskService.ts";
import type {Category} from "../TaskType.ts";

vi.mock('../TaskService.ts');

describe('Task Form', () => {
    const user = userEvent.setup();
    const setIsModalOpen = (isOpen: boolean) => {
        false
    };

    it('should display form heading and fields', () => {
        render(<TaskForm onClose={() => setIsModalOpen(false)} isOpen={true}/>);

        expect(screen.getByRole('heading', {name: /create task/i})).toBeInTheDocument();
        expect(screen.getByLabelText(/Title/i)).toBeInTheDocument();
        expect(screen.getByRole('textbox', {name: /title/i})).toBeInTheDocument();
        expect(screen.getByRole('textbox', {name: /description/i})).toBeInTheDocument();
        expect(screen.getByRole('button', {name: /add task/i})).toBeInTheDocument();
    });

    describe('Mock Task Form', () => {

        const category: Category = {id: '1', label: 'active'};
        const initialTask =
            {id: 1, title: 'First Task', description: 'Get form component built.', category: category};

        const initialTaskList = [initialTask, {
            id: 2,
            title: 'Second Task',
            description: 'Get form component built.',
            category: category
        }]

        beforeEach(() => {
            vi.clearAllMocks();
        });
        afterEach(() => {
            vi.restoreAllMocks()
        })

        it('should be able to type into fields and click submit', async () => {
            //vi.mocked(taskApi.axiosSaveTask).mockResolvedValue(mockData);
            vi.spyOn(taskApi, 'axiosGetAllTasks').mockResolvedValue(initialTaskList);

            const mockCreateTask = vi.spyOn(taskApi, 'axiosSaveTask').mockResolvedValueOnce({
                id: '1',
                title: 'Third Task',
                description: 'Feed Boots wet food',
                category: {id: '1', label: 'active'}
            });

            render(<TaskForm onClose={() => setIsModalOpen(false)} isOpen={true}/>)
            const title = screen.getByRole('textbox', {name: /title/i});
            const description = screen.getByRole('textbox', {name: /description/i});
            const submit = screen.getByRole('button', {name: /add task/i});

            await user.type(title, 'Third Task');
            expect(title).toHaveValue('Third Task');

            await user.type(description, 'Feed Boots wet food');
            expect(description).toHaveValue('Feed Boots wet food');

            await user.click(submit);
            await waitFor(() => {
                expect(mockCreateTask).toHaveBeenCalledWith(expect.objectContaining({
                    title: 'Third Task',
                    description: 'Feed Boots wet food',
                    category: {id: '1', label: 'active'}
                }));
            });
            expect(mockCreateTask).toHaveBeenCalledOnce();
        });

        it('should clear the form after successfully saving a task', async () => {
            const category: Category = {id: '1', label: 'active'};

            vi.spyOn(taskApi, 'axiosGetAllTasks').mockResolvedValue([]);
            vi.spyOn(taskApi, 'axiosSaveTask').mockResolvedValueOnce({
                id: '3',
                title: 'Third Task',
                description: 'Feed Boots wet food',
                category
            });

            const setIsModalOpen = vi.fn();

            render(<TaskForm onClose={() => setIsModalOpen(false)} isOpen={true}/>);

            const title = screen.getByRole('textbox', {name: /title/i});
            const description = screen.getByRole('textbox', {name: /description/i});
            const submit = screen.getByRole('button', {name: /add task/i});

            await user.type(title, 'Third Task');
            await user.type(description, 'Feed Boots wet food');

            await user.click(submit);

            await waitFor(() => {
                expect(title).toHaveValue('');
                expect(description).toHaveValue('');
            });
            expect(setIsModalOpen).toHaveBeenCalled();

        });
    });
});