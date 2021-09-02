import * as React from 'react';
import { addons, types, makeDecorator } from '@storybook/addons';
// @ts-ignore
import {FooContext} from '../../../stories/Button.stories';

let api;
addons.register('codesandbox', (api2) => {
  addons.add('foo', {
    type: types.TAB,
    title: 'Foo',
    route: ({ storyId, refId }) => (refId ? `/docs/${refId}_${storyId}` : `/docs/${storyId}`),
    match: ({ viewMode }) => viewMode === 'docs',
    render: () => {
      return <FooContext.Provider value={"baz"} />;
    },
  })
});

export const withLing = makeDecorator({
  name: 'withSomething',
  parameterName: 'something',
  wrapper: (storyFn, context, { parameters }) => {
    // Do something with `parameters`, which are set via { something: ... }

    // Note you may alter the story output if you like. 
    // Although generally that's not advised.

    console.log('LING')
    console.log(context);
    return storyFn(context);
  }
})