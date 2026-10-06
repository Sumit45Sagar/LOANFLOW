// ═══════════════════════════════════════════════════════════════
// LoanFlow ERP – Mock Data Store & Seed Data
// Provides realistic seed data and localStorage-based persistence
// ═══════════════════════════════════════════════════════════════

const STORAGE_KEY = 'loanflow_erp_data';

// ── Utility Helpers ─────────────────────────────────────────
const generateId = () => 'LF' + Date.now().toString(36).toUpperCase() + Math.random().toString(36).substr(2, 4).toUpperCase();
const randomFrom = arr => arr[Math.floor(Math.random() * arr.length)];
const randomBetween = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const formatCurrency = (amount) => '₹' + Number(amount).toLocaleString('en-IN');
const today = new Date();
const daysAgo = (n) => { const d = new Date(today); d.setDate(d.getDate() - n); return d.toISOString().split('T')[0]; };

// ── Seed Data ───────────────────────────────────────────────
const LOAN_TYPES = ['Personal Loan', 'Business Loan', 'Home Loan', 'Auto Loan', 'Gold Loan', 'Education Loan', 'Microfinance'];
const LOAN_STATUSES = ['Applied', 'Under Review', 'Approved', 'Disbursed', 'Active', 'Closed', 'Rejected', 'NPA'];
const LEAD_SOURCES = ['Website', 'Referral', 'Walk-in', 'WhatsApp', 'Partner API', 'Social Media', 'Call Center'];
const LEAD_STATUSES = ['New', 'Contacted', 'Qualified', 'Proposal Sent', 'Won', 'Lost'];
const COLLECTION_BUCKETS = ['Current', '0-30 DPD', '31-60 DPD', '61-90 DPD', '90+ DPD', 'NPA'];
const ROLES = ['Admin', 'Loan Officer', 'Underwriter', 'Collection Agent', 'Auditor'];

const FIRST_NAMES = ['Aarav', 'Vivaan', 'Aditya', 'Vihaan', 'Arjun', 'Sai', 'Reyansh', 'Ayaan', 'Krishna', 'Ishaan',
  'Priya', 'Ananya', 'Sneha', 'Kavitha', 'Meera', 'Divya', 'Ritu', 'Pooja', 'Neha', 'Sunita',
  'Rahul', 'Amit', 'Deepak', 'Rajesh', 'Suresh', 'Manoj', 'Vikram', 'Karthik', 'Ganesh', 'Prakash'];
const LAST_NAMES = ['Sharma', 'Patel', 'Singh', 'Kumar', 'Reddy', 'Nair', 'Gupta', 'Joshi', 'Mehta', 'Verma',
  'Yadav', 'Rao', 'Iyer', 'Pillai', 'Bhat', 'Desai', 'Kulkarni', 'Agarwal', 'Chopra', 'Malhotra'];
const CITIES = ['Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai', 'Kolkata', 'Pune', 'Ahmedabad', 'Jaipur', 'Lucknow'];
const COMPANIES = ['TCS', 'Infosys', 'Wipro', 'HCL', 'Reliance', 'Tata Motors', 'Self-Employed', 'Flipkart', 'Zomato', 'Paytm'];

function generateCustomer(i) {
  const first = randomFrom(FIRST_NAMES);
  const last = randomFrom(LAST_NAMES);
  const city = randomFrom(CITIES);
  return {
    id: `CUST${String(i + 1).padStart(5, '0')}`,
    firstName: first,
    lastName: last,
    fullName: `${first} ${last}`,
    email: `${first.toLowerCase()}.${last.toLowerCase()}${randomBetween(1, 99)}@email.com`,
    phone: `+91 ${randomBetween(70000, 99999)} ${randomBetween(10000, 99999)}`,
    pan: `${String.fromCharCode(65 + randomBetween(0, 25))}${String.fromCharCode(65 + randomBetween(0, 25))}${String.fromCharCode(65 + randomBetween(0, 25))}P${String.fromCharCode(65 + randomBetween(0, 25))}${randomBetween(1000, 9999)}${String.fromCharCode(65 + randomBetween(0, 25))}`,
    aadhaar: `XXXX XXXX ${randomBetween(1000, 9999)}`,
    dob: `${randomBetween(1975, 2000)}-${String(randomBetween(1, 12)).padStart(2, '0')}-${String(randomBetween(1, 28)).padStart(2, '0')}`,
    address: `${randomBetween(1, 500)}, ${randomFrom(['MG Road', 'Gandhi Nagar', 'Nehru Street', 'Station Road', 'Civil Lines'])}`,
    city,
    state: randomFrom(['Maharashtra', 'Karnataka', 'Tamil Nadu', 'Delhi', 'Gujarat', 'Rajasthan']),
    pincode: String(randomBetween(100000, 999999)),
    occupation: randomFrom(['Salaried', 'Self-Employed', 'Business Owner', 'Professional', 'Freelancer']),
    employer: randomFrom(COMPANIES),
    monthlyIncome: randomBetween(25000, 500000),
    creditScore: randomBetween(550, 850),
    kycStatus: randomFrom(['Verified', 'Pending', 'Rejected']),
    riskCategory: randomFrom(['Low', 'Medium', 'High']),
    totalLoans: randomBetween(0, 5),
    activeLoans: randomBetween(0, 3),
    createdAt: daysAgo(randomBetween(10, 365)),
    source: randomFrom(LEAD_SOURCES),
    notes: []
  };
}

