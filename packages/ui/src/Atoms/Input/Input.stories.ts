import type { Meta, StoryObj } from '@storybook/react';

import { Input } from './Input';

const meta = {
    title: 'Atoms/Input',
    component: Input,
    parameters: {
        layout: 'centered',
    },
    argTypes: {
      type: {
        options: ["text", "password", "email", "date", "color"],
        control: { type: 'select' },
      }
    },
    tags: ['autodocs'],
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Text: Story = {
  args: {
    type: "text"
  },
};

export const ControlledInput: Story = {
  args: {
    type: "text",
    controlled: true,
    value: "Lorem ipsum",
    label: "Controlled Input",
    onChange: () => {}
  },
};

export const UnControlledInput: Story = {
  args: {
    type: "text",
    controlled: false,
    label: "Uncontrolled Input"
  },
};

export const TextWithLabel: Story = {
  args: {
    type: "text",
    label: "Entrer le nom de l'étudiant"
  },
};

export const NotRequired: Story = {
  args: {
    type: "text",
    label: "Entrer le nom de l'étudiant",
    required: false,
    placeholder: "Nom non obligatoire"
  },
};

