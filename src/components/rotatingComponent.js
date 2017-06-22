import React from 'react';
import { Animated, Easing } from 'react-native';

let spin;

export default class RotatingComponent extends React.Component {
    constructor( props ){
        super(props);
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
        if( this.state.counterClockwise ){
            console.warn('spin counter-clockwise');
            spin = this.state.spinValue.interpolate({
                inputRange: [0, 1],
                outputRange: ['0deg', '-360deg']
            });
        }
        else {
            console.warn('spin clockwise');
            spin = this.state.spinValue.interpolate({
                inputRange: [0, 1],
                outputRange: ['0deg', '360deg']
            });
        }
        Animated.loop(
            Animated.timing( // Animate over time
                this.state.spinValue, // The animated value to drive
                {
                    toValue: 1, // Animate
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

        if( this.props.isImage ){
            return this.animatedImage();
        }
        else return this.animatedView();
    }


    // RETURNS -----------------------------------------------------------------

    animatedImage () {
         return (
            <Animated.Image // Special animatable View
            style = {
                [
                    {transform: [{rotate: spin}]},
                    this.props.style
                ]
            }
            source = {this.props.source} >

            { this.props.children }
            </Animated.Image>
        );
    }
    animatedView(){
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