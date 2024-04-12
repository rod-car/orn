import type { Meta, StoryObj } from '@storybook/react';

import { Textarea } from './Textarea';

const meta = {
    title: 'Atoms/Textarea',
    component: Textarea,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
} satisfies Meta<typeof Textarea>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Simple: Story = {
  args: {
    placeholder: "Je suis une textarea",
    rows: 5
  },
};

export const WithLabel: Story = {
  args: {
    placeholder: "Je suis une textarea",
    rows: 5,
    label: "Textarea",
    required: false
  },
};

export const WithHandler: Story = {
  args: {
    label: "Textarea with handler",
    required: true,
    value: "Je suis une textarea avec un handler",
    onChange: (e) => {
      alert(e.target.value)
    }
  },
};
