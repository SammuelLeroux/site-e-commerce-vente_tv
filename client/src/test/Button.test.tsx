// Button.test.tsx
import React from 'react';

import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect'; 

import Button from '../components/Button/Button';

test('renders button with correct text and type', () => {
    // vérifie si le bouton rend le texte correctement et a le type correct.

    const buttonText: string = 'Click me';
    const buttonType: string = 'submit';
    render(<Button text={buttonText} type={buttonType} />);
    const buttonElement: HTMLButtonElement = screen.getByText(buttonText);
    expect(buttonElement).toBeInTheDocument();
    expect(buttonElement.type).toBe('submit');
});

test('calls onClick prop when clicked', () => {
    // vérifie si le callback onClick est appelé lorsque le bouton est cliqué
    
    const onClickMock = jest.fn();
    const buttonText: string = 'Click me';
    const buttonType: string = 'submit';
    const { getByText } = render(<Button type={buttonType} text={buttonText} onClick={onClickMock} />);
    const buttonElement: HTMLButtonElement = getByText(buttonText) as HTMLButtonElement;
    fireEvent.click(buttonElement);
    expect(onClickMock).toHaveBeenCalledTimes(1);
});