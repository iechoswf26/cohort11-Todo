import {CategoryForm} from "../CategoryForm.tsx";
import {fireEvent, render, screen, waitFor} from "@testing-library/react";
import {expect} from "vitest";
import * as categoryApi from "../CategoryService.ts";
import type {Category} from "../CategoryType.ts";
import {userEvent} from "@testing-library/user-event/dist/cjs/index.js";

describe('Category Form', () => {
    it('should display category form heading and fields', () => {
        render(<CategoryForm/>);

        expect(screen.getByRole('heading', {name: /create category/i})).toBeInTheDocument();
        expect(screen.getByLabelText(/label/i)).toBeInTheDocument();
        expect(screen.getByRole('textbox', {name: /label/i})).toBeInTheDocument();
        expect(screen.getByRole('button', {name: /add category/i})).toBeInTheDocument();
    });

    describe('Mock Category Form', () => {
        const user = userEvent.setup();

        const initialCategory: Category = {id: '1', label: 'active'};

        const initialCategloryList = [initialCategory, {
            id: 2,
            label: 'active',
        }]

        beforeEach(() => {
            vi.clearAllMocks();
        });
        afterEach(() => {
            vi.restoreAllMocks()
        })

        it('should be able to type into fields and click submit', async () => {
            //vi.mocked(categoryApi.saveCategory).mockResolvedValue(mockData);
            vi.spyOn(categoryApi, 'getAllCategories').mockResolvedValue(initialCategloryList);

            const mockCreateCategory = vi.spyOn(categoryApi, 'saveCategory').mockResolvedValueOnce({
                id: '1',
                label: 'closed'
            });

            render(<CategoryForm/>)
            const label = screen.getByRole('textbox', {name: /label/i});
            const submit = screen.getByRole('button', {name: /add category/i});

            await user.type(label, 'closed');
            expect(label).toHaveValue('closed');

            await user.click(submit);
            await waitFor(() => {
                expect(mockCreateCategory).toHaveBeenCalledWith(expect.objectContaining({
                    label: 'closed',
                }));
            });
            expect(mockCreateCategory).toHaveBeenCalledOnce();
        });

        it('should clear the form after successfully saving a category', async () => {
            vi.spyOn(categoryApi, 'getAllCategories').mockResolvedValue([]);
            vi.spyOn(categoryApi, 'saveCategory').mockResolvedValueOnce({
                id: '3',
                label: 'inactive',
            });

            render(<CategoryForm/>);

            const label = screen.getByRole('textbox', {name: /label/i});
            const submit = screen.getByRole('button', {name: /add category/i});

            await user.type(label, 'inactive');

            await user.click(submit);

            await waitFor(() => {
                expect(label).toHaveValue('');
            });
        });

        it('should display field validation on blur in form', async () => {
            render(<CategoryForm/>)

            const label = screen.getByRole('textbox', {name: /label/i});

            fireEvent.blur(label);

            await waitFor(() => {
                expect(label).toBeVisible();
                expect(label).not.toHaveValue('new label');
                expect(screen.getByText(/label is required\./i)).toBeInTheDocument();
            });
        });

        it('should display field validation on empty form submit', async () => {
            render(<CategoryForm/>);

            const submit = screen.getByRole('button', {name: /add category/i});

            await user.click(submit);

            const errorMsg = screen.getByText(/label is required\./i);

//            waitFor(() => {
                expect(screen.getByText(/label is required\./i)).toBeInTheDocument();
                expect(errorMsg).toHaveClass('text-red-500');
//            });
        });
    });
});