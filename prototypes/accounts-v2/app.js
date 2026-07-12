const icon = (name) =>
  `<svg aria-hidden="true"><use href="#i-${name}" /></svg>`;

const companies = [
  {
    name: 'Motech Development',
    number: '08374621',
    email: 'accounts@motechdevelopment.co.uk',
    telephone: '0161 496 0204',
  },
  {
    name: 'Northline Digital Ltd',
    number: '10294811',
    email: 'hello@northline.digital',
    telephone: '020 7946 0361',
  },
];

const clients = [
  ['Northstar Studio', 'hello@northstar.studio', '020 7946 0182'],
  ['Birchfield Labs', 'accounts@birchfield.io', '0161 496 0321'],
  ['Orchard Works', 'finance@orchardworks.co.uk', '0117 496 0844'],
  ['Woven & Form', 'amy@wovenandform.com', '0131 496 0155'],
];

const transactions = [
  {
    id: 'transaction-northstar',
    name: 'Northstar Studio',
    detail: 'Website delivery, invoice 1042',
    type: 'income',
    amount: '+£2,840.00',
    amountInPence: 284000,
    status: 'Confirmed',
    category: 'Sales',
    date: 'Today, 11 July',
    absoluteDate: '11 July 2026',
    scheduled: false,
    attached: true,
  },
  {
    id: 'transaction-digitalocean',
    name: 'DigitalOcean',
    detail: 'Cloud hosting, July',
    type: 'expense',
    amount: '−£128.40',
    amountInPence: -12840,
    status: 'Confirmed',
    category: 'Computer and internet',
    date: 'Today, 11 July',
    absoluteDate: '11 July 2026',
    scheduled: false,
    attached: true,
  },
  {
    id: 'transaction-oak',
    name: 'Oak & Co Accountants',
    detail: 'Quarterly bookkeeping',
    type: 'expense',
    amount: '−£640.00',
    amountInPence: -64000,
    status: 'Pending',
    category: 'Professional fees',
    date: 'Yesterday, 10 July',
    absoluteDate: '10 July 2026',
    scheduled: true,
    attached: false,
  },
  {
    id: 'transaction-birchfield',
    name: 'Birchfield Labs',
    detail: 'Product workshop, invoice 1039',
    type: 'income',
    amount: '+£1,250.00',
    amountInPence: 125000,
    status: 'Confirmed',
    category: 'Sales',
    date: 'Wednesday, 9 July',
    absoluteDate: '9 July 2026',
    scheduled: false,
    attached: true,
  },
];

const screenMeta = {
  overview: [
    'Good afternoon, Mo',
    'Your financial position and the work that needs attention.',
  ],
  transactions: [
    'Transactions',
    'Review money in and out, attachments, and approval status.',
  ],
  pending: [
    'Pending transactions',
    'Review transactions before they affect the confirmed balance.',
  ],
  'transaction-new': [
    'Record transaction',
    'Add money coming in or going out of the business.',
  ],
  'transaction-edit': [
    'Edit transaction',
    'Update the transaction and its supporting attachment.',
  ],
  clients: [
    'Clients',
    'People and organisations linked to sales transactions.',
  ],
  'client-new': ['Add client', 'Create a client for sales transactions.'],
  'client-edit': [
    'Northstar Studio',
    'Update client details or remove this client.',
  ],
  reports: ['Reports', 'Create and export your accounting data.'],
  'report-new': [
    'Create report',
    'Choose the financial year and transaction status to export.',
  ],
  companies: ['Your companies', 'Select a company or add another business.'],
  'company-new': [
    'Add company',
    'Set up company details and opening account values.',
  ],
  company: [
    'Company details',
    'Registered, contact, and bank details used across Accounts.',
  ],
  settings: [
    'Settings',
    'Configure VAT, year end, and transaction categories.',
  ],
};

const content = document.querySelector('#content');
const appShell = document.querySelector('.app-shell');
const sidebar = document.querySelector('#sidebar');
const navBackdrop = document.querySelector('.nav-backdrop');
const drawerRoot = document.querySelector('#drawer-root');
const prototypeStateControl = document.querySelector(
  '#prototype-state-control',
);
const prototypeStateMenu = document.querySelector('#prototype-state-menu');
const prototypeStateTrigger = document.querySelector(
  '#prototype-state-trigger',
);
const prototypeStateLabel = document.querySelector('#prototype-state-label');
let activeView = 'overview';
const requestedState = new URLSearchParams(window.location.search).get('state');
let viewState = ['empty', 'error', 'loading'].includes(requestedState)
  ? requestedState
  : 'ready';
let companyWizardStep = 1;
let selectedCompany = {
  initial: 'M',
  name: 'Motech Development',
};
let transactionFormType = 'Purchase';
let transactionFormStatus = '';
let transactionSelectedDate = {
  day: 11,
  month: 6,
  year: 2026,
};
let transactionCalendarView = {
  month: 6,
  year: 2026,
};
let confirmationReturnFocus = null;
let attachmentReturnFocus = null;

const previewStateLabels = {
  ready: 'Ready',
  loading: 'Loading',
  empty: 'Empty',
  error: 'Error',
};

function closePrototypeStateMenu() {
  prototypeStateMenu.hidden = true;
  prototypeStateMenu.dataset.state = 'closed';
  prototypeStateTrigger.setAttribute('aria-expanded', 'false');
}

function syncPrototypeStateControl() {
  const label = previewStateLabels[viewState];

  prototypeStateLabel.textContent = `Preview: ${label}`;
  prototypeStateControl
    .querySelectorAll('[data-preview-state]')
    .forEach((option) => {
      const selected = option.dataset.previewState === viewState;

      option.setAttribute('aria-pressed', String(selected));
      option.dataset.state = selected ? 'active' : 'inactive';
    });
}

const button = (label, options = {}) => {
  const {
    action = '',
    className = 'primary',
    disabled = false,
    iconName = '',
    type = 'button',
  } = options;

  return `<button class="button ${className}" ${action ? `data-action="${action}"` : ''} ${disabled ? 'disabled' : ''} type="${type}">${iconName ? icon(iconName) : ''}${label}</button>`;
};

const heading = (title, description, actions = '', back = '') => `
  ${back ? `<button class="back-link" data-go="${back}" type="button">← Back</button>` : ''}
  <header class="page-heading">
    <div><h1>${title}</h1><p>${description}</p></div>
    ${actions}
  </header>`;

const skeletonShape = (className = '') =>
  `<span class="skeleton-shape ${className}"></span>`;

const loadingHeadingActions = (view) => {
  const actionCounts = {
    clients: 1,
    companies: 1,
    overview: 1,
    pending: 1,
    reports: 1,
    transactions: 2,
  };
  const actionCount = actionCounts[view] || 0;

  return actionCount
    ? `<div class="heading-actions loading-heading-actions">${Array.from(
        {
          length: actionCount,
        },
        () => skeletonShape('skeleton-action'),
      ).join('')}</div>`
    : '';
};

const loadingMetrics = () => `
  <section class="metrics loading-metrics" aria-hidden="true">
    <div class="balance-summary">${skeletonShape('skeleton-label skeleton-on-dark')}${skeletonShape('skeleton-metric skeleton-on-dark')}</div>
    <div class="vat-summary">${skeletonShape('skeleton-section-title')}
      <div class="loading-vat-values"><div>${skeletonShape('skeleton-label')}${skeletonShape('skeleton-value')}</div><div>${skeletonShape('skeleton-label')}${skeletonShape('skeleton-value')}</div></div>
    </div>
  </section>`;

const loadingSectionHeading = () => `
  <div class="section-heading loading-section-heading">
    <div>${skeletonShape('skeleton-section-title')}${skeletonShape('skeleton-copy')}</div>
  </div>`;

const loadingTransactionRow = () => `
  <div class="transaction-row loading-transaction-row" role="row">
    ${skeletonShape('direction loading-direction')}
    <span class="transaction-identity">${skeletonShape('skeleton-name')}${skeletonShape('skeleton-copy')}</span>
    ${skeletonShape('category skeleton-category')}
    ${skeletonShape('amount skeleton-amount')}
    ${skeletonShape('skeleton-chevron')}
  </div>`;

