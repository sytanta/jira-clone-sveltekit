// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces

import { User } from '@prisma/client';
import type formatUserForFrontend from '$lib/utils/formatUserForFrontend';

declare global {
	namespace App {
		interface PageData {
			user: ReturnType<typeof formatUserForFrontend>;
		}

		interface Locals {
			user: User;
		}

		// interface Platform {}
		// interface Error {}
	}
}

export {};
