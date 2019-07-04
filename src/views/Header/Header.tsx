import * as React from 'react';
import { StackActions } from '@react-navigation/core';
import HeaderSegment from './HeaderSegment';
import { HeaderProps } from '../../types';

class LazyHeaderSegment extends React.Component {
  state = { ready: false };

  componentDidMount() {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        this.setState({ ready: true });
      });
    })
  }

  render() {
    if (!this.state.ready) {
      return null;
    }

    return <HeaderSegment {...this.props} />;
  }
}


export default class Header extends React.Component<HeaderProps> {

  // lol no
  shouldComponentUpdate(nextProps) {
    if (nextProps.scene.descriptor === this.props.scene.descriptor) {
      return false;
    }

    return true;
  }

  render() {
    const {
      scene,
      previous,
      layout,
      navigation,
      styleInterpolator,
    } = this.props;
    const { options } = scene.descriptor;
    const title =
      options.headerTitle !== undefined
        ? options.headerTitle
        : options.title !== undefined
        ? options.title
        : scene.route.routeName;

    let leftLabel;

    // The label for the left back button shows the title of the previous screen
    // If a custom label is specified, we use it, otherwise use previous screen's title
    if (options.headerBackTitle !== undefined) {
      leftLabel = options.headerBackTitle;
    } else if (previous) {
      const o = previous.descriptor.options;

      leftLabel =
        o.headerTitle !== undefined
          ? o.headerTitle
          : o.title !== undefined
          ? o.title
          : previous.route.routeName;
    }

    return (
      <LazyHeaderSegment
        {...options}
        layout={layout}
        scene={scene}
        title={title}
        leftLabel={leftLabel}
        onGoBack={
          previous
            ? () =>
                navigation.dispatch(StackActions.pop({ key: scene.route.key }))
            : undefined
        }
        styleInterpolator={styleInterpolator}
      />
    );
  }
}