function generateLoan(i, customers) {
  const customer = randomFrom(customers);
  const loanType = randomFrom(LOAN_TYPES);
  const status = randomFrom(LOAN_STATUSES);
  const principal = randomBetween(50000, 5000000);
  const rate = randomBetween(8, 24);
  const tenure = randomFrom([6, 12, 18, 24, 36, 48, 60]);
  const monthlyRate = rate / 12 / 100;
  const emi = Math.round(principal * monthlyRate * Math.pow(1 + monthlyRate, tenure) / (Math.pow(1 + monthlyRate, tenure) - 1));
  const disbursedDate = daysAgo(randomBetween(5, 300));
  const paidInstallments = status === 'Active' || status === 'Closed' ? randomBetween(1, Math.min(tenure, 12)) : 0;
  const outstandingPrincipal = Math.max(0, principal - Math.round(paidInstallments * (emi - (principal * monthlyRate))));

  return {
    id: `LOAN${String(i + 1).padStart(6, '0')}`,
    customerId: customer.id,
    customerName: customer.fullName,
    loanType,
    status,
    principal,
    interestRate: rate,
    tenure,
    emi,
    totalPayable: emi * tenure,
    disbursedDate: ['Disbursed', 'Active', 'Closed', 'NPA'].includes(status) ? disbursedDate : null,
    applicationDate: daysAgo(randomBetween(5, 350)),
    approvedDate: ['Approved', 'Disbursed', 'Active', 'Closed'].includes(status) ? daysAgo(randomBetween(3, 330)) : null,
    maturityDate: daysAgo(-tenure * 30),
    paidInstallments,
    remainingInstallments: tenure - paidInstallments,
    outstandingPrincipal,
    totalInterestEarned: paidInstallments * (emi - Math.round(outstandingPrincipal / (tenure - paidInstallments + 1))),
    nextDueDate: daysAgo(-randomBetween(1, 30)),
    dpd: status === 'NPA' ? randomBetween(91, 365) : (status === 'Active' ? randomBetween(0, 60) : 0),
    collateralType: loanType === 'Gold Loan' ? 'Gold' : loanType === 'Home Loan' ? 'Property' : loanType === 'Auto Loan' ? 'Vehicle' : 'None',
    collateralValue: loanType !== 'Personal Loan' ? randomBetween(principal, principal * 2) : 0,
    processingFee: Math.round(principal * 0.02),
    loanOfficer: `${randomFrom(FIRST_NAMES)} ${randomFrom(LAST_NAMES)}`,
    assignedUnderwriter: `${randomFrom(FIRST_NAMES)} ${randomFrom(LAST_NAMES)}`,
    remarks: '',
    documents: ['ID Proof', 'Address Proof', 'Income Proof', 'Bank Statement'],
    repaymentSchedule: generateRepaymentSchedule(principal, rate, tenure, emi, disbursedDate),
    approvalStage: randomFrom(['KYC Check', 'Credit Analysis', 'Underwriting', 'Final Approval', 'Completed']),
  };
}

