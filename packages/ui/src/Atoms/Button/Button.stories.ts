import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './Button';

const meta = {
    title: 'Atoms/Button',
    component: Button,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    argTypes: {
        mode: {
            options: ["default", "primary", "secondary", "secondary", "danger", "warning", "success", "dark", "light"],
            control: { type: 'select' },
        },
        size: {
            options: ["sm", "md", "lg"],
            control: { type: 'select' },
        },
    },
} satisfies Meta<typeof Button>

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {
    args: {
        mode: "primary",
        children: 'Primary Button',
        icon: "save"
    },
};

export const Secondary: Story = {
    args: {
        mode: "secondary",
        children: 'Secondary Button',
        icon: "save"
    },
};

export const Success: Story = {
    args: {
        mode: "success",
        children: 'Success Button',
        icon: "save"
    },
};

export const Danger: Story = {
    args: {
        mode: "danger",
        children: 'Danger Button',
        icon: "trash"
    },
};

export const Warning: Story = {
    args: {
        mode: "warning",
        children: 'Warning Button',
        icon: "trash"
    },
};

export const Disabled: Story = {
    args: {
        mode: "warning",
        children: 'Warning Button',
        icon: "trash",
        disabled: true
    },
};

export const Handled: Story = {
    args: {
        mode: "warning",
        children: 'Warning Button',
        icon: "trash",
        onClick: (e) => {
            alert("Hello world")
        }
    },
};
