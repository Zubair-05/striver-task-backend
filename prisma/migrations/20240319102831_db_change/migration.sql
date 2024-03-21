-- CreateTable
CREATE TABLE `Submissions` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `username` VARCHAR(191) NOT NULL,
    `language` VARCHAR(191) NOT NULL,
    `source_code` VARCHAR(191) NOT NULL,
    `stdin` VARCHAR(191) NOT NULL,
    `stdout` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
