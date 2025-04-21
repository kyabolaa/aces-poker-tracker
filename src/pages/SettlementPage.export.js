// Export logic for settlement page
export function getSettlementExportText({ players, winLoss, postFoodWinLoss, showPostFood, foodBill }) {
  // Select raw win/loss array based on pre/post food flag
  const rawWinLoss = showPostFood && foodBill ? postFoodWinLoss : winLoss;
  // Round values to nearest 50 for export
  const selectedWinLoss = rawWinLoss.map(w => ({
    name: w.name,
    value: Math.round(w.value / 50) * 50
  }));
  let lines = [];
  for (const p of players) {
    const wl = selectedWinLoss.find(w => w.name === p.name)?.value || 0;
    lines.push(`${p.name}: ${wl >= 0 ? "+" : ""}${wl.toLocaleString()}`);
  }
  if (foodBill) {
    lines.push("");
    // Indicate who paid the food bill and the total amount
    lines.push(`Food bill paid by ${foodBill.payer} ₹${foodBill.amount.toLocaleString()}`);
    // For post-food export, calculate proportional shares for winners and payer
    if (showPostFood) {
      // Determine winners before food bill
      const winners = winLoss.filter(w => w.value > 0);
      const totalWinnings = winners.reduce((sum, w) => sum + w.value, 0);
      // Compute shares for other winners
      const otherWinners = winners.filter(w => w.name !== foodBill.payer);
      const otherShares = otherWinners.map(w => ({
        name: w.name,
        share: Math.round(foodBill.amount * (w.value / totalWinnings))
      }));
      const sumOther = otherShares.reduce((sum, w) => sum + w.share, 0);
      // Payer's share is the remaining amount
      const payerShare = otherWinners.length > 0
        ? foodBill.amount - sumOther
        : foodBill.amount;
      const splits = [
        ...otherShares.map(w => `${w.name} ${w.share.toLocaleString()}`),
        `${foodBill.payer} ${payerShare.toLocaleString()}`
      ];
      lines.push(`Split by ${splits.join(", ")}`);
    }
  }
  return lines.join("\n");
}
