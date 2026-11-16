// @ts-nocheck
/**
 * Foreign clubs and international transfer offers
 */

export const FOREIGN_CLUBS: any[] = [
  { id: 'besiktas', name: 'Бешикташ', country: 'Турция', flag: '🇹🇷', league: 'Суперлига', reputation: 78 },
  { id: 'galatasaray', name: 'Галатасарай', country: 'Турция', flag: '🇹🇷', league: 'Суперлига', reputation: 82 },
  { id: 'fenerbahce', name: 'Фенербахче', country: 'Турция', flag: '🇹🇷', league: 'Суперлига', reputation: 81 },
  { id: 'trabzonspor', name: 'Трабзонспор', country: 'Турция', flag: '🇹🇷', league: 'Суперлига', reputation: 76 },
  { id: 'crvena_zvezda', name: 'Црвена Звезда', country: 'Сербия', flag: '🇷🇸', league: 'Суперлига', reputation: 76 },
  { id: 'partizan', name: 'Партизан', country: 'Сербия', flag: '🇷🇸', league: 'Суперлига', reputation: 74 },
  { id: 'paok', name: 'ПАОК', country: 'Греция', flag: '🇬🇷', league: 'Суперлига', reputation: 77 },
  { id: 'olympiacos', name: 'Олимпиакос', country: 'Греция', flag: '🇬🇷', league: 'Суперлига', reputation: 79 },
  { id: 'aek_athens', name: 'АЕК Афины', country: 'Греция', flag: '🇬🇷', league: 'Суперлига', reputation: 76 },
  { id: 'monaco', name: 'Монако', country: 'Франция', flag: '🇫🇷', league: 'Лига 1', reputation: 84 },
  { id: 'marseille', name: 'Марсель', country: 'Франция', flag: '🇫🇷', league: 'Лига 1', reputation: 83 },
  { id: 'lyon', name: 'Лион', country: 'Франция', flag: '🇫🇷', league: 'Лига 1', reputation: 81 },
  { id: 'lehavre', name: 'Гавр', country: 'Франция', flag: '🇫🇷', league: 'Лига 1', reputation: 73 },
  { id: 'sociedad', name: 'Реал Сосьедад', country: 'Испания', flag: '🇪🇸', league: 'Ла Лига', reputation: 83 },
  { id: 'sevilla', name: 'Севилья', country: 'Испания', flag: '🇪🇸', league: 'Ла Лига', reputation: 80 },
  { id: 'girona', name: 'Жирона', country: 'Испания', flag: '🇪🇸', league: 'Ла Лига', reputation: 78 },
  { id: 'atalanta', name: 'Аталанта', country: 'Италия', flag: '🇮🇹', league: 'Серия А', reputation: 84 },
  { id: 'fiorentina', name: 'Фиорентина', country: 'Италия', flag: '🇮🇹', league: 'Серия А', reputation: 80 },
  { id: 'torino', name: 'Торино', country: 'Италия', flag: '🇮🇹', league: 'Серия А', reputation: 76 },
  { id: 'wolfsburg', name: 'Вольфсбург', country: 'Германия', flag: '🇩🇪', league: 'Бундеслига', reputation: 78 },
  { id: 'porto', name: 'Порту', country: 'Португалия', flag: '🇵🇹', league: 'Примейра-лига', reputation: 84 },
  { id: 'braga', name: 'Брага', country: 'Португалия', flag: '🇵🇹', league: 'Примейра-лига', reputation: 79 },
  { id: 'feyenoord', name: 'Фейеноорд', country: 'Нидерланды', flag: '🇳🇱', league: 'Эредивизи', reputation: 81 },
  { id: 'brugge', name: 'Брюгге', country: 'Бельгия', flag: '🇧🇪', league: 'Про-лига', reputation: 79 },
  { id: 'alhilal', name: 'Аль-Хиляль', country: 'Саудовская Аравия', flag: '🇸🇦', league: 'Про-лига', reputation: 83 },
  { id: 'alnasr', name: 'Аль-Наср', country: 'Саудовская Аравия', flag: '🇸🇦', league: 'Про-лига', reputation: 82 }
];

