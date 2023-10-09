/* eslint-disable max-classes-per-file */
/* eslint-disable react/no-multi-comp */

import { createMedia } from '@artsy/fresnel'
import PropTypes from 'prop-types'
import React, {  useState, useEffect } from 'react'
import { InView } from 'react-intersection-observer'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import {
  Button,
  Container,
  Divider,
  Grid,
  Header,
  Icon,
  Image,
  List,
  Menu,
  Segment,
  Sidebar,
} from 'semantic-ui-react'
import conf from './conf'

const { MediaContextProvider, Media } = createMedia({
  breakpoints: {
    mobile: 0,
    tablet: 768,
    computer: 1024,
  },
})

const HomepageHeading = ({ mobile, available, logIn }) => {
  return (
    <Container text>
      <Image alt="logo" style={{ marginTop: '6em', marginBottom: '6em' }} src='/images/favicon_io/android-chrome-512x512.png' centered />
      <Header
        as='h1'
        style={{
          fontSize: mobile ? '2em' : '4em',
          fontWeight: 'normal',
          marginTop: mobile ? '0' : '0',
        }}
      >
        <span style={{color: 'gold'}}>Survival For Poor & Rich</span>
      </Header>
      <Header
        as='h2'
        style={{
          fontSize: mobile ? '1.1em' : '2.2em',
          fontWeight: 'normal',
          marginTop: mobile ? '0.25em' : '0.5em',
          marginBottom: '2em',
        }}
      >
        <span style={{color: 'dimgray'}}>Learn Survival and Discover Happy Financial Life with Quantum AI.</span>
      </Header>
      <Button
        style={{
          marginBottom: '5em',
        }}
        color='orange' size='huge' onClick={() => logIn(false)}
      >
        { available ? 'Get Started' : 'Join a Whitelist' }
        <Icon name='right arrow' />
      </Button>
    </Container>
  )
}

HomepageHeading.propTypes = {
  mobile: PropTypes.bool,
  available: PropTypes.bool.isRequired,
  logIn: PropTypes.func.isRequired,
}

const DesktopContainer = ({ children, available, logIn }) => {
  const [ fixed, setFixed ] = useState(false)

  return (
    <Media greaterThan='mobile'>
      <InView onChange={(inView) => setFixed(!inView)}>
        <Segment
          textAlign='center'
          style={{ minHeight: 700, padding: '1em 0em' }}
        >
          <Menu
            fixed={fixed ? 'top' : null}
            pointing={!fixed}
            secondary={!fixed}
            size='large'
          >
            <Container>
              <Menu.Item active>
                <Image avatar alt="logo" src='/images/favicon_io/android-chrome-192x192.png' />
                <Link to='/'> {' '} Home</Link>
              </Menu.Item>
              <Menu.Item position='right'>
                { available ? (
                  <>
                    <Button as='a' onClick={() => logIn(true)} >
                      Log In
                    </Button>
                    <Button as='a' primary={fixed} style={{ marginLeft: '0.5em' }} onClick={() => logIn(false)} >
                      Sign up
                    </Button>
                  </>
                ) : (
                  <Button onClick={logIn}>
                    Join a Whitelist
                  </Button>
                )}
              </Menu.Item>
            </Container>
          </Menu>
          <HomepageHeading available={available} logIn={logIn}/>
        </Segment>
      </InView>

      {children}
    </Media>
  )
}

DesktopContainer.propTypes = {
  children: PropTypes.node,
  available: PropTypes.bool.isRequired,
  logIn: PropTypes.func.isRequired,
}

