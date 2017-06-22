import React from 'react';
import { Animated, Easing, View } from 'react-native';

let spin;

export default class RotatingView extends React.Component {
    constructor( props ){
        super(props);
        spin = this.state.spinValue.interpolate({
                inputRange: [0, 1],
                outputRange: ['0deg', '360deg']
            });
    }
    state = {
        spinValue: new Animated.Value(0), // Initial value: 0
        counterClockwise: false,
        lapDuration: 2000,
        easing: Easing.linear,
        isSpinning: false,
        loop: true
    }

    spin() {
       if( this.state.counterClockwise) console.warn('spin counter-clockwise');
       else console.warn('spin clockwise');
        Animated.loop(
            Animated.timing( // Animate over time
                this.state.spinValue, // The animated value to drive
                {
                    toValue: 1, //this.state.counterClockwise ? 1 : 0, // Animate
                    duration: this.state.lapDuration, // Make it take a while
                    easing: this.state.easing
                }
            )
        ).start() // Starts the animation
        this.state.isSpinning = true;
    }

    render() {
        let { spinAnim } = this.state;
        if (this.props.counterClockwise != this.state.counterClockwise && !this.state.isSpinning) {
            this.state.counterClockwise = this.props.counterClockwise;
            this.state.lapDuration = this.props.lapDuration;
            this.spin();
        }

        return (
            <Animated.View // Special animatable View
            style = {
                [ 
                    {transform: [{rotate: spin}]},
                    this.props.style
                ]
            } >

            { this.props.children }
            </Animated.View>
        );
    }
}