import type { Meta, StoryObj } from '@storybook/react';

import { Table } from './Table';

const meta = {
  title: 'Moleculs/Table',
  component: Table,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs']
} satisfies Meta<typeof Table>;

export default meta;
type Story = StoryObj<typeof meta>;

const datas = [
  {
    id: "ET-001",
    nom: "RAKOTO",
    prenoms: "Beloha",
    age: 50,
    sexe: "H"
  },
  {
    id: "ET-002",
    nom: "RAKOTO",
    prenoms: "Son",
    age: 50,
    sexe: "H"
  },
  {
    id: "ET-003",
    nom: "RAKOTO",
    prenoms: "Jean",
    age: 40,
    sexe: "H"
  },
] as User[]

export const Primary: Story = {
  args: {
    theads: {
      ['id']: "Matricule",
      ['nom']: "Nom",
      ['prenoms']: "Prénoms",
      ['age']: "Age",
      ['sexe']: "Sexe"
    },
    datas: datas
  },
};
