import React from 'react';
import { Animated, Easing, View } from 'react-native';

let spin;

export default class AnimatedRotationView extends React.Component {
    state = {
        spinValue: new Animated.Value(0), // Initial value: 0
        clockwise: true,
        lapDuration: 2000,
        easing: Easing.linear,
        isSpinning: false,
        loop: true
    }

    spin() {
        spin = this.state.spinValue.interpolate({
                inputRange: [0, 1],
                outputRange: ['0deg', '360deg']
            });
       if( this.state.clockwise) console.warn('spin clockwise');
       else console.warn('spin counter-clockwise');
        Animated.timing( // Animate over time
            this.state.spinValue, // The animated value to drive
            {
                toValue: 1, //this.state.clockwise ? 1 : 0, // Animate
                duration: this.state.lapDuration, // Make it take a while
                easing: this.state.easing
            }
        ).start( () => this.onSpinned() ); // Starts the animation
        this.state.isSpinning = true;
    }

    onSpinned(){
      this.state.isSpinning = false; //reset
      if( this.state.loop ){
          this.state.spinValue.setValue( 0 );
          this.spin();
      }
    }

    render() {
        let { spinAnim } = this.state;
        if (this.props.clockwise != this.state.clockwise && !this.state.isSpinning) {
            this.state.clockwise = this.props.clockwise;
            this.state.lapDuration = this.props.lapDuration;
            this.spin();
        }

        return (
            <Animated.View // Special animatable View
            style = {
                { 
                    transform: [{rotate: spin}],
                    position: 'absolute',
                    top:40,
                    width:120,
                    height:70
                }
            } >

            { this.props.children }
            </Animated.View>
        );
    }
}