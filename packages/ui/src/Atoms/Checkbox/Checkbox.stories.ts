import type { Meta, StoryObj } from '@storybook/react';

import { Checkbox } from './Checkbox';

const meta = {
    title: 'Atoms/Checkbox',
    component: Checkbox,
    parameters: {
        layout: 'centered',
    },
    argTypes: {
      mode: {
        options: ['primary', 'default', 'danger'],
        control: { type: 'select' }
      }
    },
    tags: ['autodocs'],
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const CheckedCheckbox: Story = {
  args: {
    label: "Coche-moi",
    name: "check",
    checked: true,
    onCheck: (e) => {
      alert(e.target.checked)
    } 
  },
};

export const UncheckedCheckbox: Story = {
  args: {
    label: "Coche-moi",
    name: "check",
    checked: false,
    onCheck: (e) => {
      alert(e.target.checked)
    } 
  },
};
