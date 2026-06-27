CREATE TABLE `kashaf_viewcache` (
	`id` int AUTO_INCREMENT NOT NULL,
	`kashafId` varchar(128) NOT NULL,
	`storageKey` varchar(512) NOT NULL,
	`schemaVersion` varchar(32),
	`generatedAt` varchar(64),
	`bookTitle` text,
	`bookAuthor` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `kashaf_viewcache_id` PRIMARY KEY(`id`),
	CONSTRAINT `kashaf_viewcache_kashafId_unique` UNIQUE(`kashafId`)
);
