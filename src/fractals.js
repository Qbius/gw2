export const minimum_ar = scale => (scale < 20) ? 0 : Math.ceil(((scale * 2.136 - 33) - 1) / 1.2);

export const all = {
    'Aetherblade': [14, 45, 65, 70, 96],
    'Aquatic Ruins': [7, 26, 61, 76],
    'Captain Mai Trin Boss': [18, 42, 71, 95],
    'Chaos': [13, 30, 38, 63, 88],
    'Cliffside': [6, 21, 46, 68, 94],
    'Deepstone': [11, 33, 67, 84],
    'Molten Boss': [10, 40, 69, 90],
    'Molten Furnace': [9, 17, 39, 58, 83],
    'Nightmare': [22, 47, 72, 97],
    'Shattered Observatory': [23, 48, 73, 98],
    'Silent Surf': [25, 50, 75, 100],
    "Siren's Reef": [12, 37, 54, 78],
    'Snowblind': [3, 27, 51, 86, 93],
    'Solid Ocean': [20, 35, 44, 60, 80],
    'Sunqua Peak': [24, 49, 74, 99],
    'Swampland': [5, 32, 56, 77, 89],
    'Thaumanova Reactor': [15, 34, 43, 55, 64, 82],
    'Twilight Oasis': [16, 41, 59, 87],
    'Uncategorized': [2, 36, 62, 79, 91],
    'Underground Facility': [8, 29, 53, 81],
    'Urban Battleground': [4, 31, 57, 66, 85],
    'Volcanic': [1, 19, 28, 52, 92],
};

export const daily = [
    ["Nightmare", "Snowblind", "Volcanic"],
    ["Aetherblade", "Thaumanova Reactor", "Uncategorized"],
    ["Chaos", "Cliffside", "Twilight Oasis"],
    ["Captain Mai Trin Boss", "Deepstone", "Silent Surf"],
    ["Nightmare", "Snowblind", "Solid Ocean"],
    ["Chaos", "Uncategorized", "Urban Battleground"],
    ["Deepstone", "Molten Furnace", "Siren's Reef"],
    ["Molten Boss", "Twilight Oasis", "Underground Facility"],
    ["Silent Surf", "Swampland", "Volcanic"],
    ["Aquatic Ruins", "Snowblind", "Thaumanova Reactor"],
    ["Sunqua Peak", "Underground Facility", "Urban Battleground"],
    ["Aetherblade", "Chaos", "Nightmare"],
    ["Cliffside", "Molten Boss", "Siren's Reef"],
    ["Deepstone", "Swampland", "Solid Ocean"],
    ["Captain Mai Trin Boss", "Molten Boss", "Shattered Observatory"],

];

export const recommended = [
    [2, 37, 53],
    [6, 28, 61],
    [10, 32, 65],
    [14, 34, 74],
    [19, 37, 66],
    [15, 41, 60],
    [24, 35, 75],
    [25, 36, 69], 
    [12, 40, 67],
    [8, 31, 54],
    [11, 39, 59],
    [18, 27, 64],
    [4, 30, 58],
    [16, 42, 62],
    [5, 47, 68],
];

const start = new Date(2021, 1, 10, 1, 0, 0);
export const daily_index = Math.ceil(((new Date() - start) / 1000 / 60 / 60) / 24) % daily.length;

function modulo(number, offset) {
    const res = number % offset;
    return (res < 0) ? res + offset : res;
}

export function dailies(offset) {
    return {names: daily[modulo(daily_index + offset, daily.length)], scales: recommended[modulo(daily_index + offset, daily.length)]};
}

export function breakdown(which, dailies, recommended) {
    const ds = dailies.map(name => all[name]).flat();
    const rs = recommended;
    const flag = scale => ((ds.indexOf(scale) !== -1) ? 'D' : '') + ((rs.indexOf(scale) !== -1) ? 'R' : '');

    let breakpoints = new Set();
    let allagony = [...Array(151).keys()].map(_ => [...Array(which.length).keys()].map(_ => ['X', '']));
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
    let state = [...Array(which.length).keys()].map(_ => ['X', '']);
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

export function name_by_scale(scale) {
    return Object.values(all).some(arr => arr.indexOf(scale) !== -1) ? Object.entries(all).find(([name, arr]) => arr.indexOf(scale) !== -1)[0] : '';
}

export function tier_from_scale(scale) {
    return Math.floor((scale - 1) / 25) + 1;
}

export function rewards2(scale, dailies) {
    if (scale === undefined) return [0, 0, 0, 0, 0, 0];
    const daily = dailies.names.indexOf(name_by_scale(scale)) !== -1;
    const recommended = dailies.scales.indexOf(scale) !== -1;
    const tier = tier_from_scale(scale);
    const nordorch = all["Nightmare"].indexOf(scale) !== -1 || all["Deepstone"].indexOf(scale) !== -1 || all["Chaos"].indexOf(scale) !== -1;

    const relics = (scale <= 50) ? Math.floor((scale - 1) / 5) + 5 : Math.floor((scale - 51) / 10) + 15;
    const pristine = daily ? tier : recommended ? 1 : 0;
    const encryptions = Math.floor((scale - 1) / 20) + 2 + (nordorch ? ((scale > 40) ? 2 : 1) : 0) + (recommended ? ((tier === 1) ? 2 : 3) : 0);
    const keys = daily ? tier : 0;
    const agony = daily ? [1, 2, 4, 6][tier - 1] : 0 + (recommended ? ((tier === 1) ? 3 : 5) : 0);
    const resonating = daily ? [1, 3, 6, 10][tier - 1] : 0;
    
    return [relics, pristine, encryptions, keys, agony, resonating];
}

export function combined_rewards(scales, dailies) {
    return scales.map(scale => rewards2(scale, dailies)).reduce((acc, ele) => [...Array(6).keys()].map(i => acc[i] + ele[i]), [0, 0, 0, 0, 0, 0]);
}

const shortexceptions = {
    "Captain Mai Trin Boss": 'Mai',
    "Shattered Observatory": 'Sh',
}
export function shortname(fractal) {
    if (fractal in shortexceptions) return shortexceptions[fractal];
    if (typeof fractal !== 'string') return fractal;

    return (fractal.indexOf(' ') !== -1) ? [...(' ' + fractal).matchAll(/ ./g)].map(m => m[0][1]).join('') : fractal.slice(0, 2);
}
