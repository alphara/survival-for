import {
  Container,
  Divider,
  Message,
  Icon,
} from 'semantic-ui-react'

const Error = () => (
  <Container>
    <Divider hidden />

    <Message negative icon>
      <Icon name='exclamation triangle' />
      <Message.Content>
        <Message.Header>Error</Message.Header>
        No such a page.
      </Message.Content>
    </Message>
  </Container>
)
export default Error

