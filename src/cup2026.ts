// @ts-nocheck
/**
 * Russian Cup 2026 format (RPL Path & Regions Path)
 */

export const CUP_FINAL_VENUE = 'Лужники (Москва)';

export function getCupFinalVenue(): string {
  return CUP_FINAL_VENUE;
}

export function initCup2026(
  season: string,
  rplTeams: any[],
  fnlTeams: any[],
  secondLeagueTeams: any[],
  mediaTeams: any[],
  uidFn: () => string,
  options?: any
): { cupState: any; fixtures: any[] } {
  const groups: Record<string, any[]> = {
    A: [],
    B: [],
    C: [],
    D: []
  };

  const rpl = [...(rplTeams || [])];
  const keys = ['A', 'B', 'C', 'D'];
  rpl.forEach((t, i) => {
    const gKey = keys[i % 4];
    groups[gKey].push({
      id: t.id,
      name: t.name,
      logo: t.logo,
      p: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, pts: 0
    });
  });

  const cupState = {
    season,
    format: 'rpl_and_regions',
    stage: 'groups',
    groups,
    playoffRpl: {},
    regionsRounds: []
  };

  return { cupState, fixtures: [] };
}

export function recalculateCupGroups(cupState: any, fixtures: any[]): void {
  if (!cupState || !Array.isArray(fixtures)) return;
  const targetSeason = cupState.season || null;
  const groupDoneFx = fixtures.filter((f) => {
    if (!f || f.comp !== 'cup' || f.status !== 'done') return false;
    if (targetSeason && f.season && f.season !== targetSeason) return false;
    if (f.cupPath === 'rpl_group') return true;
    if (!f.cupPath && !f.cupStage && !f.qualRound) {
      if (f.groupId && ['A', 'B', 'C', 'D'].includes(String(f.groupId))) return true;
      if (f.round != null && Number(f.round) >= 1 && Number(f.round) <= 6) return true;
      if (/^Группа\s+[A-D]$/i.test(String(f.stage || ''))) return true;
    }
    return false;
  });

  const applyResult = (h: any, a: any, f: any) => {
    if (f.tech?.both) {
      h.p++; a.p++; h.l++; a.l++;
      return;
    }
    const hg = Number(f.hg) || 0;
    const ag = Number(f.ag) || 0;
    h.p++; a.p++;
    h.gf += hg; h.ga += ag;
    a.gf += ag; a.ga += hg;
    if (hg > ag) {
      h.w++; h.pts += 3; a.l++;
    } else if (hg < ag) {
      a.w++; a.pts += 3; h.l++;
    } else if (f.pen) {
      const homeWonPen = f.pen.winner === 'home' || (f.pen.winner !== 'away' && Number(f.pen.hg) > Number(f.pen.ag));
      if (homeWonPen) {
        h.wp = (h.wp || 0) + 1; h.pts += 2;
        a.lp = (a.lp || 0) + 1; a.pts += 1;
      } else {
        a.wp = (a.wp || 0) + 1; a.pts += 2;
        h.lp = (h.lp || 0) + 1; h.pts += 1;
      }
    } else {
      h.d++; a.d++; h.pts += 1; a.pts += 1;
    }
  };

  const sortRows = (rows: any[]) => {
    rows.sort((a, b) =>
      b.pts - a.pts ||
      ((b.w || 0) + (b.wp || 0)) - ((a.w || 0) + (a.wp || 0)) ||
      (b.w || 0) - (a.w || 0) ||
      (b.gf - b.ga) - (a.gf - a.ga) ||
      b.gf - a.gf ||
      String(a.name || '').localeCompare(String(b.name || ''), 'ru')
    );
  };

  if (cupState.rplGroups && typeof cupState.rplGroups === 'object') {
    for (const [gid, g] of Object.entries<any>(cupState.rplGroups)) {
      if (!g || typeof g !== 'object') continue;
      const prevById = new Map<string, any>();
      if (Array.isArray(g.table)) {
        for (const r of g.table) if (r?.id) prevById.set(r.id, r);
      }
      const rawTeams = Array.isArray(g.teams) && g.teams.length
        ? g.teams
        : Array.isArray(g.table) ? g.table.map((r: any) => r.id) : [];
      const teamIds = rawTeams.map((item: any) => typeof item === 'string' ? item : item?.id).filter(Boolean);
      if (!teamIds.length) continue;
      const rowsById = new Map<string, any>();
      teamIds.forEach((tid: string, idx: number) => {
        const prev = prevById.get(tid);
        rowsById.set(tid, {
          id: tid,
          name: prev?.name || tid,
          logo: prev?.logo || '',
          pos: idx + 1,
          p: 0, w: 0, wp: 0, lp: 0, d: 0, l: 0, gf: 0, ga: 0, gd: 0, pts: 0,
          zone: idx < 2 ? 'top' : idx === 2 ? 'playoff' : 'bad',
          zoneLabel: idx < 2 ? '1/8 Пути РПЛ' : idx === 2 ? 'В Путь регионов' : 'Вылет из турнира'
        });
      });
      for (const f of groupDoneFx) {
        if (f.groupId && f.groupId !== gid) continue;
        const h = rowsById.get(f.home);
        const a = rowsById.get(f.away);
        if (h && a) applyResult(h, a, f);
      }
      const rows = [...rowsById.values()];
      sortRows(rows);
      rows.forEach((r, idx) => {
        r.pos = idx + 1;
        r.gd = r.gf - r.ga;
        r.zone = idx < 2 ? 'top' : idx === 2 ? 'playoff' : 'bad';
        r.zoneLabel = idx < 2 ? '1/8 Пути РПЛ' : idx === 2 ? 'В Путь регионов' : 'Вылет из турнира';
      });
      g.table = rows;
    }
  }

  if (cupState.groups && typeof cupState.groups === 'object') {
    for (const [gid, group] of Object.entries<any>(cupState.groups)) {
      if (!Array.isArray(group)) continue;
      for (const t of group) {
        t.p = 0; t.w = 0; t.wp = 0; t.lp = 0; t.d = 0; t.l = 0; t.gf = 0; t.ga = 0; t.gd = 0; t.pts = 0;
      }
      for (const f of groupDoneFx) {
        if (f.groupId && f.groupId !== gid) continue;
        const hTeam = group.find(x => x.id === f.home);
        const aTeam = group.find(x => x.id === f.away);
        if (hTeam && aTeam) applyResult(hTeam, aTeam, f);
      }
      sortRows(group);
      group.forEach((t: any, idx: number) => {
        t.pos = idx + 1;
        t.gd = t.gf - t.ga;
      });
    }
  }
}

export function drawNextRegionsRound(cupState: any, roundNumber: number, roundFx?: any[], uidFn?: () => string): any[] {
  return [];
}
