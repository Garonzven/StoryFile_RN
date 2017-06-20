import React from 'react';
import { Animated, Text, View } from 'react-native';

export default class fadeInView extends React.Component {
    state = {
        fadeAnim: new Animated.Value(0), // Initial value for opacity: 0
        duration: 2500,
        targetOpacity:-1
    }

    fade() {
        console.warn('fade in');
        Animated.timing( // Animate over time
            this.state.fadeAnim, // The animated value to drive
            {
                toValue: this.state.targetOpacity, // Animate to opacity: 1 (opaque)
                duration: this.state.duration, // Make it take a while
            }
        ).start( () => this.onFaded() ); // Starts the animation

    }

    onFaded(){
      this.state.targetOpacity = -1; //reset
    }

    render() {
        let { fadeAnim } = this.state;
        if (this.props.targetOpacity != this.state.targetOpacity) {
            this.state.targetOpacity = this.props.targetOpacity;
            this.fade()
        }

        return (
            <Animated.View // Special animatable View
            style = {
                {
                    //...this.props.style,
                    opacity: fadeAnim, // Bind opacity to animated value
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    bottom: 0,
                    right: 0,
                }
            } >

            { this.props.children }
            </Animated.View>
        );
    }
}