const loadingTransactionHead = () => `
  <div class="transaction-head loading-transaction-head" role="row">
    ${skeletonShape('skeleton-name')}${skeletonShape('skeleton-category')}${skeletonShape('skeleton-amount')}
  </div>`;

const loadingDateBar = () => `
  <div class="date-bar loading-date-bar" role="row">
    ${skeletonShape('skeleton-name')}${skeletonShape('skeleton-amount')}
  </div>`;

const loadingTransactions = (options = {}) => {
  const { compact = false, grouped = false, rows = 3 } = options;
  const rowMarkup = Array.from(
    {
      length: rows,
    },
    loadingTransactionRow,
  );
  const body = grouped
    ? `${loadingDateBar()}${rowMarkup.slice(0, 2).join('')}${loadingDateBar()}${rowMarkup.slice(2).join('')}`
    : rowMarkup.join('');

  return `<div class="transaction-table loading-transaction-table ${compact ? 'compact' : ''}" role="table">${compact ? '' : loadingTransactionHead()}${body}</div>`;
};

const loadingRecordHead = (gridClass, columns) => `
  <div class="data-head ${gridClass}">${Array.from(
    {
      length: columns,
    },
    (_, index) =>
      skeletonShape(index === 0 ? 'skeleton-name' : 'skeleton-copy'),
  ).join('')}</div>`;

const loadingRecordRow = (gridClass, report = false) =>
  report
    ? `<div class="data-row ${gridClass}">${skeletonShape('skeleton-copy')}${skeletonShape('skeleton-copy')}${skeletonShape('skeleton-download')}</div>`
    : `<div class="data-row ${gridClass}"><span class="client">${skeletonShape('loading-record-avatar')}${skeletonShape('skeleton-name')}</span>${skeletonShape('skeleton-copy')}${skeletonShape('skeleton-copy')}${skeletonShape('skeleton-chevron')}</div>`;

const loadingRecords = (view) => {
  const configs = {
    clients: ['clients-grid', 3, 4, false],
    companies: ['companies-grid', 3, 3, false],
    reports: ['reports-grid', 3, 3, true],
  };
  const [gridClass, columns, rows, report] = configs[view];

  return `${
    report
      ? `<div class="notice loading-notice">${skeletonShape('loading-notice-icon')}${skeletonShape('skeleton-copy')}</div>`
      : ''
  }<section class="panel records loading-records">${loadingRecordHead(gridClass, columns)}${Array.from(
    {
      length: rows,
    },
    () => loadingRecordRow(gridClass, report),
  ).join('')}</section>`;
};

const loadingField = () =>
  `<span class="loading-field">${skeletonShape('skeleton-field-label')}${skeletonShape('skeleton-field-control')}</span>`;

const loadingFormSection = (fieldCount) => `
  <section class="sectioned-form-section loading-form-section">
    ${loadingSectionHeading()}
    <div class="sectioned-form-content"><div class="form-grid">${Array.from(
      {
        length: fieldCount,
      },
      loadingField,
    ).join('')}</div></div>
  </section>`;

const loadingCategoryRow = () => `
  <div class="loading-category-row">
    ${skeletonShape('skeleton-field-control')}${skeletonShape('skeleton-field-control')}${skeletonShape('loading-remove-control')}
  </div>`;

const loadingSettingsForm = () => `
  <div class="sectioned-page-form loading-page-form">
    <section class="sectioned-form-section loading-form-section">
      ${loadingSectionHeading()}
      <div class="sectioned-form-content category-editor">
        <div class="sectioned-form-action">${skeletonShape('loading-text-action')}</div>
        <div class="loading-category-list">${Array.from(
          {
            length: 4,
          },
          loadingCategoryRow,
        ).join('')}</div>
      </div>
    </section>
    ${loadingFormSection(2)}
    <section class="sectioned-form-section loading-form-section">
      ${loadingSectionHeading()}
      <div class="sectioned-form-content">${skeletonShape('loading-radio-row')}<div class="form-grid">${Array.from(
        {
          length: 3,
        },
        loadingField,
      ).join('')}</div></div>
    </section>
    <div class="form-actions">${skeletonShape('skeleton-action')}</div>
  </div>`;

const loadingForm = (view) => {
  if (view === 'settings') return loadingSettingsForm();

  const fieldCounts = [2, 5, 2, 2];

  return `<div class="sectioned-page-form loading-page-form">${fieldCounts
    .map(loadingFormSection)
    .join(
      '',
    )}<div class="form-actions">${skeletonShape('skeleton-action')}</div></div>`;
};

const loadingScenario = (view) => {
  const screenLoaders = {
    clients: () => loadingRecords('clients'),
    companies: () => loadingRecords('companies'),
    company: () => loadingForm('company'),
    overview: () => `
      <div class="overview-grid loading-overview">
        <div class="overview-main">${loadingMetrics()}<section class="panel">${loadingSectionHeading()}${loadingTransactions({ compact: true, rows: 4 })}</section></div>
        <aside class="attention-panel loading-attention">${skeletonShape('loading-attention-icon skeleton-on-dark')}<div>${skeletonShape('skeleton-section-title skeleton-on-dark')}${skeletonShape('skeleton-copy skeleton-on-dark')}</div>${skeletonShape('loading-attention-row skeleton-on-dark')}</aside>
      </div>`,
    pending: () =>
      `<section class="panel">${loadingTransactions({ rows: 3 })}</section>`,
    reports: () => loadingRecords('reports'),
    settings: () => loadingForm('settings'),
    transactions: () =>
      `${loadingMetrics()}<section class="panel">${loadingTransactions({ grouped: true, rows: 4 })}</section>`,
  };

  return `<section class="loading-screen" aria-busy="true" aria-label="Loading screen"><span class="visually-hidden" role="status">Loading</span><div aria-hidden="true">${screenLoaders[view]()}</div></section>`;
};

const scenario = (view) => {
  const [title, description] = screenMeta[view];
  const screenHeading = heading(
    title,
    description,
    viewState === 'loading' ? loadingHeadingActions(view) : '',
    view === 'pending' ? 'transactions' : '',
  );
  const emptyConfig = {
    overview: [
      'overview',
      'No financial activity yet',
      'Record your first transaction to start building your financial overview.',
      'Record transaction',
      'record',
    ],
    clients: [
      'users',
      'No clients yet',
      'Add a client to use them on sales transactions.',
      'Add client',
      'add-client',
    ],
    companies: [
      'building',
      'No companies yet',
      'Add a company to start keeping financial records.',
      'Add company',
      'add-company',
    ],
    company: [
      'building',
      'Company details are incomplete',
      'Complete the registered, contact, and bank details used across Accounts.',
      'Complete company details',
      'retry',
    ],
    pending: [
      'clock',
      'No pending transactions',
      'All recorded transactions have been reviewed.',
      'Record transaction',
      'record',
    ],
    reports: [
      'report',
      'No reports yet',
      'Create a report for a financial year and transaction status.',
      'Create report',
      'create-report',
    ],
    settings: [
      'settings',
      'Account settings are not configured',
      'Add categories, financial year, and VAT details before recording transactions.',
      'Configure account settings',
      'retry',
    ],
    transactions: [
      'wallet',
      'No transactions yet',
      'Record money coming in or going out of the business.',
      'Record transaction',
      'record',
    ],
  };
  const errorLabels = {
    clients: 'clients',
    companies: 'companies',
    company: 'company details',
    overview: 'your overview',
    pending: 'pending transactions',
    reports: 'reports',
    settings: 'account settings',
    transactions: 'transactions',
  };

  if (viewState === 'loading') {
    return `${screenHeading}${loadingScenario(view)}`;
  }

  if (viewState === 'empty') {
    const [emptyIcon, emptyTitle, emptyMessage, emptyLabel, emptyAction] =
      emptyConfig[view];

    return `${screenHeading}<section class="state-panel empty-state"><span class="state-icon">${icon(emptyIcon)}</span><div class="state-content"><h2>${emptyTitle}</h2><p>${emptyMessage}</p><div class="state-actions">${button(emptyLabel, { action: emptyAction, iconName: emptyAction === 'retry' ? '' : 'plus' })}</div></div></section>`;
  }

  return `${screenHeading}<section class="state-panel error-state"><span class="state-icon">${icon('warning')}</span><div class="state-content"><h2>We could not load ${errorLabels[view]}</h2><p>Check your connection, then try again.</p><div class="state-actions">${button('Try again', { action: 'retry' })}</div></div></section>`;
};

