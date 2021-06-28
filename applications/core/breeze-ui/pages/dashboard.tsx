import { Menu, Transition } from '@headlessui/react';
import { BellIcon } from '@heroicons/react/outline';
import Link from 'next/link';
import { Fragment } from 'react';
import AppBar from '../components/AppBar';
import Avatar from '../components/Avatar';
import Button from '../components/Button';
import Card from '../components/Card';
import PageTitle from '../components/PageTitle';
import Typography from '../components/Typography';

const Dashboard = () => (
  <div className="min-h-screen bg-gray-200">
    <AppBar>
      <div className="flex-shrink-0 flex-1 flex items-center">
        <Typography component="h1" variant="h4" margin="none">
          Accounts
        </Typography>

        <div className="hidden md:block md:ml-6">
          <div className="flex space-x-3">
            <Link href="/accounts">
              <a className="text-gray-300 hover:bg-gray-800 hover:text-gray-100 transition-colors px-3 py-2 text-sm font-medium">
                Accounts
              </a>
            </Link>

            <Link href="/dashboard">
              <a className="text-gray-300 hover:bg-gray-800 hover:text-gray-100 transition-colors px-3 py-2 text-sm font-medium">
                Clients
              </a>
            </Link>

            <Link href="/dashboard">
              <a className="text-gray-300 hover:bg-gray-800 hover:text-gray-100 transition-colors px-3 py-2 text-sm font-medium">
                Reports
              </a>
            </Link>

            <Link href="/form">
              <a className="text-gray-300 hover:bg-gray-800 hover:text-gray-100 transition-colors px-3 py-2 text-sm font-medium">
                Company details
              </a>
            </Link>

            <Link href="/form">
              <a className="text-gray-300 hover:bg-gray-800 hover:text-gray-100 transition-colors px-3 py-2 text-sm font-medium">
                Settings
              </a>
            </Link>
          </div>
        </div>
      </div>

      <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
        <Menu as="div" className="ml-3 relative">
          {({ open }) => (
            <>
              <div>
                <Menu.Button className="bg-gray-900 p-1 rounded-full text-gray-400 hover:text-white hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-blue-600">
                  <span className="sr-only">View notifications</span>

                  <BellIcon className="h-6 w-6" aria-hidden="true" />
                </Menu.Button>
              </div>

              <Transition
                show={open}
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items
                  static
                  className="origin-top-right absolute right-0 mt-2 w-72 shadow-lg py-1 bg-gray-200 text-gray-900 ring-1 ring-black ring-opacity-5 focus:outline-none"
                >
                  <Menu.Item>
                    {() => (
                      <div className="py-2 px-4">
                        <Typography component="p" variant="p" margin="none">
                          You have no new notifications
                        </Typography>
                      </div>
                    )}
                  </Menu.Item>
                </Menu.Items>
              </Transition>
            </>
          )}
        </Menu>

        <Menu as="div" className="ml-3 relative">
          {({ open }) => (
            <>
              <div>
                <Menu.Button className="bg-gray-900 flex text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-blue-600">
                  <span className="sr-only">Open user menu</span>

                  <Avatar
                    src="https://s.gravatar.com/avatar/8801091e665fdac669daa63d32167b7b?s=480&amp;r=pg&amp;d=https%3A%2F%2Fcdn.auth0.com%2Favatars%2Fme.png"
                    alt="My avatar"
                    width="8"
                  />
                </Menu.Button>
              </div>

              <Transition
                show={open}
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items
                  static
                  className="origin-top-right absolute right-0 mt-2 w-72 shadow-lg py-1 bg-gray-800 ring-1 ring-black ring-opacity-5 focus:outline-none"
                >
                  <Menu.Item>
                    {() => (
                      <div className="py-2 px-4">
                        <div className="flex items-center gap-4">
                          <Avatar
                            src="https://s.gravatar.com/avatar/8801091e665fdac669daa63d32167b7b?s=480&amp;r=pg&amp;d=https%3A%2F%2Fcdn.auth0.com%2Favatars%2Fme.png"
                            alt="My avatar"
                            width="12"
                          />

                          <Typography component="p" variant="h6" margin="none">
                            Mo Gusbi
                          </Typography>
                        </div>
                      </div>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {() => (
                      <Link href="/">
                        <Button block type="button" colour="danger">
                          Log out
                        </Button>
                      </Link>
                    )}
                  </Menu.Item>
                </Menu.Items>
              </Transition>
            </>
          )}
        </Menu>
      </div>
    </AppBar>

    <main>
      <PageTitle title="Motech Development" subTitle="Dashboard" />

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
              Accounts
            </Typography>

            <Typography component="p" variant="lead" align="center" margin="lg">
              Keep on top of you company accounts by managing your incomings and
              outgoings
            </Typography>

            <Link href="/accounts">
              <Button block type="button">
                Manage accounts
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
              Clients
            </Typography>

            <Typography component="p" variant="lead" align="center" margin="lg">
              Add your client details so that you always have them to hand
            </Typography>

            <Link href="/dashboard">
              <Button block type="button">
                Manage clients
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
              Reports
            </Typography>

            <Typography component="p" variant="lead" align="center" margin="lg">
              Create and download accounting reports
            </Typography>

            <Link href="/dashboard">
              <Button block type="button">
                Manage reports
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
              Company details
            </Typography>

            <Typography component="p" variant="lead" align="center" margin="lg">
              View your company details and update them
            </Typography>

            <Link href="/form">
              <Button block type="button">
                Manage company details
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
              Settings
            </Typography>

            <Typography component="p" variant="lead" align="center" margin="lg">
              Update company settings
            </Typography>

            <Link href="/form">
              <Button block type="button">
                Manage settings
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
              My companies
            </Typography>

            <Typography component="p" variant="lead" align="center" margin="lg">
              Select another of your companies to manage
            </Typography>

            <Link href="/my-companies">
              <Button block type="button" colour="danger">
                Back to my companies
              </Button>
            </Link>
          </Card>
        </div>
      </section>
    </main>
  </div>
);

export default Dashboard;
