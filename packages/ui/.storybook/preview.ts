import type { Preview } from "@storybook/react";

import '../../../apps/front/node_modules/bootstrap/dist/css/bootstrap.min.css'
import '../../../apps/front/node_modules/@fortawesome/fontawesome-free/css/all.min.css'

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: "^on[A-Z].*" },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
};

export default preview;