const metrics = () => `
  <section class="metrics" aria-label="Financial summary">
    <div class="balance-summary"><span>Current balance</span><strong>£24,862.40</strong></div>
    <div class="vat-summary"><h2>VAT summary</h2><dl><div><dt>Owed</dt><dd>£1,042.16</dd></div><div><dt>Paid</dt><dd>£377.84</dd></div></dl></div>
  </section>`;

const transactionHead = (pending = false) => `
  <div class="transaction-head" role="row">
    <span>Transaction</span>
    <span>${pending ? 'Date' : 'Category'}</span>
    <span>Amount</span>
    <span class="visually-hidden">Actions</span>
  </div>`;

const scheduledIndicator = (transaction, location) =>
  transaction.scheduled
    ? `<span class="scheduled-indicator">${icon('clock')}<span class="scheduled-tooltip" id="scheduled-tooltip-${location}-${transaction.id}" role="tooltip">Scheduled transaction</span></span>`
    : '';

const transactionRow = (
  transaction,
  compact = false,
  pending = false,
  showMobileDate = true,
) => `
  <button class="transaction-row ${transaction.status === 'Pending' && !pending ? 'pending-transaction' : ''}" ${transaction.attached ? '' : `aria-describedby="attachment-tooltip-${transaction.id}"`} data-transaction="${transaction.id}" role="row" type="button">
    <span class="direction ${transaction.type}">${icon(transaction.type === 'income' ? 'right' : 'left')}</span>
    <span class="transaction-identity"><strong>${transaction.status === 'Pending' && !pending ? '<span class="visually-hidden">Pending transaction: </span>' : ''}${transaction.name}${transaction.attached ? '' : `<span class="warning">${icon('warning')}<span class="attachment-tooltip" id="attachment-tooltip-${transaction.id}" role="tooltip">No invoice or receipt</span></span>`}</strong><small>${transaction.detail}</small>${showMobileDate ? `<small class="mobile-only">${pending ? `${transaction.absoluteDate}${scheduledIndicator(transaction, 'mobile')}` : transaction.date}</small>` : ''}</span>
    ${compact ? '' : `<span class="category">${pending ? `${transaction.absoluteDate}${scheduledIndicator(transaction, 'desktop')}` : transaction.category}</span>`}
    <strong class="amount ${transaction.type}">${transaction.amount}</strong>${icon('arrow')}
  </button>`;

const transactionRows = (
  items = transactions,
  compact = false,
  pending = false,
) => `
  <div class="transaction-table ${compact ? 'compact' : ''}" role="table" aria-label="Transactions">
    ${compact ? '' : transactionHead(pending)}
    ${items.map((transaction) => transactionRow(transaction, compact, pending)).join('')}
  </div>`;

const formatCurrencyFromPence = (amountInPence) => {
  const amount = Math.abs(amountInPence / 100).toLocaleString('en-GB', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return `${amountInPence < 0 ? '−' : ''}£${amount}`;
};

const transactionsByDay = (items = transactions) => {
  const dates = [...new Set(items.map(({ date }) => date))];

  return `
    <div class="transaction-table grouped-transactions" role="table" aria-label="Transactions grouped by day">
      ${transactionHead()}
      ${dates
        .map((date) => {
          const dailyTransactions = items.filter(
            (transaction) => transaction.date === date,
          );
          const confirmedTotalInPence = dailyTransactions
            .filter(({ status }) => status === 'Confirmed')
            .reduce((total, { amountInPence }) => total + amountInPence, 0);

          return `
            <div class="date-bar" role="row"><strong role="cell">${date}</strong><span role="cell"><span class="visually-hidden">Confirmed daily total: </span>${formatCurrencyFromPence(confirmedTotalInPence)}</span></div>
            ${dailyTransactions
              .map((transaction) =>
                transactionRow(transaction, false, false, false),
              )
              .join('')}`;
        })
        .join('')}
    </div>`;
};

const sectionHeading = (title, description, action = '') =>
  `<div class="section-heading"><div><h2>${title}</h2><p>${description}</p></div>${action}</div>`;

const overview = () => `
  ${heading('Good afternoon, Mo', 'Your financial position and the work that needs attention.', button('Record transaction', { action: 'record', iconName: 'plus' }))}
  <div class="overview-grid">
    <div class="overview-main">${metrics()}<section class="panel">${sectionHeading('Recent transactions', 'Latest confirmed and pending activity', `<button class="text-button" data-go="transactions" type="button">View all ${icon('arrow')}</button>`)}${transactionRows(transactions, true)}</section></div>
    <aside class="attention-panel"><div class="attention-heading"><span>${icon('alert')}</span><div><h2>Needs attention</h2><p>Pending transactions are waiting for review</p></div></div><button data-go="pending" type="button"><span><strong>View pending transactions</strong><small>Review them before they affect your balance</small></span>${icon('arrow')}</button></aside>
  </div>`;

const transactionsView = () => `
  ${heading('Transactions', 'Review money in and out, attachments, and approval status.', `<div class="heading-actions">${button('View pending', { action: 'pending', className: 'secondary' })}${button('Record transaction', { action: 'record', iconName: 'plus' })}</div>`)}
  ${metrics()}
  <section class="panel">${transactionsByDay()}</section>`;

const pendingView = () => {
  const pendingTransactions = transactions.filter(
    ({ status }) => status === 'Pending',
  );

  return `${heading('Pending transactions', 'Review transactions before they affect the confirmed balance.', `<div class="heading-actions">${button('Record transaction', { action: 'record', iconName: 'plus' })}</div>`, 'transactions')}<section class="panel">${transactionRows(pendingTransactions, false, true)}</section>`;
};

const field = (label, value = '', options = {}) => {
  const {
    className = '',
    placeholder = '',
    readOnly = false,
    type = 'text',
  } = options;

  return `<label class="${className}">${label}<input ${readOnly ? 'readonly' : ''} type="${type}" value="${value}" placeholder="${placeholder}"></label>`;
};

const selectField = (label, options, selected = '', className = '') =>
  `<label class="${className}">${label}<select>${options.map((option) => `<option ${option === selected ? 'selected' : ''}>${option}</option>`).join('')}</select></label>`;

const radioGroup = (legend, name, options, selected, disabled = false) =>
  `<fieldset class="radio-field"><legend>${legend}</legend>${options.map((option) => `<label><input name="${name}" type="radio" value="${option}" ${option === selected ? 'checked' : ''} ${disabled ? 'disabled' : ''}> ${option}</label>`).join('')}</fieldset>`;

const transactionPartyField = (editing, type) =>
  type === 'Sale'
    ? selectField(
        'Client',
        ['Select a client', ...clients.map(([name]) => name)],
        'Select a client',
      )
    : field('Supplier', editing ? 'DigitalOcean' : '', {
        placeholder: 'Search or enter a supplier',
        readOnly: editing,
      });

const transactionAmountFields = (editing, type) => `
  <div class="form-grid transaction-values">
    ${type === 'Purchase' ? selectField('Category', ['Select category', 'Advertising', 'Computer and internet', 'Professional fees'], editing ? 'Computer and internet' : 'Select category', 'wide') : ''}
    ${field('Amount', editing ? '128.40' : '', { placeholder: '£ 0.00' })}
    ${field('VAT', editing ? '21.40' : '', { placeholder: '£ 0.00' })}
  </div>
  ${radioGroup('Refund', 'refund', ['No', 'Yes'], 'No', editing)}`;

const uploadControl = () => `
  <label class="upload-control">
    <input class="visually-hidden" data-upload-input type="file" accept="application/pdf,image/*">
    <span class="upload-icon">${icon('paperclip')}</span>
    <span class="upload-copy"><strong data-upload-name>No file selected</strong><small>PDF, JPG or PNG</small></span>
    <span class="upload-browse">Browse</span>
  </label>`;

const transactionUploadContent = (editing, type) => `
  ${sectionHeading(type === 'Purchase' ? 'Invoice or receipt' : 'Invoice', editing ? 'View, replace, or delete the attached file.' : type === 'Purchase' ? 'Attach an invoice or receipt to this transaction.' : 'Attach an invoice to this transaction.')}
  ${editing ? `<div class="attachment-actions"><span>${icon('paperclip')}<strong>digitalocean-july.pdf</strong></span><div><button class="button secondary" data-action="view-attachment" type="button">View file</button><button class="button danger" data-action="delete-attachment" type="button">Delete file</button></div></div>` : uploadControl()}`;

const formatTransactionDate = ({ day, month, year }) =>
  new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(year, month, day));