function generateRepaymentSchedule(principal, rate, tenure, emi, startDate) {
  const schedule = [];
  let balance = principal;
  const monthlyRate = rate / 12 / 100;
  const start = new Date(startDate || today);

  for (let i = 1; i <= Math.min(tenure, 12); i++) {
    const interest = Math.round(balance * monthlyRate);
    const principalPart = emi - interest;
    balance = Math.max(0, balance - principalPart);
    const dueDate = new Date(start);
    dueDate.setMonth(dueDate.getMonth() + i);
    const isPaid = i <= randomBetween(1, 8);

    schedule.push({
      installment: i,
      dueDate: dueDate.toISOString().split('T')[0],
      emi,
      principal: principalPart,
      interest,
      balance: Math.max(0, balance),
      status: isPaid ? 'Paid' : (i <= 3 ? 'Overdue' : 'Upcoming'),
      paidDate: isPaid ? dueDate.toISOString().split('T')[0] : null,
      penalty: !isPaid && i <= 3 ? randomBetween(200, 1500) : 0,
    });
  }
  return schedule;
}

function generateLead(i) {
  const first = randomFrom(FIRST_NAMES);
  const last = randomFrom(LAST_NAMES);
  return {
    id: `LEAD${String(i + 1).padStart(5, '0')}`,
    name: `${first} ${last}`,
    email: `${first.toLowerCase()}@email.com`,
    phone: `+91 ${randomBetween(70000, 99999)} ${randomBetween(10000, 99999)}`,
    source: randomFrom(LEAD_SOURCES),
    status: randomFrom(LEAD_STATUSES),
    loanType: randomFrom(LOAN_TYPES),
    requestedAmount: randomBetween(100000, 3000000),
    assignedTo: `${randomFrom(FIRST_NAMES)} ${randomFrom(LAST_NAMES)}`,
    lastContactDate: daysAgo(randomBetween(0, 30)),
    nextFollowUp: daysAgo(-randomBetween(1, 14)),
    score: randomBetween(1, 10),
    notes: randomFrom(['Interested in quick processing', 'Needs lower interest rate', 'Comparing with other lenders', 'Ready to proceed', 'Needs more documentation']),
    createdAt: daysAgo(randomBetween(1, 60)),
    city: randomFrom(CITIES),
  };
}

function generateCollectionCase(i, loans) {
  const delinquentLoans = loans.filter(l => l.status === 'Active' || l.status === 'NPA');
  const loan = delinquentLoans.length > 0 ? randomFrom(delinquentLoans) : randomFrom(loans);
  const dpd = randomBetween(1, 180);
  let bucket;
  if (dpd === 0) bucket = 'Current';
  else if (dpd <= 30) bucket = '0-30 DPD';
  else if (dpd <= 60) bucket = '31-60 DPD';
  else if (dpd <= 90) bucket = '61-90 DPD';
  else bucket = '90+ DPD';

  return {
    id: `COL${String(i + 1).padStart(5, '0')}`,
    loanId: loan.id,
    customerName: loan.customerName,
    customerId: loan.customerId,
    loanType: loan.loanType,
    outstandingAmount: randomBetween(5000, 200000),
    emiAmount: loan.emi,
    dpd,
    bucket,
    assignedAgent: `${randomFrom(FIRST_NAMES)} ${randomFrom(LAST_NAMES)}`,
    status: randomFrom(['Open', 'In Progress', 'PTP', 'Resolved', 'Escalated', 'Legal']),
    lastAction: randomFrom(['Call Made', 'SMS Sent', 'Visit Done', 'Email Sent', 'Legal Notice']),
    lastActionDate: daysAgo(randomBetween(0, 15)),
    nextActionDate: daysAgo(-randomBetween(1, 10)),
    ptpDate: dpd > 30 ? daysAgo(-randomBetween(1, 15)) : null,
    ptpAmount: dpd > 30 ? randomBetween(5000, 50000) : null,
    priority: dpd > 90 ? 'Critical' : dpd > 60 ? 'High' : dpd > 30 ? 'Medium' : 'Low',
    totalCalls: randomBetween(0, 20),
    totalVisits: randomBetween(0, 5),
    notes: [],
  };
}

