import {writable} from 'svelte/store';
import * as dailies_ex from './examples/dailies.json';
import * as account_ex from './examples/account_info.json';

export const localhost = location.hostname === "localhost";

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
    if (localhost) {
        return account_ex;
    }
    else {
        const response = await fetch(`/api/accountinfo?access_token=${token}`);
        if (response.ok) {
            const json = await response.json();
            return json;
        }
        else
            throw new Error('Error loading account info');
    }
}