const minimum_ar = scale => (scale < 20) ? 0 : Math.ceil(((scale * 2.136 - 33) - 1) / 1.2);

const all = {
    "Aquatic Ruins": [7, 26, 61, 76],
    "Captain Mai Trin Boss": [18, 42, 72, 95],
    "Chaos": [13, 30, 38, 63, 88, 97],
    "Cliffside": [6, 21, 47, 69, 94],
    "Deepstone": [11, 33, 67, 84],
    "Molten Boss": [10, 40, 70, 90],
    "Molten Furnace": [9, 22, 39, 58, 83],
    "Nightmare": [23, 48, 73, 98],
    "Shattered Observatory": [24, 49, 74, 99],
    "Siren's Reef": [12, 37, 54, 78],
    "Snowblind": [3, 27, 51, 68, 86, 93],
    "Sunqua Peak": [25, 50, 75, 100],
    "Solid Ocean": [20, 35, 45, 60, 80],
    "Swampland": [5, 17, 32, 56, 77, 89],
    "Thaumanova Reactor": [15, 34, 43, 55, 64, 82],
    "Twilight Oasis": [16, 41, 59, 87],
    "Uncategorized": [2, 36, 44, 62, 79, 91],
    "Underground Facility": [8, 29, 53, 81],
    "Urban Battleground": [4, 31, 57, 66, 85],
    "Volcanic": [1, 19, 28, 52, 92],
};

const daily = [
    ["Underground Facility", "Urban Battleground", "Sunqua Peak"],
    ["Aetherblade", "Chaos", "Nightmare"],
    ["Cliffside", "Molten Boss", "Siren's Reef"],
    ["Swampland", "Solid Ocean", "Deepstone"],
    ["Captain Mai Trin Boss", "Shattered Observatory", "Molten Boss"],
    ["Nightmare", "Snowblind", "Volcanic"],
    ["Aetherblade", "Uncategorized", "Thaumanova Reactor"],
    ["Twilight Oasis", "Cliffside", "Chaos"],
    ["Deepstone", "Captain Mai Trin Boss", "Sunqua Peak"],
    ["Snowblind", "Solid Ocean", "Nightmare"],
    ["Chaos", "Uncategorized", "Urban Battleground"],
    ["Siren's Reef", "Molten Furnace", "Deepstone"],
    ["Molten Boss", "Twilight Oasis", "Underground Facility"],
    ["Volcanic", "Swampland", "Shattered Observatory"],
    ["Snowblind", "Thaumanova Reactor", "Aquatic Ruins"],
];

const recommended = [
    [11, 39, 59],
    [18, 27, 64],
    [4, 30, 58],
    [16, 42, 62],
    [5, 48, 68],
    [2, 37, 53],
    [6, 28, 61],
    [10, 32, 65],
    [14, 34, 75],
    [19, 37, 66],
    [15, 41, 60],
    [24, 35, 75],
    [25, 36, 69],
    [12, 40, 67],
    [8, 31, 54],
];

const start = new Date(2021, 1, 10, 1, 0, 0);
export function dailies() {
    const index = Math.floor(((new Date() - start) / 1000 / 60 / 60) / 24) % daily.length;
    console.log(new Date() - start);
    return [daily[index], recommended[index]];
}

export function breakdown(which, dailies, recommended) {
    const ds = dailies.map(name => all[name]).flat();
    const rs = recommended;
    const flag = scale => ((ds.indexOf(scale) !== -1) ? 'D' : '') + ((rs.indexOf(scale) !== -1) ? 'R' : '');

    let breakpoints = new Set();
    let allagony = [...Array(151).keys()].map(_ => [['X', ''], ['X', ''], ['X', ''], ['X', ''], ['X', ''], ['X', '']]);
    which.forEach((f, index) => {
        if (typeof f === 'string') {
            all[f].forEach(scale => {
                const ar = minimum_ar(scale);
                breakpoints.add(ar);
                allagony[ar][index] = [scale, flag(scale)];
            });
        }
        else {
            const ar = minimum_ar(f);
            breakpoints.add(ar);
            allagony[ar][index] = [f, flag(f)];
        }
    });
    let state = [['X', ''], ['X', ''], ['X', ''], ['X', ''], ['X', ''], ['X', '']];
    return Array.from(breakpoints).sort((a, b) => a - b).map(breakpoint => {
        allagony[breakpoint].forEach((status, index) => {
            if (JSON.stringify(status) !== JSON.stringify(['X', ''])) {
                state[index] = status;
            }
        });
        return [breakpoint, JSON.parse(JSON.stringify(state))];
    });
    return result;
}

export function rewards(scale, flag) {
    if (scale === 'X') return [0, 0, 0, 0, 0, 0];

    const daily = flag.indexOf('D') !== -1;
    const recommended = flag.indexOf('R') !== -1;
    const tier = Math.floor((scale - 1) / 25) + 1;
    const nordorch = all["Nightmare"].indexOf(scale) !== -1 || all["Deepstone"].indexOf(scale) !== -1 || all["Chaos"].indexOf(scale) !== -1;

    const relics = (scale <= 50) ? Math.floor((scale - 1) / 5) + 5 : Math.floor((scale - 51) / 10) + 15;
    const pristine = daily ? tier : recommended ? 1 : 0;
    const encryptions = Math.floor((scale - 1) / 20) + 2 + (nordorch ? ((scale > 40) ? 2 : 1) : 0) + (recommended ? ((tier === 1) ? 2 : 3) : 0);
    const keys = daily ? tier : 0;
    const agony = daily ? [1, 2, 4, 6][tier - 1] : 0 + (recommended ? ((tier === 1) ? 3 : 5) : 0);
    const resonating = daily ? [1, 3, 6, 10][tier - 1] : 0;
    
    return [relics, pristine, encryptions, keys, agony, resonating];
}
