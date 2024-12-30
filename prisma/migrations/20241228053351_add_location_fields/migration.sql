-- CreateTable
CREATE TABLE `Location` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `tenViTri` VARCHAR(191) NOT NULL,
    `tinhThanh` VARCHAR(191) NOT NULL,
    `quocGia` VARCHAR(191) NOT NULL,
    `hinhAnh` VARCHAR(191) NOT NULL,
    `diaChi` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
