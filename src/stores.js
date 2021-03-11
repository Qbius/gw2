import {writable} from 'svelte/store';
import * as dailies_ex from './examples/dailies.json';
import * as account_ex from './examples/account_info.json';
import * as skins_ex from './examples/skins.json';

export const localhost = location.hostname === "localhost";
export const skins = skins_ex;

export const dailies = writable({});
export const account_info = writable({});

export async function wait_for_dailies() {
    if (localhost) {
        return dailies_ex
    }
    else {
        const response = await fetch('/api/dailies');
        if (response.ok) {
            const json = await response.json();
            return json;
        }
        else
            throw new Error('Error loading dailies info');
    }
}

export async function wait_for_account_info(token) {

    if ($account_info === {} && localhost) {
        account_info.set(account_ex);
        return;
    }
    else if ($account_info === {}) {
        const response = await fetch(`/api/accountinfo?access_token=${token}`);
        if (response.ok) {
            const json = await response.json();
            account_info.set(json);
        }
        else
            throw new Error('Error loading account info');
    }
}