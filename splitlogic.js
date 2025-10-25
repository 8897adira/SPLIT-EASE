export function calculateSettlements(members) {
  // members = [{ name: 'Aditi', paid: 1000 }, { name: 'Tony', paid: 500 }]
  
  const total = members.reduce((sum, m) => sum + m.paid, 0);
  const fairShare = total / members.length;
  
  const balances = members.map((m) => ({
    name: m.name,
    balance: m.paid - fairShare,
  }));

  const debtors = [];
  const creditors = [];

  balances.forEach((b) => {
    if (b.balance < -0.01) debtors.push({ ...b });
    else if (b.balance > 0.01) creditors.push({ ...b });
  });

  const settlements = [];

  while (debtors.length && creditors.length) {
    const debtor = debtors[0];
    const creditor = creditors[0];

    const amount = Math.min(creditor.balance, -debtor.balance);

    settlements.push({
      from: debtor.name,
      to: creditor.name,
      amount: amount.toFixed(2),
    });

    debtor.balance += amount;
    creditor.balance -= amount;

    if (Math.abs(debtor.balance) < 0.01) debtors.shift();
    if (Math.abs(creditor.balance) < 0.01) creditors.shift();
  }

  return {
    total,
    fairShare: fairShare.toFixed(2),
    settlements,
  };
}
