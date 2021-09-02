import { Button } from '@fluentui/react-button';
import {useStorybookApi } from '@storybook/api';
import {BridgeProvider, useBridgeValue, createContext, useContextSelector } from 'use-context-selector';

export const FooContext = createContext("foo");

const Sample = () => {
  const value = useContextSelector(FooContext, value => value);
  console.log(value);

  return null;
}


export default {
  title: 'Example/Button',
  component: Button,
};

export const ExampleErrorStory = () => {
  const value = useBridgeValue(FooContext);
  return(
    <BridgeProvider value={value} context={FooContext}>
      <Sample />
      <span>This story doesn’t have it’s individual story file and therefore will produce error.</span>
    </BridgeProvider>
  )
};

export { Emphasis } from './ButtonEmphasis.stories';