const transactionDateValue = ({ day, month, year }) =>
  `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

const calendarContent = () => {
  const { month, year } = transactionCalendarView;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const startingDay = (new Date(year, month, 1).getDay() + 6) % 7;
  const monthLabel = new Intl.DateTimeFormat('en-GB', {
    month: 'long',
    year: 'numeric',
  }).format(new Date(year, month, 1));
  const spacers = Array.from(
    {
      length: startingDay,
    },
    () => '<span class="calendar-spacer" aria-hidden="true"></span>',
  ).join('');
  const days = Array.from(
    {
      length: daysInMonth,
    },
    (_, index) => {
      const day = index + 1;
      const selected =
        transactionSelectedDate.day === day &&
        transactionSelectedDate.month === month &&
        transactionSelectedDate.year === year;

      return `<button class="calendar-day ${selected ? 'selected' : ''}" data-calendar-day="${day}" aria-pressed="${selected}" type="button">${day}</button>`;
    },
  ).join('');

  return `
    <div class="calendar-toolbar">
      <button class="calendar-nav previous" data-calendar-move="-1" aria-label="Previous month" type="button">${icon('arrow')}</button>
      <strong>${monthLabel}</strong>
      <button class="calendar-nav" data-calendar-move="1" aria-label="Next month" type="button">${icon('arrow')}</button>
    </div>
    <div class="calendar-weekdays" aria-hidden="true"><span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span></div>
    <div class="calendar-grid" role="grid" aria-label="${monthLabel}">${spacers}${days}</div>`;
};

const transactionDatePicker = () => `
  <div class="date-field">
    <span class="form-label" id="transaction-date-label">Date</span>
    <input name="date" type="hidden" value="${transactionDateValue(transactionSelectedDate)}">
    <button class="date-trigger" data-date-trigger aria-expanded="false" aria-haspopup="dialog" aria-labelledby="transaction-date-label transaction-date-value" type="button"><span id="transaction-date-value" data-date-value>${formatTransactionDate(transactionSelectedDate)}</span>${icon('calendar')}</button>
    <div class="calendar-popover" data-calendar-popover role="dialog" aria-label="Choose transaction date" hidden>${calendarContent()}</div>
  </div>`;

const transactionForm = (editing = false) => `
  <form class="transaction-form form-layout drawer-form" data-editing="${editing}" data-save-to="transactions">
    <section class="panel form-panel">${sectionHeading('Transaction details', editing ? 'Transaction type cannot be changed after creation.' : 'Identify who the transaction is with and when it occurred.')}
      ${radioGroup('Transaction type', 'transaction-type', ['Purchase', 'Sale'], transactionFormType, editing)}
      <div class="form-grid single"><div class="dynamic-field" data-transaction-party>${transactionPartyField(editing, transactionFormType)}</div>${field('Description', editing ? 'Cloud hosting, July' : '', { placeholder: 'What was this for?' })}${transactionDatePicker()}</div>
    </section>
    <div class="form-stack">
      <section class="panel form-panel">${sectionHeading('Transaction amount', 'Status determines when the balance is updated.')}
        ${radioGroup('Status', 'transaction-status', ['Confirmed', 'Pending'], transactionFormStatus)}
        <div class="transaction-amount-fields" data-transaction-amount-fields>${transactionAmountFields(editing, transactionFormType)}</div>
        <div data-scheduled-field>${transactionFormStatus === 'Pending' ? radioGroup('Scheduled transaction', 'scheduled', ['No', 'Yes'], 'No') : ''}</div>
      </section>
      <section class="panel form-panel" data-transaction-upload>${transactionUploadContent(editing, transactionFormType)}</section>
    </div>
    <div class="form-actions">${editing ? button('Delete transaction', { action: 'delete-transaction', className: 'danger' }) : ''}<span>${button('Cancel', { action: 'close-drawer', className: 'secondary' })}${button('Save transaction', { type: 'submit' })}</span></div>
  </form>`;

const clientForm = (editing = false) => `
  <form class="form-layout drawer-form" data-save-to="clients">
    <section class="panel form-panel">${sectionHeading('Client details', 'The name used on sales transactions.')}
      <div class="form-grid single">${field('Client name', editing ? 'Northstar Studio' : '', { placeholder: 'Client or organisation name' })}</div>
      ${sectionHeading('Contact details', 'How to contact this client.')}
      <div class="form-grid single">${field('Email address', editing ? 'hello@northstar.studio' : '', { type: 'email' })}${field('Telephone number', editing ? '020 7946 0182' : '', { type: 'tel' })}</div>
    </section>
    <section class="panel form-panel">${sectionHeading('Address', 'The client’s postal address.')}
      <div class="form-grid single">${field('Address line 1', editing ? '48 Lumen Street' : '')}${field('Address line 2', editing ? 'Northern Quarter' : '')}${field('Town or city', editing ? 'Manchester' : '')}${field('County', editing ? 'Greater Manchester' : '')}${field('Postcode', editing ? 'M1 2AB' : '')}</div>
    </section>
    <div class="form-actions">${editing ? button('Delete client', { action: 'delete-client', className: 'danger' }) : ''}<span>${button('Cancel', { action: 'close-drawer', className: 'secondary' })}${button('Save client', { type: 'submit' })}</span></div>
  </form>`;

const clientsView = () => `
  ${heading('Clients', 'People and organisations linked to sales transactions.', button('Add client', { action: 'add-client', iconName: 'plus' }))}
  <section class="panel records"><div class="data-head clients-grid"><span>Client</span><span>Email</span><span>Telephone</span><span class="visually-hidden">Action</span></div>${clients.map(([name, email, phone]) => `<button class="data-row clients-grid" data-action="edit-client" type="button"><span class="client"><i>${name[0]}</i><strong>${name}</strong></span><span data-label="Email">${email}</span><span data-label="Telephone">${phone}</span>${icon('arrow')}</button>`).join('')}</section>`;

const reportsView = () => `
  ${heading('Reports', 'Create and export your accounting data.', button('Create report', { action: 'create-report', iconName: 'plus' }))}
  <div class="notice">${icon('alert')}<span>Reports are automatically deleted after 24 hours.</span></div>
  <section class="panel records"><div class="data-head reports-grid"><span>Created</span><span>Expires</span><span>Actions</span></div>${[
    ['12 Jul 2026, 09:42', '13 Jul 2026, 09:42'],
    ['12 Jul 2026, 08:18', '13 Jul 2026, 08:18'],
    ['12 Jul 2026, 07:03', '13 Jul 2026, 07:03'],
  ]
    .map(
      ([created, expires]) =>
        `<div class="data-row reports-grid"><span data-label="Created">${created}</span><span data-label="Expires">${expires}</span><button class="button secondary" type="button">${icon('download')}Download</button></div>`,
    )
    .join('')}</section>`;

const reportForm = () => `
  <form class="form-layout drawer-form" data-save-to="reports"><section class="panel form-panel">${sectionHeading('Report settings', 'The export will include transactions matching these options.')}<div class="form-grid single">${selectField('Financial year', ['2025/26', '2024/25', '2023/24'], '2025/26')}${radioGroup('Transaction status', 'report-status', ['Confirmed', 'Pending'], 'Confirmed')}</div></section><div class="form-actions"><span>${button('Cancel', { action: 'close-drawer', className: 'secondary' })}${button('Create report', { type: 'submit' })}</span></div></form>`;

const companiesView = () => `
  ${heading('Your companies', 'Select a company or add another business.', button('Add company', { action: 'add-company', iconName: 'plus' }))}
  <section class="panel records"><div class="data-head companies-grid"><span>Company</span><span>Company number</span><span>Contact</span><span class="visually-hidden">Action</span></div>${companies.map(({ name, number, email }) => `<button class="data-row companies-grid" data-action="select-company" data-company-initial="${name[0]}" data-company-name="${name}" type="button"><span class="client"><i>${name[0]}</i><strong>${name}</strong></span><span data-label="Company number">${number}</span><span data-label="Contact">${email}</span>${icon('arrow')}</button>`).join('')}</section>`;

const companyIdentityFields = (editing = false, stacked = true) =>
  `${sectionHeading('Company details', 'The registered company identity.')}<div class="form-grid${stacked ? ' single' : ''}">${field('Company name', editing ? 'Motech Development' : '')}${field('Company number', editing ? '08374621' : '')}</div>`;

const companyBankFields = (editing = false) =>
  `${sectionHeading('Bank account', 'Used to match transactions.')}<div class="form-grid">${field('Account number', editing ? '12345678' : '')}${field('Sort code', editing ? '04-00-04' : '')}</div>`;

const companyAddressFields = (editing = false, stacked = true) =>
  `${sectionHeading('Address', 'The registered company address.')}<div class="form-grid${stacked ? ' single' : ''}">${field('Address line 1', editing ? '12 Cooper Street' : '')}${field('Address line 2', editing ? 'Ancoats' : '')}${field('Town or city', editing ? 'Manchester' : '')}${field('County', editing ? 'Greater Manchester' : '')}${field('Postcode', editing ? 'M1 1AA' : '')}</div>`;

const companyContactFields = (editing = false, stacked = true) =>
  `${sectionHeading('Contact details', 'Primary company contact details.')}<div class="form-grid${stacked ? ' single' : ''}">${field('Email address', editing ? 'accounts@motechdevelopment.co.uk' : '', { type: 'email' })}${field('Telephone number', editing ? '0161 496 0204' : '', { type: 'tel' })}</div>`;

const companyDetailsFields = (editing = false) => `
  <section class="panel form-panel">${companyIdentityFields(editing)}${companyBankFields(editing)}</section>
  <section class="panel form-panel">${companyAddressFields(editing)}${companyContactFields(editing)}</section>`;

const companyPageFields = (editing = false) => `
  <section class="sectioned-form-section">${companyIdentityFields(editing, false)}</section>
  <section class="sectioned-form-section">${companyAddressFields(editing, false)}</section>
  <section class="sectioned-form-section">${companyContactFields(editing, false)}</section>
  <section class="sectioned-form-section">${companyBankFields(editing)}</section>`;

const companyNew = () => {
  if (companyWizardStep === 1) {
    return `<form class="form-layout drawer-form" id="company-wizard">${companyDetailsFields(false)}<div class="form-actions"><span>${button('Cancel', { action: 'close-drawer', className: 'secondary' })}${button('Continue to settings', { action: 'company-next' })}</span></div></form>`;
  }

  return `<form class="form-layout drawer-form" data-save-to="overview"><section class="panel form-panel">${sectionHeading('VAT settings', 'How VAT is applied to transactions.')}${radioGroup('VAT scheme', 'vat-scheme', ['None', 'Standard', 'Flat rate'], 'Standard')}<div class="form-grid">${field('VAT registration', 'GB')}${field('Charge rate', '20%')}${field('Pay rate', '20%')}</div></section><section class="panel form-panel">${sectionHeading('Financial year end', 'Used for annual reports.')}<div class="form-grid">${selectField('Day', ['31', '30', '29', '28'], '31')}${selectField('Month', ['March', 'December', 'April'], 'March')}</div>${sectionHeading('Opening accounts', 'Starting values used by the account balance.')}<div class="form-grid single">${field('Balance', '0.00')}${field('VAT owed', '0.00')}${field('VAT paid', '0.00')}</div></section><div class="form-actions"><button class="button secondary" data-action="company-back" type="button">Back</button><span>${button('Cancel', { action: 'close-drawer', className: 'secondary' })}${button('Save company', { type: 'submit' })}</span></div></form>`;
};

const companyView = () => `
  ${heading('Company details', 'Registered, contact, and bank details used across Accounts.')}
  <form class="sectioned-page-form" data-save-to="company">${companyPageFields(true)}<div class="form-actions">${button('Delete company', { action: 'delete-company', className: 'danger' })}<span>${button('Save changes', { type: 'submit' })}</span></div></form>`;

const settingsView = () => `
  ${heading('Settings', 'VAT, financial year, and transaction category defaults.')}
  ${settingsForm()}`;

const settingsForm = () => `
  <form class="sectioned-page-form" data-save-to="settings"><section class="sectioned-form-section">${sectionHeading('Expense categories', 'Applied when purchases are recorded')}<div class="sectioned-form-content category-editor"><div class="sectioned-form-action"><button class="text-button" type="button">${icon('plus')}Add category</button></div><div class="category-list">${[
    ['Advertising', '20%'],
    ['Bank fees', '0%'],
    ['Computer equipment', '20%'],
    ['Professional fees', '20%'],
  ]
    .map(
      ([name, rate]) =>
        `<div><input aria-label="${name} name" value="${name}"><input aria-label="VAT rate for ${name}" value="${rate}"><button aria-label="Remove ${name}" type="button">${icon('close')}</button></div>`,
    )
    .join(
      '',
    )}</div></div></section><section class="sectioned-form-section">${sectionHeading('Financial year end', 'Used when creating annual reports')}<div class="sectioned-form-content"><div class="form-grid">${selectField('Day', ['31', '30', '29', '28'], '31')}${selectField('Month', ['March', 'December', 'April'], 'March')}</div></div></section><section class="sectioned-form-section">${sectionHeading('VAT settings', 'Rates applied to sales and purchases')}<div class="sectioned-form-content">${radioGroup('VAT scheme', 'settings-vat', ['None', 'Standard', 'Flat rate'], 'Standard')}<div class="form-grid">${field('Registration number', 'GB 123 4567 89', { className: 'wide' })}${field('Charge rate', '20%')}${field('Pay rate', '20%')}</div></div></section><div class="form-actions"><span>${button('Save settings', { type: 'submit' })}</span></div></form>`;

const loginView = () => `
  <section class="login-screen"><div class="login-brand"><svg class="brand-logo" aria-hidden="true"><use href="#i-motech-development" /></svg><span><strong>Accounts</strong></span></div><div class="login-panel"><h1>Welcome back</h1><p>Sign in to manage your company accounts, clients, transactions, and reports.</p><button class="button primary" data-action="login" type="button">Sign in securely</button></div></section>`;

const notFoundView = () =>
  `<section class="login-screen"><div class="login-panel"><span class="state-icon">404</span><h1>Page not found</h1><p>The page you requested does not exist or has moved.</p><button class="button primary" data-go="overview" type="button">Return to overview</button></div></section>`;

const views = {
  overview,
  transactions: transactionsView,
  pending: pendingView,
  clients: clientsView,
  reports: reportsView,
  companies: companiesView,
  company: companyView,
  settings: settingsView,
  login: loginView,
  'not-found': notFoundView,
};

const activeNavigation = {
  overview: 'overview',
  transactions: 'transactions',
  pending: 'transactions',
  'transaction-new': 'transactions',
  'transaction-edit': 'transactions',
  clients: 'clients',
  'client-new': 'clients',
  'client-edit': 'clients',
  reports: 'reports',
  'report-new': 'reports',
  company: 'company',
  settings: 'settings',
};

function showToast(message) {
  const toast = document.createElement('div');

  toast.className = 'toast';
  toast.setAttribute('role', 'status');
  toast.textContent = message;
  document.body.append(toast);
  window.setTimeout(() => toast.remove(), 2200);
}

function syncDrawerLayers() {
  const drawer = drawerRoot.querySelector('.drawer');
  const attachmentDrawer = drawerRoot.querySelector('.attachment-drawer');
  const confirmation = drawerRoot.querySelector('.modal-layer');

  if (drawer) {
    const hidden = Boolean(attachmentDrawer || confirmation);

    drawer.inert = hidden;
    drawer.setAttribute('aria-hidden', String(hidden));
  }
  if (attachmentDrawer) {
    const hidden = Boolean(confirmation);

    attachmentDrawer.inert = hidden;
    attachmentDrawer.setAttribute('aria-hidden', String(hidden));
  }
}

function openConfirm(title, message, confirmLabel, destination) {
  confirmationReturnFocus = document.activeElement;
  drawerRoot.querySelector('.modal-layer')?.remove();
  drawerRoot.insertAdjacentHTML(
    'beforeend',
    `<div class="modal-layer"><button class="modal-backdrop" data-close-modal aria-label="Close confirmation"></button><section class="confirm-dialog" role="alertdialog" aria-modal="true" aria-labelledby="confirm-title" aria-describedby="confirm-message"><header><div class="confirm-dialog-heading"><span class="confirm-dialog-icon">${icon('warning')}</span><h2 id="confirm-title">${title}</h2></div><button class="icon-button" data-close-modal aria-label="Close confirmation" type="button">${icon('close')}</button></header><div class="confirm-dialog-body"><p id="confirm-message">${message}</p></div><footer><button class="button secondary" data-close-modal data-modal-cancel type="button">Cancel</button><button class="button danger" data-confirm-delete type="button">${confirmLabel}</button></footer></section></div>`,
  );
  const confirmation = drawerRoot.querySelector('.modal-layer');

  confirmation
    .querySelectorAll('[data-close-modal]')
    .forEach((item) => item.addEventListener('click', closeConfirm));
  confirmation
    .querySelector('[data-confirm-delete]')
    .addEventListener('click', () => {
      closeConfirm();
      render(destination);
      showToast(`${confirmLabel} completed`);
    });
  syncDrawerLayers();
  confirmation.querySelector('[data-modal-cancel]').focus();
}

function closeConfirm() {
  drawerRoot.querySelector('.modal-layer')?.remove();
  syncDrawerLayers();
  if (confirmationReturnFocus?.isConnected) confirmationReturnFocus.focus();
  confirmationReturnFocus = null;
}

function afterDrawerAnimation(element, callback) {
  let complete = false;
  const finish = () => {
    if (complete) return;

    complete = true;
    callback();
  };

  element.addEventListener('animationend', finish, {
    once: true,
  });
  window.setTimeout(finish, 260);
}

function closeAttachmentPreview() {
  const attachmentLayer = drawerRoot.querySelector('.attachment-layer');
  const attachmentDrawer = drawerRoot.querySelector('.attachment-drawer');
  const overlay = drawerRoot.querySelector('.drawer-secondary-overlay');

  if (!attachmentLayer || attachmentLayer.classList.contains('closing')) {
    return undefined;
  }

  attachmentLayer.classList.add('closing');
  overlay?.classList.add('closing');
  afterDrawerAnimation(attachmentDrawer, () => {
    attachmentLayer.remove();
    overlay?.remove();
    syncDrawerLayers();
    if (attachmentReturnFocus?.isConnected) attachmentReturnFocus.focus();
    attachmentReturnFocus = null;
  });

  return undefined;
}

function clearDrawerRoot() {
  drawerRoot.innerHTML = '';
  confirmationReturnFocus = null;
  attachmentReturnFocus = null;
}

function closeDrawer(options = {}) {
  const { immediate = false, onClosed = () => {} } = options;
  const drawerLayer = drawerRoot.querySelector('.drawer-layer');
  const drawer = drawerRoot.querySelector('.drawer');

  if (!drawerLayer || immediate) {
    clearDrawerRoot();
    onClosed();

    return undefined;
  }
  if (drawerLayer.classList.contains('closing')) return undefined;

  drawerLayer.classList.add('closing');
  afterDrawerAnimation(drawer, () => {
    clearDrawerRoot();
    onClosed();
  });

  return undefined;
}

function openDrawer(title, description, body, wide = false) {
  drawerRoot.innerHTML = `<div class="drawer-layer ${wide ? 'drawer-layer-wide' : ''}"><button class="drawer-backdrop" data-close-drawer aria-label="Close ${title}"></button><section class="drawer ${wide ? 'drawer-wide' : ''}" role="dialog" aria-modal="true" aria-labelledby="drawer-title"><header><div><span>${description}</span><h2 id="drawer-title">${title}</h2></div><button class="icon-button" data-close-drawer aria-label="Close ${title}" type="button">${icon('close')}</button></header><div class="drawer-body">${body}</div></section></div>`;
  bindDrawerActions();
  drawerRoot.querySelector('.drawer .icon-button').focus();
}

function attachmentPreviewContent() {
  return `<div class="receipt-toolbar"><strong>digitalocean-july.pdf</strong><button class="button secondary" data-download-preview type="button">${icon('download')}Download</button></div><div class="receipt-preview"><span>DIGITALOCEAN</span><strong>Invoice #5720198</strong><dl><div><dt>Invoice date</dt><dd>11 July 2026</dd></div><div><dt>Service period</dt><dd>July 2026</dd></div><div><dt>Subtotal</dt><dd>£107.00</dd></div><div><dt>VAT</dt><dd>£21.40</dd></div><div class="receipt-total"><dt>Total</dt><dd>£128.40</dd></div></dl></div>`;
}

