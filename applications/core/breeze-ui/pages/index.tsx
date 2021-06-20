import Link from 'next/link';
import Button from '../components/Button';
import Card from '../components/Card';
import Typography from '../components/Typography';
import Window from '../components/Window';

const Home = () => (
  <Window>
    <Typography align="center" component="h1" variant="h1" margin="lg">
      Accounts
    </Typography>

    <Card padding="lg">
      <Typography align="center" component="h2" variant="h2" margin="lg">
        Welcome
      </Typography>

      <Typography align="center" component="p" variant="lead" margin="lg">
        Click the button below to log in or sign up to Accounts
      </Typography>

      <Link href="/log-in">
        <Button block>Log in</Button>
      </Link>
    </Card>
  </Window>
);

export default Home;
