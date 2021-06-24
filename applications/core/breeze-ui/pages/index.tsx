import Link from 'next/link';
import Button from '../components/Button';
import ButtonLink from '../components/ButtonLink';
import Card from '../components/Card';
import TextBox from '../components/TextBox';
import Typography from '../components/Typography';
import Window from '../components/Window';

const Home = () => (
  <Window>
    <Typography align="center" component="h1" variant="h1">
      Motech ID
    </Typography>

    <Card padding="lg">
      <Typography align="center" component="p" variant="lead" margin="md">
        Welcome to Motech Accounts
      </Typography>

      <TextBox error name="email" type="email" label="Email address" />

      <TextBox name="password" type="password" label="Password" />

      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2">
          <Typography component="p" variant="p" align="center" margin="none">
            <Link href="/forgotten-password">
              <ButtonLink>Don't remember your password?</ButtonLink>
            </Link>
          </Typography>
        </div>

        <div>
          <Link href="/my-companies">
            <Button block type="button" colour="success">
              Log in
            </Button>
          </Link>
        </div>

        <div>
          <Button block>Sign up</Button>
        </div>
      </div>
    </Card>
  </Window>
);

export default Home;