function estimateFeeMln(player: any, offerType: 'transfer' | 'loan'): number {
  const ovr = Number(player?.ovr || player?.rating || 74);
  const age = Number(player?.age || 25);
  const mvRaw = Number(player?.marketValue || 0);
  let baseMln = 0;
  if (Number.isFinite(mvRaw) && mvRaw > 0) {
    baseMln = mvRaw >= 1000 ? mvRaw / 1e6 : mvRaw;
  } else {
    if (ovr >= 82) baseMln = 14 + (ovr - 82) * 3.5;
    else if (ovr >= 78) baseMln = 6.5 + (ovr - 78) * 1.9;
    else if (ovr >= 74) baseMln = 2.4 + (ovr - 74) * 1.0;
    else if (ovr >= 70) baseMln = 1.0 + (ovr - 70) * 0.35;
    else baseMln = 0.5 + Math.max(0, ovr - 65) * 0.1;
  }
  const ageMult = age <= 21 ? 1.28 : age <= 24 ? 1.15 : age <= 28 ? 1.0 : age <= 31 ? 0.8 : 0.6;
  let feeMln = baseMln * ageMult * (1.04 + Math.random() * 0.24);
  feeMln = offerType === 'loan' ? Math.max(0.3, Math.min(2.5, feeMln * 0.18)) : Math.max(0.5, Math.min(35, feeMln));
  return Math.round(feeMln * 10) / 10;
}

function pickForeignClub(player: any, preferredName?: string) {
  if (preferredName) {
    const found = FOREIGN_CLUBS.find((c) => c.name.toLowerCase() === String(preferredName).trim().toLowerCase());
    if (found) return found;
  }
  const ovr = Number(player?.ovr || player?.rating || 74);
  let pool = ovr >= 80
    ? FOREIGN_CLUBS.filter((c) => c.reputation >= 80)
    : ovr >= 75
      ? FOREIGN_CLUBS.filter((c) => c.reputation >= 76 && c.reputation <= 83)
      : FOREIGN_CLUBS.filter((c) => c.reputation <= 78);
  if (!pool.length) pool = FOREIGN_CLUBS;
  return pool[Math.floor(Math.random() * pool.length)];
}

