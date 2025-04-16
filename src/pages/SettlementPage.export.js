// Export logic for settlement page
export function getSettlementExportText({ players, winLoss, postFoodWinLoss, showPostFood, foodBill }) {
  const selectedWinLoss = showPostFood && foodBill ? postFoodWinLoss : winLoss;
  let lines = [];
  for (const p of players) {
    const wl = selectedWinLoss.find(w => w.name === p.name)?.value || 0;
    lines.push(`${p.name}: ${wl >= 0 ? "+" : ""}${wl.toLocaleString()}`);
  }
  if (foodBill) {
    lines.push("");
    lines.push(`Food Bill: ₹${foodBill.amount.toLocaleString()} paid by ${foodBill.payer}`);
  }
  return lines.join("\n");
}
