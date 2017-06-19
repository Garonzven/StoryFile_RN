import React from 'react';
import { Animated, Text, View } from 'react-native';

export default class FadeView extends React.Component {
    state = {
        fadeAnim: new Animated.Value(0), // Initial value for opacity: 0
        duration: 2000,
        targetOpacity: 1
    }

    fade() {
        console.warn('fading');
        Animated.timing( // Animate over time
            this.state.fadeAnim, // The animated value to drive
            {
                toValue: this.state.targetOpacity, // Animate to opacity
                duration: this.state.duration, // Make it take a while
            }
        ).start( onFaded ); // Starts the animation
    }
    onFaded(){
        this.state.targetOpacity = -1;//reset
    }

    render() {
        //let { fadeAnim } = this.state;
        if(this.state.targetOpacity != this.props.targetOpacity ){
            this.state.targetOpacity = this.props.targetOpacity;
            this.fade();
        }

        return ( 
            <Animated.View // Special animatable View
            style = {
                {
                    //...this.props.style,
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    bottom: 0,
                    right: 0,
                    opacity: this.state.fadeAnim, // Bind opacity to animated value
                }
            } >
            { this.props.children }
            </Animated.View>
        );
    }
}