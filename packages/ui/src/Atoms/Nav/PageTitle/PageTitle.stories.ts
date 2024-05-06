import type { Meta, StoryObj } from '@storybook/react';

import { PageTitle } from './PageTitle';

const meta = {
    title: 'Atoms/Nav/PageTitle',
    component: PageTitle,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
} satisfies Meta<typeof PageTitle>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Simple: Story = {
    args: {
      children: "Nouveau",
      title: "Liste des étudiants"
    },
  };
