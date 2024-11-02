CREATE TABLE `Contact` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`firstName` text NOT NULL,
	`lastName` text NOT NULL,
	`email` text,
	`phoneNumber` text(13) NOT NULL
);
