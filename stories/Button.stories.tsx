import { Button } from '@fluentui/react-button';

export default {
  title: 'Example/Button',
  component: Button,
};

export const Emphasis2 = () => (
  <>
    <Button primary>Primary button</Button>
    <Button>Default button</Button>
    <Button outline>Outline button</Button>
    <Button subtle>Subtle button</Button>
    <Button transparent>Transparent button</Button>
  </>
);

export { Emphasis } from './ButtonEmphasis.stories';
