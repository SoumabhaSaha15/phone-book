ALTER TABLE `Contact` ADD `middleName` text;--> statement-breakpoint
ALTER TABLE `Contact` ADD `address` text;--> statement-breakpoint
ALTER TABLE `Contact` ADD `birthday` text;--> statement-breakpoint
CREATE UNIQUE INDEX `Contact_phoneNumber_unique` ON `Contact` (`phoneNumber`);