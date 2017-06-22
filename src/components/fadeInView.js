import React from 'react';
import { Animated, View } from 'react-native';

export default class FadeInView extends React.Component {
    state = {
        fadeAnim: new Animated.Value(0), // Initial value for opacity: 0
        duration: 2500,
        targetOpacity:-1,
        isFading: false
    }

    fade() {
       if( this.state.targetOpacity == 1)
          console.warn('fade in');
       else if(this.state.targetOpacity == 0)
          console.warn('fade out');
        Animated.timing( // Animate over time
            this.state.fadeAnim, // The animated value to drive
            {
                toValue: this.state.targetOpacity, // Animate to opacity: 1 (opaque)
                duration: this.state.duration, // Make it take a while
            }
        ).start( () => this.onFaded() ); // Starts the animation
        this.state.isFading = true;

    }

    onFaded(){
      this.state.targetOpacity = -1; //reset
      this.state.isFading = false;
    }

    render() {
        let { fadeAnim } = this.state;
        if (this.props.targetOpacity != this.state.targetOpacity && !this.state.isFading) {
            this.state.targetOpacity = this.props.targetOpacity;
            this.fade()
        }

        return (
            <Animated.View // Special animatable View
            style = {
                [
                    {opacity: fadeAnim}, // Bind opacity to animated value
                    this.props.style
                ]
            } >

            { this.props.children }
            </Animated.View>
        );
    }
}
