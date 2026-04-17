import {render, screen, within} from '@testing-library/react';
import {expect} from 'vitest';
import {TaskPage} from '../TaskPage.tsx';
import * as taskApi from '../TaskService.ts';
import type {Category} from "../../category/CategoryType.ts";
import {userEvent} from "@testing-library/user-event/dist/cjs/index.js";

vi.mock('../TaskService.ts');

const category: Category = {id: '1', label: 'testing'}
const mockData = [
    {id: 1, title: 'First Task', description: 'get task component built.', category: category},
    {id: 2, title: 'Second Task', description: 'use new task component.', category: category},
];

describe('Task Page', () => {
    const user = userEvent.setup();

    beforeEach(() => {
        vi.clearAllMocks();
        vi.mocked(taskApi.axiosGetAllTasks).mockResolvedValue(mockData);
    });

    it('should delete task when delete button is clicked', async () => {
        render(<TaskPage/>);

        const list = await screen.findByRole('list');

        const firstItem = await within(list).findByLabelText('Task 1');

        const deleteButton = await within(firstItem).findByRole('button', {name: /delete/i});

        expect(deleteButton).toBeInTheDocument();

        await user.click(deleteButton);

        expect(firstItem).not.toBeInTheDocument();

    });

    it('should display task heading', async () => {
        render(<TaskPage/>);
        await screen.findByRole('list');

        expect(
            screen.getByRole('heading', {name: /Task List/i}),
        ).toBeInTheDocument();
    });

    it('should show multiple tasks', async () => {
        render(<TaskPage/>);

        // Wait for async data to render
        const list = await screen.findByRole('list');

        const items = within(list).getAllByRole('listitem');

        expect(items).toHaveLength(2);
        expect(items[0]).toHaveTextContent('First Task');
        expect(items[1]).toHaveTextContent('Second Task');
    });

    it('should show multiple tasks and find the first task', async () => {
        render(<TaskPage/>);

        // Wait for async data to render
        const list = await screen.findByRole('list');

        const items = within(list).getAllByRole('listitem');

        expect(items).toHaveLength(2);

        const firstItem = await within(list).findByLabelText('Task 1');
        expect(firstItem).toBeInTheDocument();
    });

});