export async function createForeignOfferWithAI(options: {
  player: any;
  club: any;
  performanceReason?: string;
  triggerReason?: string;
  preferLoan?: boolean;
  llmJSON?: (sys: string, prompt: string, opts?: any) => Promise<any>;
}): Promise<any> {
  const player = options.player;
  const club = options.club;
  const ovr = Number(player?.ovr || player?.rating || 74);
  const age = Number(player?.age || 25);
  let offerType: 'transfer' | 'loan' = options.preferLoan || (age <= 22 && ovr < 77 && Math.random() < 0.35) || Math.random() < 0.18 ? 'loan' : 'transfer';
  let buyer = pickForeignClub(player);
  let feeAmount = estimateFeeMln(player, offerType);
  let wage = `€${Math.round(Math.max(10, Math.min(140, feeAmount * 7.5 + (ovr - 65) * 1.4)))} тыс./нед.`;
  let triggerReason = options.triggerReason || options.performanceReason || `Уверенная игра и высокий рейтинг (${ovr}) в составе «${club?.name || 'клуба'}»`;
  let scoutReport = options.performanceReason || `Международные скауты клуба «${buyer.name}» высоко оценили игру ${player?.name || 'футболиста'} (${player?.pos || 'ЦП'}, рейтинг ${ovr}) и видят в нём готовое усиление состава.`;

  if (typeof options.llmJSON === 'function') {
    try {
      const clubList = FOREIGN_CLUBS.map((c) => `${c.name} (${c.country}, ${c.league}, рейтинг ${c.reputation})`).join('; ');
      const sys = 'Ты — международный футбольный скаут. Сгенерируй реалистичное зарубежное трансферное предложение для игрока российского клуба. Отвечай строго в JSON.';
      const prompt = `Игрок: ${player?.name || 'Игрок'}, позиция: ${player?.pos || 'ЦП'}, возраст: ${age}, рейтинг: ${ovr}, клуб: «${club?.name || 'Клуб'}».\nПовод: ${triggerReason}.\nБазовый расчёт: €${feeAmount}M.\nКлубы: ${clubList}.\nВерни JSON: {"buyerClub":"","type":"transfer|loan","feeAmount":0,"wage":"","triggerReason":"","scoutReport":""}`;
      const aiRes = await options.llmJSON(sys, prompt, { task: 'foreign-scout-offer', temp: 0.45, max: 600 });
      if (aiRes && typeof aiRes === 'object') {
        if (aiRes.buyerClub) buyer = pickForeignClub(player, aiRes.buyerClub);
        if (aiRes.type === 'loan' || aiRes.type === 'transfer') offerType = aiRes.type;
        const aiFee = Number(aiRes.feeAmount);
        if (Number.isFinite(aiFee) && aiFee >= 0.2 && aiFee <= 50) feeAmount = Math.round(aiFee * 10) / 10;
        if (aiRes.wage) wage = String(aiRes.wage).slice(0, 40);
        if (aiRes.triggerReason) triggerReason = String(aiRes.triggerReason).slice(0, 180);
        if (aiRes.scoutReport) scoutReport = String(aiRes.scoutReport).slice(0, 350);
      }
    } catch {
    }
  }

  const feeNum = Math.round(feeAmount * 1e6);
  const fee = feeAmount < 1 ? `€${Math.round(feeAmount * 1000)}K` : `€${feeAmount.toFixed(1)}M`;
  return {
    id: `fo_${Date.now()}_${Math.floor(Math.random() * 10000)}`,
    pid: player?.id,
    playerId: player?.id,
    playerName: player?.name || 'Игрок',
    pos: player?.pos || 'ЦП',
    clubId: club?.id,
    clubName: club?.name || '',
    buyerClub: buyer.name,
    buyerCountry: buyer.country,
    buyerLeague: buyer.league,
    buyerFlag: buyer.flag || '🌍',
    buyerLogo: '',
    type: offerType,
    fee,
    feeAmount,
    feeNum,
    wage,
    triggerReason,
    scoutReport,
    status: 'pending',
    date: new Date().toISOString()
  };
}

