import React from 'react';
import { Animated, Text, View } from 'react-native';

export default class fadeInView extends React.Component {
    state = {
        fadeAnim: new Animated.Value(0), // Initial value for opacity: 0
        duration: 2500
    }

    fadeIn() {
        console.warn('fade in');
        Animated.timing( // Animate over time
            this.state.fadeAnim, // The animated value to drive
            {
                toValue: 1, // Animate to opacity: 1 (opaque)
                duration: this.state.duration, // Make it take a while
            }
        ).start(); // Starts the animation
    }

    render() {
        let { fadeAnim } = this.state;
        if (this.props.fadeIn) {
            this.fadeIn()
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
