import Link from 'next/link';
import AppBar from '../components/AppBar';
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

            <Typography component="p" variant="lead" align="center">
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

            <Typography component="p" variant="p" align="center">
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

            <Typography component="p" variant="p" align="center">
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

            <Typography component="p" variant="p" align="center">
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

            <Typography component="p" variant="p" align="center">
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
