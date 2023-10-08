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
  Tab,
  Message,
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
      <Image alt="logo" style={{ marginTop: '6em', marginBottom: '6em' }} src='/images/title-logo-1080x280.png' centered />
      <Header
        as='h1'
        style={{
          fontSize: mobile ? '2em' : '4em',
          fontWeight: 'normal',
          marginTop: mobile ? '0' : '0',
        }}
      >
        <span style={{color: 'gold'}}>AI Evoking Laugh</span>
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
        <span style={{color: 'dimgray'}}>Learn Humor and Make Funny Jokes with AI.</span>
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
                <Image avatar alt="logo" src='/images/logo192.png' />
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
            <Grid.Column floated='left' width={8}>
              <Header as='h3' style={{ fontSize: '2em' }}>
                Our app helps you develop your sense of humor and create hilarious jokes on any topic.
              </Header>
              <p style={{ fontSize: '1.33em' }}>

              </p>

              <Header as='h3' style={{ fontSize: '2em' }}>
                Features
              </Header>
              <p style={{ fontSize: '1.33em' }}>
                <ul>
                  <li>
                    <b>Learn the science of humor:</b> Our app teaches you the different types of humor, how to identify them, and how to use them in your own writing.
                  </li>
                  <li>
                    <b>Generate funny jokes on any topic:</b> Simply select a topic and our app will generate funny jokes for you.
                  </li>
                  <li>
                    <b>Improve your social skills:</b> Humor is a great way to connect with others and make new friends. Our app can help you become more confident and charismatic in social situations.
                  </li>
                </ul>
              </p>

              <Header as='h3' style={{ fontSize: '2em' }}>
                Benefits
              </Header>
              <p style={{ fontSize: '1.33em' }}>
                <ul>
                  <li>
                    <b>Be more likable:</b> Humor is a great way to connect with people and make them smile.
                  </li>
                  <li>
                    <b>Be more successful:</b> Humor can help you succeed in your career and personal life.
                  </li>
                  <li>
                    <b>Be more confident:</b> When you know how to make people laugh, you will feel more confident in yourself.
                  </li>
                </ul>
              </p>
            </Grid.Column>
            <Grid.Column floated='right' width={6}>
              <Image bordered rounded size='large' src='/images/laughting-group-1.png' />
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column floated='left' width={6}>
              <Image bordered rounded size='large' src='/images/laughting-group-2.png' />
            </Grid.Column>
            <Grid.Column floated='right' width={8}>
              <Header as='h3' style={{ fontSize: '2em' }}>
                Learn Humor
              </Header>
              <p style={{ fontSize: '1.33em' }}>
                <ul>
                  <li>
                    Our app teaches you the fundamentals of humor, such as how to use wordplay, irony, and exaggeration.
                  </li>
                  <li>
                    You will learn how to craft different types of jokes, such as puns, one-liners, and sketch comedies.
                  </li>
                  <li>
                    You will also learn how to tailor your humor to different audiences.
                  </li>
                </ul>
              </p>

              <Header as='h3' style={{ fontSize: '2em' }}>
                Make Funny Jokes
              </Header>
              <p style={{ fontSize: '1.33em' }}>
                <ul>
                  <li>
                    Our AI-powered joke generator can help you create funny jokes on any topic, no matter how mundane.
                  </li>
                  <li>
                    Simply enter a topic and our AI will generate a list of jokes for you.
                  </li>
                  <li>
                    You can also edit the jokes to make them your own.
                  </li>
                </ul>
              </p>

              <Header as='h3' style={{ fontSize: '2em' }}>
                Valuable Features
              </Header>
              <p style={{ fontSize: '1.33em' }}>
                <ul>
                  <li>
                    <b>Community:</b> Connect with other users and share your jokes and feedback.
                  </li>
                  <li>
                    <b>Challenges:</b> Complete challenges to earn rewards and improve your humor skills.
                  </li>
                  <li>
                    <b>Leaderboards:</b> See how you stack up against other users on our leaderboards.
                  </li>
                </ul>
              </p>
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
          <Grid.Row textAlign='center'>
            <Grid.Column style={{ paddingBottom: '5em', paddingTop: '5em' }}>
              <Header as='h4' style={{ fontSize: '1.5em' }}>
                "I've always wanted to be funnier, but I never knew where to start. This app has helped me develop my sense of humor and write my own funny jokes. I'm so glad I found it!"
              </Header>
              <p style={{ fontSize: '1.33em' }}>
                <Image avatar src='/images/male.jpeg' />
                - Mason Rodriguez
              </p>
            </Grid.Column>
            <Grid.Column style={{ paddingBottom: '5em', paddingTop: '5em' }}>
              <Header as='h4' style={{ fontSize: '1.5em' }}>
                "I use this app every day to generate funny jokes for my social media posts. It's so easy to use and the jokes are always hilarious. My followers love it!"
              </Header>
              <p style={{ fontSize: '1.33em' }}>
                <Image avatar src='/images/female.jpeg' />
                - Sofia Johnson
              </p>
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
              Ready to Laugh?
            </a>
          </Divider>
          <p style={{ fontSize: '1.33em' }}>
            Sign up for free today and start learning humor and making funny jokes!
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
                    <a href='https://www.linkedin.com/showcase/joke-funnier/' target='_blank' rel='noopener noreferrer'>
                      Follow on LinkedIn
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
                </List>
              </Grid.Column>
              <Grid.Column width={7}>
                <List link inverted>
                  <List.Item as='a'>
                    <p>
                      Fill the world with laughter.
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