function generateUsers() {
  return [
    { id: 'USR001', name: 'Sumit Sagar', email: 'sumit@loanflow.com', role: 'Admin', status: 'Active', lastLogin: daysAgo(0), avatar: 'SS' },
    { id: 'USR002', name: 'Priya Sharma', email: 'priya@loanflow.com', role: 'Loan Officer', status: 'Active', lastLogin: daysAgo(0), avatar: 'PS' },
    { id: 'USR003', name: 'Rahul Gupta', email: 'rahul@loanflow.com', role: 'Underwriter', status: 'Active', lastLogin: daysAgo(1), avatar: 'RG' },
    { id: 'USR004', name: 'Kavitha Nair', email: 'kavitha@loanflow.com', role: 'Collection Agent', status: 'Active', lastLogin: daysAgo(0), avatar: 'KN' },
    { id: 'USR005', name: 'Amit Patel', email: 'amit@loanflow.com', role: 'Auditor', status: 'Active', lastLogin: daysAgo(2), avatar: 'AP' },
    { id: 'USR006', name: 'Deepak Reddy', email: 'deepak@loanflow.com', role: 'Loan Officer', status: 'Inactive', lastLogin: daysAgo(30), avatar: 'DR' },
    { id: 'USR007', name: 'Meera Joshi', email: 'meera@loanflow.com', role: 'Loan Officer', status: 'Active', lastLogin: daysAgo(0), avatar: 'MJ' },
    { id: 'USR008', name: 'Vikram Singh', email: 'vikram@loanflow.com', role: 'Collection Agent', status: 'Active', lastLogin: daysAgo(1), avatar: 'VS' },
  ];
}

function generateJournalEntries(loans) {
  const entries = [];
  const types = ['Disbursement', 'EMI Receipt', 'Interest Income', 'Fee Income', 'Penalty Income', 'Provision', 'Write-Off'];

  for (let i = 0; i < 50; i++) {
    const loan = randomFrom(loans);
    const type = randomFrom(types);
    let debit = '', credit = '', amount = 0;

    switch (type) {
      case 'Disbursement':
        debit = 'Loan Portfolio'; credit = 'Bank Account'; amount = loan.principal;
        break;
      case 'EMI Receipt':
        debit = 'Bank Account'; credit = 'Loan Portfolio'; amount = loan.emi;
        break;
      case 'Interest Income':
        debit = 'Interest Receivable'; credit = 'Interest Income'; amount = Math.round(loan.emi * 0.4);
        break;
      case 'Fee Income':
        debit = 'Bank Account'; credit = 'Fee Income'; amount = loan.processingFee;
        break;
      case 'Penalty Income':
        debit = 'Bank Account'; credit = 'Penalty Income'; amount = randomBetween(200, 2000);
        break;
      case 'Provision':
        debit = 'Provision Expense'; credit = 'Provision for Bad Debts'; amount = randomBetween(5000, 50000);
        break;
      case 'Write-Off':
        debit = 'Bad Debt Expense'; credit = 'Loan Portfolio'; amount = randomBetween(10000, 100000);
        break;
    }

    entries.push({
      id: `JE${String(i + 1).padStart(5, '0')}`,
      date: daysAgo(randomBetween(0, 90)),
      type,
      loanId: loan.id,
      customerName: loan.customerName,
      debitAccount: debit,
      creditAccount: credit,
      amount,
      narration: `${type} for ${loan.id} - ${loan.customerName}`,
      status: randomFrom(['Posted', 'Pending', 'Reversed']),
      createdBy: randomFrom(['System', 'Priya Sharma', 'Amit Patel']),
    });
  }
  return entries.sort((a, b) => new Date(b.date) - new Date(a.date));
}

function generateAuditLog() {
  const actions = [
    { action: 'Login', module: 'Auth', detail: 'User logged in successfully' },
    { action: 'Loan Created', module: 'LOS', detail: 'New loan application created' },
    { action: 'Loan Approved', module: 'LOS', detail: 'Loan application approved by underwriter' },
    { action: 'Disbursement', module: 'LMS', detail: 'Loan amount disbursed to borrower' },
    { action: 'EMI Collected', module: 'LMS', detail: 'EMI payment received' },
    { action: 'Customer Updated', module: 'CRM', detail: 'Customer profile information updated' },
    { action: 'Document Uploaded', module: 'KYC', detail: 'KYC document uploaded' },
    { action: 'Role Changed', module: 'Admin', detail: 'User role permissions modified' },
    { action: 'Collection Call', module: 'Collections', detail: 'Collection call logged' },
    { action: 'Report Generated', module: 'Reports', detail: 'Monthly report exported' },
  ];

  const logs = [];
  for (let i = 0; i < 100; i++) {
    const a = randomFrom(actions);
    logs.push({
      id: `AUD${String(i + 1).padStart(5, '0')}`,
      timestamp: new Date(today.getTime() - randomBetween(0, 30 * 24 * 60 * 60 * 1000)).toISOString(),
      user: randomFrom(['Sumit Sagar', 'Priya Sharma', 'Rahul Gupta', 'Kavitha Nair', 'Amit Patel']),
      action: a.action,
      module: a.module,
      detail: a.detail,
      ipAddress: `192.168.${randomBetween(1, 10)}.${randomBetween(1, 254)}`,
      status: randomFrom(['Success', 'Success', 'Success', 'Failed']),
    });
  }
  return logs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
}

