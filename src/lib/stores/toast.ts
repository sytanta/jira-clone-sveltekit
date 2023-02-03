import { writable } from 'svelte/store';
import { v4 as uuidv4 } from 'uuid';

interface Toast {
	id?: string;
	type: 'success' | 'danger';
	title?: string;
	message: string;
}

export const toastsStore = writable<Toast[]>([]);

export function addToast(toast: Toast, duration?: number) {
	if (!toast.id) toast.id = uuidv4();
	toastsStore.update((pre) => [...pre, toast]);

	setTimeout(removeToast, duration || 4500, toast);
}

export function removeToast(toast: Toast | string) {
	toastsStore.update((pre) => {
		const id = typeof toast === 'string' ? toast : toast.id;
		const newToasts = id ? pre.filter((t) => t.id !== id) : pre.slice(0, pre.length - 1);
		return newToasts;
	});
}

export function clearToasts() {
	toastsStore.set([]);
}