function openAttachmentPreview() {
  attachmentReturnFocus = document.activeElement;
  drawerRoot.querySelector('.attachment-layer')?.remove();
  drawerRoot.querySelector('.drawer-secondary-overlay')?.remove();
  drawerRoot
    .querySelector('.drawer-layer')
    .insertAdjacentHTML(
      'beforeend',
      '<button class="drawer-secondary-overlay" data-close-attachment aria-label="Close file preview"></button>',
    );
  drawerRoot.insertAdjacentHTML(
    'beforeend',
    `<div class="attachment-layer"><section class="attachment-drawer" role="dialog" aria-modal="true" aria-labelledby="attachment-preview-title"><header><div><span>PDF document</span><h2 id="attachment-preview-title">Invoice preview</h2></div><button class="icon-button" data-close-attachment aria-label="Close file preview" type="button">${icon('close')}</button></header><div class="attachment-drawer-body">${attachmentPreviewContent()}</div></section></div>`,
  );
  const attachmentLayer = drawerRoot.querySelector('.attachment-layer');

  drawerRoot
    .querySelectorAll('[data-close-attachment]')
    .forEach((item) => item.addEventListener('click', closeAttachmentPreview));
  attachmentLayer
    .querySelector('[data-download-preview]')
    .addEventListener('click', () => showToast('Attachment download started'));
  syncDrawerLayers();
  attachmentLayer.querySelector('.attachment-drawer .icon-button').focus();
}