// ── Chart of Accounts ───────────────────────────────────────
const CHART_OF_ACCOUNTS = [
  { code: '1001', name: 'Cash & Bank', type: 'Asset', category: 'Current Asset', balance: randomBetween(5000000, 20000000) },
  { code: '1010', name: 'Loan Portfolio - Personal', type: 'Asset', category: 'Current Asset', balance: randomBetween(10000000, 50000000) },
  { code: '1011', name: 'Loan Portfolio - Business', type: 'Asset', category: 'Current Asset', balance: randomBetween(5000000, 30000000) },
  { code: '1012', name: 'Loan Portfolio - Home', type: 'Asset', category: 'Current Asset', balance: randomBetween(20000000, 80000000) },
  { code: '1020', name: 'Interest Receivable', type: 'Asset', category: 'Current Asset', balance: randomBetween(500000, 3000000) },
  { code: '1030', name: 'Processing Fee Receivable', type: 'Asset', category: 'Current Asset', balance: randomBetween(100000, 500000) },
  { code: '1100', name: 'Fixed Assets', type: 'Asset', category: 'Fixed Asset', balance: randomBetween(2000000, 5000000) },
  { code: '2001', name: 'Borrowings', type: 'Liability', category: 'Current Liability', balance: randomBetween(20000000, 60000000) },
  { code: '2010', name: 'Security Deposits', type: 'Liability', category: 'Current Liability', balance: randomBetween(1000000, 5000000) },
  { code: '2020', name: 'Provision for Bad Debts', type: 'Liability', category: 'Current Liability', balance: randomBetween(500000, 3000000) },
  { code: '3001', name: 'Share Capital', type: 'Equity', category: 'Capital', balance: randomBetween(10000000, 30000000) },
  { code: '3010', name: 'Retained Earnings', type: 'Equity', category: 'Reserves', balance: randomBetween(2000000, 10000000) },
  { code: '4001', name: 'Interest Income', type: 'Revenue', category: 'Operating Revenue', balance: randomBetween(5000000, 15000000) },
  { code: '4010', name: 'Processing Fee Income', type: 'Revenue', category: 'Operating Revenue', balance: randomBetween(500000, 2000000) },
  { code: '4020', name: 'Penalty Income', type: 'Revenue', category: 'Non-Operating Revenue', balance: randomBetween(100000, 500000) },
  { code: '5001', name: 'Interest Expense', type: 'Expense', category: 'Operating Expense', balance: randomBetween(2000000, 8000000) },
  { code: '5010', name: 'Salary Expense', type: 'Expense', category: 'Operating Expense', balance: randomBetween(1000000, 4000000) },
  { code: '5020', name: 'Provision Expense', type: 'Expense', category: 'Operating Expense', balance: randomBetween(500000, 2000000) },
  { code: '5030', name: 'Admin & Other Expenses', type: 'Expense', category: 'Operating Expense', balance: randomBetween(200000, 1000000) },
];

// ── Initialize / Load Data ──────────────────────────────────
function initializeData() {
  const existing = localStorage.getItem(STORAGE_KEY);
  if (existing) {
    try {
      return JSON.parse(existing);
    } catch {
      // corrupt data, regenerate
    }
  }

  const customers = Array.from({ length: 60 }, (_, i) => generateCustomer(i));
  const loans = Array.from({ length: 80 }, (_, i) => generateLoan(i, customers));
  const leads = Array.from({ length: 40 }, (_, i) => generateLead(i));
  const collections = Array.from({ length: 35 }, (_, i) => generateCollectionCase(i, loans));
  const users = generateUsers();
  const journalEntries = generateJournalEntries(loans);
  const auditLog = generateAuditLog();

  const data = {
    customers,
    loans,
    leads,
    collections,
    users,
    journalEntries,
    auditLog,
    chartOfAccounts: CHART_OF_ACCOUNTS,
    settings: {
      companyName: 'LoanFlow Finance Pvt. Ltd.',
      currency: 'INR',
      currencySymbol: '₹',
      dateFormat: 'DD/MM/YYYY',
      fiscalYearStart: '04',
      defaultInterestRate: 12,
      lateFeePercent: 2,
      gracePeriodDays: 5,
    },
    notifications: [
      { id: 'n1', message: '15 loans pending approval', type: 'warning', read: false, time: 'Just now' },
      { id: 'n2', message: '₹12.5L EMI collected today', type: 'success', read: false, time: '10 min ago' },
      { id: 'n3', message: '8 accounts moved to NPA', type: 'danger', read: false, time: '1 hour ago' },
      { id: 'n4', message: 'Monthly report ready for download', type: 'info', read: true, time: '3 hours ago' },
    ],
  };

  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  return data;
}

