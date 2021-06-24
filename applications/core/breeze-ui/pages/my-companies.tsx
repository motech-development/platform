import Link from 'next/link';
import AppBar from '../components/AppBar';
import Avatar from '../components/Avatar';
import Button from '../components/Button';
import Card from '../components/Card';
import PageTitle from '../components/PageTitle';
import Typography from '../components/Typography';

const MyCompanies = () => (
  <div className="min-h-screen bg-gray-200">
    <AppBar>
      <Typography component="h1" variant="h4" margin="none">
        Accounts
      </Typography>

      <Avatar
        src="https://s.gravatar.com/avatar/8801091e665fdac669daa63d32167b7b?s=480&r=pg&d=https%3A%2F%2Fcdn.auth0.com%2Favatars%2Fme.png"
        alt="My avatar"
        width="8"
      />
    </AppBar>

    <main>
      <PageTitle
        title="My companies"
        subTitle="Select the company you wish to manage or add a new one"
      />

      <section className="max-w-7xl mx-auto pb-8 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <Card flex padding="lg">
            <Typography
              rule
              component="h3"
              variant="h3"
              align="center"
              margin="lg"
            >
              New company
            </Typography>

            <Typography component="p" variant="lead" align="center" margin="lg">
              You can quickly enroll your company by clicking the button below.
              What are you waiting for?
            </Typography>

            <Link href="/form">
              <Button block type="button">
                Add a new company
              </Button>
            </Link>
          </Card>

          <Card flex padding="lg">
            <Typography
              rule
              component="h3"
              variant="h3"
              align="center"
              margin="lg"
            >
              Motech Development
            </Typography>

            <Typography
              component="h4"
              variant="h6"
              align="center"
              margin="none"
            >
              Company number
            </Typography>

            <Typography component="p" variant="p" align="center" margin="lg">
              12026537
            </Typography>

            <Link href="/dashboard">
              <Button block type="button">
                Select company
              </Button>
            </Link>
          </Card>

          <Card flex padding="lg">
            <Typography
              rule
              component="h3"
              variant="h3"
              align="center"
              margin="lg"
            >
              The Whitley Company
            </Typography>

            <Typography
              component="h4"
              variant="h6"
              align="center"
              margin="none"
            >
              Company number
            </Typography>

            <Typography component="p" variant="p" align="center" margin="lg">
              65489485
            </Typography>

            <Link href="/dashboard">
              <Button block type="button">
                Select company
              </Button>
            </Link>
          </Card>

          <Card flex padding="lg">
            <Typography
              rule
              component="h3"
              variant="h3"
              align="center"
              margin="lg"
            >
              Breeze UI
            </Typography>

            <Typography
              component="h4"
              variant="h6"
              align="center"
              margin="none"
            >
              Company number
            </Typography>

            <Typography component="p" variant="p" align="center" margin="lg">
              56498555
            </Typography>

            <Link href="/dashboard">
              <Button block type="button">
                Select company
              </Button>
            </Link>
          </Card>

          <Card flex padding="lg">
            <Typography
              rule
              component="h3"
              variant="h3"
              align="center"
              margin="lg"
            >
              FlexCard
            </Typography>

            <Typography
              component="h4"
              variant="h6"
              align="center"
              margin="none"
            >
              Company number
            </Typography>

            <Typography component="p" variant="p" align="center" margin="lg">
              82084780
            </Typography>

            <Link href="/dashboard">
              <Button block type="button">
                Select company
              </Button>
            </Link>
          </Card>
        </div>
      </section>
    </main>
  </div>
);

export default MyCompanies;
