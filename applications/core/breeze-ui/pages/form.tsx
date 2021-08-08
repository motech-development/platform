import { Menu, Transition } from '@headlessui/react';
import { BellIcon } from '@heroicons/react/outline';
import Link from 'next/link';
import { Fragment } from 'react';
import AppBar from '../components/AppBar';
import Avatar from '../components/Avatar';
import Button from '../components/Button';
import Card from '../components/Card';
import PageTitle from '../components/PageTitle';
import Radio from '../components/Radio';
import Select from '../components/Select';
import TextBox from '../components/TextBox';
import Typography from '../components/Typography';

const Form = () => (
  <div className="min-h-screen bg-gray-200">
    <AppBar>
      <div className="flex-shrink-0 flex-1 flex items-center">
        <Typography component="h1" variant="h4" margin="none">
          Accounts
        </Typography>
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
        title="Add a new company"
        subTitle="Onboard a new company to Accounts"
      />

      <section className="max-w-7xl mx-auto pb-8 px-4 sm:px-6 lg:px-8 space-y-5">
        <Card padding="lg">
          <div className="md:grid md:grid-cols-3 md:gap-6">
            <div className="md:col-span-1">
              <Typography rule component="h3" variant="h3">
                Your company
              </Typography>

              <Typography component="p" variant="lead" margin="none">
                Some basic information about your company
              </Typography>
            </div>

            <div className="mt-5 md:mt-0 -mb-4 md:col-span-2">
              <TextBox name="name" label="Name*" />

              <TextBox name="companyNumber" label="Company number*" />
            </div>
          </div>
        </Card>

        <Card padding="lg">
          <div className="md:grid md:grid-cols-3 md:gap-6">
            <div className="md:col-span-1">
              <Typography rule component="h3" variant="h3">
                Bank details
              </Typography>

              <Typography component="p" variant="lead" margin="none">
                These bank details will be printed on any invoices you generate
              </Typography>
            </div>

            <div className="mt-5 md:mt-0 -mb-4 md:col-span-2">
              <TextBox name="bank.accountNumber" label="Account number*" />

              <TextBox name="bank.sortCode" label="Sort code*" />
            </div>
          </div>
        </Card>

        <Card padding="lg">
          <div className="md:grid md:grid-cols-3 md:gap-6">
            <div className="md:col-span-1">
              <Typography rule component="h3" variant="h3">
                Address
              </Typography>

              <Typography component="p" variant="lead" margin="none">
                Your registered or correspondence address
              </Typography>
            </div>

            <div className="mt-5 md:mt-0 -mb-4 md:col-span-2">
              <TextBox name="address.line1" label="Address line 1*" />

              <TextBox name="address.line2" label="Address line 2" />

              <TextBox name="address.town" label="Town*" />

              <TextBox name="address.county" label="County" />

              <TextBox name="address.postcode" label="Postcode*" />
            </div>
          </div>
        </Card>

        <Card padding="lg">
          <div className="md:grid md:grid-cols-3 md:gap-6">
            <div className="md:col-span-1">
              <Typography rule component="h3" variant="h3">
                VAT settings
              </Typography>

              <Typography component="p" variant="lead" margin="none">
                Company VAT information
              </Typography>
            </div>

            <div className="mt-5 md:mt-0 -mb-4 md:col-span-2">
              <Radio
                label="VAT scheme"
                options={[
                  {
                    name: 'None',
                    value: 'none',
                  },
                  {
                    name: 'Standard',
                    value: 'standard',
                  },
                  {
                    name: 'Flat rate',
                    value: 'flat rate',
                  },
                ]}
              />

              <TextBox
                name="vat.registration"
                label="VAT registration number"
              />

              <TextBox name="vat.charge" label="VAT to charge*" />

              <TextBox name="vat.pay" label="VAT to pay*" />
            </div>
          </div>
        </Card>

        <Card padding="lg">
          <div className="md:grid md:grid-cols-3 md:gap-6">
            <div className="md:col-span-1">
              <Typography rule component="h3" variant="h3">
                Year end
              </Typography>

              <Typography component="p" variant="lead" margin="none">
                Set your company year end date
              </Typography>
            </div>

            <div className="mt-5 md:mt-0 -mb-4 md:col-span-2">
              <div className="grid grid-cols-3 gap-6">
                <div className="col-span-1">
                  <Select
                    name="yearEnd.day"
                    label="Day*"
                    placeholder="Select day"
                    options={[]}
                  />
                </div>

                <div className="col-span-2">
                  <Select
                    name="yearEnd.month"
                    label="Month*"
                    placeholder="Select month"
                    options={[]}
                  />
                </div>
              </div>
            </div>
          </div>
        </Card>

        <Card padding="lg">
          <div className="md:grid md:grid-cols-3 md:gap-6">
            <div className="md:col-span-1">
              <Typography rule component="h3" variant="h3">
                Accounts
              </Typography>

              <Typography component="p" variant="lead" margin="none">
                Your opening accounts
              </Typography>
            </div>

            <div className="mt-5 md:mt-0 -mb-4 md:col-span-2">
              <TextBox name="balance.balance" label="Opening balance*" />

              <TextBox name="balance.vat.owed" label="VAT owed*" />

              <TextBox name="balance.vat.paid" label="VAT paid*" />
            </div>
          </div>
        </Card>

        <div className="flex justify-end space-x-5">
          <Button colour="secondary">Cancel</Button>

          <Button colour="primary">Save</Button>
        </div>
      </section>
    </main>
  </div>
);

export default Form;
