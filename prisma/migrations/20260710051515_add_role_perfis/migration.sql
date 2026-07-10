-- CreateEnum
CREATE TYPE "Role" AS ENUM ('lojista', 'profissional', 'cliente');

-- AlterTable
ALTER TABLE "User" ADD COLUMN "role" "Role" NOT NULL DEFAULT 'lojista';
ALTER TABLE "User" ADD COLUMN "businessOwnerId" TEXT;
ALTER TABLE "User" ADD COLUMN "clienteId" TEXT;
ALTER TABLE "User" ADD COLUMN "teamMemberId" TEXT;

-- Backfill existing users
UPDATE "User" SET "role" = 'lojista'::"Role" WHERE "role" IS NULL;

-- CreateIndex
CREATE UNIQUE INDEX "User_clienteId_key" ON "User"("clienteId");
CREATE UNIQUE INDEX "User_teamMemberId_key" ON "User"("teamMemberId");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_businessOwnerId_fkey" FOREIGN KEY ("businessOwnerId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "User" ADD CONSTRAINT "User_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "Cliente"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "User" ADD CONSTRAINT "User_teamMemberId_fkey" FOREIGN KEY ("teamMemberId") REFERENCES "TeamMember"("id") ON DELETE SET NULL ON UPDATE CASCADE;
