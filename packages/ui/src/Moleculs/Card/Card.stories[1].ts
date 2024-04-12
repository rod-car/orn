import type { Meta, StoryObj } from '@storybook/react';
import { Card } from './Card';

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: 'Moleculs/Card',
  component: Card,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  // More on argTypes: https://storybook.js.org/docs/api/argtypes
  /* argTypes: {
    backgroundColor: { control: 'color' },
  }, */
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Primary: Story = {
  args: {
    title: "Bootstrap card",
    children: "Je suis le contenu de la Card",
    footer: "Voir plus des détails"
  },
};