function openTransactionDrawer(editing = false) {
  transactionFormType = 'Purchase';
  transactionFormStatus = editing ? 'Confirmed' : '';
  transactionSelectedDate = {
    day: 11,
    month: 6,
    year: 2026,
  };
  transactionCalendarView = {
    month: transactionSelectedDate.month,
    year: transactionSelectedDate.year,
  };
  openDrawer(
    editing ? 'Edit transaction' : 'Record transaction',
    editing
      ? 'Update the transaction and its attachment.'
      : 'Add money coming in or going out.',
    transactionForm(editing),
    true,
  );
}

function openClientDrawer(editing = false) {
  openDrawer(
    editing ? 'Edit client' : 'Add client',
    editing
      ? 'Update Northstar Studio or remove this client.'
      : 'Create a client for sales transactions.',
    clientForm(editing),
  );
}

function openCompanyDrawer() {
  const description = companyWizardStep === 1 ? 'Step 1 of 2' : 'Step 2 of 2';

  openDrawer('Add company', description, companyNew(), true);
}

function bindDrawerActions() {
  drawerRoot
    .querySelectorAll('[data-close-drawer]')
    .forEach((item) => item.addEventListener('click', () => closeDrawer()));
  bindDrawerContentActions();
}

function updateCompanyDrawer() {
  const drawer = drawerRoot.querySelector('.drawer');
  const drawerBody = drawerRoot.querySelector('.drawer-body');
  const drawerDescription = drawerRoot.querySelector('.drawer header span');

  drawerDescription.textContent =
    companyWizardStep === 1 ? 'Step 1 of 2' : 'Step 2 of 2';
  drawerBody.innerHTML = companyNew();
  drawer.scrollTop = 0;
  bindDrawerContentActions();
}

