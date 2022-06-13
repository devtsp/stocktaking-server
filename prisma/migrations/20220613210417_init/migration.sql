-- CreateTable
CREATE TABLE `refresh_token` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `tokenUserId` VARCHAR(300) NOT NULL,
    `refreshToken` VARCHAR(300) NOT NULL,

    UNIQUE INDEX `refreshToken`(`refreshToken`),
    INDEX `user_id_idx`(`tokenUserId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `transaction` (
    `id` VARCHAR(300) NOT NULL,
    `transactionUserId` VARCHAR(300) NOT NULL,
    `amount` FLOAT NOT NULL,
    `concept` VARCHAR(30) NOT NULL,
    `type` ENUM('IN', 'OUT') NOT NULL,
    `createdAt` VARCHAR(30) NOT NULL,
    `modifiedAt` VARCHAR(30) NULL,
    `deletedAt` VARCHAR(30) NULL,

    INDEX `transactionUserId_idx`(`transactionUserId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user` (
    `id` VARCHAR(300) NOT NULL,
    `email` VARCHAR(45) NOT NULL,
    `password` VARCHAR(300) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `refresh_token` ADD CONSTRAINT `tokenUserId` FOREIGN KEY (`tokenUserId`) REFERENCES `user`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `transaction` ADD CONSTRAINT `transactionUserId` FOREIGN KEY (`transactionUserId`) REFERENCES `user`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;
