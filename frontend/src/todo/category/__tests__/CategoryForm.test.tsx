import {CategoryForm} from "../CategoryForm.tsx";
import {render, screen} from "@testing-library/react";
import {expect} from "vitest";

describe('Category Form', () => {
    it('should display category form heading and fields', () => {
        render(<CategoryForm />);

        expect(screen.getByRole('heading', {name: /category form/i})).toBeInTheDocument();
        expect(screen.getByLabelText(/label/i)).toBeInTheDocument();
        expect(screen.getByRole('textbox', {name: /label/i})).toBeInTheDocument();
        expect(screen.getByRole('button', {name: /add category/i})).toBeInTheDocument();

    });
});