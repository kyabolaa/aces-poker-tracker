export function getSettlementExportText(args: {
  players: { name: string }[],
  winLoss: { name: string, value: number }[],
  postFoodWinLoss: { name: string, value: number }[],
  showPostFood: boolean,
  foodBill: { payer: string, amount: number } | null
}): string;
