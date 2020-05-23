describe('Smoke tests', () => {
  beforeEach(() => {
    cy.login().then(() => {
      cy.url().should('eq', 'http://localhost:3000/my-companies');

      cy.wait(1000);
    });
  });

  describe('Register company', () => {
    beforeEach(() => {
      cy.get('a:contains("Add a new company")').click();

      cy.url().should('eq', 'http://localhost:3000/my-companies/add-company');

      cy.wait(1000);
    });

    afterEach(() => {
      cy.url().should(
        'include',
        'http://localhost:3000/my-companies/dashboard/',
      );
    });

    it('should create a VAT registered company', () => {
      cy.fixture('data/company.json').then(res => {
        const company = res[0];

        cy.get('input[id="name"]')
          .focus()
          .type(company.name);
        cy.get('input[id="companyNumber"]')
          .focus()
          .type(company.companyNumber);
        cy.get('input[id="vatRegistration"]')
          .focus()
          .type(company.vatRegistration);
        cy.get('input[id="bank.accountNumber"]')
          .focus()
          .type(company.bank.accountNumber);
        cy.get('input[id="bank.sortCode"]')
          .focus()
          .type(company.bank.sortCode);
        cy.get('input[id="address.line1"]')
          .focus()
          .type(company.address.line1);
        cy.get('input[id="address.line2"]')
          .focus()
          .type(company.address.line2);
        cy.get('input[id="address.line3"]')
          .focus()
          .type(company.address.line3);
        cy.get('input[id="address.line5"]')
          .focus()
          .type(company.address.line5);
        cy.get('input[id="contact.email"]')
          .focus()
          .type(company.contact.email);
        cy.get('input[id="contact.telephone"]')
          .focus()
          .type(company.contact.telephone);

        cy.get('button[type="submit"]').click();
      });
    });

    it('should create a non-VAT registered company', () => {
      cy.fixture('data/company.json').then(res => {
        const company = res[1];

        cy.get('input[id="name"]')
          .focus()
          .type(company.name);
        cy.get('input[id="companyNumber"]')
          .focus()
          .type(company.companyNumber);
        cy.get('input[id="bank.accountNumber"]')
          .focus()
          .type(company.bank.accountNumber);
        cy.get('input[id="bank.sortCode"]')
          .focus()
          .type(company.bank.sortCode);
        cy.get('input[id="address.line1"]')
          .focus()
          .type(company.address.line1);
        cy.get('input[id="address.line3"]')
          .focus()
          .type(company.address.line3);
        cy.get('input[id="address.line4"]')
          .focus()
          .type(company.address.line4);
        cy.get('input[id="address.line5"]')
          .focus()
          .type(company.address.line5);
        cy.get('input[id="contact.email"]')
          .focus()
          .type(company.contact.email);
        cy.get('input[id="contact.telephone"]')
          .focus()
          .type(company.contact.telephone);

        cy.get('button[type="submit"]').click();
      });
    });
  });

  describe('Update company', () => {
    afterEach(() => {
      cy.url().should(
        'include',
        'http://localhost:3000/my-companies/dashboard/',
      );
    });

    it('should update company details', () => {
      cy.fixture('data/company.json').then(res => {
        const company = res[0];
        const updated = res[2];

        cy.get('a:contains("Select company")')
          .eq(1)
          .click();

        cy.wait(1000);

        cy.get('a:contains("Manage company details")').click();

        cy.wait(1000);

        cy.get('input[id="name"]').should('have.value', company.name);
        cy.get('input[id="companyNumber"]').should(
          'have.value',
          company.companyNumber,
        );

        cy.format('VAT registration', company.vatRegistration).then(value => {
          cy.get('input[id="vatRegistration"]').should('have.value', value);
        });

        cy.get('input[id="bank.accountNumber"]')
          .should('have.value', company.bank.accountNumber)
          .clear()
          .type(updated.bank.accountNumber);

        cy.format('sort code', company.bank.sortCode).then(value => {
          cy.get('input[id="bank.sortCode"]')
            .should('have.value', value)
            .clear()
            .type(updated.bank.sortCode);
        });

        cy.get('input[id="address.line1"]')
          .should('have.value', company.address.line1)
          .clear()
          .type(updated.address.line1);
        cy.get('input[id="address.line2"]')
          .should('have.value', company.address.line2)
          .clear();
        cy.get('input[id="address.line3"]').should(
          'have.value',
          company.address.line3,
        );
        cy.get('input[id="address.line5"]').should(
          'have.value',
          company.address.line5,
        );
        cy.get('input[id="contact.email"]')
          .should('have.value', company.contact.email)
          .clear()
          .type(updated.contact.email);
        cy.get('input[id="contact.telephone"]').should(
          'have.value',
          company.contact.telephone,
        );

        cy.get('button[type="submit"]').click();
      });
    });
  });

  describe('Settings', () => {
    afterEach(() => {
      cy.url().should(
        'include',
        'http://localhost:3000/my-companies/dashboard/',
      );
    });

    it('should update VAT registered company settings', () => {
      cy.fixture('data/settings.json').then(res => {
        const settings = res[0];

        cy.get('a:contains("Select company")')
          .eq(1)
          .click();

        cy.wait(1000);

        cy.get('a:contains("Manage settings")').click();

        cy.wait(1000);

        cy.get('button:contains("Add a new category")').click();

        cy.get('input[id="categories.0.name"]')
          .focus()
          .type(settings.categories[0].name);

        cy.get('button:contains("Add a new category")').click();

        cy.get('input[id="categories.1.name"]')
          .focus()
          .type(settings.categories[1].name);

        cy.get('input[id="categories.1.vatRate"]')
          .clear()
          .type(settings.categories[1].vatRate);

        cy.get('button:contains("Add a new category")').click();

        cy.get('input[id="categories.2.name"]')
          .focus()
          .type(settings.categories[2].name);

        cy.get('input[id="categories.2.vatRate"]')
          .clear()
          .type(settings.categories[2].vatRate);

        cy.format('percentage', '20').then(value => {
          cy.get('input[id="vat.pay"]')
            .should('have.value', value)
            .clear()
            .type(settings.vat.pay);
        });

        cy.get('button[type="submit"]').click();
      });
    });

    it('should remove expenses category', () => {
      cy.fixture('data/settings.json').then(res => {
        const settings = res[0];

        cy.get('a:contains("Select company")')
          .eq(1)
          .click();

        cy.wait(1000);

        cy.get('a:contains("Manage settings")').click();

        cy.wait(1000);

        cy.get('input[id="categories.0.name"]').should(
          'have.value',
          settings.categories[0].name,
        );

        cy.format('percentage', settings.categories[0].vatRate).then(value => {
          cy.get('input[id="categories.0.vatRate"]').should(
            'have.value',
            value,
          );
        });

        cy.get('input[id="categories.1.name"]').should(
          'have.value',
          settings.categories[1].name,
        );

        cy.format('percentage', settings.categories[1].vatRate).then(value => {
          cy.get('input[id="categories.1.vatRate"]').should(
            'have.value',
            value,
          );
        });

        cy.get('input[id="categories.2.name"]').should(
          'have.value',
          settings.categories[2].name,
        );

        cy.format('percentage', settings.categories[2].vatRate).then(value => {
          cy.get('input[id="categories.2.vatRate"]').should(
            'have.value',
            value,
          );
        });

        cy.format('percentage', settings.vat.charge).then(value => {
          cy.get('input[id="vat.charge"]').should('have.value', value);
        });

        cy.format('percentage', settings.vat.pay).then(value => {
          cy.get('input[id="vat.pay"]').should('have.value', value);
        });

        cy.get('button:contains("Remove")')
          .eq(0)
          .click();

        cy.get('button:contains("Remove")')
          .eq(0)
          .click();

        cy.get('button:contains("Remove")')
          .eq(0)
          .click();

        cy.get('button[type="submit"]').click();
      });
    });

    it('should re-add expense categories', () => {
      cy.fixture('data/settings.json').then(res => {
        const settings = res[0];

        cy.get('a:contains("Select company")')
          .eq(1)
          .click();

        cy.wait(1000);

        cy.get('a:contains("Manage settings")').click();

        cy.wait(1000);

        cy.get('button:contains("Add a new category")').click();

        cy.get('input[id="categories.0.name"]')
          .focus()
          .type(settings.categories[0].name);

        cy.get('button:contains("Add a new category")').click();

        cy.get('input[id="categories.1.name"]')
          .focus()
          .type(settings.categories[1].name);

        cy.get('input[id="categories.1.vatRate"]')
          .clear()
          .type(settings.categories[1].vatRate);

        cy.get('button[type="submit"]').click();
      });
    });

    it('should have correct defaults for non-VAT registered company', () => {
      cy.fixture('data/settings.json').then(res => {
        const settings = res[1];

        cy.get('a:contains("Select company")')
          .eq(0)
          .click();

        cy.wait(1000);

        cy.get('a:contains("Manage settings")').click();

        cy.wait(1000);

        cy.format('percentage', settings.vat.charge).then(value => {
          cy.get('input[id="vat.charge"]').should('have.value', value);
        });

        cy.format('percentage', settings.vat.pay).then(value => {
          cy.get('input[id="vat.pay"]').should('have.value', value);
        });

        cy.get('button[type="submit"]').click();
      });
    });

    it('should update non-VAT registered company settings', () => {
      cy.fixture('data/settings.json').then(res => {
        const settings = res[1];

        cy.get('a:contains("Select company")')
          .eq(0)
          .click();

        cy.wait(1000);

        cy.get('a:contains("Manage settings")').click();

        cy.wait(1000);

        cy.get('button:contains("Add a new category")').click();

        cy.get('input[id="categories.0.name"]')
          .focus()
          .type(settings.categories[0].name);

        cy.get('button:contains("Add a new category")').click();

        cy.get('input[id="categories.1.name"]')
          .focus()
          .type(settings.categories[1].name);

        cy.get('input[id="categories.1.vatRate"]')
          .clear()
          .type(settings.categories[1].vatRate);

        cy.get('button[type="submit"]').click();
      });
    });
  });

  describe('Clients', () => {
    afterEach(() => {
      cy.url().should('include', 'http://localhost:3000/my-companies/clients/');
    });

    describe('VAT registered company', () => {
      beforeEach(() => {
        cy.get('a:contains("Select company")')
          .eq(1)
          .click();

        cy.wait(1000);

        cy.get('a:contains("Manage clients")').click();

        cy.wait(1000);

        cy.url().should(
          'include',
          'http://localhost:3000/my-companies/clients/',
        );

        cy.wait(1000);
      });

      it('should add client 1', () => {
        cy.fixture('data/client.json').then(res => {
          const client = res[0];

          cy.get('a:contains("Add a new client")').click();

          cy.wait(1000);

          cy.get('input[id="name"]')
            .focus()
            .type(client.name);
          cy.get('input[id="address.line1"]')
            .focus()
            .type(client.address.line1);
          cy.get('input[id="address.line3"]')
            .focus()
            .type(client.address.line3);
          cy.get('input[id="address.line5"]')
            .focus()
            .type(client.address.line5);
          cy.get('input[id="contact.email"]')
            .focus()
            .type(client.contact.email);
          cy.get('input[id="contact.telephone"]')
            .focus()
            .type(client.contact.telephone);

          cy.get('button[type="submit"]').click();
        });
      });
    });

    describe('Non-VAT registered company', () => {
      beforeEach(() => {
        cy.get('a:contains("Select company")')
          .eq(0)
          .click();

        cy.wait(1000);

        cy.get('a:contains("Manage clients")').click();

        cy.wait(1000);

        cy.url().should(
          'include',
          'http://localhost:3000/my-companies/clients/',
        );

        cy.wait(1000);
      });

      it('should add client 1', () => {
        cy.fixture('data/client.json').then(res => {
          const client = res[0];

          cy.get('a:contains("Add a new client")').click();

          cy.wait(1000);

          cy.get('input[id="name"]')
            .focus()
            .type(client.name);
          cy.get('input[id="address.line1"]')
            .focus()
            .type(client.address.line1);
          cy.get('input[id="address.line3"]')
            .focus()
            .type(client.address.line3);
          cy.get('input[id="address.line5"]')
            .focus()
            .type(client.address.line5);
          cy.get('input[id="contact.email"]')
            .focus()
            .type(client.contact.email);
          cy.get('input[id="contact.telephone"]')
            .focus()
            .type(client.contact.telephone);

          cy.get('button[type="submit"]').click();
        });
      });

      it('should add client 2', () => {
        cy.fixture('data/client.json').then(res => {
          const client = res[1];

          cy.get('a:contains("Add a new client")').click();

          cy.wait(1000);

          cy.get('input[id="name"]')
            .focus()
            .type(client.name);
          cy.get('input[id="address.line1"]')
            .focus()
            .type(client.address.line1);
          cy.get('input[id="address.line2"]')
            .focus()
            .type(client.address.line2);
          cy.get('input[id="address.line3"]')
            .focus()
            .type(client.address.line3);
          cy.get('input[id="address.line4"]')
            .focus()
            .type(client.address.line4);
          cy.get('input[id="address.line5"]')
            .focus()
            .type(client.address.line5);
          cy.get('input[id="contact.email"]')
            .focus()
            .type(client.contact.email);
          cy.get('input[id="contact.telephone"]')
            .focus()
            .type(client.contact.telephone);

          cy.get('button[type="submit"]').click();
        });
      });

      it('should add client 3', () => {
        cy.fixture('data/client.json').then(res => {
          const client = res[2];

          cy.get('a:contains("Add a new client")').click();

          cy.wait(1000);

          cy.get('input[id="name"]')
            .focus()
            .type(client.name);
          cy.get('input[id="address.line1"]')
            .focus()
            .type(client.address.line1);
          cy.get('input[id="address.line3"]')
            .focus()
            .type(client.address.line3);
          cy.get('input[id="address.line4"]')
            .focus()
            .type(client.address.line4);
          cy.get('input[id="address.line5"]')
            .focus()
            .type(client.address.line5);
          cy.get('input[id="contact.email"]')
            .focus()
            .type(client.contact.email);
          cy.get('input[id="contact.telephone"]')
            .focus()
            .type(client.contact.telephone);

          cy.get('button[type="submit"]').click();
        });
      });

      it('should update client 2', () => {
        cy.fixture('data/client.json').then(res => {
          const client = res[1];
          const updated = res[3];

          cy.get('a:contains("Manage client details")')
            .eq(1)
            .click();

          cy.wait(1000);

          cy.get('input[id="name"]')
            .should('have.value', client.name)
            .clear()
            .type(updated.name);
          cy.get('input[id="address.line1"]').should(
            'have.value',
            client.address.line1,
          );
          cy.get('input[id="address.line2"]').should(
            'have.value',
            client.address.line2,
          );
          cy.get('input[id="address.line3"]').should(
            'have.value',
            client.address.line3,
          );
          cy.get('input[id="address.line4"]').should(
            'have.value',
            client.address.line4,
          );
          cy.get('input[id="address.line5"]').should(
            'have.value',
            client.address.line5,
          );
          cy.get('input[id="contact.email"]').should(
            'have.value',
            client.contact.email,
          );
          cy.get('input[id="contact.telephone"]').should(
            'have.value',
            client.contact.telephone,
          );

          cy.get('button[type="submit"]').click();
        });
      });

      it('should delete client 3', () => {
        cy.fixture('data/client.json').then(res => {
          const client = res[2];

          cy.get('a:contains("Manage client details")')
            .eq(0)
            .click();

          cy.wait(1000);

          cy.get(`button:contains("Delete ${client.name}")`).click();

          cy.wait(1000);

          cy.get('input[id="confirmation"]')
            .focus()
            .type(client.name);

          cy.get('button[type="submit"]')
            .eq(1)
            .click();
        });
      });
    });
  });

  describe('Accounts', () => {
    afterEach(() => {
      cy.url().should(
        'include',
        'http://localhost:3000/my-companies/accounts/',
      );
    });

    describe('VAT registered company', () => {
      beforeEach(() => {
        cy.get('a:contains("Select company")')
          .eq(1)
          .click();

        cy.wait(1000);

        cy.get('a:contains("Manage accounts")').click();

        cy.wait(1000);

        cy.url().should(
          'include',
          'http://localhost:3000/my-companies/accounts/',
        );

        cy.wait(1000);
      });

      it('should add a confirmed sale', () => {
        cy.fixture('data/account.json').then(res => {
          cy.fixture('upload/invoice.pdf').then(file => {
            const transaction = res[0];

            cy.get('a:contains("Record a new transaction")').click();

            cy.wait(1000);

            cy.get('input[type="radio"]').check(transaction.type);

            cy.get('input[id="attachment"]').upload({
              fileContent: file,
              fileName: 'invoice.pdf',
              mimeType: 'application/pdf',
            });

            cy.get('input[id="attachment"]').should('not.be.visible');

            cy.get('select[id="name"]')
              .focus()
              .select(transaction.supplier);

            cy.get('input[id="description"]')
              .focus()
              .type(transaction.description);

            cy.get('input[type="radio"]').check(transaction.status);

            cy.get('input[id="amount"]')
              .focus()
              .type(transaction.amount);

            cy.format('currency', transaction.vat).then(value => {
              cy.get('input[id="vat"]').should('have.value', value);
            });

            cy.get('div:contains("File has been uploaded")', {
              timeout: 10000,
            }).should('not.be.visible');

            cy.get('button[type="submit"]').click();
          });
        });
      });

      it('should add a confirmed purchase', () => {
        cy.fixture('data/account.json').then(res => {
          cy.fixture('upload/invoice.pdf').then(file => {
            const transaction = res[1];

            cy.get('a:contains("Record a new transaction")').click();

            cy.wait(1000);

            cy.get('input[type="radio"]').check(transaction.type);

            cy.get('input[id="name"]')
              .focus()
              .type(transaction.supplier);

            cy.get('input[id="description"]')
              .focus()
              .type(transaction.description);

            cy.get('input[type="radio"]').check(transaction.status);

            cy.get('input[id="attachment"]').upload({
              fileContent: file,
              fileName: 'invoice.pdf',
              mimeType: 'application/pdf',
            });

            cy.get('input[id="attachment"]').should('not.be.visible');

            cy.get('select[id="category"]')
              .focus()
              .select(transaction.category);

            cy.get('input[id="amount"]')
              .focus()
              .type(transaction.amount);

            cy.format('currency', transaction.vat).then(value => {
              cy.get('input[id="vat"]').should('have.value', value);
            });

            cy.get('div:contains("File has been uploaded")', {
              timeout: 10000,
            }).should('not.be.visible');

            cy.get('button[type="submit"]').click();
          });
        });
      });

      it('should add a confirmed zero VAT rate purchase', () => {
        cy.fixture('data/account.json').then(res => {
          cy.fixture('upload/invoice.pdf').then(file => {
            const transaction = res[2];

            cy.get('a:contains("Record a new transaction")').click();

            cy.wait(1000);

            cy.get('input[type="radio"]').check(transaction.type);

            cy.get('input[id="name"]')
              .focus()
              .type(transaction.supplier);

            cy.get('input[id="description"]')
              .focus()
              .type(transaction.description);

            cy.get('input[type="radio"]').check(transaction.status);

            cy.get('input[id="attachment"]').upload({
              fileContent: file,
              fileName: 'invoice.pdf',
              mimeType: 'application/pdf',
            });

            cy.get('input[id="attachment"]').should('not.be.visible');

            cy.get('select[id="category"]')
              .focus()
              .select(transaction.category);

            cy.get('input[id="amount"]')
              .focus()
              .type(transaction.amount);

            cy.format('currency', transaction.vat).then(value => {
              cy.get('input[id="vat"]').should('have.value', value);
            });

            cy.get('div:contains("File has been uploaded")', {
              timeout: 10000,
            }).should('not.be.visible');

            cy.get('button[type="submit"]').click();
          });
        });
      });

      it('should show correct balance details', () => {
        cy.contains('Balance: £1790.40').should('be.visible');

        cy.contains('VAT owed: £310.00').should('be.visible');

        cy.contains('VAT paid: £16.27').should('be.visible');
      });

      it('should update a transaction', () => {
        cy.fixture('data/account.json').then(res => {
          cy.fixture('upload/invoice.pdf').then(file => {
            const transaction = res[6];

            cy.get('a:contains("View")')
              .eq(3)
              .click();

            cy.wait(1000);

            cy.get('input[name="transaction"][type="hidden"]').should(
              'have.value',
              transaction.type,
            );

            cy.get('select[id="name"]').should(
              'have.value',
              transaction.supplier,
            );

            cy.get('input[id="description"]').should(
              'have.value',
              transaction.description,
            );

            cy.get(`input[value="${transaction.status}"]`).should(
              'have.prop',
              'checked',
            );

            cy.get('input[id="amount"]')
              .clear()
              .type(transaction.amount);

            cy.format('currency', transaction.vat).then(value => {
              cy.get('input[id="vat"]').should('have.value', value);
            });

            cy.get('button:contains("Delete file")').click();

            cy.get('div:contains("File has been deleted")', {
              timeout: 10000,
            }).should('not.be.visible');

            cy.get('input[id="attachment"]').upload({
              fileContent: file,
              fileName: 'invoice.pdf',
              mimeType: 'application/pdf',
            });

            cy.get('input[id="attachment"]').should('not.be.visible');

            cy.get('div:contains("File has been uploaded")', {
              timeout: 10000,
            }).should('not.be.visible');

            cy.get('button[type="submit"]').click();

            cy.wait(1000);

            cy.contains('Balance: £2290.40').should('be.visible');

            cy.contains('VAT owed: £387.50').should('be.visible');
          });
        });
      });

      it('should delete a confirmed transaction', () => {
        cy.fixture('data/account.json').then(res => {
          const transaction = res[0];

          cy.get('button:contains("Delete")')
            .eq(2)
            .click();

          cy.wait(1000);

          cy.get('input[id="confirmation"]')
            .focus()
            .type(transaction.supplier);

          cy.get('button[type="submit"]').click();

          cy.contains('Balance: -£209.60').should('be.visible');

          cy.contains('VAT owed: £0.00').should('be.visible');
        });
      });
    });

    describe('Non-VAT registered company', () => {
      beforeEach(() => {
        cy.get('a:contains("Select company")')
          .eq(0)
          .click();

        cy.wait(1000);

        cy.get('a:contains("Manage accounts")').click();

        cy.wait(1000);

        cy.url().should(
          'include',
          'http://localhost:3000/my-companies/accounts/',
        );

        cy.wait(1000);
      });

      it('should add a confirmed sale', () => {
        cy.fixture('data/account.json').then(res => {
          const transaction = res[0];

          cy.get('a:contains("Record a new transaction")').click();

          cy.wait(1000);

          cy.get('input[type="radio"]').check(transaction.type);

          cy.get('select[id="name"]')
            .focus()
            .select(transaction.supplier);

          cy.get('input[id="description"]')
            .focus()
            .type(transaction.description);

          cy.get('input[type="radio"]').check(transaction.status);

          cy.get('input[id="amount"]')
            .focus()
            .type(transaction.amount);

          cy.format('currency', '0').then(value => {
            cy.get('input[id="vat"]').should('have.value', value);
          });

          cy.get('button[type="submit"]').click();
        });
      });

      it('should add a confirmed purchase', () => {
        cy.fixture('data/account.json').then(res => {
          const transaction = res[1];

          cy.get('a:contains("Record a new transaction")').click();

          cy.wait(1000);

          cy.get('input[type="radio"]').check(transaction.type);

          cy.get('input[id="name"]')
            .focus()
            .type(transaction.supplier);

          cy.get('input[id="description"]')
            .focus()
            .type(transaction.description);

          cy.get('input[type="radio"]').check(transaction.status);

          cy.get('select[id="category"]')
            .focus()
            .select(transaction.category);

          cy.get('input[id="amount"]')
            .focus()
            .type(transaction.amount);

          cy.format('currency', transaction.vat).then(value => {
            cy.get('input[id="vat"]').should('have.value', value);
          });

          cy.get('button[type="submit"]').click();
        });
      });

      it('should add a confirmed zero VAT rate purchase', () => {
        cy.fixture('data/account.json').then(res => {
          const transaction = res[2];

          cy.get('a:contains("Record a new transaction")').click();

          cy.wait(1000);

          cy.get('input[type="radio"]').check(transaction.type);

          cy.get('input[id="name"]')
            .focus()
            .type(transaction.supplier);

          cy.get('input[id="description"]')
            .focus()
            .type(transaction.description);

          cy.get('input[type="radio"]').check(transaction.status);

          cy.get('select[id="category"]')
            .focus()
            .select(transaction.category);

          cy.get('input[id="amount"]')
            .focus()
            .type(transaction.amount);

          cy.format('currency', transaction.vat).then(value => {
            cy.get('input[id="vat"]').should('have.value', value);
          });

          cy.get('button[type="submit"]').click();
        });
      });

      it('should show correct balance details', () => {
        cy.contains('Balance: £1790.40').should('be.visible');

        cy.contains('VAT owed: £0.00').should('be.visible');

        cy.contains('VAT paid: £16.27').should('be.visible');
      });

      it('should delete a confirmed transaction', () => {
        cy.fixture('data/account.json').then(res => {
          const transaction = res[2];

          cy.get('button:contains("Delete")')
            .eq(0)
            .click();

          cy.wait(1000);

          cy.get('input[id="confirmation"]')
            .focus()
            .type(transaction.supplier);

          cy.get('button[type="submit"]').click();

          cy.contains('Balance: £1902.40').should('be.visible');
        });
      });

      it('should add a pending sale', () => {
        cy.fixture('data/account.json').then(res => {
          const transaction = res[3];

          cy.get('a:contains("Record a new transaction")').click();

          cy.wait(1000);

          cy.get('input[type="radio"]').check(transaction.type);

          cy.get('select[id="name"]')
            .focus()
            .select(transaction.supplier);

          cy.get('input[id="description"]')
            .focus()
            .type(transaction.description);

          cy.get('input[type="radio"]').check(transaction.status);

          cy.get('input[id="amount"]')
            .focus()
            .type(transaction.amount);

          cy.format('currency', '0').then(value => {
            cy.get('input[id="vat"]').should('have.value', value);
          });

          cy.get('button[type="submit"]').click();
        });
      });

      it('should add a pending purchase', () => {
        cy.fixture('data/account.json').then(res => {
          const transaction = res[4];

          cy.get('a:contains("Record a new transaction")').click();

          cy.wait(1000);

          cy.get('input[type="radio"]').check(transaction.type);

          cy.get('input[id="name"]')
            .focus()
            .type(transaction.supplier);

          cy.get('input[id="description"]')
            .focus()
            .type(transaction.description);

          cy.get('input[type="radio"]').check(transaction.status);

          cy.get('select[id="category"]')
            .focus()
            .select(transaction.category);

          cy.get('input[id="amount"]')
            .focus()
            .type(transaction.amount);

          cy.format('currency', transaction.vat).then(value => {
            cy.get('input[id="vat"]').should('have.value', value);
          });

          cy.get('button[type="submit"]').click();
        });
      });

      it('should add a pending zero VAT rate purchase', () => {
        cy.fixture('data/account.json').then(res => {
          const transaction = res[5];

          cy.get('a:contains("Record a new transaction")').click();

          cy.wait(1000);

          cy.get('input[type="radio"]').check(transaction.type);

          cy.get('input[id="name"]')
            .focus()
            .type(transaction.supplier);

          cy.get('input[id="description"]')
            .focus()
            .type(transaction.description);

          cy.get('input[type="radio"]').check(transaction.status);

          cy.get('select[id="category"]')
            .focus()
            .select(transaction.category);

          cy.get('input[id="amount"]')
            .focus()
            .type(transaction.amount);

          cy.format('currency', transaction.vat).then(value => {
            cy.get('input[id="vat"]').should('have.value', value);
          });

          cy.get('button[type="submit"]').click();
        });
      });

      it('should delete a pending transaction', () => {
        cy.fixture('data/account.json').then(res => {
          const transaction = res[5];

          cy.get('a:contains("View pending transactions")').click();

          cy.wait(1000);

          cy.get('button:contains("Delete")')
            .eq(2)
            .click();

          cy.wait(1000);

          cy.get('input[id="confirmation"]')
            .focus()
            .type(transaction.supplier);

          cy.get('button[type="submit"]').click();

          cy.get('button:contains("Delete")').should('have.length', 2);
        });
      });
    });
  });

  describe('Delete company', () => {
    afterEach(() => {
      cy.url().should('eq', 'http://localhost:3000/my-companies');
    });

    it('should remove VAT registered company', () => {
      cy.fixture('data/company.json').then(res => {
        const company = res[0];

        cy.get('a:contains("Select company")')
          .eq(1)
          .click();

        cy.wait(1000);

        cy.get('a:contains("Manage company details")').click();

        cy.wait(1000);

        cy.get(`button:contains("Delete ${company.name}")`).click();

        cy.wait(1000);

        cy.get('input[id="confirmation"]')
          .focus()
          .type(company.name);

        cy.get('button[type="submit"]')
          .eq(1)
          .click();
      });
    });

    it('should remove non-VAT registered company', () => {
      cy.fixture('data/company.json').then(res => {
        const company = res[1];

        cy.get('a:contains("Select company")')
          .eq(0)
          .click();

        cy.wait(1000);

        cy.get('a:contains("Manage company details")').click();

        cy.wait(1000);

        cy.get(`button:contains("Delete ${company.name}")`).click();

        cy.wait(1000);

        cy.get('input[id="confirmation"]')
          .focus()
          .type(company.name);

        cy.get('button[type="submit"]')
          .eq(1)
          .click();
      });
    });
  });
});