function saveData(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function resetData() {
  localStorage.removeItem(STORAGE_KEY);
  return initializeData();
}

// ── Dashboard Stats ─────────────────────────────────────────
function getDashboardStats(data) {
  const activeLoans = data.loans.filter(l => l.status === 'Active' || l.status === 'Disbursed');
  const totalDisbursed = activeLoans.reduce((sum, l) => sum + l.principal, 0);
  const totalOutstanding = activeLoans.reduce((sum, l) => sum + l.outstandingPrincipal, 0);
  const npaLoans = data.loans.filter(l => l.status === 'NPA');
  const npaAmount = npaLoans.reduce((sum, l) => sum + l.outstandingPrincipal, 0);
  const todayCollections = randomBetween(800000, 2500000);
  const monthlyCollections = randomBetween(15000000, 35000000);
  const approvalPending = data.loans.filter(l => l.status === 'Applied' || l.status === 'Under Review').length;

  return {
    totalAUM: totalDisbursed,
    totalOutstanding,
    activeLoansCount: activeLoans.length,
    totalCustomers: data.customers.length,
    npaPercentage: activeLoans.length > 0 ? ((npaLoans.length / activeLoans.length) * 100).toFixed(1) : 0,
    npaAmount,
    todayCollections,
    monthlyCollections,
    approvalPending,
    totalLeads: data.leads.length,
    newLeadsToday: data.leads.filter(l => l.createdAt === daysAgo(0)).length + randomBetween(2, 8),
    collectionEfficiency: randomBetween(82, 96),
    avgTicketSize: activeLoans.length > 0 ? Math.round(totalDisbursed / activeLoans.length) : 0,
    disbursementThisMonth: randomBetween(10000000, 30000000),
    interestIncome: randomBetween(3000000, 8000000),
  };
}

// ── Chart Data ──────────────────────────────────────────────
function getChartData() {
  const months = ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'];

  return {
    disbursementTrend: months.map(m => ({
      month: m,
      amount: randomBetween(10000000, 35000000),
      count: randomBetween(30, 80),
    })),
    collectionTrend: months.map(m => ({
      month: m,
      collected: randomBetween(8000000, 25000000),
      target: randomBetween(10000000, 28000000),
    })),
    portfolioByProduct: LOAN_TYPES.slice(0, 5).map(type => ({
      name: type.replace(' Loan', ''),
      value: randomBetween(5000000, 50000000),
      count: randomBetween(10, 60),
    })),
    dpdDistribution: [
      { bucket: 'Current', count: randomBetween(200, 400), amount: randomBetween(50000000, 100000000) },
      { bucket: '0-30 DPD', count: randomBetween(20, 60), amount: randomBetween(5000000, 15000000) },
      { bucket: '31-60 DPD', count: randomBetween(10, 30), amount: randomBetween(2000000, 8000000) },
      { bucket: '61-90 DPD', count: randomBetween(5, 15), amount: randomBetween(1000000, 5000000) },
      { bucket: '90+ DPD', count: randomBetween(3, 10), amount: randomBetween(500000, 3000000) },
    ],
    leadConversion: months.map(m => ({
      month: m,
      leads: randomBetween(30, 80),
      converted: randomBetween(10, 40),
    })),
    riskDistribution: [
      { category: 'Low Risk', value: randomBetween(40, 55) },
      { category: 'Medium Risk', value: randomBetween(25, 35) },
      { category: 'High Risk', value: randomBetween(10, 20) },
    ],
  };
}

export {
  initializeData,
  saveData,
  resetData,
  getDashboardStats,
  getChartData,
  formatCurrency,
  generateId,
  LOAN_TYPES,
  LOAN_STATUSES,
  LEAD_SOURCES,
  LEAD_STATUSES,
  COLLECTION_BUCKETS,
  ROLES,
};
