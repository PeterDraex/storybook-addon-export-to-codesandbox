import React from 'react';
import { addons, makeDecorator} from '@storybook/addons';

let api;
addons.register('codesandbox', (api2) => {
    console.log('REGISTERED');
    api = api2;
});


export const withLing = makeDecorator({
  name: 'withSomething',
  parameterName: 'something',
  wrapper: (storyFn, context, { parameters }) => {
    // Do something with `parameters`, which are set via { something: ... }

    // Note you may alter the story output if you like. 
    // Although generally that's not advised.

    console.log('LING')
    return storyFn(context);
  }
})