const MobileContainer = ({ children, available, logIn }) => {
  const [ sidebarOpened, setSidebarOpened ] = useState(false)

  return (
    <Media as={Sidebar.Pushable} at='mobile'>
      <Sidebar.Pushable>
        <Sidebar
          as={Menu}
          animation='overlay'
          onHide={() => setSidebarOpened(false)}
          vertical
          visible={sidebarOpened}
        >
          <Menu.Item active>
            <Link to='/'>Home</Link>
          </Menu.Item>
          { available ? (
            <>
              <Menu.Item as='a' onClick={() => logIn(true)}>
                Log In
              </Menu.Item>
              <Menu.Item as='a' onClick={() => logIn(false)}>
                Sign up
              </Menu.Item>
            </>
          ) : (
            <Menu.Item onClick={() => logIn(false)}>
              { available ? 'Get Started' : 'Join a Whitelist' }
            </Menu.Item>
          )}
        </Sidebar>

        <Sidebar.Pusher dimmed={sidebarOpened}>
          <Segment
            textAlign='center'
            style={{ minHeight: 350, padding: '1em 0em' }}
            vertical
          >
            <Container>
              <Menu pointing secondary size='large'>
                <Menu.Item onClick={() => setSidebarOpened(true)}>
                  <Icon name='sidebar' />
                </Menu.Item>
                <Menu.Item position='right'>
                  { available ? (
                    <>
                      <Button as='a' onClick={() => logIn(true)}>
                        { available ? 'Log In' : 'Join a Whilelist' }
                      </Button>
                      <Button as='a' style={{ marginLeft: '0.5em' }} onClick={() => logIn(false)}>
                        { available ? 'Sign up': 'Join a Whitelist' }
                      </Button>
                    </>
                  ) : (
                    <Button onClick={logIn}>
                      Join a Whitelist
                    </Button>
                  ) }
                </Menu.Item>
              </Menu>
            </Container>
            <HomepageHeading mobile available={available} logIn={logIn}/>
          </Segment>

          {children}
        </Sidebar.Pusher>
      </Sidebar.Pushable>
    </Media>
  )
}

MobileContainer.propTypes = {
  children: PropTypes.node,
  available: PropTypes.bool.isRequired,
  logIn: PropTypes.func.isRequired,
}

const ResponsiveContainer = ({ children, available, logIn }) => (
  /* Heads up!
   * For large applications it may not be best option to put all page into these containers at
   * they will be rendered twice for SSR.
   */
  <MediaContextProvider>
    <DesktopContainer available={available} logIn={logIn}>{children}</DesktopContainer>
    <MobileContainer available={available} logIn={logIn}>{children}</MobileContainer>
  </MediaContextProvider>
)

ResponsiveContainer.propTypes = {
  children: PropTypes.node,
  available: PropTypes.bool,
  logIn: PropTypes.func,
}

