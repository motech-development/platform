import { Menu, Transition } from '@headlessui/react';
import { BellIcon } from '@heroicons/react/outline';
import {
  ArrowCircleLeftIcon,
  ArrowCircleRightIcon,
} from '@heroicons/react/solid';
import Link from 'next/link';
import { Fragment } from 'react';
import AppBar from '../components/AppBar';
import Avatar from '../components/Avatar';
import Button from '../components/Button';
import Card from '../components/Card';
import Logo from '../components/Logo';
import PageTitle from '../components/PageTitle';
import Typography from '../components/Typography';

const Accounts = () => (
  <div className="min-h-screen bg-gray-200">
    <AppBar>
      <div className="flex-shrink-0 flex-1 flex items-center">
        <Typography component="h1" variant="h4" margin="none">
          <span className="sr-only">Accounts</span>

          <Logo className="text-blue-600 w-10 h-10" alt="Accounts logo" />
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
      <PageTitle
        title="Accounts"
        subTitle="Keep on top of your company finances"
      />

      <section className="max-w-7xl mx-auto pb-8 px-4 sm:px-6 lg:px-8 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <Card flex padding="lg">
            <Typography
              rule
              component="h3"
              variant="h3"
              align="center"
              margin="lg"
            >
              New transaction
            </Typography>

            <Typography component="p" variant="lead" align="center" margin="lg">
              Record any money coming in or going out of your business.
            </Typography>

            <Link href="/transaction">
              <Button block type="button">
                Record new transaction
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
              Pending transactions
            </Typography>

            <Typography component="p" variant="lead" align="center" margin="lg">
              Manage any transactions that are waiting to be approved.
            </Typography>

            <Link href="/accounts">
              <Button block type="button">
                View pending transactions
              </Button>
            </Link>
          </Card>
        </div>

        <Card padding="none">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-blue-600">
              <tr>
                <th
                  className="px-6 py-3 font-display text-left text-md text-gray-100"
                  colSpan={2}
                  scope="col"
                >
                  Monday, 09 August
                </th>
                <th
                  className="px-6 py-3 font-display text-right text-md text-gray-100"
                  scope="col"
                >
                  £3500.00
                </th>
                <th
                  className="px-6 py-3 font-display text-left text-md text-gray-100"
                  scope="col"
                >
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="bg-gray-100 divide-y divide-gray-200">
              <tr>
                <td className="pl-6 pr-0 py-4 w-8 whitespace-nowrap font-display text-left text-gray-900">
                  <ArrowCircleRightIcon
                    className="w-8 h-8 text-green-600"
                    aria-hidden="true"
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap font-display text-left text-gray-900">
                  <Typography component="p" variant="h6" margin="none">
                    Some client
                  </Typography>
                  <Typography component="p" variant="p" margin="none">
                    Invoice #88
                  </Typography>
                </td>
                <td className="px-6 py-4 whitespace-nowrap font-display text-right text-gray-900">
                  <Typography
                    component="p"
                    variant="p"
                    margin="none"
                    align="right"
                  >
                    £7000.00
                  </Typography>
                </td>
                <td className="px-6 py-4 whitespace-nowrap font-display text-left text-gray-900">
                  <div className="flex gap-4">
                    <Button type="button" size="sm">
                      View
                    </Button>
                    <Button type="button" colour="danger" size="sm">
                      Delete
                    </Button>
                  </div>
                </td>
              </tr>
            </tbody>

            <thead className="bg-blue-600">
              <tr>
                <th
                  className="px-6 py-3 font-display text-left text-md text-gray-100"
                  colSpan={2}
                  scope="col"
                >
                  Monday, 09 August
                </th>
                <th
                  className="px-6 py-3 font-display text-right text-md text-gray-100"
                  scope="col"
                >
                  -£3500.00
                </th>
                <th
                  className="px-6 py-3 font-display text-left text-md text-gray-100"
                  scope="col"
                >
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="bg-gray-100 divide-y divide-gray-200">
              <tr>
                <td className="pl-6 pr-0 py-4 w-8 whitespace-nowrap font-display text-left text-gray-900">
                  <ArrowCircleLeftIcon
                    className="w-8 h-8 text-red-600"
                    aria-hidden="true"
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap font-display text-left text-gray-900">
                  <Typography component="p" variant="h6" margin="none">
                    Mo Gusbi
                  </Typography>
                  <Typography component="p" variant="p" margin="none">
                    Salary
                  </Typography>
                </td>
                <td className="px-6 py-4 whitespace-nowrap font-display text-right text-gray-900">
                  <Typography
                    component="p"
                    variant="p"
                    margin="none"
                    align="right"
                  >
                    -£3500.00
                  </Typography>
                </td>
                <td className="px-6 py-4 whitespace-nowrap font-display text-left text-gray-900">
                  <div className="flex gap-4">
                    <Button type="button" size="sm">
                      View
                    </Button>
                    <Button type="button" colour="danger" size="sm">
                      Delete
                    </Button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </Card>
      </section>
    </main>
  </div>
);

export default Accounts;
