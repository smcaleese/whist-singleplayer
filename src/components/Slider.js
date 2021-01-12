import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Slider from '@material-ui/core/Slider';
import VolumeDown from '@material-ui/icons/VolumeDown';
import VolumeUp from '@material-ui/icons/VolumeUp';

class ContinuousSlider extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            value: 50
        }
    }
    handleChange = (event, newValue) => {
        this.setState({value: newValue})
        this.props.newValue(newValue)
        console.log(newValue)
    }
    render() {
        const value = this.state.value
        return (
            <div className="speed-slider center2">
              <p>Game Speed</p>
              <Grid container spacing={2}>
                <Grid item xs>
                    <Slider defaultValue={50} aria-labelledby="discrete-slider"
                        step={10} marks min={10} max={100} onChange={this.handleChange} />
                </Grid>
              </Grid>
            </div>
          )
    }
}

export default ContinuousSlider