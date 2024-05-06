import type { Meta, StoryObj } from '@storybook/react';

import { Select } from './Select';

const meta = {
    title: 'Atoms/Select',
    component: Select,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Simple: Story = {
    args: {
      options: [
        {
          id: 1,
          label: "Rakoto"
        },
        {
          id: 2,
          label: "Rasoa"
        },
        {
          id: 3,
          label: "Rabe"
        }
      ],
      defaultOption: 1,
      label: "Selectionner une personne",
      onChange: (e) => {
        alert(e.target.value);
      }
    },
  };