function closeTransactionCalendar(form) {
  const trigger = form.querySelector('[data-date-trigger]');
  const popover = form.querySelector('[data-calendar-popover]');

  popover.hidden = true;
  trigger.setAttribute('aria-expanded', 'false');
}

function bindTransactionCalendarControls(form) {
  const popover = form.querySelector('[data-calendar-popover]');
  const trigger = form.querySelector('[data-date-trigger]');

  popover.querySelectorAll('[data-calendar-move]').forEach((control) =>
    control.addEventListener('click', (event) => {
      event.stopPropagation();
      const direction = control.dataset.calendarMove;
      const nextMonth = new Date(
        transactionCalendarView.year,
        transactionCalendarView.month + Number(direction),
        1,
      );

      transactionCalendarView = {
        month: nextMonth.getMonth(),
        year: nextMonth.getFullYear(),
      };
      popover.innerHTML = calendarContent();
      bindTransactionCalendarControls(form);
      popover.querySelector(`[data-calendar-move="${direction}"]`).focus();
    }),
  );
  popover.querySelectorAll('[data-calendar-day]').forEach((dayButton) =>
    dayButton.addEventListener('click', () => {
      transactionSelectedDate = {
        day: Number(dayButton.dataset.calendarDay),
        month: transactionCalendarView.month,
        year: transactionCalendarView.year,
      };
      form.querySelector('[name="date"]').value = transactionDateValue(
        transactionSelectedDate,
      );
      form.querySelector('[data-date-value]').textContent =
        formatTransactionDate(transactionSelectedDate);
      closeTransactionCalendar(form);
      trigger.focus();
    }),
  );
}

function bindUploadInput(form) {
  const uploadInput = form.querySelector('[data-upload-input]');

  if (!uploadInput) return undefined;

  uploadInput.addEventListener('change', () => {
    const [file] = uploadInput.files;

    if (!file) return undefined;

    const uploadControlElement = uploadInput.closest('.upload-control');

    uploadControlElement.classList.add('has-file');
    uploadControlElement.querySelector('[data-upload-name]').textContent =
      file.name;
  });
}

function bindTransactionForm(form) {
  const editing = form.dataset.editing === 'true';
  const datePicker = form.querySelector('.date-field');
  const dateTrigger = form.querySelector('[data-date-trigger]');

  form.querySelectorAll('[name="transaction-type"]').forEach((control) =>
    control.addEventListener('change', () => {
      transactionFormType = control.value;
      form.querySelector('[data-transaction-party]').innerHTML =
        transactionPartyField(editing, transactionFormType);
      form.querySelector('[data-transaction-amount-fields]').innerHTML =
        transactionAmountFields(editing, transactionFormType);
      form.querySelector('[data-transaction-upload]').innerHTML =
        transactionUploadContent(editing, transactionFormType);
      bindUploadInput(form);
    }),
  );
  form.querySelectorAll('[name="transaction-status"]').forEach((control) =>
    control.addEventListener('change', () => {
      transactionFormStatus = control.value;
      form.querySelector('[data-scheduled-field]').innerHTML =
        transactionFormStatus === 'Pending'
          ? radioGroup(
              'Scheduled transaction',
              'scheduled',
              ['No', 'Yes'],
              'No',
            )
          : '';
    }),
  );
  dateTrigger.addEventListener('click', () => {
    const popover = form.querySelector('[data-calendar-popover]');
    const open = popover.hidden;

    popover.hidden = !open;
    dateTrigger.setAttribute('aria-expanded', String(open));
  });
  datePicker.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape') return;

    closeTransactionCalendar(form);
    dateTrigger.focus();
  });
  datePicker.addEventListener('focusout', () => {
    window.setTimeout(() => {
      if (!datePicker.contains(document.activeElement)) {
        closeTransactionCalendar(form);
      }
    }, 0);
  });
  form.addEventListener('click', (event) => {
    if (!event.target.closest('.date-field')) closeTransactionCalendar(form);
  });
  bindTransactionCalendarControls(form);
  bindUploadInput(form);
}

function bindDrawerContentActions() {
  const drawerBody = drawerRoot.querySelector('.drawer-body');

  drawerBody.querySelectorAll('form').forEach((form) =>
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const destination = form.dataset.saveTo;

      closeDrawer({
        onClosed: () => {
          if (destination) render(destination);
          showToast('Changes saved');
        },
      });
    }),
  );
  drawerBody.querySelectorAll('[data-action]').forEach((item) =>
    item.addEventListener('click', () => {
      const { action } = item.dataset;

      if (action === 'close-drawer') closeDrawer();
      if (action === 'company-next') {
        companyWizardStep = 2;
        updateCompanyDrawer();
      }
      if (action === 'company-back') {
        companyWizardStep = 1;
        updateCompanyDrawer();
      }
      if (action === 'delete-transaction')
        openConfirm(
          'Delete transaction?',
          'DigitalOcean and its attachment will be permanently removed.',
          'Delete transaction',
          'transactions',
        );
      if (action === 'delete-attachment')
        openConfirm(
          'Delete attached file?',
          'The transaction will remain, but its receipt will be permanently removed.',
          'Delete file',
          'transactions',
        );
      if (action === 'delete-client')
        openConfirm(
          'Delete Northstar Studio?',
          'The client will be removed. Existing transactions will remain.',
          'Delete client',
          'clients',
        );
      if (action === 'delete-company')
        openConfirm(
          'Delete Motech Development?',
          'Company records, clients, reports, and transactions will be permanently removed.',
          'Delete company',
          'companies',
        );
      if (action === 'view-attachment') {
        openAttachmentPreview();
      }
    }),
  );
  const activeTransactionForm = drawerBody.querySelector('.transaction-form');

  if (activeTransactionForm) bindTransactionForm(activeTransactionForm);
}

function render(view) {
  closeDrawer({
    immediate: true,
  });
  closeMenus();
  closeMobileProfileMenu();
  activeView = views[view] ? view : 'not-found';
  if (activeView === 'companies') selectedCompany = null;
  const signedOut = activeView === 'login' || activeView === 'not-found';
  const shouldShowScenario = !signedOut && screenMeta[activeView];
  const screen =
    viewState === 'ready' || !shouldShowScenario
      ? views[activeView]()
      : scenario(activeView);

  appShell.classList.toggle('app-shell--signed-out', signedOut);
  prototypeStateControl.hidden = signedOut;
  appShell.classList.toggle(
    'app-shell--no-company',
    !signedOut && selectedCompany === null,
  );
  syncCompanyContext();
  content.innerHTML = screen;
  document.querySelectorAll('[data-view]').forEach((navButton) => {
    const selected = navButton.dataset.view === activeNavigation[activeView];

    navButton.classList.toggle('active', selected);
    navButton.setAttribute('aria-current', selected ? 'page' : 'false');
  });
  bindScreenActions();
  syncPrototypeStateControl();
  window.scrollTo({
    behavior: 'smooth',
    top: 0,
  });
}

