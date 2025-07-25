import { goto } from "$app/navigation";
import api, { ApiError } from "$lib/api";
import auth from "$lib/auth.svelte";
import type { LayoutLoad } from "./$types";
import { showToast } from "$lib/components/toast.svelte";
import { redirect } from "@sveltejs/kit";

export const load: LayoutLoad = async ({ fetch }) => {
    api.fetch_fn = fetch;
    if (auth.token) {
        try {
            await api.users.me();
        } catch (e) {
            const ae = e as ApiError;
            switch (ae.status) {
                case 401:
                    auth.clear();
                    goto("/login");
                    showToast("session expired. please login again", "info", 10000);
                    break;
            }
        }
        throw redirect(302, "/")
    }
}