const HomepageLayout = () => {
  const navigate = useNavigate()
  const [available, setAvailable] = useState(true)

  const logIn = (openLogin) => {
    if (available) {
      // navigate('/chat')
      if (openLogin) {
        navigate('/login')
      } else {
        navigate('/signup')
      }
    } else {
      console.log('navigate to interestForm')
      window.open(conf.interestForm.url, '_blank')
    }
  }

  useEffect(() => {
    // Run only once
    axios.get(`${conf.api.url}/available`)
      .then((response) => {
        if (response.data.status === 'available') {
          console.log('The API is available. You can log in.')
        } else {
          console.warn('Unknown availability status. Join a Whitelist.')
          setAvailable(false)
        }
      })
      .catch(function (error) {
        console.error('error:', error);
        console.warn('The API is unavailable. Join a Whitelist.')
        setAvailable(false)
      })
  }, []);

  return (
    <ResponsiveContainer logIn={logIn} available={available}>

      <Segment style={{ padding: '8em 0em' }} vertical>
        <Grid container stackable verticalAlign='middle'>
          <Grid.Row>
            <Grid.Column floated='right' width={6}>
              <Image bordered rounded size='large' src='/images/00001.jpg' />
            </Grid.Column>
            <Grid.Column floated='left' width={6}>
              <Image bordered rounded size='large' src='/images/00002.jpg' />
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column floated='left' width={8}>
              <Header as='h3' style={{ fontSize: '2em' }}>
Learn how to survive on a tight budget and make the most of your resources.
              </Header>
              <p style={{ fontSize: '1.33em' }}>
                <ul>
                  <li>
Body
                  </li>
                  <li>
Are you struggling to make ends meet? Do you feel like you're constantly one paycheck away from financial disaster? If so, you're not alone. Millions of people around the world live on a tight budget, but that doesn't mean you have to give up on your dreams.
                  </li>
                  <li>

Survival For Poor is a web app that can teach you how to survive on a tight budget and make the most of your resources. We offer a variety of articles, videos, and resources on topics such as:
                  </li>
                  <li>

Budgeting
                  </li>
                  <li>
Saving money
                  </li>
                  <li>
Cooking on a budget
                  </li>
                  <li>
Finding affordable housing
                  </li>
                  <li>
Getting a job
                  </li>
                  <li>
Starting a business
                  </li>
                  <li>
And much more!
                  </li>
                  <li>

Call to action
                  </li>
                  <li>

Sign up for a free account today and start learning how to survive on a tight budget!
                  </li>
                  <li>

Dashboard for Survival For Rich
                  </li>
                  <li>

The dashboard for Survival For Rich would be a more exclusive section of the web app, only accessible to users who have signed up for a personal or team account. This section would offer more in-depth content on topics such as:
                  </li>
                  <li>

Investing
                  </li>
                  <li>
Real estate
                  </li>
                  <li>
Wealth management
                  </li>
                  <li>
Luxury lifestyle
                  </li>
                  <li>
And more!
                  </li>
                  <li>
Can a poor author develop the code for the system for the rich without knowledge of sufficient luxury?
                  </li>
                  <li>

Yes, a poor author can develop the code for the system for the rich without knowledge of sufficient luxury. The code for a web app is typically written in a programming language such as JavaScript, Python, or Ruby. These languages are general-purpose languages that can be used to build a wide variety of web applications, including Survival For Poor and Survival For Rich.
                  </li>
                  <li>

The author would need to have a good understanding of the programming language they are using, as well as the web development framework they are using (such as React.js and Semantic UI React). However, they can have personal experience with luxury goods and services in order to write the code for the web app.
                  </li>
                  <li>

Of course, it would be helpful for the author to have some understanding of the needs of the rich. This could be done through research, interviews, or surveys. However, it is not essential for the author to have personal experience with luxury in order to write the code for the web app.
                  </li>
                  <li>

Conclusion
                  </li>
                  <li>

It is possible for a poor author to develop the code for a web app about survival for the rich, even if they do not have personal experience with luxury goods and services. The author would need to have a good understanding of the programming language they are using and the web development framework they are using. They would also need to have some understanding of the needs of the rich. However, it is not essential for the author to have personal experience with luxury in order to write the code for the web app.
                  </li>
                </ul>
              </p>

              <Header as='h3' style={{ fontSize: '2em' }}>
              </Header>
              <p style={{ fontSize: '1.33em' }}>
              </p>
            </Grid.Column>
            <Grid.Column floated='right' width={6}>
              <Image bordered rounded size='large' src='/images/00003.jpg' />
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column floated='left' width={6}>
              <Image bordered rounded size='large' src='/images/00004.jpg' />
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column textAlign='center'>
              <Button size='huge' onClick={() => logIn(false)}>
                { available ? 'Get Started' : 'Join a Whitelist' }
                <Icon name='right arrow' />
              </Button>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Segment>

      <Segment style={{ padding: '0em' }} vertical>
        <Grid celled='internally' columns='equal' stackable>
          <Grid.Row>
            <Grid.Column floated='right' width={6}>
              <Image bordered rounded size='large' src='/images/00001 (1).jpg' />
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column floated='left' width={6}>
              <Image bordered rounded size='large' src='/images/00002 (1).jpg' />
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Segment>

      <Segment style={{ padding: '0em' }} vertical>
        <Grid celled='internally' columns='equal' stackable>
          <Grid.Row>
            <Grid.Column floated='right' width={6}>
              <Image bordered rounded size='large' src='/images/00003 (1).jpg' />
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column floated='left' width={6}>
              <Image bordered rounded size='large' src='/images/00004 (1).jpg' />
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Segment>

      {/*
      <Container style={{ marginTop: '6em' }}>
        <Divider
          as='h4'
          className='header'
          horizontal
          style={{ margin: '3em 0em', textTransform: 'uppercase' }}
        >
          <a href='#'>
            Demo Video
          </a>
        </Divider>
        <Embed
          id='1FxJ4kelZvw'
          placeholder='/images/demo-placeholder.png'
          source='youtube'
        />
      </Container>
      */}

      <Segment style={{ padding: '3em 0em' }} vertical>
        <Container text>
          <Divider
            as='h4'
            className='header'
            horizontal
            style={{ margin: '3em 0em', textTransform: 'uppercase' }}
          >
            <a href='#'>
              Ready to Survive Out?
            </a>
          </Divider>
          <p style={{ fontSize: '1.33em' }}>
            Sign up for free today and start learning and teaching survival and making the lives loved ones!
          </p>
          <Button size='large' color='yellow' onClick={() => logIn(false)}>
            { available ? 'Get Started Today' : 'Join a Whitelist' }
            <Icon name='right arrow' />
          </Button>
        </Container>
      </Segment>

      <Segment inverted vertical style={{ padding: '5em 0em' }}>
        <Container>
          <Grid divided inverted stackable>
            <Grid.Row>
              <Grid.Column width={3}>
                <Header inverted as='h4' content='About' />
                <List link inverted>
                  <List.Item as='a'>
                    <a href='mailto:admin@vuics.com'>
                      Contact Us
                    </a>
                  </List.Item>
                  <List.Item as='a'>
                    <a href='https://www.linkedin.com/showcase/survival-for' target='_blank' rel='noopener noreferrer'>
                      Follow Survival For on LinkedIn
                    </a>
                  </List.Item>
                  {/*
                  <List.Item as='a'>
                    <a href='https://youtube.com/playlist?list=PLXkNXBn6_PqxAFUWetX0_r7825eVMJTAs&si=hdD6MJ1Fo7MSHicc' target='_blank' rel='noopener noreferrer'>
                      Subscribe on YouTube
                    </a>
                  </List.Item>
                  <List.Item as='a'>
                    <a href='https://vuics.tawk.help/category/quantum-copilot' target='_blank' rel='noopener noreferrer'>
                      Knowledge Base
                    </a>
                  </List.Item>
                  <List.Item as='a'>
                    <a href='https://vuics.tawk.help/article/quantum-copilot-faq' target='_blank' rel='noopener noreferrer'>
                      FAQ
                    </a>
                  </List.Item>
                  */}
                </List>
              </Grid.Column>
              <Grid.Column width={3}>
                <Header inverted as='h4' content='Services' />
                <List link inverted>
                  <List.Item as='a'>
                    <a href='https://qc.vuics.com/' target='_blank' rel='noopener noreferrer'>
                      Quantum Copilot
                    </a>
                  </List.Item>
                  <List.Item as='a'>
                    <a href='https://quantum-gpt.vuics.com/' target='_blank' rel='noopener noreferrer'>
                      Quantum GPT
                    </a>
                  </List.Item>
                  <List.Item as='a'>
                    <a href='https://vuics.com' target='_blank' rel='noopener noreferrer'>
                      Voice User Interfaces
                    </a>
                  </List.Item>
                  <List.Item as='a'>
                    <a href='https://cs.vuics.com' target='_blank' rel='noopener noreferrer'>
                      Contract Smarter
                    </a>
                  </List.Item>
                  <List.Item as='a'>
                    <a href='https://jf.vuics.com' target='_blank' rel='noopener noreferrer'>
                      Joke Funnier
                    </a>
                  </List.Item>
                  <List.Item as='a'>
                    <a href='https://sf.vuics.com' target='_blank' rel='noopener noreferrer'>
                      Survival For
                    </a>
                  </List.Item>
                </List>
              </Grid.Column>
              <Grid.Column width={7}>
                <List link inverted>
                  <List.Item as='a'>
                    <p>
                      Fill the world with the smile or laughter.
                    </p>
                  </List.Item>
                  <List.Item as='a'>
                    <p>
                      © 2023 Vuics. All rights reserved.
                    </p>
                  </List.Item>
                </List>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Container>
      </Segment>
    </ResponsiveContainer>
  )
}

export default HomepageLayout
