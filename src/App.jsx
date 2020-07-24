import {
  AppBar,
  Button,
  CssBaseline,
  Snackbar,
  ThemeProvider,
  Toolbar,
  Typography,
  makeStyles,
} from '@material-ui/core'
import React, { Component } from 'react'

import { Alert } from '@material-ui/lab'
import { Auth } from 'aws-amplify'
import { Style, lightTheme } from './theme'
import Routes, { RouteLinks } from './Routes'

import { exportClassComponent } from './utils'
import PropTypes from 'prop-types'

const navbarStyles = makeStyles(theme => ({
  appBar: {
    background: Style.LIGHT_NAVBAR_COLOR,
    color: Style.LIGHT_NAVBAR_TEXT,
  },
  toolbar: {
    color: 'inherit',
  },
  button: {
    color: 'inherit',
    textTransform: 'none',
    fontWeight: 'bolder',
    padding: `0 ${theme.spacing(2)}px`,
    borderRadius: '0',
  },
  buttonBorder: {
    borderRight: `1px solid ${Style.LIGHT_NAVBAR_TEXT}`,
  },
  brand: {
    flexGrow: 1,
    textDecoration: 'none',
    color: theme.palette.common.white,
  },
}))

const NavigationBar = ({ authenticated }) => {
  const profileLink = authenticated ? RouteLinks.PROFILE : RouteLinks.SIGN_UP
  const classes = navbarStyles()

  return (
    <React.StrictMode>
      <AppBar className={classes.appBar}>
        <Toolbar className={classes.toolbar}>
          <Typography
            className={classes.brand}
            variant="h5"
            component="a"
            href={RouteLinks.HOME}>
            Route Rating
          </Typography>
          <Button
            className={`${classes.button} ${classes.buttonBorder}`}
            href={RouteLinks.HOME}>
            Home
          </Button>
          <Button
            className={`${classes.button} ${classes.buttonBorder}`}
            href={RouteLinks.GYMS}>
            Gyms
          </Button>
          <Button className={classes.button} href={profileLink}>
            Profile
          </Button>
        </Toolbar>
      </AppBar>
    </React.StrictMode>
  )
}

NavigationBar.propTypes = {
  authenticated: PropTypes.bool,
}

const appStyles = theme => ({
  box: {
    paddingBottom: theme.spacing(10),
  },
})

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isLoading: true,
      authenticated: false,
      openSnack: false,
      snackSeverity: 'info',
      snackMessage: '',
    }

    this.classes = this.props.classes
  }

  updateAuth = async () => {
    let authenticated = false

    try {
      const user = await Auth.currentAuthenticatedUser()
      authenticated = user !== null
    } catch (e) {}
    this.setState({ authenticated })
  }

  componentDidMount = async () => {
    await this.updateAuth()
    this.setState({ isLoading: false })
  }

  openSnack = async (message, severity) => {
    this.setState({
      openSnack: true,
      snackMessage: message,
      snackSeverity: severity,
    })
  }

  handleSnackClose = async () => {
    this.setState({
      openSnack: false,
    })
  }

  render = () => {
    return (
      <ThemeProvider theme={lightTheme}>
        <CssBaseline />
        <Snackbar
          open={this.state.openSnack}
          autoHideDuration={6000}
          onClose={this.handleSnackClose}>
          <Alert
            onClose={this.handleSnackClose}
            severity={this.state.snackSeverity}>
            {this.state.snackMessage}
          </Alert>
        </Snackbar>
        <NavigationBar authenticated={this.state.authenticated} />
        <div className={this.classes.box} />
        {!this.state.isLoading && (
          <Routes
            childProps={{
              authenticated: this.state.authenticated,
              updateAuth: this.updateAuth,
              openSnack: this.openSnack,
            }}
          />
        )}
      </ThemeProvider>
    )
  }
}

App.propTypes = {
  classes: PropTypes.object,
  openSnack: PropTypes.func,
  updateAuth: PropTypes.func,
}

export default exportClassComponent(App, appStyles)