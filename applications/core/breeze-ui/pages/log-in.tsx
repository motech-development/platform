import Card from '../components/Card';
import Window from '../components/Window';
import Typography from '../components/Typography';

const LogIn = () => (
  <Window>
    <Typography align="center" component="h1" variant="h1" margin="lg">
      Accounts
    </Typography>

    <Card padding="lg">
      <div className="outline relative z-0 border-2 bg-white focus-within:border-blue-500">
        <input
          id="email-address"
          className="block px-2 pt-5 pb-1 w-full text-md appearance-none focus:outline-none bg-transparent"
          type="email"
          placeholder=" "
        />

        <label
          className="absolute text-gray-400 top-0 text-md px-2 py-3 -z-1 duration-300 origin-0"
          htmlFor="email-address"
        >
          Email address
        </label>
      </div>
    </Card>
  </Window>
);

export default LogIn;