export async function checkForeignInterestAfterMatch(db: any, match: any, fixture: any): Promise<any[]> {
  if (!db || !match || !fixture || fixture.comp === 'friendly') return [];
  if (!Array.isArray(db.foreignOffers)) db.foreignOffers = [];
  if (!Array.isArray(db.transfers)) db.transfers = [];

  const ratings = Array.isArray(match.ratings) ? match.ratings : [];
  if (!ratings.length) return [];

  const motmId = match.motm?.playerId || match.motm?.id || null;
  const recentRejectedCutoff = Date.now() - 7 * 864e5;
  const candidates: any[] = [];

  for (const r of ratings) {
    const pid = r.playerId || r.id;
    if (!pid) continue;
    const pObj = (db.players || []).find((x: any) => x.id === pid);
    if (!pObj || (pObj.teamId !== fixture.home && pObj.teamId !== fixture.away)) continue;
    const clubObj = (db.teams || []).find((x: any) => x.id === pObj.teamId);
    if (!clubObj) continue;
    if (!['rpl', 'fnl', 'cup', 'supercup'].includes(fixture.comp) && !['rpl', 'fnl'].includes(clubObj.comp)) continue;

    if (db.foreignOffers.some((o: any) => (o.pid === pid || o.playerId === pid) && o.status === 'pending')) continue;
    if (db.foreignOffers.filter((o: any) => o.clubId === clubObj.id && o.status === 'pending').length >= 2) continue;
    if (db.foreignOffers.some((o: any) => (o.pid === pid || o.playerId === pid) && o.status === 'rejected' && new Date(o.respondedAt || o.date || 0).getTime() > recentRejectedCutoff)) continue;

    const mRating = Number(r.rating || 6.5);
    const goals = Number(r.goals || 0);
    const assists = Number(r.assists || 0);
    const saves = Number(r.saves || 0);
    const cs = Number(r.cs || 0);
    const isMotm = motmId === pid;
    const baseOvr = Number(pObj.ovr || pObj.rating || 70);
    const age = Number(pObj.age || 25);

    const standout = isMotm || mRating >= 7.7 || goals + assists >= 2 || (saves >= 5 && cs > 0) || (baseOvr >= 78 && mRating >= 7.3) || (age <= 22 && baseOvr >= 72 && mRating >= 7.3);
    if (!standout) continue;

    const priority = mRating * 10 + goals * 8 + assists * 5 + (isMotm ? 10 : 0) + Math.max(0, baseOvr - 70) + (age <= 23 ? 5 : 0);
    candidates.push({ pObj, clubObj, priority, isMotm, mRating, goals, assists, saves, cs });
  }

  if (!candidates.length) return [];
  candidates.sort((a, b) => b.priority - a.priority);
  const best = candidates[0];
  const prob = best.isMotm || best.mRating >= 8.3 || best.goals + best.assists >= 2 ? 0.35 : 0.2;
  if (Math.random() > prob) return [];

  const reasons: string[] = [];
  if (best.isMotm) reasons.push('лучший игрок матча (MOTM)');
  if (best.goals > 0) reasons.push(`голы: ${best.goals}`);
  if (best.assists > 0) reasons.push(`ассисты: ${best.assists}`);
  reasons.push(`оценка ${best.mRating.toFixed(1)}`);

  const offer = await createForeignOfferWithAI({
    player: best.pObj,
    club: best.clubObj,
    triggerReason: reasons.join(', '),
    performanceReason: `Скауты впечатлены выступлением ${best.pObj.name} (${reasons.join(', ')}).`
  });

  db.foreignOffers.push(offer);
  db.transfers.push({
    id: 'tr_' + offer.id,
    pid: offer.pid,
    playerName: offer.playerName,
    pos: offer.pos,
    from: best.clubObj.id,
    fromName: best.clubObj.name,
    to: null,
    toName: offer.buyerClub,
    isForeign: true,
    buyerCountry: offer.buyerCountry,
    buyerFlag: offer.buyerFlag,
    type: offer.type,
    fee: offer.fee,
    feeAmount: offer.feeAmount,
    date: offer.date.slice(0, 10),
    status: 'pending',
    clubApproval: 'pending',
    adminApproval: 'approved',
    note: offer.scoutReport,
    foreignOfferId: offer.id
  });
  return [offer];
}

