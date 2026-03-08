import fetch from 'node-fetch';

export interface PriceInfo {
  appId: number;
  priceUsd: number;
  priceBrl?: number;
  timestamp: Date;
}

export const collectPrice = async (appId: number): Promise<PriceInfo | null> => {
  try {
    const url = `https://store.steampowered.com/api/appdetails?appids=${appId}&cc=us&l=english`;
    const res = await fetch(url);
    const json: any = await res.json();
    if (!json || !(appId in json) || !json[appId].success) {
      return null;
    }
    const data = json[appId].data as any;
    let priceUsd = 0;
    if (data.price_overview) {
      priceUsd = (data.price_overview.final || 0) / 100;
    }
    // TODO: convert to BRL via exchange rate
    return { appId, priceUsd, timestamp: new Date() };
  } catch (err) {
    console.error('collectPrice error', err);
    return null;
  }
};