function bindScreenActions() {
  content
    .querySelectorAll('[data-go]')
    .forEach((item) =>
      item.addEventListener('click', () => render(item.dataset.go)),
    );
  content
    .querySelectorAll('[data-transaction]')
    .forEach((item) =>
      item.addEventListener('click', () => openTransactionDrawer(true)),
    );
  content.querySelectorAll('form').forEach((form) =>
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const destination = form.dataset.saveTo;

      if (destination) {
        render(destination);
        showToast('Changes saved');
      }
    }),
  );
  content.querySelectorAll('[data-action]').forEach((item) =>
    item.addEventListener('click', () => {
      const { action } = item.dataset;
      const destinations = {
        pending: 'pending',
        transactions: 'transactions',
        clients: 'clients',
        reports: 'reports',
        companies: 'companies',
        overview: 'overview',
        login: 'companies',
        retry: activeView,
      };

      if (destinations[action]) {
        viewState = 'ready';
        render(destinations[action]);
      }
      if (action === 'record') openTransactionDrawer();
      if (action === 'add-client') openClientDrawer();
      if (action === 'edit-client') openClientDrawer(true);
      if (action === 'create-report')
        openDrawer(
          'Create report',
          'Choose the records to export.',
          reportForm(),
        );
      if (action === 'add-company') {
        companyWizardStep = 1;
        openCompanyDrawer();
      }
      if (action === 'select-company') selectCompany(item);
      if (action === 'delete-transaction')
        openConfirm(
          'Delete transaction?',
          'DigitalOcean and its attachment will be permanently removed.',
          'Delete transaction',
          'transactions',
        );
      if (action === 'delete-attachment')
        openConfirm(
          'Delete attached file?',
          'The transaction will remain, but its receipt will be permanently removed.',
          'Delete file',
          activeView,
        );
      if (action === 'delete-client')
        openConfirm(
          'Delete Northstar Studio?',
          'The client will be removed. Existing transactions will remain.',
          'Delete client',
          'clients',
        );
      if (action === 'delete-company')
        openConfirm(
          'Delete Motech Development?',
          'Company records, clients, reports, and transactions will be permanently removed.',
          'Delete company',
          'companies',
        );
    }),
  );
}

document.querySelectorAll('[data-view]').forEach((navButton) =>
  navButton.addEventListener('click', () => {
    viewState = 'ready';
    render(navButton.dataset.view);
    closeNav();
  }),
);

const companyTrigger = document.querySelector('#company-trigger');
const profileTrigger = document.querySelector('#profile-trigger');
const companyMenu = document.querySelector('#company-menu');
const profileMenu = document.querySelector('#profile-menu');
const mobileProfileTrigger = document.querySelector('#mobile-profile-trigger');
const mobileProfileMenu = document.querySelector('#mobile-profile-menu');

function syncCompanyContext() {
  const companyInitial = companyTrigger.querySelector('.company-initial');
  const companyLabel = companyTrigger.querySelector('small');
  const companyName = companyTrigger.querySelector('strong');
  const companyOptions = companyMenu.querySelectorAll(
    '[data-action="select-company"]',
  );

  companyInitial.innerHTML = selectedCompany
    ? selectedCompany.initial
    : icon('building');
  companyLabel.textContent = selectedCompany ? 'Current company' : 'Company';
  companyName.textContent = selectedCompany
    ? selectedCompany.name
    : 'Select company';
  companyOptions.forEach((option) => {
    const optionName = option.querySelector('strong').textContent;
    const selected = selectedCompany?.name === optionName;

    option.classList.toggle('selected', selected);
    option.setAttribute('aria-pressed', String(selected));
  });
}

function selectCompany(item) {
  selectedCompany = {
    initial:
      item.dataset.companyInitial ||
      item.querySelector('.company-initial').textContent.trim(),
    name: item.dataset.companyName || item.querySelector('strong').textContent,
  };
  viewState = 'ready';
  render('overview');
  closeNav();
}

function toggleMenu(trigger, menu, otherTrigger, otherMenu) {
  const nextOpen = menu.hidden;

  closeMobileProfileMenu();
  menu.hidden = !nextOpen;
  trigger.classList.toggle('selected', nextOpen);
  trigger.setAttribute('aria-expanded', String(nextOpen));
  otherMenu.hidden = true;
  otherTrigger.classList.remove('selected');
  otherTrigger.setAttribute('aria-expanded', 'false');
}

function closeMenus() {
  companyMenu.hidden = true;
  profileMenu.hidden = true;
  companyTrigger.classList.remove('selected');
  profileTrigger.classList.remove('selected');
  companyTrigger.setAttribute('aria-expanded', 'false');
  profileTrigger.setAttribute('aria-expanded', 'false');
}

function closeMobileProfileMenu() {
  mobileProfileMenu.hidden = true;
  mobileProfileTrigger.setAttribute('aria-expanded', 'false');
}

companyTrigger.addEventListener('click', () =>
  toggleMenu(companyTrigger, companyMenu, profileTrigger, profileMenu),
);
profileTrigger.addEventListener('click', () =>
  toggleMenu(profileTrigger, profileMenu, companyTrigger, companyMenu),
);
mobileProfileTrigger.addEventListener('click', () => {
  const nextOpen = mobileProfileMenu.hidden;

  closeMenus();
  mobileProfileMenu.hidden = !nextOpen;
  mobileProfileTrigger.setAttribute('aria-expanded', String(nextOpen));
});

document.querySelectorAll('[data-action="manage-companies"]').forEach((item) =>
  item.addEventListener('click', () => {
    viewState = 'ready';
    render('companies');
    closeNav();
  }),
);
document.querySelectorAll('[data-action="add-company"]').forEach((item) =>
  item.addEventListener('click', () => {
    companyWizardStep = 1;
    viewState = 'ready';
    render('companies');
    openCompanyDrawer();
  }),
);
document
  .querySelectorAll('[data-action="select-company"]')
  .forEach((item) => item.addEventListener('click', () => selectCompany(item)));
document.querySelectorAll('[data-action="view-reports"]').forEach((item) =>
  item.addEventListener('click', () => {
    viewState = 'ready';
    render('reports');
  }),
);
document
  .querySelectorAll('[data-action="sign-out"]')
  .forEach((item) => item.addEventListener('click', () => render('login')));

function closeNav() {
  sidebar.classList.remove('open');
  navBackdrop.hidden = true;
  closeMenus();
}

document.querySelector('#open-nav').addEventListener('click', () => {
  sidebar.classList.add('open');
  navBackdrop.hidden = false;
});
document
  .querySelectorAll('[data-close-nav]')
  .forEach((item) => item.addEventListener('click', closeNav));

prototypeStateTrigger.addEventListener('click', () => {
  const nextOpen = prototypeStateMenu.hidden;

  prototypeStateMenu.hidden = !nextOpen;
  prototypeStateMenu.dataset.state = nextOpen ? 'open' : 'closed';
  prototypeStateTrigger.setAttribute('aria-expanded', String(nextOpen));
});

prototypeStateControl
  .querySelectorAll('[data-preview-state]')
  .forEach((option) =>
    option.addEventListener('click', () => {
      viewState = option.dataset.previewState;
      closePrototypeStateMenu();
      render(activeView);
      prototypeStateTrigger.focus();
    }),
  );

document.addEventListener('click', (event) => {
  const { target } = event;

  if (!(target instanceof Element)) return;
  if (!target.closest('.popover-anchor')) closeMenus();
  if (!target.closest('#prototype-state-control')) closePrototypeStateMenu();
  if (
    !target.closest('#mobile-profile-trigger') &&
    !target.closest('#mobile-profile-menu')
  )
    closeMobileProfileMenu();
});

document.addEventListener('focusin', (event) => {
  const { target } = event;

  if (!(target instanceof Element)) return;
  if (!target.closest('.popover-anchor')) closeMenus();
  if (!target.closest('#prototype-state-control')) closePrototypeStateMenu();
  if (
    !target.closest('#mobile-profile-trigger') &&
    !target.closest('#mobile-profile-menu')
  )
    closeMobileProfileMenu();
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    if (!prototypeStateMenu.hidden) {
      closePrototypeStateMenu();
      prototypeStateTrigger.focus();

      return;
    }
    if (drawerRoot.querySelector('.modal-layer')) {
      closeConfirm();
    } else if (drawerRoot.querySelector('.attachment-layer')) {
      closeAttachmentPreview();
    } else {
      closeDrawer();
    }
    closeMenus();
    closeMobileProfileMenu();
    closeNav();
  }
});

render(activeView);