export function respondToForeignOffer(
  db: any,
  offerId: string,
  action: 'accept' | 'reject' | string,
  tid?: string,
  comment?: string
): any {
  if (!db || !Array.isArray(db.foreignOffers)) throw new Error('База зарубежных предложений недоступна');
  const offer = db.foreignOffers.find((o: any) => o.id === offerId);
  if (!offer) throw new Error('Зарубежное предложение не найдено');
  if (tid && offer.clubId && offer.clubId !== tid) throw new Error('Предложение адресовано другому клубу');
  if (offer.status !== 'pending') throw new Error('По этому предложению уже принято решение');
  if (action !== 'accept' && action !== 'reject') throw new Error('Неизвестное действие по зарубежному предложению');

  const nowIso = new Date().toISOString();
  if (!Array.isArray(db.transfers)) db.transfers = [];
  const linkedTransfer = db.transfers.find((t: any) => t.foreignOfferId === offer.id || t.id === 'tr_' + offer.id);

  if (action === 'reject') {
    offer.status = 'rejected';
    offer.respondedAt = nowIso;
    if (comment) offer.comment = String(comment).slice(0, 300);
    if (linkedTransfer) {
      linkedTransfer.status = 'rejected';
      linkedTransfer.clubApproval = 'rejected';
      linkedTransfer.rejectedAt = nowIso;
    }
    return { ok: true, status: 'rejected', offer };
  }

  const pid = offer.pid || offer.playerId;
  const p = (db.players || []).find((x: any) => x.id === pid);
  const seller = (db.teams || []).find((x: any) => x.id === offer.clubId);
  if (!p) throw new Error('Игрок не найден в базе');
  if (!seller) throw new Error('Клуб-продавец не найден');
  if (p.teamId !== seller.id) throw new Error(`Игрок ${p.name} уже не числится в составе «${seller.name}»`);

  const feeAmt = offer.feeAmount !== undefined && offer.feeAmount !== null && Number.isFinite(Number(offer.feeAmount))
    ? Number(offer.feeAmount)
    : offer.feeNum && Number(offer.feeNum) >= 1000 ? Number(offer.feeNum) / 1e6 : 0;
  const feeEuros = Math.round(Math.max(0, feeAmt) * 1e6);

  if (db.squads && Array.isArray(db.squads[seller.id])) {
    db.squads[seller.id] = db.squads[seller.id].filter((id: string) => id !== p.id);
  }
  if (offer.type === 'loan') {
    p.loanFromId = seller.id;
    p.loanFromName = seller.name;
    p.loanIsForeign = true;
    p.teamId = null;
    p.abroadClub = offer.buyerClub;
    p.abroadCountry = offer.buyerCountry;
  } else {
    p.teamId = null;
    p.formerClub = seller.name;
    p.abroadClub = offer.buyerClub;
    p.abroadCountry = offer.buyerCountry;
    delete p.loanFromId;
    delete p.loanFromName;
    delete p.loanIsForeign;
  }

  if (!Array.isArray(db.budgetHistory)) db.budgetHistory = [];
  if (feeEuros > 0) {
    const prevBudget = seller.budget || 0;
    seller.budget = prevBudget + feeEuros;
    db.budgetHistory.push({
      id: `bh_${Date.now()}`,
      teamId: seller.id,
      teamName: seller.name,
      amount: feeEuros,
      prevBudget,
      newBudget: seller.budget,
      type: offer.type === 'loan' ? 'foreign_loan' : 'foreign_sale',
      typeLabel: offer.type === 'loan' ? 'Аренда за рубеж' : 'Трансфер за рубеж',
      description: `${offer.type === 'loan' ? 'Аренда' : 'Продажа'} за рубеж: ${p.name} в «${offer.buyerClub}» (${offer.buyerCountry}) (+€${feeEuros.toLocaleString('ru-RU')})`,
      date: nowIso,
      byAdmin: false
    });
  }

  offer.status = 'accepted';
  offer.respondedAt = nowIso;
  offer.feeAmount = feeAmt;
  if (linkedTransfer) {
    linkedTransfer.status = 'approved';
    linkedTransfer.clubApproval = 'approved';
    linkedTransfer.adminApproval = 'approved';
    linkedTransfer.executedAt = nowIso;
    linkedTransfer.fee = offer.fee;
    linkedTransfer.feeAmount = feeAmt;
  } else {
    db.transfers.push({
      id: 'tr_' + offer.id,
      pid: p.id,
      playerName: p.name,
      pos: p.pos || offer.pos || 'ЦП',
      from: seller.id,
      fromName: seller.name,
      to: null,
      toName: offer.buyerClub,
      isForeign: true,
      buyerCountry: offer.buyerCountry,
      buyerFlag: offer.buyerFlag || '🌍',
      type: offer.type || 'transfer',
      fee: offer.fee,
      feeAmount: feeAmt,
      date: nowIso.slice(0, 10),
      status: 'approved',
      clubApproval: 'approved',
      adminApproval: 'approved',
      executedAt: nowIso,
      note: offer.scoutReport,
      foreignOfferId: offer.id
    });
  }

  return { ok: true, status: 'accepted', offer, netIncome: feeEuros, newBudget: seller.budget };
}
